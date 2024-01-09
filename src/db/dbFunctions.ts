import diffpatch from 'jsondiffpatch';
import { StixObject } from '../stix';
import { IDatabaseConfigOptions, TaxiiParams } from '../storage/database-configuration-storage';
import { schema } from './schema';

export function use_db (config: IDatabaseConfigOptions) {
  void fetch('/use_db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ config })
  }).then(async res => await res.json()).then(data => {
    if (data.message) {
      $('.message-status').html(data.message);
    }

    void check_db();
  });
}

export async function commit (stix: StixObject) {
  if (stix && checkProps(stix)) {
    // Only commit if the object is valid
    return await fetch('/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: stix })
    }).then(async res => await res.json()).then(data => {
      if (data.message !== '') {
        $('.message-status').html(data.message);
        return false;
      }

      return true;
    });
  } else {
    return false;
  }
}

export function db_delete (stix: StixObject) {
  void fetch('/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: stix })
  }).then(async res => await res.json()).then(data => {
    if (data.message !== '') {
      $('.message-status').html(data.message);
    }
  });
}

export async function query_incoming (stix: StixObject): Promise<StixObject[]> {
  return await fetch('/query_incoming', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: stix.id })
  }).then(async response => await response.json()).then(response => {
    if (response.data) {
      return response.data;
    } else {
      if (response.message !== '') {
        $('.message-status').html(response.message);
      }
      return undefined;
    }
  });
}

export async function query_outgoing (stix: StixObject): Promise<StixObject[]> {
  return await fetch('/query_outgoing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: stix.id })
  }).then(async response => await response.json()).then(response => {
    if (response.data) {
      return response.data;
    } else {
      if (response.message) {
        $('.message-status').html(response.message);
      }
      return undefined;
    }
  });
}

export async function query (query: string): Promise<StixObject[]> {
  return await fetch('/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  }).then(async response => await response.json()).then(response => {
    if (response.data) {
      return response.data;
    } else {
      if (response.message !== '') {
        $('.message-status').html(response.message);
      }
      return undefined;
    }
  });
}

export async function get_diff (stix: StixObject): Promise<diffpatch.Delta> {
  return await fetch('/diff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: stix })
  }).then(async response => await response.json()).then(response => {
    if (response.data) {
      return response.data;
    } else {
      if (response.message) {
        $('.message-status').html(response.message);
      }
      return undefined;
    }
  });
}

export async function get_taxii (tax: TaxiiParams): Promise<StixObject[]> {
  return await fetch('/taxii', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ params: tax })
  }).then(async response => await response.json()).then(response => {
    // console.log(data)
    if (response.taxii) {
      return JSON.parse(response.taxii);
    } else {
      if (response.message) {
        $('.message-status').html(response.message);
      }
      return undefined;
    }

    // check_db()
  });
}

export async function check_db () {
  const db = await fetch('/check_db', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async response => await response.json()).then(response => { return response.data; });

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
    // console.log(prop.name, prop.mandatory)

    // id_ only exists on the database side. Skip this.
    if (prop.name === 'id_') continue;

    if (object[prop.name] === undefined) {
      // console.log(prop.name, ' not found on object');

      // Return false to indicate that this object is invalid
      return false;
    }
  }

  return true;
}
