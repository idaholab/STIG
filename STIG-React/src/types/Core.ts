import { Asset } from "./Asset";
import { AttackPattern } from "./AttackPattern";
import { Campaign } from "./Campaign";
import { CourseOfAction } from "./CourseOfAction";
import { ExternalReference } from "./ExternalReference";
import { GranularMarking } from "./GranularMarking";
import { Identity } from "./Identity";
import { Indicator } from "./Indicator";
import { IntrusionSet } from "./IntrusionSet";
import { Malware } from "./Malware";
import { ObservedData } from "./ObservedData";
import { Relationship } from "./Relationship";
import { Report } from "./Report";
import { Sighting } from "./Sighting";
import { ThreatActor } from "./ThreatActor";
import { Tool } from "./Tool";
import { Vulnerability } from "./Vulnerability";

export type SDO = Asset | AttackPattern | Campaign | CourseOfAction | Identity | Indicator | IntrusionSet | Malware | ObservedData | Report | ThreatActor | Tool | Vulnerability;
export type SRO = Relationship | Sighting;
export type StixObject = SDO | SRO;
/**
 * Specifies the hexadecimal constant ('magic number') associated with a specific file format that corresponds to the file, if applicable.
 */
export type Hex = string;

/**
 * The type property identifies the type of STIX Object (SDO, Relationship Object, etc).
 * The value of the type field MUST be one of the types defined by a STIX Object (e.g., indicator).
 */
export type StixType = string;
/**
 * The id property universally and uniquely identifies this object.
 */
export type Identifier = string;
export type Timestamp = string;
/**
 * Specifies any extensions of the object, as a dictionary.
 */
export type Dictionary = Record<string, any>;
export type DataSourceType = 'DB' | 'GUI' | 'IGNORE';
export const node_img: Record<string, string> = {};

export type Core = {
    type: StixType;
    id: Identifier;
    id_?: Identifier;
    created_by_ref?: Identifier;
    /**
     * The labels property specifies a set of classifications.
     */
    labels?: string[];
    created: Timestamp;
    modified?: Timestamp;
    /**
     * The revoked property indicates whether the object has been revoked.
     */
    revoked?: boolean;
    /**
     * A list of external references which refers to non-STIX information.
     */
    external_references?: ExternalReference[];
    /**
     * The list of marking-definition objects to be applied to this object.
     */
    object_marking_refs?: Identifier[];
    /**
     * The set of granular markings that apply to this object.
     */
    granular_markings?: GranularMarking[];
}


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
}