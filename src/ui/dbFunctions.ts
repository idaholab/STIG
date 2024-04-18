import diffpatch from 'jsondiffpatch';
import { StixObject } from '../stix';
import { IDatabaseConfigOptions, TaxiiParams } from '../storage/database-configuration-storage';
import { schema, IJSONClassOptions } from '../db/schema';
import { StigDB } from '../db';

let currentDB: StigDB;

async function wrapVoid (stix: StixObject, cb: (stix: StixObject) => Promise<void>) {
  if (stix && checkProps(stix) && currentDB) {
    try {
      await cb(stix);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

async function wrapReturn<T, V extends string | StixObject> (
  stix: V, def: T, cb: ((s: V) => Promise<T>)
): Promise<T> {
  if (stix && (typeof stix === 'string' || checkProps(stix)) && currentDB) {
    try {
      return cb(stix);
    } catch {
      return def;
    }
  }
  return def;
}

export function check_db () {
  const db_el = document.getElementById('db-status')!;
  if (currentDB) {
    db_el.innerHTML = currentDB.config.db ?? currentDB.config.name;
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

export async function commit (stix: StixObject) {
  return wrapVoid(stix, s => currentDB.updateDB(s));
}

export function db_delete (stix: StixObject) {
  return wrapVoid(stix, s => currentDB.delete(s));
}

export async function query_incoming ({ id }: StixObject): Promise<StixObject[]> {
  return wrapReturn(id, [], s => currentDB.traverseNodeIn(s));
}

export async function query_outgoing ({ id }: StixObject): Promise<StixObject[]> {
  return wrapReturn(id, [], s => currentDB.traverseNodeOut(s));
}

export async function query (query: string): Promise<StixObject[]> {
  return wrapReturn(query, [], q => currentDB.executeQuery(q));
}

export async function get_diff (stix: StixObject): Promise<diffpatch.Delta | undefined> {
  return wrapReturn(stix, {}, s => currentDB.getDiff(s));
}

export async function get_taxii (tax: TaxiiParams): Promise<StixObject[]> {
  const res = await fetch('/taxii', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ params: tax })
  });
  const data = await res.json();
  if (data.message) {
    $('.message-status').html(data.message);
  }
  return data.taxii ? JSON.parse(data.taxii) : [];
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
    return false;
  }

  // Get the required props from the schema
  const props = getAllProps(schemaObject);
  const reqProps = props.filter(prop => { return prop.mandatory; });
  for (const prop of reqProps) {
    // id_ only exists on the database side. Skip this.
    if (prop.name === 'id_') continue;

    if (object[prop.name] === undefined) {
      // Return false to indicate that this object is invalid
      return false;
    }
  }

  return true;
}
