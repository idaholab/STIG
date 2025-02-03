import { DataSourceType } from '../DataSourceType';
import { StixRelationshipObject } from '../stixTypes/StixRelationshipObject';

export type CytoscapeRelationshipData = cytoscape.EdgeDataDefinition & {
  raw_data: StixRelationshipObject;
  saved?: boolean;
  label: string;
  target: string;
  source: string;
  id: string;
  data_source?: DataSourceType;
};
