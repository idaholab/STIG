import { CytoscapeRelationshipData } from "./CytoscapeRelationshipData";

export type CytoscapeRelationship = cytoscape.EdgeDefinition & {
    data: CytoscapeRelationshipData;
    saved?: boolean;
}