/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as moment from 'moment';
import * as cytoscape from 'cytoscape';
import { HTTPCommandQuery, GraphQueryResult, OrientErrorMessage, Rid } from './db_types';
import { BundleType, Id, Identifier, SDO, SRO, StixNodeData, StixObject } from '../stix';
// import { } from './stixnode';
import * as _ from 'lodash';
import * as diffpatch from 'jsondiffpatch';
import { DiffDialog } from '../ui/diff-dialog';
import * as http_codes from 'http-status-codes';
import { ErrorWidget } from '../ui/errorWidget';
import * as orientjs from 'orientjs';
import { PropertyCreateConfig, QueryOptions } from 'orientjs';
import { DatabaseConfigurationStorage } from '../storage';
import { ipcRenderer } from 'electron';
import { IDatabaseConfigOptions } from '../storage/database-configuration-storage';
import { openDatabaseConfiguration } from '../ui/database-config-widget';

export class DBConnectionError implements Error {
    public message: string;
    public name: string;
    constructor(message: string, stack: string) {
        const dialog = new ErrorWidget($('#error-anchor'));
        $('#query-status').html('Database Connection Error!');
        this.message = message;
        dialog.populate("Error Connecting to database", `
        <p>Message: ${message}</p>
        <p>Stack: ${stack}</p>`);
    }
    public display() {
        const dialog = new ErrorWidget($('#error-anchor'));
        dialog.open();
    }
}

export class HTTPQueryError implements Error {
    public props: any;
    public code: number;
    public name: string = "QueryError";
    public message: string;
    public json: OrientErrorMessage;
    public statusCode = this.code;
    public statusMessage = this.message;
    constructor(code: string | number, msg: string, props?: any) {
        if (typeof code === "string") { (this.isCodeString(code)) ? code = http_codes[code] : code = +code; }
        if (typeof code !== "number") { throw new TypeError(`unsupported HTTP Code: ${code}`); }
        if (typeof msg === "object" && msg !== null) { props = msg; msg = null; }
        this.code = code;
        try {
            this.json = JSON.parse(msg);
            this.message = JSON.stringify(this.json);
        } catch (e) {
            this.json = undefined;
            this.message = msg;
        }
        this.props = props;
        $('#query-status').html('Query Error!');
    }

    private isCodeString(code: string) {
        // tslint:disable-next-line:use-isnan
        return +code === NaN;
    }

    public toHtml() {
        let msg = '<h3> Query Error </h3>';
        if (this.json !== undefined && this.json.errors && this.json.errors.length > 0) {
            this.json.errors.forEach((e) => {
                msg += `<p><b>Status Code:</b> ${e.code}
                            ${http_codes.getStatusText(e.code)}<\p>
                            <b>Error: </b>`;
                msg += `<p>${e.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`;
            });
        } else {
            msg += this.message;
        }
        // console.log(msg);
        return msg;
    }

    public display() {
        const dialog = new ErrorWidget($('#error-anchor'));
        dialog.populate('Query Error', this.toHtml());
        dialog.open();
    }
}

export class StigDB {

    public db_config: IDatabaseConfigOptions;
    public headersLocal: { "Authorization": string; "Content-Type": string; };
    public ojs: orientjs.ODatabase;
    public odb: orientjs.Db;
    public diff_dialog: DiffDialog;
    public dbhost: string;
    public dbname: string;
    public commandurl: string;
    public gremlinurl: string;
    public baseurl: string;
    public _properties_cache: { [k: string]: orientjs.Property[] } = {};

    constructor(dbname: string) {
        ipcRenderer.on('database_reconfigured', (_event: Event, options: IDatabaseConfigOptions) => this.changeConfig(options));
        this.diff_dialog = new DiffDialog($('#diff-anchor'));
        if (dbname === undefined) {
            this.configure();
        } else {
            this.changeConfig(DatabaseConfigurationStorage.Instance.get(dbname));
        }
    }

    private configure() {
        // const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
        // try {
        openDatabaseConfiguration();
        //     // tslint:disable-next-line:no-empty
        // } catch (e) {
        //     const err = new DBConnectionError(e.message, e.stack);
        //     await err.display();
        // }
        // return;
    }

