/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

// import { objects.StixRelationshipData, StixRelationship, DataSourceType } from '../stix';
import { BundleType, Relationship, Sighting, Core, CreatedByRelationshipFactory, Identifier, ObjectMarkingRelationship, StixObject, Id, StixRelationshipData, StixRelationship, DataSourceType, IStixNode, StixNode } from "../stix";
import { StigDB } from "../db/db";
import * as moment from 'moment';
import { layouts, LayoutsType } from './graphOptions';
import * as cytoscape from 'cytoscape';
import { GraphQueryResult } from '../db/db_types';

export class GraphUtils {
    public db: StigDB;
    public cy: cytoscape.Core;
    constructor(cy: cytoscape.Core, db: StigDB) {
        this.cy = cy;
        this.db = db;
    }
    /**
     *
     *
     * @param {Identifier} id
     * @param {StixObject} [stixobj]
     * @returns {Promise<cytoscape.CollectionReturnValue>}
     * @memberof GraphUtils
     */
    public async handle_not_in_graph(id: Identifier): Promise<cytoscape.CollectionReturnValue | undefined> {
        let ret;
        const the_type = id.split('--')[0].toLowerCase();
        const data: GraphQueryResult = { graph: { edges: [], vertices: [] } };
        let st_node: IStixNode;
        let exists;

        try {
            exists = await this.db.exists(id);
            if (exists) {
                if (the_type === 'relationship' || the_type === 'sighting') {
                    data.graph.edges = [await this.db.getEdge(id)];
                } else {
                    data.graph.vertices = [await this.db.getSDO(id)];
                }
                const bundle = await this.db.handleResponse(data);
                const sdo = bundle.objects[0];
                st_node = new StixNode(sdo as Core, sdo.type, 'DB');
            } else {
                // src_node not in graph or db
                const create = await confirm("Object with id:" + id + "not found.  Create?");
                if (create) {
                    const sdo = {
                        created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                        modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                        type: the_type,
                        id,
                        revoked: false,
                    };
                    st_node = new StixNode(sdo as Core, sdo.type, 'GUI');
                } else {
                    return undefined;
                }
            }
            if (!this.cy.getElementById(st_node.data.id).length) {
                ret = this.cy.add(st_node as cytoscape.ElementDefinition);
                this.db.needs_save(id, this.cy).then(() => { return; });
            }
            return ret;
        } catch (e) {
            console.error(e);
            e.stack += (new Error()).stack;
            throw e;
        }
    }

    private _addVertices(sdos: StixObject[], from_db: boolean = false, metadata: object = null): [cytoscape.CollectionReturnValue, Relationship[], Sighting[]] {
        const relationshipsKeyRegex = /((r|R)elationship)|((s|S)ighting)/;
        const in_graph = new Set<Id>();
        const to_add: cytoscape.ElementDefinition[] = [];
        const relationships: Relationship[] = [];
        const sightings: Sighting[] = [];
        sdos = sdos.sort((a, b) => {
            const momentA = moment(a.modified).unix();
            const momentB = moment(b.modified).unix();
            return momentB - momentA;
        });

        try {
            for (const sdo of sdos) {
                if (sdo.id === undefined || sdo.type === undefined) {
                    continue;
                }
                if (this.cy.getElementById(sdo.id).length > 0) { continue; }

                if (!(relationshipsKeyRegex.exec(sdo.type))) {
                    try {
                        const st_node = new StixNode(sdo as Core, sdo.type, from_db ? 'DB' : 'GUI');
                        if (!in_graph.has(st_node.data.id)) {
                            to_add.push(JSON.parse(JSON.stringify(st_node)) as cytoscape.ElementDefinition);
                            in_graph.add(st_node.data.id);
                        }
                        if (sdo.created_by_ref !== null && sdo.created_by_ref !== undefined) {
                            if (!in_graph.has(sdo.id)) {
                                const cb_sro = CreatedByRelationshipFactory(sdo.id, sdo.created_by_ref as Identifier, sdo.created, sdo.modified);
                                relationships.push(cb_sro as Relationship);
                                in_graph.add(sdo.id);
                            }
                        } else if ('object_marking_refs' in sdo && sdo.object_marking_refs !== undefined) {
                            // add object marking references 'applies-to'
                            sdo.object_marking_refs.forEach((markingID) => {
                                if (!in_graph.has(sdo.id)) {
                                    relationships.push(new ObjectMarkingRelationship(markingID, sdo.id, sdo.created, sdo.modified));
                                    in_graph.add(sdo.id);
                                }
                            });
                        }
                    } catch (e) {
                        console.error(`Error adding node: ${sdo}\nError ${e}`);
                        throw e;
                    }
                } else if (sdo.type.toLowerCase() === 'relationship') {
                    if (!in_graph.has(sdo.id)) {
                        relationships.push(sdo as Relationship);
                        in_graph.add(sdo.id);
                    }
                } else if (sdo.type.toLowerCase() === 'sighting') {
                    if (!in_graph.has(sdo.id)) {
                        sightings.push(sdo as Sighting);
                        in_graph.add(sdo.id);
                    }
                }
            }
            const nodes_added = this.cy.add(to_add);
            this.addMetadataToNodes(metadata, nodes_added);

            return [nodes_added, relationships, sightings];
        } catch (e) {
            console.error('Exception adding nodes to graph:', e);
            throw e;
        }
    }

