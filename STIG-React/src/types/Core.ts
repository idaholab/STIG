import { Artifact } from "./Artifact";
import { Asset } from "./Asset";
import { AttackPattern } from "./AttackPattern";
import { AutonomousSystem } from "./AutonomousSystem";
import { Campaign } from "./Campaign";
import { CourseOfAction } from "./CourseOfAction";
import { Directory } from "./Directory";
import { DomainName } from "./DomainName";
import { EmailAddr } from "./EmailAddr";
import { EmailMessage } from "./EmailMessage";
import { ExternalReference } from "./ExternalReference";
import { File } from "./File";
import { GranularMarking } from "./GranularMarking";
import { Identity } from "./Identity";
import { Indicator } from "./Indicator";
import { IntrusionSet } from "./IntrusionSet";
import { Ipv4Addr } from "./Ipv4Addr";
import { Ipv6Addr } from "./Ipv6Addr";
import { Malware } from "./Malware";
import { ObservedData } from "./ObservedData";
import { Relationship } from "./Relationship";
import { Report } from "./Report";
import { Sighting } from "./Sighting";
import { ThreatActor } from "./ThreatActor";
import { Tool } from "./Tool";
import { Vulnerability } from "./Vulnerability";

// TODO: 
//   Remove: Asset?
//   Add: ExtensionDefinition | Grouping | Infrastructure | LanguageContent | Location | MalwareAnalysis | Marking Definition | Note | Opinion?
export type SDO = Asset | AttackPattern | Campaign | CourseOfAction | Identity | Indicator | IntrusionSet | Malware | ObservedData | Report | ThreatActor | Tool | Vulnerability;
// TODO: Add MacAddress | Mutex | NetworkTraffic | Process | Software | URL | UserAccount | WindowsRegistryKey | X509Certificate?
export type SCO = Artifact | AutonomousSystem | Directory | DomainName | EmailAddr | EmailMessage | File | Ipv4Addr | Ipv6Addr;
export type SRO = Relationship | Sighting;
export type StixObject = SDO | SCO | SRO;
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


const relationshipsKeyRegex = /((r|R)elationship)|((s|S)ighting)/;
export function isSRO(item: Core): item is SRO {
    return relationshipsKeyRegex.exec(item.type) !== null;
}

export function isRelationship(item: Core): item is Relationship {
    return item.type.toLocaleLowerCase() === 'relationship';
}

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

export interface IStixNode extends cytoscape.ElementDefinition {
    data: StixNodeData;
    data_source?: DataSourceType;
    style?: CSSStyleDeclaration;
    saved?: boolean;
    classes?: string;
}

export type ObjectMarkingRelationship = Relationship & {
    type: 'relationship';
    relationship_type: 'applies-to';
    id: Identifier;
    source_ref: Identifier;
    target_ref: Identifier;
    created: Timestamp;
    modified: Timestamp;
    description: string;
}

