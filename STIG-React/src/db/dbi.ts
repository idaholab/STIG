
import { IDatabaseConfigOptions } from '../storage/database-configuration-storage';

import { Neo4jStigDB } from './neo4j';
import { Identifier, StixObject } from '@/types/Core';
import { BundleType } from '@/types/BundleType';
import { Relationship } from '@/types/Relationship';

export type StigDBBackends = 'neo4j';

export abstract class StigDB {
  public config?: IDatabaseConfigOptions;

  abstract getName(): string;
  abstract configure(config: IDatabaseConfigOptions): Promise<void>;
  abstract delete(stix: StixObject): Promise<void>;
  abstract traverseNodeIn(id: Identifier): Promise<StixObject[]>;
  abstract traverseNodeOut(id: Identifier): Promise<StixObject[]>;
  //abstract getDiff(node: StixObject): Promise<diffpatch.Delta | undefined>;
  abstract uploadBundle(stix: BundleType): Promise<[Set<string>, Set<string>]>;
  abstract updateDB(stix_nodes: StixObject[], stix_edges: Relationship[]): Promise<[Set<string>, Set<string>]>;
  abstract executeQuery(query: string): Promise<StixObject[]>;
  abstract close(): void;

  public static async getDB(_backend: StigDBBackends, config: IDatabaseConfigOptions): Promise<StigDB> {
    const db = new Neo4jStigDB();
    await db.configure(config);
    return db;
  }
}
