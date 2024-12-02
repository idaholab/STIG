// import diffpatch from 'jsondiffpatch';

import { StigDB } from "@/db/dbi";
import { DBProfile } from "@/types/DBProfile";
import { StixObject } from "@/types/stixTypes/StixObject";
import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";
import { Delta } from "diffpatch";
import { checkProps } from "@/stix/stix";

export let currentDB: StigDB;

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

export async function commit(nodes: StixObject[], edges: StixRelationshipObject[]): (Promise<{ nodes: number; edges: number; errors: number; }> ) {
  // if (!nodes.every(checkProps) || !edges.every(checkProps)) throw new Error('Invalid stix');
  const filteredNodes = nodes;//.filter(checkProps);
  const filteredEdges = edges;//.filter(checkProps);
  const pair: [StixObject[], StixRelationshipObject[]] = [filteredNodes, filteredEdges];
  return wrapReturn(pair, () => ({ nodes: 0, edges: 0, errors: 0 }), ([n, e]) => currentDB.updateDB(n, e));
}

export function db_delete(stix: StixObject[]) {
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

export async function get_diff(nodes: StixObject[], edges: StixRelationshipObject[]): Promise<[StixObject, Delta][]> {
  if (!nodes.every(checkProps) || !edges.every(checkProps)) throw new Error('Invalid stix');
  return wrapReturn({nodes, edges}, () => [], ({ nodes, edges }) => currentDB.getDiff(nodes, edges));
}