    /**
     *  add location data or other metadata to nodes on page
     * @param metadata
     * @param nodes
     */
    private addMetadataToNodes(metadata: object, nodes: cytoscape.CollectionReturnValue) {
        if (metadata == null) return;
        nodes.map(node => {
            let obj = metadata.find(x => x.id === node.id());
            if (obj) node.position(obj.position);
        })
    }

    /**
     * pkg should be a JSON object complying to the Stix2.0 bundle schema
     *
     * @param {BundleType} pkg
     * @returns {Promise<cytoscape.CollectionElements>}
     * @memberof GraphUtils
     */
    public async buildNodes(pkg: BundleType, from_db: boolean = false): Promise<cytoscape.CollectionReturnValue> {
        // let relationships: Relationship[] = [];
        // let sightings: Sighting[] = [];
        // let in_graph = new Set<Id>()
        const sdos = pkg.objects;
        const metadata = "metadata" in pkg  ? pkg.metadata : null

        // let cont = false;
        if (sdos === undefined) {
            this.addMetadataToNodes(metadata, this.cy.elements())
            return this.cy.elements('#nothing');
        }
        const data_source = from_db ? 'DB' : 'GUI';
        const [nodes_added, relationships, sightings] = this._addVertices(sdos as StixObject[], from_db, metadata);
        const to_add: cytoscape.ElementDefinition[] = [];
        try {
            // Add relationships to graph
            for (const r of relationships) {
                // console.log(`adding relationship ${r.id}`);
                let to_node = this.cy.getElementById(r.target_ref);
                let from_node = this.cy.getElementById(r.source_ref);
                if (from_node.length === 0) {
                    from_node = await this.handle_not_in_graph(r.source_ref);
                }
                if (to_node.length === 0) {
                    to_node = await this.handle_not_in_graph(r.target_ref);
                }

                if (from_node === undefined || to_node === undefined) {
                    console.debug(`Couldn't find node:
                from_node:${from_node} ${r.source_ref}
                to_node:${to_node} ${r.target_ref}`);
                    continue;
                }

                const edge_data: StixRelationshipData = {
                    target: to_node.id(),
                    source: from_node.id(),
                    id: r.id,
                    label: r.relationship_type,
                    raw_data: r,
                };
                const relationship = new StixRelationship(edge_data, data_source);
                try {
                    if (!this.cy.getElementById(r.id).length) {
                        to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
                    }
                } catch (error) {
                    throw error;
                }
            }
            for (const r of sightings) {
                const from_node = this.cy.getElementById(r.sighting_of_ref);
                // first create any observed data refs
                if (r.observed_data_refs) {
                    for (const t_n of r.observed_data_refs) {
                        const to_node = this.cy.getElementById(t_n);
                        const edge_data = {
                            target: to_node.id(),
                            source: from_node.id(),
                            id: r.id,
                            label: 'observed data sighting',
                            raw_data: r,
                            data_source: 'IGNORE' as DataSourceType,
                        };
                        const relationship = new StixRelationship(edge_data, 'IGNORE');
                        try {
                            if (!this.cy.getElementById(r.id).length) {
                                to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
                            }
                        } catch (error) {
                            throw error;
                        }
                    }
                }
                if (r.object_marking_refs) {
                    for (const t_n of r.object_marking_refs) {
                        const to_node = this.cy.getElementById(t_n);
                        const edge_data = {
                            target: to_node.id(),
                            source: from_node.id(),
                            id: r.id,
                            label: 'object marking',
                            raw_data: r,
                            data_source: 'IGNORE' as DataSourceType,
                        };
                        const relationship = new StixRelationship(edge_data, 'IGNORE');
                        try {
                            if (!this.cy.getElementById(r.id).length) {
                                to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
                            }
                        } catch (error) {
                            throw error;
                        }
                    }
                }
                if (r.where_sighted_refs) {
                    for (const t_n of r.where_sighted_refs) {
                        const to_node = this.cy.getElementById(t_n);
                        const edge_data = {
                            target: to_node.id(),
                            source: from_node.id(),
                            id: r.id,
                            label: 'where sighted',
                            raw_data: r,
                        };
                        const relationship = new StixRelationship(edge_data, 'IGNORE');
                        try {
                            if (!this.cy.getElementById(r.id).length) {
                                to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
                            }
                        } catch (error) {
                            console.error(error);
                            throw error;
                        }
                    }
                }
                if (r.sighting_of_ref) {
                    const to_node = this.cy.getElementById(r.sighting_of_ref);
                    const edge_data = {
                        target: to_node.id(),
                        source: from_node.id(),
                        id: r.id,
                        label: 'where sighted',
                        raw_data: r,
                        data_source: 'IGNORE' as DataSourceType,
                    };
                    const relationship = new StixRelationship(edge_data, 'IGNORE');
                    try {
                        if (!this.cy.getElementById(r.id).length) {
                            to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
                        }
                    } catch (error) {
                        console.error(error);
                        throw error;
                    }
                }
            }
            const edges_added = this.cy.add(to_add);
            const all_new = nodes_added.union(edges_added);

            // for (let j in all_new){
            all_new.forEach((ele: { data: { (arg0: string): string; (arg0: string): string; }; }, j: any, _eles: any) => {
                try {
                    if (ele.data) {
                        // console.debug(ele.id(), ele.data('data_source'));
                        if (ele.data('data_source') === 'GUI') {
                            this.db.needs_save(ele.data('id'), this.cy).then((saved) => saved);
                        }
                    } else {
                        console.debug(`Something in all_new does not have data @index ${j} ${ele}`);
                    }
                    return true;
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            });
            return all_new;
        } catch (e) {
            console.error(`Exception in buildNodes:
        ${e}`);
            throw e;
        }
        // console.debug(all_new);S
    }

    /**
     *
     * @description Lays out and renders the graph.
     * @param {keyof LayoutsType} layout_type
     * @memberof GraphUtils
     */
    public myLayout(layout_type: keyof LayoutsType): void {
        const layout = this.cy.layout(layouts[layout_type]);
        layout.run();
        // layout.promiseOn('layoutstop').then((event) => {
        //     if (this.cy.$(':selected').length > 0) {
        //         let nodes = this.cy.$(':selected');
        //         this.cy.animate({
        //             fit: {
        //                 eles: nodes,
        //                 padding: 50
        //             },
        //             step: () => { },
        //             duration: 3000
        //         });
        //     };
        // })
    }
}
