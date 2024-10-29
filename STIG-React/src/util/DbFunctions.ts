// import diffpatch from 'jsondiffpatch';

import { StigDB } from "@/db/dbi";
import { SchemaSTIXClass } from "@/types/stixSchemaTypes/SchemaSTIXClass";
import { schema } from "@/stix/schema";
import { DBProfile } from "@/types/DBProfile";
import { STIGBundle } from "@/types/STIGBundle";
import { StixObject } from "@/types/stixTypes/StixObject";
import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";

let currentDB: StigDB;

async function wrapVoid<T>(stix: T, cb: (stix: T) => Promise<void>) {
  if (currentDB) {
    try {
      await cb(stix);
      return true;
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      return false;
    }
  }
  return false;
}

async function wrapReturn<T, V>(
  stix: V, def: () => T, cb: ((s: V) => Promise<T>)
): Promise<T> {
  if (currentDB && !currentDB.is_closed()) {
    try {
      return cb(stix);
    } catch {
      return def();
    }
  }
  return def();
}

export function close_db() {
  try {
    currentDB?.close();
  } catch (e) {
    console.error(e);
  }

}

export async function use_db(config: DBProfile) {
  currentDB?.close();
  try {
    currentDB = await StigDB.getDB('neo4j', config);
  } catch (e) {
    console.error(e)
  }
}

export async function commitBundle(bundle: STIGBundle): Promise<[Set<string>, Set<string>]> {
  return wrapReturn(bundle, () => [new Set(), new Set()], b => currentDB.uploadBundle(b));
}

export async function commit(nodes: StixObject[], edges: StixRelationshipObject[]): (Promise<[Set<string>, Set<string>]>) {
  // if (!nodes.every(checkProps) || !edges.every(checkProps)) throw new Error('Invalid stix');
  const filteredNodes = nodes.filter(checkProps);
  const filteredEdges = edges.filter(checkProps);
  const pair: [StixObject[], StixRelationshipObject[]] = [filteredNodes, filteredEdges];
  return wrapReturn(pair, () => [new Set(), new Set()], ([n, e]) => currentDB.updateDB(n, e));
}

export function db_delete(stix: StixObject) {
  return wrapVoid(stix, s => currentDB.delete(s));
}

export async function query_incoming({ id }: StixObject): Promise<StixObject[]> {
  return wrapReturn(id, () => [], s => currentDB.traverseNodeIn(s));
}

export async function query_outgoing({ id }: StixObject): Promise<StixObject[]> {
  return wrapReturn(id, () => [], s => currentDB.traverseNodeOut(s));
}

export async function query(query: string): Promise<StixObject[]> {
  return wrapReturn(query, () => [], q => currentDB.executeQuery(q));
}

// export async function get_diff(stix: StixObject): Promise<diffpatch.Delta | undefined> {
//   if (!checkProps(stix)) throw new Error('Invalid stix');
//   return wrapReturn(stix, () => ({}), s => currentDB.getDiff(s));
// }

function getAllProps(schemaObject: SchemaSTIXClass) {
  const props = schemaObject.properties;
  for (const superClass of schemaObject.superClasses) {
    const superClassObject = schema.find(c =>
      c.name.replace(/-/g, '') === superClass
    );
    if (superClassObject) {
      props.concat(getAllProps(superClassObject));
    }
  }
  return props;
}

export function checkProps(object: StixObject): boolean {
  const schemaObject = schema.find(c => { return c.name === object.type; });
  if (typeof schemaObject !== 'object') {
    return false;
  }

  // Get the required props from the schema
  const props = getAllProps(schemaObject);
  const reqProps = props.filter(prop => { return prop.mandatory; });
  for (const prop of reqProps) {
    // id_ only exists on the database side. Skip this.
    if (prop.name === 'id_') continue;

    if ((object as any)[prop.name] === undefined) {
      // Return false to indicate that this object is invalid
      return false;
    }
  }

  return true;
}
