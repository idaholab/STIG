import neo4j, { Driver, Session, ManagedTransaction } from 'neo4j-driver';
import { DBProfile } from '@/types/DBProfile';
import { StigDB } from '../dbi';
import moment from 'moment';
import { fromNeo4j, toNeo4j } from './stix2neo';
import { isRelationship } from './isRelationship';
import { StixObject } from '@/types/stixTypes/StixObject';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { Delta, DiffPatcher } from 'diffpatch';

function diffAgainstDB(patcher: DiffPatcher, obj: StixObject, query: string):  (s: Session) => Promise<[StixObject, Delta | undefined]> {
  return async (s: Session) => {
    const res = await s.executeRead(tx => tx.run(query, { id: obj.id }));
    const rec = res.records[0];
    return [obj, patcher.diff(rec ? toNeo4j(fromNeo4j(rec.get('n'))[0]) : {}, toNeo4j(obj))];
  };
}

export class Neo4jStigDB implements StigDB {
  private driver?: Driver;
  public config?: DBProfile;

  public async configure(config: DBProfile) {
    await this.close();
    this.config = config;
    const driver = neo4j.driver(config.Host, neo4j.auth.basic(config.Username, config.Password));
    await driver.getServerInfo();
    this.driver = driver;
  }

  public getName(): string {
    return 'Neo4j';
  }

  private async wrapSession<T>(cb: (s: Session) => Promise<T>): Promise<T> {
    if (!this.driver) {
      return Promise.reject(new Error('DB driver is not initialized'));
    }
    const session = this.driver.session(this.config?.DatabaseName ? { database: this.config?.DatabaseName } : undefined);
    try {
      return await cb(session);
    } catch (e: any) {
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
  public delete(stix: StixObject): Promise<void> {
    return this.wrapSession((s: Session) =>
      s.executeWrite((tx: ManagedTransaction) =>
        tx.run(isRelationship(stix)
          ? 'MATCH ()-[r]->() WHERE r.id = $id DELETE r'
          : 'MATCH (n: stixnode) WHERE n.id = $id DETACH DELETE n',
          { id: stix.id })
      )
    ) as Promise<unknown> as Promise<void>;
  }

  private traverseNode(query: string, id: string): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) =>
        tx.run(query, { id })
      );
      return res.records.flatMap(rec => rec.map(fromNeo4j).flatMap(x => x));
    });
  }

  /**
   * @description Gets all incoming edges and the objects they connect to.
   * @param {string} id
   * @returns {Promise<StixObject[]>}
   * @memberof StigDB
   */
  public traverseNodeIn(id: string): Promise<StixObject[]> {
    return this.traverseNode('MATCH (n)<-[r]-(o) WHERE n.id = $id RETURN r, o', id);
  }

  /**
   * @description Gets all outgoing edges and the objects they connect to.
   * @param {string} id
   * @returns {Promise<StixObject[]>}
   * @memberof StigDB
   */
  public traverseNodeOut(id: string): Promise<StixObject[]> {
    return this.traverseNode('MATCH (n)-[r]->(o) WHERE n.id = $id RETURN r, o', id);
  }

  /**
   * @description Determines the difference between a node from the graph and what is in the database
   * @param {StixObject[]} nodes
   * @returns {Promise<diffpatch.Delta>}
   * @memberof StigDB
   */
  public async getDiff(nodes: StixObject[], edges: StixRelationshipObject[]): Promise<[StixObject, Delta][]> {
    const patcher = new DiffPatcher();
    const node_promises: Promise<[StixObject, Delta|undefined]>[] = nodes.map(
      node => this.wrapSession(diffAgainstDB(patcher, node, 'MATCH (n) where n.id = $id RETURN n'))
    );
    const edge_promises: Promise<[StixObject, Delta|undefined]>[] = edges.map(
      edge => this.wrapSession(diffAgainstDB(patcher, edge, 'MATCH ()-[n]-() where n.id = $id RETURN n'))
    );
    return (await Promise.all([...node_promises, ...edge_promises])).filter(
      p => typeof p[1] == 'object' && Object.keys(p[1]).length > 0
    ) as [StixObject, Delta][];
  }

  /**
   * @description Updates the database from the editor form
   * @param {StixObject} stix
   * @returns  Promise<string>
   * @memberof StigDB
   */
  public async updateDB(stix_nodes: StixObject[], stix_edges: StixRelationshipObject[]): Promise<{ nodes: number; edges: number; errors: number; }> {
    const time = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return await this.wrapSession(async (s: Session) => {
      const node_res: number[] = await s.executeWrite((tx: ManagedTransaction) =>
        
        Promise.all(stix_nodes.map(async (stix) => {
          (stix as StixObject).modified = time;
          if (!moment(stix.created).isValid()) {
            stix.created = time;
          }
          try {
            const query = 'MERGE (n {id:$id})\nSET n = $props\n'
                        + 'SET n:stixnode:`'+stix.type+'`\nRETURN n';
            const props = toNeo4j(stix);
            delete props.type;
            const res = await tx.run(query, { id: props.id, props });
            return res.records.length === 1 ? 1 : 0;
          } catch (e) {
            console.error(e); // eslint-disable-line no-console
            return 0;
          }
        }))
      );

      const cnodes = node_res.reduce((p, n) => p + n, 0);

      const edge_res: number[] = await s.executeWrite((tx: ManagedTransaction) =>
        Promise.all(stix_edges.map(async (stix) => {
          stix.modified = time;
          if (!moment(stix.created).isValid()) {
            stix.created = time;
          }
          try {
            const query = 'MATCH (a:stixnode {id:$srcid}),(b:stixnode {id:$dstid})\n'
                        + 'MERGE (a)-[n:`' + stix.relationship_type + '` {id:$id}]->(b)\n'
                        + 'SET n = $props\nRETURN n'

            const props = toNeo4j((stix as StixObject));
            delete props.type;
            delete props.relationship_type;

            const res = await tx.run(query, {
              id: stix.id,
              srcid: stix.source_ref,
              dstid: stix.target_ref,
              props,
            });
            return res.records.length === 1 ? 1 : 0;
          } catch (e) {
            console.error(e); // eslint-disable-line no-console
            return 0;
          }
        }))
      );

      const cedges = edge_res.reduce((p, n) => p + n, 0);

      return { nodes: cnodes, edges: cedges, errors: stix_edges.length + stix_nodes.length - cnodes - cedges };
    });
  }

  /**
   * @param query
   * @returns
   */
  public executeQuery(query: string): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) => tx.run(query));
      return res.records.flatMap(rec => rec.map(fromNeo4j).flat());
    });
  }

  public async close() {
    await this.driver?.close();
    this.driver = undefined;
  }
  public is_closed(){
    return this.driver == undefined
  }
}
