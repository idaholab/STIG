import neo4j, {
  Driver,
  Session,
  ManagedTransaction,
  Record as Neo4jRecord,
  isNode,
  isPath,
  isRelationship as isNeoRelationship,
} from 'neo4j-driver';

// --- Types (mirrored from src/types for server use) ---

export type DBProfile = {
  Id: string;
  ProfileName: string;
  DatabaseType: string;
  Host: string;
  DatabaseName: string;
  Username: string;
  Password: string;
  LastDBOperationSuccessful: boolean;
};

export type StixObject = {
  type: string;
  spec_version?: string;
  id: string;
  object_marking_refs?: string[];
  [propertyName: string]: any;
};

export type StixRelationshipObject = StixObject & {
  spec_version: string;
  source_ref: string;
  target_ref: string;
  relationship_type: string;
  created: string;
  modified: string;
  [propertyName: string]: any;
};

// --- Dot notation helpers (from stix2neo.ts) ---

function makeDotNotation(parent: string, node: any, obj: Record<string, unknown>) {
  if (node instanceof Array) {
    obj[parent] = node.map((o) => JSON.stringify(o));
  } else if (typeof node === 'object' && node !== null) {
    for (const [p, n] of Object.entries(node)) {
      makeDotNotation(parent + '.' + p, n, obj);
    }
  } else {
    obj[parent] = node;
  }
}

function unmakeDotNotation(source: Record<string, unknown>): Record<string, unknown> {
  const node: Record<string, unknown> = {};
  for (let [key, value] of Object.entries(source)) {
    let target = node;
    const path = key.split('.');
    const plen = path.length;
    for (let i = 0; i < plen - 1; i++) {
      const prop = path[i];
      if (typeof target[prop] !== 'object') {
        target[prop] = {};
      }
      target = target[prop] as Record<string, unknown>;
    }
    if (value instanceof Array) {
      value = value.map((s) => {
        try { return JSON.parse(s as string); } catch { return s; }
      });
    }
    target[path[plen - 1]] = value;
  }
  return node;
}

export function toNeo4j(stix: StixObject): Record<string, any> {
  const props: Record<string, any> = {};
  for (const [key, val] of Object.entries(stix)) {
    if (key !== 'type') {
      makeDotNotation(key, val, props);
    }
  }
  return props;
}

export function fromNeo4j(obj: unknown): StixObject[] {
  if (isNode(obj)) {
    const node = unmakeDotNotation(obj.properties as Record<string, unknown>);
    for (const typ of obj.labels) {
      if (typ !== 'stixnode') {
        node.type = typ;
      }
    }
    return [node as StixObject];
  }
  if (isPath(obj)) {
    const res = fromNeo4j(obj.start);
    for (const seg of obj.segments) {
      res.push(...fromNeo4j(seg.relationship), ...fromNeo4j(seg.end));
    }
    return res;
  }
  if (isNeoRelationship(obj)) {
    return [
      {
        type: 'relationship',
        relationship_type: obj.type,
        ...obj.properties,
      } as unknown as StixRelationshipObject,
    ];
  }
  return [];
}

function isRelationship(item: StixObject): item is StixRelationshipObject {
  return typeof item.type === 'string' && item.type.toLocaleLowerCase() === 'relationship';
}

// --- Cypher queries ---

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

// --- Stencil type lookup (from StencilItems.ts, simplified) ---
// We import the stencil type mapping at build time. For now we accept it as a parameter.

// --- Neo4j DB class ---

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

function bulkRequest(ids: string[], query: string) {
  return async (s: Session) => {
    const { records } = await s.executeRead((tx) => tx.run(query, { ids }));
    return records;
  };
}

export class Neo4jDB {
  private driver?: Driver;
  private databaseName?: string;

  async connect(config: DBProfile): Promise<void> {
    await this.close();
    this.databaseName = config.DatabaseName || undefined;
    const driver = neo4j.driver(
      config.Host,
      neo4j.auth.basic(config.Username, config.Password)
    );
    await driver.getServerInfo();
    this.driver = driver;
  }

  async close(): Promise<void> {
    await this.driver?.close();
    this.driver = undefined;
  }

  getDatabaseName(): string | undefined {
    return this.databaseName;
  }

  isClosed(): boolean {
    return this.driver === undefined;
  }

  private async wrapSession<T>(cb: (s: Session) => Promise<T>): Promise<T> {
    if (!this.driver) {
      throw new Error('DB driver is not initialized');
    }
    const session = this.driver.session(
      this.databaseName ? { database: this.databaseName } : undefined
    );
    try {
      return await cb(session);
    } finally {
      await session.close();
    }
  }

