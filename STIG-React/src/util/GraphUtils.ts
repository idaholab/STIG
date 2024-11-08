/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */
import moment from 'moment';
import cytoscape, { CollectionElements, CollectionReturnValue, ElementDefinition, EventHandler } from 'cytoscape';
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
import { graph_copy } from './clipboard';
import { ContextMenu } from '@/types/cytoscapeTypes/ContextMenu';
import { getCssRGBVarColor } from './GetCssVarColor';
import { query } from '@/util/DbFunctions';
import { STIGBundle } from '@/types/STIGBundle';
import { v4 as uuidv4 } from 'uuid';
import { exportGraph } from '@/graph/exportGraph';


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
}

export function setupCtxMenu(
    cy: cytoscape.Core,
    setIsPropertyPanelOpen: (b: boolean) => void,
    selectedSTIXObject: StixObject | undefined,
    setSelectedSTIXObject: (obj: StixObject | undefined) => void,
    setSelectionExists: React.Dispatch<React.SetStateAction<boolean>>,
    view_util?: any
): void {
    const graph_utils = new GraphUtils(cy);

    // NOTE: For some reason the styles can't be changed once instantiated so light/dark mode changes won't impact the initial colors!
    // itemColor
    cy.cxtmenu({
        menuRadius: () => { return 120 },
        selector: '.stix_node',
        fillColor: getCssRGBVarColor('--context-menu-node-background'),
        activeFillColor: getCssRGBVarColor('--context-menu-node-active-background'),
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
                    /*FIX!: TODO: the following steps will produce a bug:
                     * Drag a node onto the screen (Let's call that node 'A')
                     * Drag another node onto the screen (perhaps a different type of stix object for debugging. Let's call that node 'B')
                     * Click 'A' (opening the property panel for 'A')
                     * Click 'B' (opening the property panel for 'B')
                     * Shift select 'A', still keeping the selection on and property panel open for 'B'
                     * "Graph Remove" 'A'
                     * 
                     * Notice that the property panel is mistakenly closed for 'B'. See the console.debug below
                     */
                    if (selectedSTIXObject?.id === element.data("id")) {
                        setSelectedSTIXObject(undefined);
                        setSelectionExists(false);
                        setIsPropertyPanelOpen(false);
                    }
                    cy.remove(element);
                    console.debug("the selected stix object during 'Graph Remove' is ", selectedSTIXObject?.id);
                }
            },
            {
                content: 'DB Delete',
                select(ele: cytoscape.CollectionElements) {
                    const element = ele as unknown as CollectionArgument;
                    try {
                        // const eleList = element.toArray();
                        // eleList.forEach((value) => {
                        //     cy.remove(value);
                        //     void db_delete(value.data('raw_data'));
                        // });
                        if (selectedSTIXObject?.id === element.data("id")) {
                            setSelectedSTIXObject(undefined);
                            setSelectionExists(false);
                            setIsPropertyPanelOpen(false);
                        }
                        cy.remove(element);
                        db_delete(element.data('raw_data'));
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
                        runGraphLayout(getLayoutSettingsFromStore(), cy);
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
                        runGraphLayout(getLayoutSettingsFromStore(), cy);
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
        fillColor: getCssRGBVarColor('--context-menu-edge-background'),
        activeFillColor: getCssRGBVarColor('--context-menu-edge-active-background'),
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
                        setSelectionExists(false);
                        setIsPropertyPanelOpen(false);
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
                            const selectedSTIXObjectId = selectedSTIXObject?.id.replace("relationship--", "");
                            if (selectedSTIXObjectId === element.data("id") || selectedSTIXObject?.id === element.data("id")) {
                                setSelectedSTIXObject(undefined);
                                setSelectionExists(false);
                                setIsPropertyPanelOpen(false);
                            }
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
        fillColor: getCssRGBVarColor('--context-menu-core-background'),
        activeFillColor: getCssRGBVarColor('--context-menu-core-active-background'),
        outsideMenuCancel: 10,
        commands: [
            {
                content: 'Layout',
                select: () => {
                    runGraphLayout(getLayoutSettingsFromStore(), cy);
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
                        setSelectionExists(false);
                        setIsPropertyPanelOpen(false);
                    }
                }
            }
        ]
    } as ContextMenu);
}

