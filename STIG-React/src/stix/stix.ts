import { stencilItems } from "@/components/elements/StencilItems";
import { DataSourceType } from "@/types/DataSourceType";
import { CytoscapeNode } from "@/types/cytoscapeTypes/CytoscapeNode";
import { CytoscapeNodeData } from "@/types/cytoscapeTypes/CytoscapeNodeData";
import { v4 as uuidv4 } from 'uuid';
import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";
import { convertISOToStandardDateFormat } from "@/util/convertISO8601ToStandardDate";
import moment from "moment";

export const createObjectMarkingRelationship = (
    source_ref: string,
    target_ref: string,
    created: string,
    modified: string
): StixRelationshipObject => {
    return {
        type: 'relationship',
        spec_version: '2.1',
        relationship_type: 'applies-to',
        id: `applies-to--${uuidv4()}`,
        source_ref,
        target_ref,
        created,
        modified,
        description: ''
    };
};

export const getNodeLabel = (node: CytoscapeNodeData): string | undefined => {
    let nodelabel: string = '';
    const labelorder = ['name', 'value', 'key', 'path', 'product', 'dst_port', 'command_line', 'labels', 'type', 'id'];
    for (const element of labelorder) {
        if (Object.prototype.hasOwnProperty.call(node, element)) {
            if (element === 'dst_port') {
                const { [element]: nodelabel1, src_port, protocols } = node;
                nodelabel = src_port.toString().concat(' -> ', nodelabel1.toString(), '/', protocols.toString());
            }
            else if (element === 'labels') {
                let nodeLabelslabel = (node?.labels && node?.labels?.length > 0) ? node.labels.join(', ') : '';
                nodelabel = `${nodeLabelslabel ? nodeLabelslabel : node[element]}`;
            }else{
                nodelabel = node[element];
            }
            break;
        }
    }

    if (node.type === 'marking-definition' && node?.name) {
        nodelabel = node.name;
    }
    nodelabel = (nodelabel && nodelabel?.length > 60) ? nodelabel.substring(0, 60).concat('...') : nodelabel;
    if (node.type === 'observed-data') {
        nodelabel = `${nodelabel} (${convertISOToStandardDateFormat(node.last_observed)})`; // If this gets dupicated then the label is getting saved with the stix when it shouldn't!
    }

    return nodelabel;
};



export const createCytoscapeNode = (
    node: CytoscapeNodeData,
    dataSourceType: DataSourceType,
    isNewNode: boolean,
    imgUrl?: string,
): CytoscapeNode => {
    let newCytoscapeNode: CytoscapeNodeData = addStixPropertiesToNode(node, isNewNode);
    let nodelabel = getNodeLabel(newCytoscapeNode);
    newCytoscapeNode.label = nodelabel; // All cytoscape nodes need a label. Just not the stix.

    const nodeImage = (imgUrl) ? imgUrl : stencilItems.find(stencilItem => stencilItem.id === node.type)?.imageUrl;
    const style: CSSStyleDeclaration = { backgroundImage: nodeImage } as unknown as CSSStyleDeclaration;
    const classes = 'stix_node';
    return {
        data: newCytoscapeNode,
        style: style,
        data_source: dataSourceType,
        saved: dataSourceType === 'DB' || dataSourceType === 'IGNORE',
        classes: classes
    };
};

const addStixPropertiesToNode = (node: CytoscapeNodeData, isNewNode: boolean): CytoscapeNodeData => {
    let returnedNode: CytoscapeNodeData = { ...node };
    if (isNewNode) {
        if (returnedNode.type === 'indicator') {
            returnedNode.valid_from = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else if (returnedNode.type === 'observed-data') {
            returnedNode.first_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            returnedNode.last_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        } else if (returnedNode.type === 'report') {
            returnedNode.published = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }
    }
    const raw_data = { ...returnedNode };
    delete raw_data.label; // Label does not belong in stix data. User can add their own custom labels list
    returnedNode.raw_data = raw_data;
    return returnedNode;
}