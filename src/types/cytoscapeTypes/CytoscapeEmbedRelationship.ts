import { CytoscapeEmbedRelationshipData } from "./CytoscapeEmbedRelationshipData";

export type CytoscapeEmbedRelationship = cytoscape.EdgeDefinition & {
    data: CytoscapeEmbedRelationshipData;
}