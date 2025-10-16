import { StixObject } from "../stixTypes/StixObject";

export type CytoscapeNodeData = cytoscape.NodeDataDefinition & {
    //name?: string; // No Names on cytoscape nodes at this level!!
    id: string;
    //label?: string; // Label exists in cytoscape and confusing here
    type: string;
    created?: string;
    modified?: string;
    //description?: string; // No descriptions on cytoscape nodes!!
    raw_data?: StixObject;
    saved?: boolean;
}