/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */
import moment from 'moment';
import cytoscape, { CollectionElements, CollectionReturnValue, ElementDefinition } from 'cytoscape';
import { DataSourceType } from '@/types/DataSourceType';
import { StixObject } from '@/types/stixTypes/StixObject';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { CytoscapeRelationshipData } from '@/types/cytoscapeTypes/CytoscapeRelationshipData';
import { createStixRelationship } from './createStixRelationship';
import { CreatedByRelationshipFactory } from './CreatedByRelationshipFactory';
import { layouts, LayoutsType } from '@/graph/graphOptions';
import { createObjectMarkingRelationship, createCytoscapeNode } from '../stix/stix';
import { CollectionArgument } from 'cytoscape';
import { db_delete, query_incoming, query_outgoing } from './DbFunctions';
import { StigSettings } from '@/storage/stig-settings-storage';
import { graph_copy } from './clipboard';
import { ContextMenu } from '@/types/cytoscapeTypes/ContextMenu';
import { getCssVarColor } from './GetCssVarColor';
import { query } from '@/util/DbFunctions';
import { STIGBundle } from '@/types/STIGBundle';


export class GraphUtils {
    public cy: cytoscape.Core;
    public skipLayout: boolean = false;

    constructor(cy: cytoscape.Core) {
        this.cy = cy;
    }

    private _addVertices(sdos: StixObject[], data_source: DataSourceType): [CollectionReturnValue, StixRelationshipObject[], StixRelationshipObject[]] {
        const in_graph = new Set<string>();
        const to_add: ElementDefinition[] = [];
        const relationships: StixRelationshipObject[] = [];
        const sightings: StixRelationshipObject[] = [];
        try {
            sdos = sdos.sort((a, b) => {
                const momentA = (a && a.modified) ? moment(a.modified)?.unix() : 0;
                const momentB = (b && b.modified) ? moment(b.modified)?.unix() : 0;
                return momentB - momentA;
            });

            for (const sdo of sdos) {
                if (!sdo.id || !sdo.type) {
                    continue;
                }
                if (this.cy.getElementById(sdo.id).length > 0) { continue; }

                if (sdo.type.toLowerCase() !== 'relationship' && sdo.type.toLowerCase() !== 'sighting') {
                    const st_node = createCytoscapeNode(sdo, data_source, false);
                    if (!in_graph.has(st_node.data.id)) {
                        to_add.push(JSON.parse(JSON.stringify(st_node)) as ElementDefinition);
                        in_graph.add(st_node.data.id);
                    }
                    if (sdo.created_by_ref) {
                        if (!in_graph.has(sdo.id)) {
                            const cb_sro = CreatedByRelationshipFactory(sdo.id, sdo.created_by_ref, sdo.created, sdo.modified!);
                            relationships.push(cb_sro as StixRelationshipObject);
                            in_graph.add(sdo.id);
                        }
                    } else if ('object_marking_refs' in sdo && sdo.object_marking_refs) {
                        sdo.object_marking_refs.forEach((markingID: any) => {
                            if (!in_graph.has(sdo.id)) {
                                relationships.push(createObjectMarkingRelationship(markingID, sdo.id, sdo.created, sdo.modified!));
                                in_graph.add(sdo.id);
                            }
                        });
                    }
                } else if (sdo.type.toLowerCase() === 'relationship') {
                    if (!in_graph.has(sdo.id)) {
                        relationships.push(sdo as StixRelationshipObject);
                        in_graph.add(sdo.id);
                    }
                } else if (sdo.type.toLowerCase() === 'sighting') {
                    if (!in_graph.has(sdo.id)) {
                        sightings.push(sdo as StixRelationshipObject);
                        in_graph.add(sdo.id);
                    }
                }
            }
            const nodes_added = this.cy.add(to_add);

            return [nodes_added, relationships, sightings];
        } catch (e) {
            console.error('Exception adding nodes to graph:', e);
            throw e;
        }
    }

