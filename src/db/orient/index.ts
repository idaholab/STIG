/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import moment from 'moment';
import orientjs, { OrientDBClient, PropertyCreateConfig } from 'orientjs';
import { schema, IJSONClassOptions } from '../schema';
import { Identifier, SDO, SRO, StixObject } from '../../stix';
import { IDatabaseConfigOptions } from '../../storage/database-configuration-storage';

import * as diffpatch from 'jsondiffpatch';
import { isSRO, isRelationship } from '../../stix/stix2';
import { StigDB } from '../dbi';

export class OrientStigDB implements StigDB {
  private ojs: orientjs.OrientDBClient;
  private odb: orientjs.ODatabaseSession;

  public async configure (config: IDatabaseConfigOptions) {
    this.ojs = await OrientDBClient.connect({ host: config.host, port: config.port });

    const dbOptions = { name: config.name, username: config.username, password: config.password };
    if (await this.ojs.existsDatabase(dbOptions)) {
      this.odb = await this.ojs.session(dbOptions);
    } else {
      void this.ojs.createDatabase(dbOptions).then(async () => {
        this.odb = await this.ojs.session(dbOptions);
        void this.createClasses();
      });
    }
  }

  public getName (): string {
    return this.odb.name;
  }

  /**
   * @description For a given Stix identifier, returns the Orient record ID, or undefined if it is not in the database
   * @param {Identifier} identifier
   * @returns {Promise<string>}
   * @memberof StigDB
   */
  private async getRID (identifier: Identifier): Promise<string | undefined> {
    let query: string;
    try {
      if (identifier.startsWith('relationship') || identifier.startsWith('sighting')) {
        query = 'select from E where id_=:id order by modified desc limit 1';
      } else {
        query = 'select from V where id_=:id order by modified desc limit 1';
      }
      const result = await this.odb.query(query, { params: { id: identifier } }).all() as StixObject[];
      if (result && result.length > 0) {
        return result[0]['@rid'];
      } else {
        return undefined;
      }
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * @description User deleted an edge from the graph in the UI
   * @param {SRO} sro
   * @returns {Promise<void>}
   * @memberof StigDB
   */
  public async sroDestroyedUI (sro: SRO): Promise<void> {
    const rid = await this.getRID(sro.id);
    const q = `DELETE EDGE E WHERE @rid == "${rid}"`;
    try {
      await this.odb.command(q, {}).all();
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * @descriptionUer User deleted a node from the graph in the UI
   * @param {SDO} sdo
   * @returns {Promise<void>}
   * @memberof StigDB
   */
  public async sdoDestroyedUI (sdo: SDO): Promise<void> {
    const q = `DELETE VERTEX FROM (SELECT FROM V where id_="${sdo.id}")`;
    try {
      await this.odb.command(q, {}).all();
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  private async traverseNode (id: Identifier, dir: string): Promise<StixObject[]> {
    const node: StixObject = await this.odb.select().from('V').where({ id_: id }).one();
    const in_edges: StixObject[] = await this.odb.select().from('E').where({ in: node['@rid'] }).all();

    const results = [node];
    await Promise.all(
      in_edges.map(async (edge) => {
        const in_node: StixObject = await this.odb.select()
          .from(edge[dir].toString())
          .one();
        results.push(in_node, edge);
      })
    );

    return transform_records_to_stix(results);
  }

  /**
   * @description
   * @param {Identifier} id
   * @returns {Promise<StixObject[]>}
   * @memberof StigDB
   */
  public traverseNodeIn (id: Identifier): Promise<StixObject[]> {
    try {
      return this.traverseNode(id, 'out');
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  public traverseNodeOut (id: Identifier): Promise<StixObject[]> {
    try {
      return this.traverseNode(id, 'in');
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * TODO: FIX DUPLICATE IDS, check GetSDO
   * @description
   * @param {StixObject} stix_obj
   * @returns {Promise<string>}
   * @memberof StigDB
   */
  private createVertex (stix_obj: StixObject): Promise<StixObject[]> {
    try {
      if (stix_obj.type.startsWith('relation')) {
        throw new Error('Attempt to create a relation, use createEdge instead!');
      }

      const q_class = '`' + stix_obj.type + '`';
      const q_action = 'Create VERTEX ';
      const query = q_action + q_class + ' CONTENT ' + JSON.stringify(transform_to_db(stix_obj));
      return this.odb.command(query).all() as Promise<StixObject[]>;
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * @description
   * @param {string} from_RID
   * @param {string} to_RID
   * @param {StixObject} data
   * @returns {Promise<SRO[]>}
   * @memberof StigDB
   */
  private createEdgeRID (from_RID: string, to_RID: string, data: StixObject): Promise<StixObject[]> {
    try {
      const query = 'CREATE EDGE `' + data.type + '` FROM :from_rid to :to_rid CONTENT :content';
      const parameters = {
        params: {
          from_rid: from_RID,
          to_rid: to_RID,
          content: transform_to_db(data)
        }
      };
      return this.odb.command(query, parameters).all() as Promise<StixObject[]>;
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * @description
   * @param {Identifier} from_node
   * @param {Identifier} to_node
   * @param {StixObject} data
   * @returns {Promise<SRO[]>}
   * @memberof StigDB
   */
  private async createEdge (from_node: Identifier, to_node: Identifier, data: StixObject): Promise<StixObject[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const [from_RID, to_RID] = from_node.includes('--')
        ? await Promise.all([this.getRID(from_node), this.getRID(to_node)])
        : [from_node, to_node];
      return this.createEdgeRID(from_RID!, to_RID!, transform_to_db(data));
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * @description Determines the difference between a node from the graph and what is in the database
   * @param {StixObject} node
   * @returns {Promise<diffpatch.Delta>}
   * @memberof StigDB
   */
  public async getDiff (node: StixObject): Promise<diffpatch.Delta | undefined> {
    // Get the node from the database
    const dbNode: StixObject = await this.odb.select().from(node.type).where({ id_: node.id }).one();

    // Return if node isn't in the database
    if (!dbNode) {
      return undefined;
    }

    // Convert node to STIX
    const compNode = transform_to_stix(dbNode);

    // Get the difference between the two
    return diffpatch.diff(node, compNode);
  }

  /**
   * @description Updates the database from the editor form
   * @param {StixObject} formdata
   * @returns  Promise<string>
   * @memberof StigDB
   */
  public async updateDB (formdata: StixObject): Promise<StixObject[] | string> {
    const db_obj = transform_to_db(formdata);

    // Check if the id already exists in the database
    const rid = await this.getRID(formdata.id);

    try {
      if (rid === undefined) {
        // New node, make sure dates are good
        if (!moment(db_obj.created).isValid()) {
          db_obj.created = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }
        if (!moment(db_obj.modified).isValid()) {
          db_obj.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }

        if (isRelationship(db_obj)) {
          if (db_obj.source_ref && db_obj.target_ref) {
            return this.createEdge(db_obj.source_ref, db_obj.target_ref, db_obj);
          }
          throw new Error('Missing source and/or target references for edge.');
        }

        return this.createVertex(db_obj);
      }

      // Existing node, must create a new modified date
      db_obj.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      return this.updateObject(db_obj, rid.toString());
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * @description Updates properties stored in database
   * @param {StixObject} object
   * @param {string} rid
   * @returns
   * @memberof StigDB
   */
  private updateObject (object: StixObject, rid: string): Promise<string> {
    try {
      return this.odb.update(rid).set(transform_to_db(object)).one();
    } catch (e) {
      e.stack += (new Error()).stack;
      throw e;
    }
  }

  /**
   * @description Creates the classes from the schema
   */
  private async createClasses () {
    return Promise.all(
      schema.classes.map(async (cls) => {
        const c = await this.class_query(cls);
        return this.create_properties(c, cls.properties as unknown as PropertyCreateConfig[]);
      })
    );
  }

  /**
   * @param options
   * @returns
   */
  private async class_query (options: IJSONClassOptions) {
    let name = options.name;
    const idx = name.indexOf('-');
    let alias: string | undefined;
    if (idx > -1) {
      alias = name;
      name = name.replace(/-/g, '');
    }
    try {
      const exists = await this.odb.class.get(name);
      if (exists !== undefined) {
        await this.odb.class.drop(name);
      }
    } catch (e) { }
    const cls = await this.odb.class.create(name, options.superClasses[0]);
    if (alias !== undefined) {
      alias = '`' + alias + '`';
      const query = `ALTER CLASS  ${name}  SHORTNAME ${alias}`;
      await this.odb.exec(query);
    }
    return cls;
  }

  /**
   * @param cls
   * @param props
   * @returns
   */
  private create_properties (cls: orientjs.OClass, props: orientjs.PropertyCreateConfig[]): Promise<orientjs.OClassProperty[]> {
    return cls.property.create(props);
  }

  /**
   * @param query
   * @returns
   */
  public async executeQuery (query: string): Promise<StixObject[]> {
    // Get result
    const result = await this.odb.query(query).all() as StixObject[];
    // Sort into nodes and edges
    const resNodes: StixObject[] = [];
    const resEdges: SRO[] = [];
    for (const item of result) {
      (isSRO(item) ? resEdges : resNodes).push(item);
    }
    // Make a list of node rids
    const nodeRids = resNodes.map(n => n['@rid'].toString());

    // Get edges
    const edgeQuery = 'select * from E where in in :nodes and out in :nodes';
    const edges = await this.odb.query(edgeQuery, { params: { nodes: nodeRids } }).all() as StixObject[];

    // Make a set of in and out rids
    const edgeRids = new Set<string>(resEdges.flatMap(e => [(e as any).in.toString(), (e as any).out.toString()]));

    // Get nodes to complete the edges
    const nodeQuery = 'select * from V where @rid in :rids';
    const nodes = await this.odb.query(nodeQuery, { params: { rids: Array.from(edgeRids) } }).all() as StixObject[];

    return transform_records_to_stix([...nodes, ...edges]);
  }
}

/**
 * @export
 * @param {string} timestamp
 * @returns {string}
 */
function toDBTime (timestamp: string): string {
  return moment.parseZone(timestamp).utc().format('YYYY-MM-DD HH:mm:ss.SSS');
}

/**
 * @export
 * @param {string} timestamp
 * @returns {string}
 */
function toStixTime (timestamp: string): string {
  return moment.parseZone(timestamp).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
}

/**
 * @export
 * @param {StixObject} stix_record
 * @returns {StixObject}
 */
function transform_to_db (stix_record: StixObject): StixObject {
  const ret: StixObject = {} as any;
  for (const prop of Object.keys(stix_record)) {
    if (prop === 'id') {
      ret.id_ = stix_record.id;
    } else // Check if value contains date in STIX format
      if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d*Z|Z)/.test(stix_record[prop])) {
        ret[prop] = toDBTime(stix_record[prop]);
      } else {
        ret[prop] = stix_record[prop];
      }
  }
  return ret;
}

/**
 * @description Converts a stix record from DB format to STIX format. (Converts dates and id_)
 * @param {StixObject} stix_record
 * @returns {StixObject}
 */
function transform_to_stix (stix_record: StixObject): StixObject {
  const ret: StixObject = {} as any;
  for (const prop of Object.keys(stix_record)) {
    switch (prop) {
      case 'id_':
        ret.id = stix_record.id_!;
        break;
      case '@rid':
      case '@class':
      case '@version':
      case 'in_relationship':
      case 'out_relationship':
        break;
      default:
        // Check if value contains date in DB format
        if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}/.test(stix_record[prop])) {
          ret[prop] = toStixTime(stix_record[prop]);
        } else {
          ret[prop] = stix_record[prop];
        }
    }
  }
  return ret;
}

/**
 * @param {StixObject[]} stix_records
 * @returns {StixObject[]}
 */
function transform_records_to_stix (stix_records: StixObject[]): StixObject[] {
  return stix_records.map(transform_to_stix);
}
