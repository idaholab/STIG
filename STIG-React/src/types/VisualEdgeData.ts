import { Identifier } from "./Core";

export type VisualEdgeData = cytoscape.EdgeDataDefinition & {
    raw_data: string;
    target: Identifier;
    source: Identifier;
    id: Identifier;
}

export type VisualEdge = cytoscape.EdgeDefinition & {
    data: VisualEdgeData;
}