    public buildNodes(objects: StixObject[], data_source: DataSourceType): [number, number] {
        const [nodes_added, relationships, sightings] = this._addVertices(objects, data_source);
        const to_add: ElementDefinition[] = [];

        for (const r of relationships) {
            const to_node = this.cy.getElementById(r.target_ref!);
            const from_node = this.cy.getElementById(r.source_ref!);
            if (from_node.length === 0 || to_node.length === 0) {
                continue;
            }

            const edge_data: CytoscapeRelationshipData = {
                target: to_node.id(),
                source: from_node.id(),
                id: r.id,
                label: r.relationship_type!,
                raw_data: r
            };
            const relationship = createStixRelationship(edge_data, data_source);
            if (!this.cy.getElementById(r.id).length) {
                to_add.push(JSON.parse(JSON.stringify(relationship)) as ElementDefinition);
            }
        }

        for (const r of sightings) {
            const from_node = this.cy.getElementById(r.sighting_of_ref!);
            if (r.observed_data_refs) {
                for (const t_n of r.observed_data_refs) {
                    const to_node = this.cy.getElementById(t_n);
                    const edge_data: CytoscapeRelationshipData = {
                        target: to_node.id(),
                        source: from_node.id(),
                        id: r.id,
                        label: 'observed data sighting',
                        raw_data: r,
                        data_source: 'IGNORE' as DataSourceType
                    };
                    const relationship = createStixRelationship(edge_data, 'IGNORE');
                    if (!this.cy.getElementById(r.id).length) {
                        to_add.push(JSON.parse(JSON.stringify(relationship)) as ElementDefinition);
                    }
                }
            }
            if (r.object_marking_refs) {
                for (const t_n of r.object_marking_refs) {
                    const to_node = this.cy.getElementById(t_n);
                    const edge_data: CytoscapeRelationshipData = {
                        target: to_node.id(),
                        source: from_node.id(),
                        id: r.id,
                        label: 'object marking',
                        raw_data: r,
                        data_source: 'IGNORE' as DataSourceType
                    };
                    const relationship = createStixRelationship(edge_data, 'IGNORE');
                    if (!this.cy.getElementById(r.id).length) {
                        to_add.push(JSON.parse(JSON.stringify(relationship)) as ElementDefinition);
                    }
                }
            }
            if (r.where_sighted_refs) {
                for (const t_n of r.where_sighted_refs) {
                    const to_node = this.cy.getElementById(t_n);
                    const edge_data: CytoscapeRelationshipData = {
                        target: to_node.id(),
                        source: from_node.id(),
                        id: r.id,
                        label: 'where sighted',
                        raw_data: r
                    };
                    const relationship = createStixRelationship(edge_data, 'IGNORE');
                    if (!this.cy.getElementById(r.id).length) {
                        to_add.push(JSON.parse(JSON.stringify(relationship)) as ElementDefinition);
                    }
                }
            }
            if (r.sighting_of_ref) {
                const to_node = this.cy.getElementById(r.sighting_of_ref);
                const edge_data: CytoscapeRelationshipData = {
                    target: to_node.id(),
                    source: from_node.id(),
                    id: r.id,
                    label: 'where sighted',
                    raw_data: r,
                    data_source: 'IGNORE' as DataSourceType
                };
                const relationship = createStixRelationship(edge_data, 'IGNORE');
                if (!this.cy.getElementById(r.id).length) {
                    to_add.push(JSON.parse(JSON.stringify(relationship)) as ElementDefinition);
                }
            }
        }

        const edges_added = this.cy.add(to_add);
        return [nodes_added.length, edges_added.length];
    }

    /**
     *
     * @description Lays out and renders the graph.
     * @param {keyof LayoutsType} layout_type
     * @memberof GraphUtils
     */
    public myLayout(layout_type: keyof LayoutsType): void {
        if (this.skipLayout) {
            this.skipLayout = !this.skipLayout;
            return;
        }
        const orphans = this.cy.elements(':orphan').filter(':childless');
        const layout = orphans.layout(layouts[layout_type]);
        layout.run();
    }
}

