import { Identifier, SDO, SRO, StixObject } from '../stix';
import { IDatabaseConfigOptions } from '../storage/database-configuration-storage';
import * as diffpatch from 'jsondiffpatch';
import { OrientStigDB } from './orient';

export type StigDBBackends = 'orient';

export abstract class StigDB {
  abstract getName (): string;
  abstract configure (config: IDatabaseConfigOptions): Promise<void>;
  abstract sroDestroyedUI (sro: SRO): Promise<void>;
  abstract sdoDestroyedUI (sdo: SDO): Promise<void>;
  abstract traverseNodeIn (id: Identifier): Promise<StixObject[]>;
  abstract traverseNodeOut (id: Identifier): Promise<StixObject[]>;
  abstract getDiff (node: StixObject): Promise<diffpatch.Delta | undefined>;
  abstract updateDB (formdata: StixObject): Promise<void>;
  abstract executeQuery (query: string): Promise<StixObject[]>;

  public static async getDB (backend: StigDBBackends, config: IDatabaseConfigOptions): Promise<StigDB> {
    let db: StigDB;
    switch (backend) {
      case 'orient':
        db = new OrientStigDB();
        break;
      default:
        throw new Error('Invalid Database Backend');
    }

    await db.configure(config);
    return db;
  }
}
