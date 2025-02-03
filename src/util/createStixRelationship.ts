import { DataSourceType } from "../types/DataSourceType";
import { CytoscapeRelationship } from "../types/cytoscapeTypes/CytoscapeRelationship";
import { CytoscapeRelationshipData } from "../types/cytoscapeTypes/CytoscapeRelationshipData";

export function createStixRelationship(
    the_data: CytoscapeRelationshipData,
    data_source: DataSourceType
): CytoscapeRelationship {
    const data: CytoscapeRelationshipData = {
        ...the_data,
        data_source,
        saved: data_source === 'DB' || data_source === 'IGNORE',
    };

    return {
        data,
        saved: data.saved,
    };
}