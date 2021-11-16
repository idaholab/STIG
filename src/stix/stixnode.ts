/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import * as cytoscape from 'cytoscape';
import { Core, Identifier, StixType, Timestamp, Relationship, Sighting } from './stix2';

export type DataSourceType = 'DB' | 'GUI' | 'IGNORE';
export let node_img: { [index: string]: string } = {};
export interface StixNodeData extends cytoscape.NodeDataDefinition {
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

export interface IStixNode extends cytoscape.ElementDefinition {

    data: StixNodeData;
    // style: StixNodeStyle
    data_source?: DataSourceType;
    style?: CSSStyleDeclaration;
    saved?: boolean;
    classes?: string;
}

export class StixNode implements IStixNode {
    public data: StixNodeData;
    public position: cytoscape.Position;
    public style: CSSStyleDeclaration;
    public saved: boolean;
    public classes: string;

    /**
     * Represents a stix node in the graph.  One of these is attached to each node on the canvas.
     * The actual data is stored here for easy access.  stixNode.raw_data should hold the actual
     * stix JSON
     * @param {StixNodeData} the_data Object Thrown to Cytoscape Node
     * @param {StixType} the_type - Object From Database
     * @param {DataSourceType} d_source - Whether we are drag and drop or queried from DB.
     */
    constructor(the_data: StixNodeData, the_type: StixType, d_source: DataSourceType) {

        console.log("<stixnode> type: ", the_data.name, the_type)

        this.data = {
            id: the_data.id,
            label: the_type === 'marking-definition' ? the_type : the_data.name,
            type: the_type,
            level: 1,
            created: the_data.created,
            description: the_data.description,
            saved: false,
            raw_data: the_data,
            data_source: d_source,
        };
        if (the_type !== 'marking-definition') {
            if(the_data.name == undefined){
                this.data.name = the_data.type;
            }else{
                this.data.name = the_data.name;
            }
            this.data.modified = the_data.modified;
        }

        this.position = {
            x: 100,
            y: 100,
        };
        const style: CSSStyleDeclaration = { backgroundImage: node_img[the_type], backgroundFit: 'contain' } as unknown as CSSStyleDeclaration;
        this.style = style;
        if (this.data.data_source === 'DB' || this.data.data_source === 'IGNORE') {
            this.saved = true;
        } else {
            this.saved = false;
        }
        this.data.saved = this.saved;
        this.classes = 'stix_node';
    }
}

export interface StixRelationshipData extends cytoscape.EdgeDataDefinition {
    raw_data: Relationship | Sighting;
    saved?: boolean;
    label: string;
    target: Identifier;
    source: Identifier;
    id: Identifier;
    data_source?: DataSourceType;
}

export interface IStixRelationship extends cytoscape.EdgeDefinition {
    data: StixRelationshipData;
    saved?: boolean;
}

export class StixRelationship implements IStixRelationship {
    public data: StixRelationshipData;
    public saved: boolean;

    constructor(the_data: StixRelationshipData, data_source: DataSourceType) {
        this.data = the_data;
        this.data.data_source = data_source;
        if (this.data.data_source === 'DB' || this.data.data_source === 'IGNORE') {
            this.saved = true;
        } else {
            this.saved = false;
        }
        this.data.saved = this.saved;
    }
}
