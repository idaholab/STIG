import { isNode, isPath, isRelationship as isNeoRelationship } from 'neo4j-driver';
import { Core, Relationship, SDO, StixObject } from '../../stix/stix2';

export function makeDotNotation (parent: string, node: any, obj: Record<string, unknown>) {
  if (node instanceof Array) {
    obj[parent] = node.map(o => JSON.stringify(o));
  } else if (typeof node === 'object') {
    for (const [p, n] of Object.entries(node)) {
      makeDotNotation(parent + '.' + p, n, obj);
    }
  } else {
    obj[parent] = node;
  }
}

export function unmakeDotNotation (source: Record<string, unknown>): Record<string, unknown> {
  const node: Record<string, unknown> = {};
  for (let [key, value] of Object.entries(source)) {
    let target = node;
    const path = key.split('.');
    const plen = path.length;

    // vivify the path
    for (let i = 0; i < plen - 1; i++) {
      const prop = path[i];
      if (typeof target[prop] !== 'object') {
        target[prop] = {};
      }
      target = target[prop] as Record<string, unknown>;
    }

    // inflate array values which were uniformly stringified
    if (value instanceof Array) {
      value = value.map(s => JSON.parse(s));
    }
    target[path[plen - 1]] = value;
  }

  return node;
}

export function toNeo4j (stix: Core) {
  const props: Record<string, string> = {};
  for (const [key, val] of Object.entries(stix)) {
    if (key !== 'type') {
      makeDotNotation(key, val, props);
    }
  }
  return props;
}

export function fromNeo4j (obj: unknown): StixObject[] {
  if (isNode(obj)) {
    const node = unmakeDotNotation(obj.properties);
    for (const typ of obj.labels) {
      if (typ !== 'stixnode') {
        node.type = typ;
      }
    }
    return [node as SDO];
  }
  if (isPath(obj)) {
    const res = fromNeo4j(obj.start);
    for (const seg of obj.segments) {
      res.push(...fromNeo4j(seg.relationship), ...fromNeo4j(seg.end));
    }
    return res;
  }
  if (isNeoRelationship(obj)) {
    return [{
      type: 'relationship',
      relationship_type: obj.type,
      ...obj.properties,
    } as unknown as Relationship];
  }
  return [];
}