    private changeConfig(options: IDatabaseConfigOptions): void {

        this.db_config = options;
        this.headersLocal = {
            "Authorization": "Basic " + Buffer.from(`${options.username}:${options.password}`).toString('base64'),
            "Content-Type": "application/json;charset=utf-8",
        };
        this.dbname = options.name;
        this.commandurl = `http://${this.db_config.host}:2480/command/${this.dbname}/sql/-/-1`;
        this.gremlinurl = `http://${this.db_config.host}:2480/command/${this.dbname}/gremlin/-/-1`;
        this.baseurl = 'http://' + this.db_config.host + ':2480';
        this.diff_dialog = new DiffDialog($('#diff-anchor'));
        if (this.ojs !== undefined) {
            this.ojs.close();
        }
        try {
            this.ojs = new orientjs.ODatabase(options);
            this.ojs.open().then((db) => this.odb = db);
        } catch (e) {
            alert(`Error Opening Database: \n\t${e.name}\nMessage: \n\t${e.message}\n\nOpening Configuration`);
            openDatabaseConfiguration();
            console.error(e.name, e.message);
        }

        DatabaseConfigurationStorage.Instance.current = options.name;
    }

    // private _aliases = {
    //     "attack-pattern": "attackpattern",
    //     "course-of-action": "courseofaction",
    //     "intrusion-set": "intrusionset",
    //     "marking-definition":  "markingdefinition",
    //     "observed-data": "observeddata",
    //     "threat-actor": "threatactor",
    // };

    /**
     * @description
     * @param {string} clazz
     * @returns {Promise<orientjs.Property[]>}
     * @memberof StigDB
     */
    public async  listPropertiesForClass(clazz: string): Promise<orientjs.Property[]> {
        // let classes = this.metadata['classes'];
        // if (clazz in this._aliases) {
        //     clazz = this._aliases[clazz];
        // }

        if (clazz in this._properties_cache) {
            return this._properties_cache[clazz];
        }

        const fields: orientjs.Property[] = [];
        try {
            const regex = /-/g;
            const cls = await this.ojs.class.get(clazz.replace(regex, ''));
            const props = await cls.property.list();
            for (const f in props) {
                if (props[f]) {
                    fields.push(props[f]);
                }
            }
            if (cls.superClass) {
                fields.push(...await this.listPropertiesForClass(cls.superClass));
            }
            this._properties_cache[clazz] = fields;
            return fields;
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error(`Error in listPropertiesForClass:
            ${err}`);
            err.stack += (new Error()).stack;
            throw err;
        }
    }

    public async OJSQuery(query: string, options: QueryOptions): Promise<StixObject[]> {
        let ret;
        try {
            // options.mode = 'graph';
            ret = await this.ojs.query(query, options);
            return ret;
        } catch (err) {
            // console.error(`OJSQuery Error:\n${err}`);
            err.stack += (new Error()).stack;
            throw err;
        }
    }
    public async doQuery(query: HTTPCommandQuery): Promise<GraphQueryResult> {
        const fetchData: RequestInit = {
            method: 'POST',
            body: JSON.stringify(query),
            mode: "cors" as RequestMode,
            headers: this.headersLocal,
        };
        if (query.command.length === 0) {
            const ret: GraphQueryResult = {
                graph: {
                    edges: [],
                    vertices: [],
                },
            };
            return ret;
        }
        let url;
        if (query.command.startsWith('g.')) { url = this.gremlinurl; } else { url = this.commandurl; }
        let result;
        try {
            result = await fetch(url, fetchData);
            if (result.ok) {
                const ret = result.json();
                return ret as Promise<GraphQueryResult>;
            } else {
                const error = new HTTPQueryError(result.status, await result.text(), { response: result });
                error.display();
                return {
                    graph: {
                        edges: [],
                        vertices: [],
                    },
                };
                // throw error;
            }
        } catch (e) {
            const ee: Error = e;
            const error = new HTTPQueryError(ee.name, ee.message, ee.stack);
            error.display();
            return {
                graph: {
                    edges: [],
                    vertices: [],
                },
            };
        }
    }