  async delete(stix: StixObject[]): Promise<{ nodes: number; rels: number }> {
    return this.wrapSession((s) =>
      s.executeWrite(async (tx) => {
        const nodeIds: string[] = [];
        const relIds: string[] = [];
        let nodeDels = 0;
        let relDels = 0;
        for (const obj of stix) {
          (isRelationship(obj) ? relIds : nodeIds).push(obj.id);
        }
        if (relIds.length) {
          const res = await tx.run(
            'UNWIND $ids AS id MATCH ()-[r {id: id}]->() DELETE r',
            { ids: relIds }
          );
          const { nodesDeleted, relationshipsDeleted } = res.summary.counters.updates();
          nodeDels += nodesDeleted;
          relDels += relationshipsDeleted;
        }
        if (nodeIds.length) {
          const res = await tx.run(
            'UNWIND $ids AS id MATCH (n: stixnode {id: id}) DETACH DELETE n',
            { ids: nodeIds }
          );
          const { nodesDeleted, relationshipsDeleted } = res.summary.counters.updates();
          nodeDels += nodesDeleted;
          relDels += relationshipsDeleted;
        }
        return { nodes: nodeDels, rels: relDels };
      })
    );
  }

  private traverseNode(query: string, id: string): Promise<StixObject[]> {
    return this.wrapSession(async (s: Session) => {
      const res = await s.executeRead((tx: ManagedTransaction) => tx.run(query, { id }));
      return res.records.flatMap((rec) => rec.map(fromNeo4j).flat());
    });
  }

  async traverseNodeIn(id: string): Promise<StixObject[]> {
    return this.traverseNode('MATCH (n)<-[r]-(o) WHERE n.id = $id RETURN r, o', id);
  }

  async traverseNodeOut(id: string): Promise<StixObject[]> {
    return this.traverseNode('MATCH (n)-[r]->(o) WHERE n.id = $id RETURN r, o', id);
  }

  async getDiff(
    nodes: StixObject[],
    edges: StixRelationshipObject[]
  ): Promise<[StixObject, any][]> {
    const [nres, eres] = await this.wrapSession(async (s) => {
      const np =
        nodes.length === 0
          ? []
          : await bulkRequest(
              nodes.map((o) => o.id),
              get_node_query
            )(s);
      const ep =
        edges.length === 0
          ? []
          : await bulkRequest(
              edges.map((o) => o.id),
              get_rel_query
            )(s);
      return [np, ep];
    });
    return [...diffAgainstDB(nodes, nres), ...diffAgainstDB(edges, eres)];
  }

  async updateDB(
    stixNodes: StixObject[],
    stixEdges: StixRelationshipObject[],
    stencilTypeLookup: (type: string) => string | undefined
  ): Promise<{ nodes: number; edges: number; errors: number; invalIds: string[] | undefined }> {
    const time = new Date().toISOString();
    const nodeParams = stixNodes.map((stix) => {
      const stixCoreType = stencilTypeLookup(stix.type);
      if (stixCoreType === 'sdo') {
        stix.modified = time;
        if (!stix.created || isNaN(Date.parse(stix.created))) {
          stix.created = time;
        }
      } else if (stixCoreType === 'sco') {
        stix.created = undefined;
        stix.modified = undefined;
      }
      const props = toNeo4j(stix);
      delete props.type;
      return { id: props.id, type: stix.type, props };
    });

    const edgeParams = stixEdges.map((stix) => {
      stix.modified = time;
      if (!stix.created || isNaN(Date.parse(stix.created))) {
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
      const nodesWritten =
        nodeParams.length === 0 ? 0 : await s.executeWrite(dbWrite(set_node_query, nodeParams));
      const edgesWritten =
        edgeParams.length === 0 ? 0 : await s.executeWrite(dbWrite(set_rel_query, edgeParams));
      return {
        nodes: nodesWritten,
        edges: edgesWritten,
        errors: stixEdges.length + stixNodes.length - nodesWritten - edgesWritten,
        invalIds: undefined,
      };
    });
  }

  async executeQuery(query: string): Promise<StixObject[]> {
    const res = await this.wrapSession((s) => s.executeRead((tx) => tx.run(query)));
    return res.records.flatMap((rec) => rec.map(fromNeo4j).flat());
  }
}

function diffAgainstDB(
  objs: StixObject[],
  records: Neo4jRecord[]
): [StixObject, any][] {
  const recsByID = new Map<string, object>();
  for (const rec of records) {
    const res = rec.get('n');
    if (!res) continue;
    recsByID.set(res.properties.id, res);
  }
  const results: [StixObject, any][] = [];
  for (const obj of objs) {
    const res = recsByID.get(obj.id);
    const current = res ? toNeo4j(fromNeo4j(res)[0]) : {};
    const incoming = toNeo4j(obj);
    // Simple diff: find keys that differ
    const diff: Record<string, any> = {};
    const allKeys = new Set([...Object.keys(current), ...Object.keys(incoming)]);
    for (const key of allKeys) {
      if (JSON.stringify(current[key]) !== JSON.stringify(incoming[key])) {
        diff[key] = incoming[key];
      }
    }
    if (Object.keys(diff).length > 0) {
      results.push([obj, diff]);
    }
  }
  return results;
}
