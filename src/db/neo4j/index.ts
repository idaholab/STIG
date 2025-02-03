import neo4j, { Driver, Session, ManagedTransaction, Record, Neo4jError } from 'neo4j-driver';
import { DBProfile } from '@/types/DBProfile';
import { StigDB } from '../dbi';
import moment from 'moment';
import { fromNeo4j, toNeo4j } from './stix2neo';
import { isRelationship } from './isRelationship';
import { StixObject } from '@/types/stixTypes/StixObject';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { Delta, DiffPatcher } from 'diffpatch';
import { stencilItems } from '@/components/elements/StencilItems';

const get_node_query = `
UNWIND $ids AS id
OPTIONAL MATCH (n {id:id})
RETURN n`;

const get_rel_query = `
UNWIND $ids AS id
OPTIONAL MATCH ()-[n {id: id}]-()
RETURN n`;

const set_node_query = `
UNWIND $objects AS object
WITH
  object.type AS type,
  object.id AS id,
  object.props AS props
MERGE (n {id: id})
WITH type, props, n
CALL apoc.create.setLabels(n, ['stixnode', type]) YIELD node
SET node = props
RETURN node AS n`;

const set_rel_query = `
UNWIND $objects AS object
WITH
  object.type AS type,
  object.id AS id,
  object.srcid AS srcid,
  object.dstid AS dstid,
  object.props AS props
MATCH (a:stixnode {id:srcid}),(b:stixnode {id:dstid})
WITH type, id, props, a, b
OPTIONAL MATCH (a)-[r {id: id}]-(b) DELETE r
MERGE (a)-[n:stixrel {id: id}]-(b)
WITH type, props, n
CALL apoc.refactor.setType(n, type) YIELD output
SET output = props
RETURN output AS n`;

// eslint-disable-next-line
function dbWrite(query: string, objects: any[]) {
  return async (tx: ManagedTransaction) => {
    try {
      const res = await tx.run(query, { objects });
      return res.records.length;
    } catch (e) {
      console.error(e);
      return 0;
    }
  };
}

function bulkRequest(objs: StixObject[], query: string) {
  return async (s: Session) => {
    const { records } = await s.executeRead((tx) => tx.run(query, { ids: objs.map((o) => o.id) }));
    return records;
  };
}

function* diffAgainstDB(patcher: DiffPatcher, objs: StixObject[], records: Record[]): Generator<[StixObject, Delta]> {
  const recs_by_id = new Map<string, object>();
  for (const rec of records) {
    const res = rec.get('n');
    if (!res) continue;
    recs_by_id.set(res.properties.id, res);
  }
  for (const obj of objs) {
    const res = recs_by_id.get(obj.id);
    const diff = patcher.diff(res ? toNeo4j(fromNeo4j(res)[0]) : {}, toNeo4j(obj));
    if (diff && Object.keys(diff).length > 0) yield [obj, diff];
  }
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
    } catch (e: unknown) {
      if (e instanceof Neo4jError || e instanceof Error) {
        e.stack += (new Error().stack ?? '');
        throw e;
      } else {
        throw new Error('Unexpected error: ');
      }
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
  public delete(stix: StixObject[]): Promise<{ nodes: number; rels: number }> {
    return this.wrapSession((s) =>
      s.executeWrite(async (tx) => {
        const nodes: string[] = [];
        const rels: string[] = [];
        let node_dels = 0;
        let rel_dels = 0;
        for (const obj of stix) {
          (isRelationship(obj) ? rels : nodes).push(obj.id);
        }
        if (rels.length) {
          const res = await tx.run('UNWIND $ids AS id MATCH ()-[r {id: id}]->() DELETE r', { ids: rels });
          const { nodesDeleted, relationshipsDeleted } = res.summary.counters.updates();
          node_dels += nodesDeleted;
          rel_dels += relationshipsDeleted;
        }
        if (nodes.length) {
          const res = await tx.run('UNWIND $ids AS id MATCH (n: stixnode {id: id}) DETACH DELETE n', { ids: nodes });
          const { nodesDeleted, relationshipsDeleted } = res.summary.counters.updates();
          node_dels += nodesDeleted;
          rel_dels += relationshipsDeleted;
        }
        return { nodes: node_dels, rels: rel_dels };
      }),
    );
  }

  private traverseNode(query: string, id: string): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) => tx.run(query, { id }));
      return res.records.flatMap((rec) => rec.map(fromNeo4j).flat());
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
    const [nres, eres] = await this.wrapSession(async (s) => {
      const np = nodes.length === 0 ? [] : await bulkRequest(nodes, get_node_query)(s);
      const ep = edges.length === 0 ? [] : await bulkRequest(edges, get_rel_query)(s);
      return [np, ep];
    });
    const patcher = new DiffPatcher();
    return [...diffAgainstDB(patcher, nodes, nres), ...diffAgainstDB(patcher, edges, eres)];
  }

  /**
   * @description Updates the database from the editor form
   * @param {StixObject} stix
   * @returns  Promise<string>
   * @memberof StigDB
   */
  public updateDB(
    stix_nodes: StixObject[],
    stix_edges: StixRelationshipObject[],
  ): Promise<{ nodes: number; edges: number; errors: number }> {
    const time = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const node_params = stix_nodes.map((stix) => {
      const stixCoreType = stencilItems.find((stencilItem) => stencilItem.id === stix.type)?.type;
      if (stixCoreType == 'sdo') {
        stix.modified = time;
        if (!moment(stix.created).isValid()) {
          stix.created = time;
        }
      } else if (stixCoreType == 'sco') {
        if (stix.created != undefined) {
          console.warn("the 'created' property is not valid for SCO's, so it has been removed from " + stix.id);
        }
        if (stix.modified != undefined) {
          console.warn("the 'modified' property is not valid for SCO's, so it has been removed from " + stix.id);
        }
        stix.created = undefined;
        stix.modified = undefined;
      }

      const props = toNeo4j(stix);
      delete props.type;
      return { id: props.id, type: stix.type, props };
    });

    const edge_params = stix_edges.map((stix) => {
      stix.modified = time;
      if (!moment(stix.created).isValid()) {
        stix.created = time;
      }
      const props = toNeo4j(stix as StixObject);
      delete props.type;
      delete props.relationship_type;
      return {
        id: stix.id,
        type: stix.relationship_type,
        srcid: stix.source_ref,
        dstid: stix.target_ref,
        props,
      };
    });

    return this.wrapSession(async (s: Session) => {
      const nodes = node_params.length === 0 ? 0 : await s.executeWrite(dbWrite(set_node_query, node_params));
      const edges = edge_params.length === 0 ? 0 : await s.executeWrite(dbWrite(set_rel_query, edge_params));
      return { nodes, edges, errors: stix_edges.length + stix_nodes.length - nodes - edges };
    });
  }

  /**
   * @param query
   * @returns
   */
  public async executeQuery(query: string): Promise<StixObject[]> {
    const res = await this.wrapSession((s) => s.executeRead((tx) => tx.run(query)));
    return res.records.flatMap((rec) => rec.map(fromNeo4j).flat());
  }

  public async close() {
    await this.driver?.close();
    this.driver = undefined;
  }
  public is_closed() {
    return this.driver == undefined;
  }
}
