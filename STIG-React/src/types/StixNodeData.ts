import { Core, DataSourceType, Identifier, StixType, Timestamp } from "./Core";

export type StixNodeData = cytoscape.NodeDataDefinition & {
    name?: string; // the_data.name,
    id: Identifier; // the_data.id,
    label?: string; // the_data.label,
    type: StixType; // the_type,
    level?: 1;
    // version: the_data.version,
    created: Timestamp; // the_data.created,
    modified?: Timestamp; // the_data.modified,
    description?: string; // the_data.description,
    // typeGroup: the_data.typeGroup
    raw_data?: Core; // the_data
    saved?: boolean;
    data_source?: DataSourceType;
}

export type StixNode = cytoscape.ElementDefinition & {
    data: StixNodeData;
    data_source?: DataSourceType;
    style?: CSSStyleDeclaration;
    saved?: boolean;
    position: cytoscape.Position;
    classes: string;
}