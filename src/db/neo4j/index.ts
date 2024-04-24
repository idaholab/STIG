import neo4j, { Driver, Session, ManagedTransaction } from 'neo4j-driver';
import { Identifier, StixObject } from '../../stix';
import { IDatabaseConfigOptions } from '../../storage/database-configuration-storage';

import * as diffpatch from 'jsondiffpatch';
import { BundleType, Relationship, isRelationship } from '../../stix/stix2';
import { StigDB } from '../dbi';
import moment from 'moment';
import { fromNeo4j, toNeo4j } from './stix2neo';

function setProperties (tx: ManagedTransaction, stix: Record<string, unknown>, cmd: string) {
  return tx.run(
    cmd +
    Object.keys(stix).map(k => 'SET n.`' + k + '` = $`' + k + '`').join('\n') +
    '\nRETURN n',
    stix,
  );
}

export class Neo4jStigDB implements StigDB {
  private driver?: Driver;
  public config: IDatabaseConfigOptions;

  public async configure (config: IDatabaseConfigOptions) {
    await this.close();
    this.config = config;
    const driver = neo4j.driver(config.host, neo4j.auth.basic(config.username, config.password));
    await driver.getServerInfo();
    this.driver = driver;
  }

  public getName (): string {
    return 'Neo4j';
  }

  private async wrapSession<T> (cb: (s: Session) => Promise<T>): Promise<T> {
    if (!this.driver) {
      return Promise.reject(new Error('DB driver is not initialized'));
    }
    const session = this.driver.session(this.config.db ? { database: this.config.db } : undefined);
    try {
      return await cb(session);
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    } finally {
      await session.close();
    }
  }

  /**
   * @description User deleted a node or edge from the graph in the UI
   * @param {StixObject} stix
   * @returns {Promise<void>}
   * @memberof StigDB
   */
  public delete (stix: StixObject): Promise<void> {
    return this.wrapSession((s: Session) =>
      s.executeWrite((tx: ManagedTransaction) =>
        tx.run(isRelationship(stix)
          ? 'MATCH ()-[r]->() WHERE r.id = $id DELETE r'
          : 'MATCH (n: stixnode) WHERE n.id = $id DETACH DELETE n',
        { id: stix.id })
      )
    ) as Promise<unknown> as Promise<void>;
  }

  private traverseNode (query: string, id: Identifier): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) =>
        tx.run(query, { id })
      );
      return res.records.flatMap(rec => rec.map(fromNeo4j).flatMap(x => x));
    });
  }

  /**
   * @description Gets all incoming edges and the objects they connect to.
   * @param {Identifier} id
   * @returns {Promise<StixObject[]>}
   * @memberof StigDB
   */
  public traverseNodeIn (id: Identifier): Promise<StixObject[]> {
    return this.traverseNode('MATCH (n)<-[r]-(o) WHERE n.id = $id RETURN r, o', id);
  }

  /**
   * @description Gets all outgoing edges and the objects they connect to.
   * @param {Identifier} id
   * @returns {Promise<StixObject[]>}
   * @memberof StigDB
   */
  public traverseNodeOut (id: Identifier): Promise<StixObject[]> {
    return this.traverseNode('MATCH (n)-[r]->(o) WHERE n.id = $id RETURN r, o', id);
  }

  /**
   * @description Determines the difference between a node from the graph and what is in the database
   * @param {StixObject} node
   * @returns {Promise<diffpatch.Delta>}
   * @memberof StigDB
   */
  public getDiff (node: StixObject): Promise<diffpatch.Delta | undefined> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) =>
        tx.run('MATCH (n) where n.id = $id RETURN n', { id: node.id })
      );
      const rec = res.records[0];
      if (rec) {
        return diffpatch.diff(node, fromNeo4j(rec.get('n').properties));
      }
    });
  }

  /**
   * @description Updates the database from the editor form
   * @param {StixObject} stix
   * @returns  Promise<string>
   * @memberof StigDB
   */
  public uploadBundle (stix: BundleType): Promise<[Set<string>, Set<string>]> {
    const nodes: StixObject[] = [];
    const edges: Relationship[] = [];
    for (const obj of stix.objects) {
      (isRelationship(obj) ? edges : nodes).push(obj as any);
    }
    return this.updateDB(nodes, edges);
  }

  /**
   * @description Updates the database from the editor form
   * @param {StixObject} stix
   * @returns  Promise<string>
   * @memberof StigDB
   */
  public async updateDB (stix_nodes: StixObject[], stix_edges: Relationship[]): Promise<[Set<string>, Set<string>]> {
    const time = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return await this.wrapSession(async (s: Session) => {
      const node_res = await s.executeWrite(async (tx: ManagedTransaction) =>
        Promise.all(stix_nodes.map(async (stix) => {
          stix.modified = time;
          if (!moment(stix.created).isValid()) {
            stix.created = time;
          }
          try {
            const res = await tx.run('MATCH (n:stixnode {id:$id}) RETURN n', { id: stix.id });
            const cmd = res.records.length === 0
              ? 'MERGE (n:stixnode:`' + stix.type + '` {id:$id})\n'
              : 'MATCH (n:stixnode {id:$id})\n';

            await setProperties(tx, toNeo4j(stix), cmd);
            return stix.id;
          } catch (e) {
            console.error(e); // eslint-disable-line no-console
            return '';
          }
        }))
      );

      const cnodes = new Set(node_res.filter(s => s !== ''));

      const edge_res = await s.executeWrite(async (tx: ManagedTransaction) =>
        Promise.all(stix_edges.map(async (stix) => {
          if (!cnodes.has(stix.source_ref!)) {
            console.error(`Source ref ${stix.source_ref} has not been committed`); // eslint-disable-line no-console
            return '';
          }
          if (!cnodes.has(stix.target_ref!)) {
            console.error(`Target ref ${stix.source_ref} has not been committed`); // eslint-disable-line no-console
            return '';
          }

          stix.modified = time;
          if (!moment(stix.created).isValid()) {
            stix.created = time;
          }
          try {
            const res = await tx.run('MATCH ()-[n {id:$id}]->() RETURN n', { id: stix.id });
            const cmd = res.records.length === 0
              ? 'MATCH (a:stixnode {id:$source_ref}), (b:stixnode {id:$target_ref})\n' +
                'MERGE (a)-[n:`' + stix.relationship_type + '` {id:$id}]->(b)\n'
              : 'MATCH (n:stixnode {id:$id})\n';

            await setProperties(tx, stix as any, cmd);
            return stix.id;
          } catch (e) {
            console.error(e); // eslint-disable-line no-console
            return '';
          }
        }))
      );

      const enodes = new Set(edge_res.filter(s => s !== ''));

      return [cnodes, enodes];
    });
  }

  /**
   * @param query
   * @returns
   */
  public executeQuery (query: string): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) => tx.run(query));
      return res.records.flatMap(rec => rec.map(fromNeo4j).flatMap(x => x));
    });
  }

  public async close () {
    await this.driver?.close();
    this.driver = undefined;
  }
}