export function setupCtxMenu(
    cy: cytoscape.Core,
    isDrawerOpen: boolean,
    toggleDrawer: () => void,
    selectedSTIXObject: StixObject | undefined,
    setSelectedSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>,
    view_util?: any
): void {
    const graph_utils = new GraphUtils(cy);
    //const menuBackground = theme === 'dark' ? getCssVarColor('--context-menu-background-dark') : getCssVarColor('--context-menu-background-light');

    // itemColor
    cy.cxtmenu({
        menuRadius: () => { return 120 },
        selector: 'node',
        fillColor: getCssVarColor('--context-menu-node-background'),
        activeFillColor: getCssVarColor('--context-menu-node-active-background'),
        spotlightPadding: 20,
        itemTextShadowColor: 'transparent',
        outsideMenuCancel: 10,
        commands: [
            {
                content: 'Graph Remove',
                select: (ele: cytoscape.CollectionElements) => {
                    const element = ele as unknown as CollectionArgument;
                    // Check if the deleted element is currently selected
                    // and if so, close the property panel and clear
                    // the currently selected object
                    if (selectedSTIXObject?.id === element.data("id")) {
                        setSelectedSTIXObject(undefined);
                        if (isDrawerOpen) {
                            toggleDrawer();
                        }
                    }
                    cy.remove(element);
                }
            },
            {
                content: 'DB Delete',
                select(ele: cytoscape.CollectionElements) {
                    const element = ele as unknown as CollectionArgument;

                    try {
                        const eleList = element.toArray();
                        eleList.forEach((value) => {
                            cy.remove(value);
                            void db_delete(value.data('raw_data'));
                        });
                    } catch (e) {
                        // Handle error: probably want to indicate that it wasn't deleted from DB
                    }
                }
            },
            {
                content: 'Query Incoming',
                async select(ele: cytoscape.CollectionElements) {
                    const elements = ele as unknown as CollectionArgument;
                    for (const value of elements.toArray()) {
                        let data = value.data('raw_data');
                        if (typeof data === 'string') {
                            data = JSON.parse(data);
                        }
                        let incoming = await query_incoming(data)
                        const coreObjects: StixObject[] = incoming.map(obj => obj as StixObject);
                        graph_utils.buildNodes(coreObjects, 'DB');
                        graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
                    }
                }
            },
            {
                content: 'Select Incoming',
                select(ele: cytoscape.CollectionElements) {
                    const elements = ele as unknown as CollectionArgument;
                    elements.toArray().forEach((value) => {
                        if (value.isNode()) {
                            value.incomers().select();
                        }
                    });
                }
            },
            {
                content: 'Select Out',
                select(ele: cytoscape.CollectionElements) {
                    const elements = ele as unknown as CollectionArgument;
                    elements.toArray().forEach((value) => {
                        if (value.isNode()) {
                            value.outgoers().select();
                        }
                    });
                }
            },
            {
                content: 'Query Out',
                async select(ele: cytoscape.CollectionElements) {
                    const elements = ele as unknown as CollectionArgument;
                    for (const value of elements.toArray()) {
                        let data = value.data('raw_data');
                        if (typeof data === 'string') {
                            data = JSON.parse(data);
                        }
                        let outgoing = await query_outgoing(data)
                        const coreObjects: StixObject[] = outgoing.map(obj => obj as StixObject);
                        graph_utils.buildNodes(coreObjects, 'DB');
                        graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
                    }
                }
            },
            {
                content: 'Select Neighbors',
                select(ele: cytoscape.CollectionElements) {
                    const elements = ele as unknown as CollectionArgument;
                    elements.toArray().forEach((value) => {
                        if (value.isNode()) {
                            value.select();
                            value.closedNeighborhood().select();
                        }
                    });
                }
            }
        ]
    } as ContextMenu);

    cy.cxtmenu({
        selector: 'edge',
        menuRadius: () => { return 120 },
        fillColor: getCssVarColor('--context-menu-edge-background'),
        activeFillColor: getCssVarColor('--context-menu-edge-active-background'),
        outsideMenuCancel: 10,
        commands: [
            {
                content: 'Remove from Graph',
                select: (ele: cytoscape.CollectionElements) => {
                    const element = ele as unknown as CollectionArgument;
                    // Check if the deleted element is currently selected
                    // and if so, close the property panel and clear
                    // the currently selected object
                    const selectedSTIXObjectId = selectedSTIXObject?.id.replace("relationship--", "");
                    // If a relationship is created via the application (as opposed to imported), its cytoscape id will be
                    // its raw_data id with "relationship--" on the front
                    if (selectedSTIXObjectId === element.data("id") || selectedSTIXObject?.id === element.data("id")) {
                        setSelectedSTIXObject(undefined);
                        if (isDrawerOpen) {
                            toggleDrawer();
                        }
                    }
                    cy.remove(element);
                }
            },
            {
                content: 'DB Delete',
                select(ele: CollectionElements) {
                    const element = ele as unknown as CollectionArgument;

                    try {
                        const eleList = element.toArray();
                        eleList.forEach((value) => {
                            cy.remove(value);
                            void db_delete(value.data('raw_data'));
                        });
                    } catch (e) {
                        console.warn("Relationship was not removed from DB", e);
                    }
                }
            },
            {
                content: 'Select Source',
                select(ele: CollectionElements) {
                    const elements = ele as unknown as CollectionArgument;
                    elements.toArray().forEach((value) => {
                        if (value.isEdge()) {
                            value.source().select();
                        }
                    });
                }
            },
            {
                content: 'Select Target',
                select(ele: CollectionElements) {
                    const elements = ele as unknown as CollectionArgument;
                    elements.toArray().forEach((value) => {
                        if (value.isEdge()) {
                            value.target().select();
                        }
                    });
                }
            }
        ]
    } as ContextMenu);

    cy.cxtmenu({
        menuRadius: () => { return 130 },
        selector: 'core',
        fillColor: getCssVarColor('--context-menu-core-background'),
        activeFillColor: getCssVarColor('--context-menu-core-active-background'),
        outsideMenuCancel: 10,
        commands: [
            {
                content: 'Layout',
                select: () => {
                    graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
                }
            },
            {
                content: 'Hide Selected',
                select: () => {
                    view_util.hide(cy.elements(':selected'));
                }
            },
            {
                content: 'Hide Not Selected',
                select: () => {
                    view_util.hide(cy.elements('.stix_node:unselected'));
                }
            },
            {
                content: 'Show All',
                select: () => {
                    view_util.show(cy.elements('.stix_node'));
                }
            },
            {
                content: 'Copy Selected',
                select: () => {
                    graph_copy(cy);
                }
            },
            {
                content: 'Remove Selected',
                select: () => {
                    cy.remove(':selected');
                    // Check if selectedSTIXObject is in the group
                    // of remaining elements.
                    // If not, close the property panel and clear
                    // the currently selected object
                    let selectedSTIXObjectId = selectedSTIXObject?.id;
                    if (selectedSTIXObject?.type === "relationship") {
                        selectedSTIXObjectId = selectedSTIXObjectId?.replace("relationship--", "");
                    }
                    const remainingElementIds = cy.elements().map(element => element.data("id"));
                    // If a relationship is created via the application (as opposed to imported), its cytoscape id will be
                    // its raw_data id with "relationship--" on the front
                    if ((selectedSTIXObjectId && !remainingElementIds.includes(selectedSTIXObjectId)) &&
                        (selectedSTIXObject?.id && !remainingElementIds.includes(selectedSTIXObject?.id))
                    ) {
                        setSelectedSTIXObject(undefined);
                        if (isDrawerOpen) {
                            toggleDrawer();
                        }
                    }
                }
            }
        ]
    } as ContextMenu);
}

