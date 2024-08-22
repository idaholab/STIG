import { DataSourceType, Identifier } from "./Core";
import { Relationship } from "./Relationship";
import { Sighting } from "./Sighting";

export type StixRelationshipData = cytoscape.EdgeDataDefinition & {
    raw_data: Relationship | Sighting;
    saved?: boolean;
    label: string;
    target: Identifier;
    source: Identifier;
    id: Identifier;
    data_source?: DataSourceType;
}

export type IStixRelationship = cytoscape.EdgeDefinition & {
    data: StixRelationshipData;
    saved?: boolean;
}

export function createStixRelationship(
    the_data: StixRelationshipData,
    data_source: DataSourceType
): IStixRelationship {
    const data: StixRelationshipData = {
        ...the_data,
        data_source,
        saved: data_source === 'DB' || data_source === 'IGNORE',
    };

    return {
        data,
        saved: data.saved,
    };
}