export function create_bundle(nodes: CollectionReturnValue): STIGBundle {
    const bundle_id = 'bundle--' + uuidv4();
    let bundle: STIGBundle = { type: 'bundle', id: bundle_id, objects: [] } as any;
    // ATTN: the following logic may actually do nothing at all. If that is the case, this 
    // problem can be solved by doing the filter like on the visual edges
    // logic to remove null on json export
    nodes.each((ele) => {
        if (ele.length === 0) {
            return;
        }
        if (ele.data('raw_data') !== undefined) {
            bundle.objects.push(ele.data('raw_data'));
        }
    });

    // filter out embedded relationship visual edges
    bundle.objects = bundle.objects.filter((bundleObj: any) => {
        return bundleObj !== "visual_edge";
    })
    return bundle;
}

export function exportObject(fileName: string, cy: cytoscape.Core, obj: StixObject | StixRelationshipObject | undefined) {
    const bundle_id = 'bundle--' + uuidv4();
    let bundle: STIGBundle = { type: 'bundle', id: bundle_id, objects: [] } as any;
    if (obj !== undefined) {
        bundle.objects.push(obj);
        exportGraph(fileName, bundle);
    }
    return bundle;
}
export function exportSelected(fileName: string, cy: cytoscape.Core) {
    const selected = cy.elements(':selected')
    let bundle = create_bundle(selected);
    exportGraph(fileName, bundle);
    return bundle
}
export function exportAll(fileName: string, cy: cytoscape.Core) {
    let allNodes = cy.$(':visible');
    let bundle = create_bundle(allNodes)
    exportGraph(fileName, bundle);
    return bundle
}
export function exportAllwPositions(fileName: string, cy: cytoscape.Core) {
    let allNodes = cy.$(':visible');
    let bundle = create_bundle(allNodes)
    bundle.metadata = allNodes.map((obj: any) => ({
        id: obj.id(),
        position: obj.position(),
    }));
    exportGraph(fileName, bundle);
    return bundle
}