export async function queryToGraph(q: string, cyInstance: cytoscape.Core | undefined) {
    let queryReturn = await query(q);
    if (!(cyInstance)) { return; }
    export async function queryToGraph(q: string, cyInstance: cytoscape.Core | undefined) {
        if (!(cyInstance)) { return [-1, -1]; }
        const graph_utils = new GraphUtils(cyInstance);

        try {
            let queryReturn = await query(q);
            const [numVerticiesAdded, numEdgesAdded] = graph_utils.buildNodes(queryReturn, "GUI");
            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());

            return [numVerticiesAdded, numEdgesAdded];
        } catch (err) {
            console.warn("[Nodes could not be built] :", err);
            //TODO: make some sort of meaningful message appear to the user informing them why the nodes couldn't be added
            return [-1, -1];
        }
    }

    export function addToGraph(pkg: STIGBundle, cyInstance: cytoscape.Core) {
        const graph_utils = new GraphUtils(cyInstance);
        let numVerticiesAdded, numEdgesAdded = 0;
        try {
            [numVerticiesAdded, numEdgesAdded] = graph_utils.buildNodes(pkg.objects, "GUI");
        } catch (err) {
            console.warn("[Nodes could not be built. JSON may be invalid] :", err);
            //TODO: make some sort of meaningful message appear to the user informing them why the nodes couldn't be added
            return [-1, -1];
        }

        if (pkg.metadata) {
            // Position the nodes
            for (const node of pkg.metadata) {
                // Find the element on the graph
                cyInstance.$id(node.id).animate({
                    position: node.position,
                    duration: 1000,
                    complete: () => cyInstance.fit()
                });
            }
        } else {
            let canLayout = true;

            // TODO: Add this logic back in for when
            // defense in depth gets added as a feature?
            // Check if defense in depth is on
            // if (cyInstance.nodes(`#${defense.name.replaceAll(' ', '_')}`).length > 0) {
            //     canLayout = false;
            //     $('#dd-ctxLayoutDefInDepth').trigger('click');
            // }

            // TODO: Add this logic back in for when
            // kill chain gets added as a feature?
            // // Check if a kill chain is on
            // killChain['kill-chain'].forEach(kc => {
            //     // `#ctxLayout${kc.type}`
            //     if (cy.nodes(`#${kc.type}`).length > 0) {
            //         canLayout = false;
            //         $(`#ctxLayout${kc.type}`).trigger('click');
            //     }
            // });

            // Only do this if there aren't any defense in depth or kill chain layouts open
            if (canLayout) {
                graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
            }
        }

        return [numVerticiesAdded, numEdgesAdded];
    }