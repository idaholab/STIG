import { stencilItems } from "@/components/elements/StencilItems";
import { DataSourceType, Identifier, IStixNode, node_img, ObjectMarkingRelationship, StixNodeData, StixType, Timestamp } from "@/types/Core";
import { v4 as uuidv4 } from 'uuid';


export const createObjectMarkingRelationship = (
    source_ref: Identifier,
    target_ref: Identifier,
    created: Timestamp,
    modified: Timestamp
): ObjectMarkingRelationship => {
    return {
        type: 'relationship',
        relationship_type: 'applies-to',
        id: `applies-to--${uuidv4()}`,
        source_ref,
        target_ref,
        created,
        modified,
        description: ''
    };
};


export const createStixNode = (
    the_data: StixNodeData,
    the_type: StixType,
    d_source: DataSourceType
): IStixNode => {
    const labelorder = ['name', 'value', 'key', 'path', 'product', 'dst_port', 'command_line', 'type', 'id'];
    let nodelabel: string | undefined;

    if (the_type === 'marking-definition') {
        nodelabel = the_data.name;
    } else {
        for (const element of labelorder) {
            if (Object.prototype.hasOwnProperty.call(the_data, element)) {
                if (element === 'dst_port') {
                    const { [element]: nodelabel1, src_port, protocols } = the_data;
                    nodelabel = src_port.toString().concat(' -> ', nodelabel1.toString(), '/', protocols.toString());
                } else {
                    const { [element]: nodelabel1 } = the_data;
                    nodelabel = nodelabel1;
                }
                break;
            }
        }
    }

    if (nodelabel && nodelabel.length > 60) {
        nodelabel = nodelabel.substring(0, 60).concat('...');
    }
    if (the_type === 'observed-data') {
        nodelabel = `${nodelabel} (Last Observed: ${the_data.last_observed})`;
    }

    // const displayLabel = stencilItems.find(stencilItem => {
    //     return stencilItem.id === the_type
    // })?.alt;

    const data: StixNodeData = {
        id: the_data.id,
        label: nodelabel,
        type: the_type,
        level: 1,
        created: the_data.created,
        description: the_data.description,
        saved: d_source === 'DB' || d_source === 'IGNORE',
        raw_data: the_data,
        data_source: d_source,
        name: nodelabel,
        modified: the_data.modified,
    };

    const position: cytoscape.Position = {
        x: 100,
        y: 100,
    };

    const nodeImage = stencilItems.find(stencilItem => {
        return stencilItem.id === the_type
    })?.imageUrl;
    const style: CSSStyleDeclaration = {
        backgroundImage: nodeImage,
    } as unknown as CSSStyleDeclaration;

    const classes = 'stix_node';

    return {
        data,
        position,
        style,
        saved: data.saved,
        classes,
    };
};