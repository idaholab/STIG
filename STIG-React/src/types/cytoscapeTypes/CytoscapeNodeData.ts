import { StixObject } from "../stixTypes/StixObject";

export type CytoscapeNodeData = cytoscape.NodeDataDefinition & {
    name?: string; // the_data.name,
    id: string; // the_data.id,
    label?: string; // the_data.label,
    type: string; // the_type,
    level?: 1;
    created?: string; // the_data.created,
    modified?: string; // the_data.modified,
    description?: string; // the_data.description,
    raw_data?: StixObject; // the_data
    saved?: boolean;
}