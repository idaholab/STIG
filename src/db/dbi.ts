import { Identifier, StixObject } from '../stix';
import { IDatabaseConfigOptions } from '../storage/database-configuration-storage';
import * as diffpatch from 'jsondiffpatch';
import { Neo4jStigDB } from './neo4j';

export type StigDBBackends = 'neo4j';

export abstract class StigDB {
  public config: IDatabaseConfigOptions;

  abstract getName (): string;
  abstract configure (config: IDatabaseConfigOptions): Promise<void>;
  abstract delete (stix: StixObject): Promise<void>;
  abstract traverseNodeIn (id: Identifier): Promise<StixObject[]>;
  abstract traverseNodeOut (id: Identifier): Promise<StixObject[]>;
  abstract getDiff (node: StixObject): Promise<diffpatch.Delta | undefined>;
  abstract updateDB (formdata: StixObject): Promise<void>;
  abstract executeQuery (query: string): Promise<StixObject[]>;
  abstract close (): void;

  public static async getDB (_backend: StigDBBackends, config: IDatabaseConfigOptions): Promise<StigDB> {
    const db = new Neo4jStigDB();
    await db.configure(config);
    return db;
  }
}
