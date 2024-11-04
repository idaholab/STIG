import { DBProfile } from '@/types/DBProfile';
import { Neo4jStigDB } from './neo4j';
import { StixObject } from '@/types/stixTypes/StixObject';
import { STIGBundle } from '@/types/STIGBundle';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { Delta } from "diffpatch"

export type StigDBBackends = 'neo4j';

export abstract class StigDB {
  public config?: DBProfile;

  abstract getName(): string;
  abstract configure(config: DBProfile): Promise<void>;
  abstract delete(stix: StixObject): Promise<void>;
  abstract traverseNodeIn(id: string): Promise<StixObject[]>;
  abstract traverseNodeOut(id: string): Promise<StixObject[]>;
  abstract getDiff(...nodes: StixObject[]): Promise<Map<string, Delta | undefined>>;
  abstract uploadBundle(stix: STIGBundle): Promise<[Set<string>, Set<string>]>;
  abstract updateDB(stix_nodes: StixObject[], stix_edges: StixRelationshipObject[]): Promise<[Set<string>, Set<string>]>;
  abstract executeQuery(query: string): Promise<StixObject[]>;
  abstract close(): void;
  abstract is_closed(): boolean;

  public static async getDB(_backend: StigDBBackends, config: DBProfile): Promise<StigDB> {
    const db = new Neo4jStigDB();
    await db.configure(config);
    return db;
  }
}
