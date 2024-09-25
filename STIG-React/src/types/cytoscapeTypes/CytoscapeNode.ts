import { DataSourceType } from "../DataSourceType";
import { CytoscapeNodeData } from "./CytoscapeNodeData";

export type CytoscapeNode = cytoscape.ElementDefinition & {
    data: CytoscapeNodeData;
    data_source?: DataSourceType;
    style?: CSSStyleDeclaration;
    saved?: boolean;
    position: cytoscape.Position;
    classes: string;
}