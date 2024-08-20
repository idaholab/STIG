import diffpatch from 'jsondiffpatch';
import { BundleType, Relationship, StixObject } from '../stix';
import { IDatabaseConfigOptions } from '../storage/database-configuration-storage';
import { schema, IJSONClassOptions } from '../db/schema';
import { StigDB } from '../db';

let currentDB: StigDB;

async function wrapVoid<T> (stix: T, cb: (stix: T) => Promise<void>) {
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

async function wrapReturn<T, V> (
  stix: V, def: () => T, cb: ((s: V) => Promise<T>)
): Promise<T> {
  if (currentDB) {
    try {
      return cb(stix);
    } catch {
      return def();
    }
  }
  return def();
}

export function check_db () {
  const db_el = document.getElementById('db-status')!;
  if (currentDB) {
    db_el.innerHTML = currentDB.config.db ? currentDB.config.db : currentDB.config.name;
    db_el.className = 'db-status-green';
  } else {
    db_el.innerHTML = 'not connected';
    db_el.className = 'db-status-red';
  }
}

export async function use_db (config: IDatabaseConfigOptions) {
  currentDB?.close();
  try {
    currentDB = await StigDB.getDB('neo4j', config);
  } finally {
    check_db();
  }
}

export async function commitBundle (bundle: BundleType): Promise<[Set<string>, Set<string>]> {
  return wrapReturn(bundle, () => [new Set(), new Set()], b => currentDB.uploadBundle(b));
}

export async function commit (nodes: StixObject[], edges: Relationship[]): Promise<[Set<string>, Set<string>]> {
  edges.forEach(e=>{
    if (!e.target_ref && !e.source_ref && !e.relationship_type){
      //NOTE: this means that it is a visual edge, which ought to be removed
      edges = edges.filter(obj => {return obj !== e});
    }
  })
  if (!nodes.every(checkProps)){
    throw new Error('Invalid objects');
  }
  if (!edges.every(checkProps)){
    throw new Error('Invalid relationships')
  }
  const pair: [StixObject[], Relationship[]] = [nodes, edges];
  return wrapReturn(pair, () => [new Set(), new Set()], ([n, e]) => currentDB.updateDB(n, e));
}

export function db_delete (stix: StixObject) {
  return wrapVoid(stix, s => currentDB.delete(s));
}

export async function query_incoming ({ id }: StixObject): Promise<StixObject[]> {
  return wrapReturn(id, () => [], s => currentDB.traverseNodeIn(s));
}

export async function query_outgoing ({ id }: StixObject): Promise<StixObject[]> {
  return wrapReturn(id, () => [], s => currentDB.traverseNodeOut(s));
}

export async function query (query: string): Promise<StixObject[]> {
  return wrapReturn(query, () => [], q => currentDB.executeQuery(q));
}

export async function get_diff (stix: StixObject): Promise<diffpatch.Delta | undefined> {
  if (!checkProps(stix)) throw new Error('Invalid stix');
  return wrapReturn(stix, () => ({}), s => currentDB.getDiff(s));
}

function getAllProps (schemaObject: IJSONClassOptions) {
  const props = schemaObject.properties;
  for (const superClass of schemaObject.superClasses) {
    const superClassObject = schema.classes.find(c =>
      c.name.replace(/-/g, '') === superClass
    );
    if (superClassObject) {
      props.concat(getAllProps(superClassObject));
    }
  }
  return props;
}

export function checkProps (object: StixObject): boolean {
  const schemaObject = schema.classes.find(c => { return c.name === object.type; });
  if (typeof schemaObject !== 'object') {
    console.error(`${schemaObject} is not equal to type 'object'`);
    return false;
  }

  // Get the required props from the schema
  const props = getAllProps(schemaObject);
  const reqProps = props.filter(prop => { return prop.mandatory; });
  for (const prop of reqProps) {
    // id_ only exists on the database side. Skip this.
    if (prop.name === 'id_') continue;

    if (object[prop.name] === undefined) {
      console.error(`${prop.name} is undefined for:\n`, object);
      return false;
    }
  }

  return true;
}