export async function queryToGraph(q: string, cyInstance: cytoscape.Core | undefined) {
    if (!(cyInstance)) { return [-1, -1]; }
    const graph_utils = new GraphUtils(cyInstance);
    try {
        let queryReturn = await query(q);
        const [numVerticiesAdded, numEdgesAdded] = graph_utils.buildNodes(queryReturn, "GUI");
        runGraphLayout(getLayoutSettingsFromStore(), cyInstance);
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
    return [numVerticiesAdded, numEdgesAdded];
}


export const defaultLayout: string = 'grid';
export const saveLayoutToLocalStorage = (layout: string) => {
    localStorage.setItem('stigSettings', layout);
}
export const getLayoutSettingsFromStore = (): string => {
    const layout = localStorage.getItem('stigSettings');
    return layout === null ? defaultLayout : layout;
}
export const runGraphLayout = (layoutType: keyof LayoutsType, cyInstance: cytoscape.Core) => {
    const orphans = cyInstance?.elements(':orphan').filter(':childless');
    const layout = orphans?.layout(layouts[layoutType]);
    if (layoutType === 'attack_timeline') {
        layoutByTimeframe(cyInstance);
        // Run the preset layout
        cyInstance.layout({ name: 'preset' }).run();
        saveLayoutToLocalStorage(layoutType);
    }
    else if (layoutType === 'default') {
        cyInstance.layout({ name: 'preset' }).run();
        saveLayoutToLocalStorage(layoutType);
    }
    else {
        layout?.run();
    }
    saveLayoutToLocalStorage(layoutType);
}





export function layoutByTimeframe(cy: cytoscape.Core) {
    const startX = 0;
    const gap = 200; // Spacing between nodes
    const bufferSpace = 200; // Space between timeline and non-timeline nodes
    const gridCols = 5; // Number of columns in the grid
    const gridGapX = 200; // Horizontal gap between nodes in the grid
    const gridGapY = 200; // Vertical gap between nodes in the grid
    const animations: Promise<EventHandler>[] = [];
    const positionedAttackPatternNodes = new Set<string>(); // Track positioned node IDs
    const observedDataNodes = getObservedDataNodes(cy);
    const relationshipEdges = getRelationshipEdges(cy);
    const maxYTimeline = positionObservedDataNodes(observedDataNodes, relationshipEdges, cy, animations, positionedAttackPatternNodes, startX, gap);
    const nonTimelineNodes = getNonTimelineNodes(cy, positionedAttackPatternNodes);
    positionNonTimelineNodes(nonTimelineNodes, animations, startX, maxYTimeline, bufferSpace, gridCols, gridGapX, gridGapY);
}

function getObservedDataNodes(cy: cytoscape.Core) {
    return cy.nodes().filter(node => node.data('raw_data')?.last_observed && node.data('type') === 'observed-data');
}

function getRelationshipEdges(cy: cytoscape.Core) {
    return cy.edges().filter(edge => edge.data('raw_data')?.type === 'relationship');
}

function positionObservedDataNodes(
    observedDataNodes: cytoscape.Collection,
    relationshipEdges: cytoscape.Collection,
    cy: cytoscape.Core,
    animations: Promise<EventHandler>[],
    positionedAttackPatternNodes: Set<string>,
    startX: number,
    gap: number,
): number {
    let maxYTimeline = 0;
    observedDataNodes.sort((a, b) => new Date(a.data('raw_data')?.last_observed).getTime() - new Date(b.data('raw_data')?.last_observed).getTime())
        .forEach((observedNode, index) => {
            const newX = startX + index * gap;
            animateNodePosition(observedNode, newX, 0, animations);
            maxYTimeline = Math.max(maxYTimeline, 0);
            const connectedAttackPatternNodes = getConnectedAttackPatternNodes(observedNode, relationshipEdges, cy);
            connectedAttackPatternNodes.forEach((attackPatternNode, attackIndex) => {
                if (!positionedAttackPatternNodes.has(attackPatternNode.id())) {
                    const newY = 200 + attackIndex * gap;
                    animateNodePosition(attackPatternNode, newX, newY, animations);
                    maxYTimeline = Math.max(maxYTimeline, newY);
                    positionedAttackPatternNodes.add(attackPatternNode.id());
                }
            });
        });
    return maxYTimeline;
}

function getConnectedAttackPatternNodes(observedNode: cytoscape.NodeSingular, relationshipEdges: cytoscape.Collection, cy: cytoscape.Core) {
    // Filter the edges to find connected attack-pattern nodes
    const connectedNodes = relationshipEdges.filter(edge => {
        const sourceIsObserved = edge.data('raw_data')?.source_ref === observedNode.data('id') &&
            cy.getElementById(edge.data('raw_data').target_ref).data('type') === 'attack-pattern';
        const targetIsObserved = edge.data('raw_data').target_ref === observedNode.data('id') &&
            cy.getElementById(edge.data('raw_data').source_ref).data('type') === 'attack-pattern';
        return sourceIsObserved || targetIsObserved;
    }).map(edge => {
        return cy.getElementById(edge.data('raw_data').source_ref === observedNode.data('id')
            ? edge.data('raw_data').target_ref
            : edge.data('raw_data').source_ref);
    });

    // Get attack-pattern nodes from object_refs
    const objectRefs = observedNode.data('raw_data').object_refs || [];
    objectRefs.forEach((refId: string) => {
        const refNode = cy.getElementById(refId);
        if (refNode.data('type') === 'attack-pattern') {
            connectedNodes.push(refNode);
        }
    });

    return [...new Set(connectedNodes)]; // Deduplicate attack-pattern nodes
}

function getNonTimelineNodes(cy: cytoscape.Core, positionedAttackPatternNodes: Set<string>) {
    return cy.nodes().filter(node => {
        const isObservedData = node.data('type') === 'observed-data';
        const isConnectedAttackPattern = positionedAttackPatternNodes.has(node.id());
        return !isObservedData && !isConnectedAttackPattern;
    });
}

function positionNonTimelineNodes(
    nonTimelineNodes: cytoscape.Collection,
    animations: Promise<EventHandler>[],
    startX: number,
    maxYTimeline: number,
    bufferSpace: number,
    gridCols: number,
    gridGapX: number,
    gridGapY: number
) {
    let row = 0;
    let col = 0;

    nonTimelineNodes.forEach((nonTimelineNode) => {
        const newX = startX + col * gridGapX;
        const newY = maxYTimeline + bufferSpace + row * gridGapY;
        animateNodePosition(nonTimelineNode, newX, newY, animations);
        col++;
        if (col >= gridCols) {
            col = 0;
            row++;
        }
    });
}

function animateNodePosition(node: cytoscape.NodeSingular, x: number, y: number, animations: Promise<EventHandler>[]) {
    animations.push(node.animate({
        position: { x, y }
    }, {
        duration: 1000,
        easing: 'ease-in-out'
    }).promiseOn('position'));

    node.position({ x, y });
}