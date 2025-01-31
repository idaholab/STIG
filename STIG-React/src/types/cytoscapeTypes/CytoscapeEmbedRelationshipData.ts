export type CytoscapeEmbedRelationshipData = cytoscape.EdgeDataDefinition & {
  raw_data: string;
  target: string;
  source: string;
  id: string;
};