    public async doGraphQuery(query: HTTPCommandQuery): Promise<GraphQueryResult> {
        query.mode = 'graph';
        let url: string;
        if (query.command.startsWith('g.')) { url = this.gremlinurl; } else { url = this.commandurl; }
        const fetchData: RequestInit = {
            method: 'POST',
            body: JSON.stringify(query),
            mode: "cors" as RequestMode,
            headers: this.headersLocal,
        };
        let result;
        try {
            result = await fetch(url, fetchData);
            if (result.status === 200) {
                const ret = result.json();
                return ret as Promise<GraphQueryResult>;
            } else {
                const error = new HTTPQueryError(result.status, await result.text(), { response: result });
                error.display();
                return {
                    graph: {
                        edges: [],
                        vertices: [],
                    },
                };
            }
        } catch (e) {
            alert(`Error Running Query: \n\t${e.name}\nMessage: \n\t${e.message}\n\nOpening Configuration`);
            openDatabaseConfiguration();
            console.error(e.name, e.message);
            return {
                graph: {
                    edges: [],
                    vertices: [],
                },
            };
        }
    }

    /**
     * @description For a given Stix identifier, returns the Orient record ID, or undefined if it is not in the database
     * @param {Identifier} identifier
     * @returns {Promise<Rid>}
     * @memberof StigDB
     */
    public async getRID(identifier: Identifier): Promise<Rid | undefined> {
        let rid: Rid;
        let query;
        try {
            if (identifier.startsWith('relationship') || identifier.startsWith('sighting')) {
                query = "select from E where id_=:id order by modified desc limit 1";
            } else {
                query = "select from V where id_=:id order by modified desc limit 1";
            }
            const result = await this.ojs.query(query, { params: { id: identifier } });
            if (result && result.length > 0) {
                rid = result[0]['@rid'];
                return rid;
            } else {
                return undefined;
            }
        } catch (e) {
            console.error('getRid error: ' + identifier);
            e.stack += (new Error()).stack;
            throw e;
        }
    }
    /**
     * @description Returns the modified date for the most recent record, returns undefined if no record is found
     * @param {Identifier} identifier
     * @returns {Promise<string>}
     * @memberof StigDB
     */
    public async getModified(identifier: Identifier): Promise<string | undefined> {
        let command: string;
        if (identifier.startsWith('relation') || identifier.startsWith('sighting')) {
            command = "select from E where id_= :id ORDER By modified DESC LIMIT 1";
        } else {
            command = "select from V where id_= :id ORDER By modified DESC LIMIT 1";
        }

        const options: QueryOptions = {
            params: { id: identifier },
        };
        let result: StixObject[];
        try {
            result = await this.ojs.query(command, options);
            if (result && result.length > 0) {
                return result[0].modified as string;
            } else {
                return undefined;
            }
        } catch (e) {
            console.error('Excpetion running query:', command);
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description Gets SDO or SCO from db.
     * @param {Identifier} identifier
     * @returns {Promise<SDO>}
     * @memberof StigDB
     */
    public async getSDO(identifier: Identifier): Promise<SDO | undefined> {
        const query = "select from V where id_=:id ORDER BY modified DESC limit 1";
        const options: QueryOptions = {
            params: {
                id: identifier,
            },
        };
        let result: StixObject[];
        try {
            result = await this.ojs.query(query, options);
            if (result.length > 0) {
                return result[0] as SDO;
            } else {
                return undefined;
            }
        } catch (e) {
            console.error('Exception in getSDO: ' + query);
            e.stack += (new Error()).stack;
            throw e;
        }
    }
    /**
     * @description
     * @param {Identifier} identifier
     * @returns {Promise<SRO>}
     * @memberof StigDB
     */
    public async getEdge(identifier: Identifier): Promise<SRO | undefined> {
        const query = "select from E where id_=:id ORDER BY modified DESC limit 1";
        const options: QueryOptions = {
            params: {
                id: identifier,
            },
        };
        let result: StixObject[];
        let ret: SRO | undefined;
        try {
            result = await this.ojs.query(query, options);
            (result.length > 0) ? ret = result[0] as SRO : ret = undefined;
            return ret;
        } catch (e) {
            console.error('Exception in getSDO:' + query);
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    public async exists(identifier: Identifier): Promise<boolean> {
        let query = "select from V where id_= :id";
        const options: QueryOptions = {
            params: {
                id: identifier,
            },
        };
        let v_result;
        let e_result;
        try {
            //  vertex?
            v_result = await this.OJSQuery(query, options);
            if (v_result && v_result.length > 0) { return true; }
            // edge?
            query = "select from E where id_= :id";
            e_result = await this.OJSQuery(query, options);
            if (e_result && e_result.length > 0) { return true; }
            // nuthin
            return false;
        } catch (e) {
            console.error('Exception in exists:' + query);
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description Get the database class for the named class
     * @param {string} cls_name
     * @returns {Promise<orientjs.Class>}
     * @memberof StigDB
     */
    public async getClass(cls_name: string): Promise<orientjs.Class> {
        let ret: orientjs.Class;
        try {
            const regex = /-/g;
            ret = await this.ojs.class.get(cls_name.replace(regex, ''));
            return ret;
        } catch (e) {
            console.error('Exception in getClass:');
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description Get the database properties list for a named class
     * @param {string} cls_name
     * @returns {Promise<orientjs.Property[]>}
     * @memberof StigDB
     */
    public async getClassProperties(cls_name: string): Promise<orientjs.Property[] | undefined> {
        let cls;
        try {
            const regex = /-/g;
            cls = await this.ojs.class.get(cls_name.replace(regex, ''));
            if (cls === undefined) { return undefined; }
            return cls.property.list();
        } catch (e) {
            console.error('Exception in getClass:');
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {string} className
     * @param {PropertyCreateConfig[]} props
     * @returns {Promise<orientjs.Class>}
     * @memberof StigDB
     */
    public async createVertexClass(className: string, props: PropertyCreateConfig[]): Promise<orientjs.Class> {
        let cls;
        try {
            cls = await this.ojs.class.create(className, 'V.Core', undefined, false, true);  // create the class
            for (const p of props) {
                cls.property.create(p);
            }
            return cls;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {string} className
     * @param {string} propertyName
     * @param {string} propertyType
     * @returns {Promise<orientjs.Property>}
     * @memberof StigDB
     */
    public async addPropertyToClass(className: string, propertyName: string, propertyType: string): Promise<orientjs.Property> {
        let cls;
        let property;
        try {
            const regex = /-/g;
            cls = await this.ojs.class.get(className.replace(regex, ''));
            property = await cls.property.create({ name: propertyName, type: propertyType } as PropertyCreateConfig);
            return property;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {string} className
     * @param {PropertyCreateConfig[]} props
     * @returns {Promise<orientjs.Class>}
     * @memberof StigDB
     */
    public async createEdgeClass(className: string, props: PropertyCreateConfig[]): Promise<orientjs.Class> {
        let cls;
        try {
            cls = await this.ojs.class.create(className, 'E.relationship', undefined, false, true);  // create the class
            for (const p of props) {
                cls.property.create(p);
            }
            return cls;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description User deleted an edge from the graph in the UI
     * @param {SRO} sro
     * @returns {Promise<StixObject[]>}
     * @memberof StigDB
     */
    public async sroDestroyedUI(sro: SRO): Promise<StixObject[]> {
        let rid = await this.getRID(sro.id);
        const q = `DELETE EDGE E WHERE @rid == "${rid}"`;

        const options: QueryOptions = {};
        let result: StixObject[];
        try {
            result = await this.OJSQuery(q, options);
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @descriptionUer User deleted a node from the graph in the UI
     * @param {SDO} sdo
     * @returns {Promise<StixObject[]>}
     * @memberof StigDB
     */
    public async sdoDestroyedUI(sdo: SDO): Promise<StixObject[]> {
        const q = `DELETE VERTEX FROM (SELECT FROM V where id_="${sdo.id}")`;
        const options: QueryOptions = {};
        let result: StixObject[];
        try {
            result = await this.OJSQuery(q, options);
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description Find neighbors for a given sdo node
     * @param {string} identifier
     * @param {Array<string>} [relationship_types]
     * @returns {Promise<{ nodes: StixObject[], edges: StixObject[] }>}
     * @memberof StigDB
     */
    public async getChildren(identifier: string, relationship_type?: string): Promise<{ nodes: StixObject[], edges: StixObject[] }> {
        let query: string;
        if (relationship_type === undefined) {
            query = "select expand(out()) from V where id_= :id";
        } else {
            query = `select expand(out('${relationship_type}')) from V where id_= :id`;
        }
        const options: QueryOptions = {
            params: {
                id: identifier,
            },
        };
        let vtx_results: StixObject[];
        let edge_results: StixObject[];
        try {
            vtx_results = await this.OJSQuery(query, options);
            if (relationship_type === undefined) {
                query = "select expand(outE()) from V where id_= :id";
            } else {
                query = `select expand(outE('${relationship_type}')) from V where id_= :id`;
            }
            edge_results = await this.OJSQuery(query, options);
            return { nodes: vtx_results, edges: edge_results };
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {Identifier} id
     * @returns {Promise<GraphQueryResult>}
     * @memberof StigDB
     */
    public async traverseNodeIn(id: Identifier): Promise<GraphQueryResult> {
        const query = {
            command: "traverse in()  from (select from V where id_=? ORDER BY modified DESC limit 1) while $depth < 2 ",
            mode: "graph",
            parameters: [id],
        };
        let results;
        try {
            results = await this.doGraphQuery(query);
            return results;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    public async traverseNodeOut(id: Identifier): Promise<GraphQueryResult> {
        const query = {
            command: "traverse out()  from (select from V where id_=? ORDER BY modified DESC limit 1) while $depth < 2 ",
            mode: "graph",
            // parameters:(relationship_type)?[relationship_type, id]: ['', id]
            parameters: [id],
        };
        let results;
        try {
            results = await this.doGraphQuery(query);
            return results;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    public async getParents(id: string): Promise<GraphQueryResult> {
        // get the parents for a given node{
        // this should include the ability to filter by SDO type or relationship type
        const query: HTTPCommandQuery = {
            command: "select expand(in()) from V where id_= :?",
            mode: "graph",
            parameters: [id],
        };
        try {
            const vtx_results = await this.doGraphQuery(query);
            query.command = "select expand(inE()) from V where id_=:id";
            const edge_results = await this.doGraphQuery(query);
            return { graph: { vertices: vtx_results.graph.vertices, edges: edge_results.graph.edges } };
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    public async isEqualToDB(changedNodeData: StixObject): Promise<boolean> {
        // see if the item in the UI is really different from the one in the DB
        // Being explicit about this to avoid having different versions of a node
        // that onyl differ by timestamp
        let db_instance;
        try {
            db_instance = await this.getSDO(changedNodeData.id);
            if (db_instance === undefined) { return false; }
            return _.isEqual(db_instance, changedNodeData);
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * TODO: FIX DUPLICATE IDS, check GetSDO
     * @description
     * @param {StixObject} stix_obj
     * @returns {Promise<Rid>}
     * @memberof StigDB
     */
    public async createVertex(stix_obj: StixObject): Promise<StixObject[]> {
        let result: StixObject[];
        try {
            if (stix_obj.type.startsWith('relation')) {
                throw new Error("Attempt to create a relation, use createEdge instead!");
            }
            const existing_node = await this.getSDO(stix_obj.id);
            if (existing_node !== undefined) {
                return existing_node["@rid"];
            }
            let query: string;
            let q_action: string;
            let q_class: string;
            q_class = "`" + stix_obj.type + "`";
            q_action = 'Create VERTEX ';
            query = q_action + q_class + ' CONTENT ' + JSON.stringify(transform_to_db(stix_obj));
            // console.log(query);
            result = await this.OJSQuery(query, {});
            // console.log('Query result:');
            // console.log(result);
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {Rid} from_RID
     * @param {Rid} to_RID
     * @param {StixObject} data
     * @returns {Promise<SRO[]>}
     * @memberof StigDB
     */
    public async createEdgeRID(from_RID: Rid, to_RID: Rid, data: StixObject): Promise<StixObject[]> {
        let result: StixObject[];
        try {
            const query = "CREATE EDGE `" + data.type + "` FROM :from_rid to :to_rid CONTENT :content";
            const parameters = {
                params: {
                    from_rid: from_RID,
                    to_rid: to_RID,
                    content: data,
                },
            };
            result = await this.OJSQuery(query, parameters);
            return result;
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
    public async createEdge(from_node: Identifier, to_node: Identifier, data: StixObject): Promise<StixObject[]> {
        let result;
        let to_RID: Rid;
        let from_RID: Rid;
        try {
            if (from_node.includes('--')) {
                from_RID = await this.getRID(from_node);
                to_RID = await this.getRID(to_node);
            } else {
                from_RID = from_node;
                to_RID = to_node;
            }
            if (from_RID === undefined) {
                console.debug(`createEdge saving ${from_node} to database`);
                const node_data = window.cycore.getElementById(from_node);
                from_RID = await this.createVertex(node_data.data('raw_data'))[0].RID;
            }
            if (to_RID === undefined) {
                console.debug(`createEdge saving ${to_node} to database`);
                const node_data = window.cycore.getElementById(to_node);
                to_RID = await this.createVertex(node_data.data('raw_data'))[0].RID;
            }
            result = this.createEdgeRID(from_RID, to_RID, data);
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {Identifier} id
     * @param {cytoscape.Core} cy
     * @returns {Promise<boolean>}
     * @memberof StigDB
     */
    public async needs_save(id: Identifier, cy: cytoscape.Core): Promise<boolean> {
        let ret: StixObject;
        let retval = true;
        try {
            const graph_node = cy.getElementById(id);
            // if (graph_node.length == 0){return true;}
            const db = this;
            const exists = await db.exists(id);
            if (!exists) {
                graph_node.data('saved', false);
                return true;
            }
            let db_copy;
            const node_data = graph_node.data().raw_data as StixObject;

            switch (node_data.type) {
                case 'relationship':
                case 'sighting':
                    ret = await db.getEdge(node_data.id);
                    break;
                default:
                    ret = await db.getSDO(node_data.id);
                    break;
            }
            const diffpatcher = new diffpatch.DiffPatcher({
                arrays: {
                    detectMove: true,
                    includeValueOnMove: false,
                },
                propertyFilter: (name: string) => {
                    if (name.startsWith('@', 0)) {
                        return false;
                    }
                    return true;
                },
            });
            if (ret === undefined) {
                graph_node.data('saved', false);
                const dif = diffpatcher.diff(node_data, { id: ' ' });
                if (dif !== undefined) {
                    // tslint:disable-next-line:no-string-literal
                    this.diff_dialog.addDiff(node_data.id, dif, {} as StixObject, node_data['name'] || '');
                }
                return true;
            }
            db_copy = ret as StixObject;
            // const class_props: orientjs.Property[] = await db.listPropertiesForClass(node_data.type.replace(/-/g, ''));
            const class_props: orientjs.Property[] = await db.listPropertiesForClass(node_data.type);
            const db_tmp = {};
            for (const p in class_props) {
                if (class_props[p]) {
                    const n = class_props[p].name;
                    const db_type = class_props[p].type;
                    // const cp_n = db_copy[n];
                    // console.log(n)
                    if (db_copy[n] === undefined) {
                        if (node_data[n] !== undefined) {
                            retval = false;
                            continue;
                        }
                    }
                    if (n.endsWith('_')) {
                        db_tmp[n.replace(/_$/, '')] = db_copy[n];
                    } else if (+db_type === 6 && db_copy[n] !== undefined) {
                        db_tmp[n] = db_copy[n].toISOString();
                    } else if (db_copy[n] !== undefined) {
                        if (!n.startsWith('@', 0)) {
                            db_tmp[n] = db_copy[n];
                        }
                    }
                }
            }
            // if (db_tmp.hasOwnProperty('revoked') && !node_data.hasOwnProperty('revoked')) {
            //     node_data['revoked'] = db_tmp['revoked'];
            // }
            // if (retval  && _.isEqual(node_data, db_tmp)) {
            const diff = diffpatcher.diff(node_data, db_tmp);
            if (retval && diff === undefined) {
                graph_node.data('saved', true);
                retval = false;
            } else {
                graph_node.data('saved', false);
                retval = true;
                if (node_data !== undefined && db_tmp !== undefined) {
                    if (diff !== undefined) {
                        // tslint:disable-next-line:no-string-literal
                        this.diff_dialog.addDiff(node_data.id, diff, db_tmp as StixObject, node_data['name'] || '');
                    }
                }
            }
            return retval;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description Updates the database from the editor form
     * @param {StixObject} formdata
     * @returns  Promise<string>
     * @memberof StigDB
     */
    public async  updateDB(formdata: StixObject): Promise<StixObject[]> {
        const db_obj = transform_to_db(formdata);
        const old_modified = await this.getModified(formdata.id);
        if (old_modified === undefined) {
            // New node, make sure dates are good
            if (!moment(db_obj.created).isValid()) {
                db_obj.created = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            }
            if (!moment(db_obj.modified).isValid()) {
                db_obj.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            }
        } else if (old_modified !== undefined && moment(old_modified).isSame(db_obj.modified)) {
            // Existing node, must create a new modified date and create a new object in the datyabase
            db_obj.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }
        let result;
        try {
            if (db_obj.type.startsWith('relation') || db_obj.type.startsWith('sighting')) {
                // tslint:disable-next-line:no-string-literal
                result = await this.createEdge(db_obj['source_ref'], db_obj['target_ref'], db_obj);
            } else {
                result = await this.createVertex(db_obj);
            }
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description Updates modified timestamp for edge
     * @param {SRO} edge
     * @param {string} old_modified
     * @returns
     * @memberof StigDB
     */
    public async updateEdge(edge: SRO): Promise<string> {
        // let command: CommandQuery = {
        //     command: "UPDATE EDGE `" + `${edge['relationship_type']}` + "`  CONTENT  ? WHERE id_ = ?",
        //     mode: "graph",
        //     parameters: [JSON.stringify(transform_to_db(edge)), edge.id]
        // }
        // let result = await this.doQuery(command);
        let result;
        try {
            // tslint:disable-next-line:no-string-literal
            result = await this.ojs.update(`${edge['relationship_type']}`).set(transform_to_db(edge)).where({ id_: `${edge.id}` }).exec<string>();
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description Updates modified timestamp for vertex
     * @param {SDO} vertex
     * @param {string} old_modified
     * @returns
     * @memberof StigDB
     */
    public async updateVertex(vertex: SDO, old_modified: string): Promise<string> {
        let result;
        try {
            result = await this.ojs.update(`\`${vertex.type}\``).set(transform_to_db(vertex)).where({ id_: `${vertex.id}`, modified: `${old_modified}` }).exec<string>();
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {("VERTEX" | "EDGE")} type
     * @param {Id} identifier
     * @returns {Promise<StixObject[]>}
     * @memberof StigDB
     */
    public async revokeID(type: "VERTEX" | "EDGE", identifier: Id): Promise<StixObject[]> {
        let query: string;
        type === "EDGE" ? query = "UPDATE EDGE E SET revoked = 'True' where id_=? " : query = "UPDATE V SET revoked = 'True' where id_=?";
        let result: StixObject[];
        try {
            result = await this.OJSQuery(query, { params: { id: identifier } });
            return result;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    /**
     * @description
     * @param {GraphQueryResult} records
     * @returns {Promise<BundleType>}
     * @memberof StigDB
     */
    public async  handleResponse(records: GraphQueryResult): Promise<BundleType> {
        // response handler
        let resp: StixObject[] = [];
        resp = resp.concat(records.graph.vertices, records.graph.edges);
        // resp = resp.concat(records.graph.edges);
        const bundle: BundleType = {
            type: "bundle",
            objects: [],
        };
        try {
            for (const record of resp) {

                const sdo = {} as StixObject;
                for (const prop of Object.keys(record)) {
                    if (prop === undefined || prop === null) {
                        continue;
                    }
                    if (record.type.toLowerCase() === "relationship" && (prop === 'in' || prop === 'out')) {
                        continue;
                    }
                    if (!prop.startsWith('@')) {
                        if (prop.endsWith('_')) {
                            sdo[prop.replace(/_$/, '')] = record[prop];
                        } else {
                            sdo[prop] = record[prop];
                        }
                    }
                }
                bundle.objects.push(sdo);
            }
            return bundle;
        } catch (e) {
            e.stack += (new Error()).stack;
            throw e;
        }
    }
}

/**
 *
 *
 * @export
 * @param {string} timestamp
 * @returns {string}
 */
export function toDBTime(timestamp: string): string {
    return moment.parseZone(timestamp).utc().format('YYYY-MM-DD HH:mm:ss.SSS');
}

/**
 *
 *
 * @export
 * @param {string} timestamp
 * @returns {string}
 */
export function toStixTime(timestamp: string): string {
    return moment.parseZone(timestamp).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
}

/**
 *
 *
 * @export
 * @param {StixObject} stix_record
 * @returns {StixObject}
 */
export function transform_to_db(stix_record: StixObject): StixObject {
    const ret = {} as StixObject;
    Object.keys(stix_record).forEach((prop) => {
        switch (prop) {
            case "id":
                // tslint:disable-next-line:no-string-literal
                ret['id_'] = stix_record.id;
                break;
            default:
                ret[prop] = stix_record[prop];
        }
    });
    return ret;
}

/**
 *
 *
 * @param {StixObject[]} stix_records
 * @returns {StixObject[]}
 */
export function transform_records_to_db(stix_records: StixObject[]): StixObject[] {
    const ret = [] as StixObject[];
    stix_records.forEach((r) => {
        const revised = transform_to_db(r);
        ret.push(revised);
    });
    return ret;
}
