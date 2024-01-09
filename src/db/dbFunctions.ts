import diffpatch from 'jsondiffpatch';
import { StixObject } from '../stix';
import { IDatabaseConfigOptions, TaxiiParams } from '../storage/database-configuration-storage';
import { schema } from './schema';

async function req (path: string, body: unknown): Promise<any> {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.message) {
    $('.message-status').html(data.message);
  }
  return data;
}

export async function use_db (config: IDatabaseConfigOptions) {
  await req('/use_db', { config });
  return check_db();
}

export async function commit (stix: StixObject) {
  if (stix && checkProps(stix)) {
    // Only commit if the object is valid
    const response = await req('/commit', { data: stix });
    return response.message === '';
  }
  return false;
}

export function db_delete (stix: StixObject) {
  return req('/delete', { data: stix });
}

export async function query_incoming (stix: StixObject): Promise<StixObject[]> {
  const response = await req('/query_incoming', { id: stix.id });
  return response.data ?? [];
}

export async function query_outgoing (stix: StixObject): Promise<StixObject[]> {
  const response = await req('/query_outgoing', { id: stix.id });
  return response.data ?? [];
}

export async function query (query: string): Promise<StixObject[]> {
  const response = await req('/query', { query });
  return response.data ?? [];
}

export async function get_diff (stix: StixObject): Promise<diffpatch.Delta | undefined> {
  const response = await req('/diff', { data: stix });
  return response.data;
}

export async function get_taxii (tax: TaxiiParams): Promise<StixObject[]> {
  const response = await req('/taxii', { params: tax });
  return response.taxii ? JSON.parse(response.taxii) : [];
}

export async function check_db () {
  const response = await fetch('/check_db', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const json = await response.json();
  const db: string = json.data;

  const db_el = document.getElementById('db-status')!;
  if (db) {
    db_el.innerHTML = db;
    db_el.className = 'db-status-green';
  } else {
    db_el.innerHTML = 'not connected';
    db_el.className = 'db-status-red';
  }
}

export function checkProps (object: StixObject): boolean {
  const schemaObject = schema.classes.find(c => { return c.name === object.type; });
  if (typeof schemaObject !== 'object') {
    return false;
  }

  // Get the requireed props from the schema
  const reqProps = schemaObject.properties.filter(prop => { return prop.mandatory; });
  // Get the required props from the super classes
  for (const superClass of schemaObject.superClasses) {
    const superClassObject = schema.classes.find(c => {
      const name = c.name.replace(/-/g, '');
      return name === superClass;
    });
    if (superClassObject) {
      const superReqProps = superClassObject.properties.filter(prop => { return prop.mandatory; });
      reqProps.concat(superReqProps);
    }
  }

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
