import neo4j, { Driver, Session, ManagedTransaction } from 'neo4j-driver';
import { Identifier, SDO, SRO, StixObject } from '../../stix';
import { IDatabaseConfigOptions } from '../../storage/database-configuration-storage';

import * as diffpatch from 'jsondiffpatch';
import { isRelationship } from '../../stix/stix2';
import { StigDB } from '../dbi';
import moment from 'moment';

function * iterNestedProperties (obj: object) {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v !== 'object') {
      yield [k, v];
    } else {
      for (const [vk, vv] of iterNestedProperties(v)) {
        yield [`${v}.${vk}`, vv];
      }
    }
  }
}

function toNeo4j (obj: object) {
  return Object.fromEntries(iterNestedProperties(obj));
}

function fromNeo4j (obj: object) {
  const n: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = k.split('.');
    let l = n;
    for (let i = 0; i < path.length - 1; i++) {
      let nn = l[path[i]];
      if (typeof nn !== 'object') {
        nn = {};
        l[path[i]] = nn;
      }
      l = nn as Record<string, unknown>;
    }
    l[path.pop()!] = v;
  }
  return n as unknown as StixObject;
}

export class Neo4jStigDB implements StigDB {
  private driver: Driver;

  public async configure (config: IDatabaseConfigOptions) {
    this.driver = neo4j.driver(config.host, neo4j.auth.basic(config.username, config.password));
    await this.driver.verifyConnectivity();
  }

  public getName (): string {
    return 'Neo4j';
  }

  private async wrapSession<T> (cb: (s: Session) => Promise<T>) {
    const session = this.driver.session();
    try {
      return cb(session);
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    } finally {
      await session.close();
    }
  }

  /**
   * @description User deleted an edge from the graph in the UI
   * @param {SRO} sro
   * @returns {Promise<void>}
   * @memberof StigDB
   */
  public sroDestroyedUI ({ id }: SRO): Promise<void> {
    return this.wrapSession((s: Session) =>
      s.executeWrite((tx: ManagedTransaction) =>
        tx.run('MATCH ()-[r]->() WHERE r.id = $id DELETE r', { id })
      )
    ) as Promise<unknown> as Promise<void>;
  }

  /**
   * @descriptionUer User deleted a node from the graph in the UI
   * @param {SDO} sdo
   * @returns {Promise<void>}
   * @memberof StigDB
   */
  public sdoDestroyedUI ({ id }: SDO): Promise<void> {
    return this.wrapSession((s: Session) =>
      s.executeWrite((tx: ManagedTransaction) =>
        tx.run('MATCH (n) WHERE n.id = $id DETACH DELETE n', { id })
      )
    ) as Promise<unknown> as Promise<void>;
  }

  private traverseNode (query: string, id: Identifier): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) =>
        tx.run(query, { id })
      );
      return res.records.flatMap(rec => rec.map(fromNeo4j));
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
   * @param {StixObject} formdata
   * @returns  Promise<string>
   * @memberof StigDB
   */
  public updateDB (formdata: StixObject): Promise<void> {
    const dbObj = toNeo4j(formdata);
    const time = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return this.wrapSession(async (s: Session) => {
      if (isRelationship(formdata)) {
        if (formdata.source_ref && formdata.target_ref) {
          await s.executeWrite(async (tx: ManagedTransaction) => {
            if (!moment(dbObj.created).isValid()) {
              const res = await tx.run(`
                MERGE ()-[r]->() WHERE r.id = $id RETURN r
              `, {
                id: formdata.id,
              });

              if (res.records.length === 0) {
                dbObj.created = time;
              }
            }
            dbObj.modified = time;

            return tx.run(`
              MERGE (a)-[r]->(b)
              WHERE a.id = $src AND b.id = $dst AND r.id = $id
              SET r = $props
            `, {
              src: formdata.source_ref,
              dst: formdata.target_ref,
              id: formdata.id,
              props: dbObj,
            });
          });
        }
        throw new Error('Missing source and/or target references for edge.');
      } else {
        await s.executeWrite(async (tx: ManagedTransaction) => {
          if (!moment(dbObj.created).isValid()) {
            const res = await tx.run(`
              MERGE (n) WHERE n.id = $id RETURN n
            `, {
              id: formdata.id,
            });

            if (res.records.length === 0) {
              dbObj.created = time;
            }
          }
          dbObj.modified = time;

          return tx.run(`
            MERGE (n) WHERE n.id = $id
            SET n = $props
          `, {
            id: formdata.id,
            props: dbObj,
          });
        });
      }
    });
  }

  /**
   * @param query
   * @returns
   */
  public executeQuery (query: string): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) => tx.run(query));
      return res.records.flatMap(rec => rec.map(fromNeo4j));
    });
  }
}
