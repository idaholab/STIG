/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import * as uuid from 'uuid';

export interface BundleType {
  type: 'bundle' | 'Bundle';
  objects: Core[];
  metadata?: Array<{ id: string; position: { x: number; y: number } }>;
}

export type SDO = Asset | AttackPattern | Campaign | CourseOfAction | Identity | Indicator | IntrusionSet | Malware | ObservedData | Report | ThreatActor | Tool | Vulnerability;

export type SRO = Relationship | Sighting;

export type StixObject = SDO | SRO;

const relationshipsKeyRegex = /((r|R)elationship)|((s|S)ighting)/;
export function isSRO (item: Core): item is SRO {
  return relationshipsKeyRegex.exec(item.type) !== null;
}

export function isRelationship (item: Core): item is Relationship {
  return item.type.toLocaleLowerCase() === 'relationship';
}

/**
 * Common properties and behavior across all STIX Domain Objects and STIX Relationship Objects.
 */
export interface Core {
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

export class StixCore implements Core {
  public type: StixType;
  public id: Identifier;
  public created_by_ref?: Identifier;
  public labels?: string[];
  public created: Timestamp;
  public modified?: Timestamp;
  public revoked?: boolean;
  public external_references?: ExternalReference[];
  public object_marking_refs?: Identifier[];
  public granular_markings?: GranularMarking[];
}

export type ExternalReference = ({
  /**
   * The source within which the external-reference is defined (system, registry, organization, etc.)
   */
  source_name: string;
  /**
   * An identifier for the external reference content.
   */
  external_id: string;
  [k: string]: any;
} | Record<string, any>);

export type Id = string;

export interface GranularMarking {
  /**
   * A list of selectors for content contained within the STIX object in which this property appears.
   */
  selectors: string[];
  marking_ref: (Identifier & Record<string, any>);
  [k: string]: any;
}

export interface KillChainPhase {
  /**
   * The name of the kill chain.
   */
  kill_chain_name: string;
  /**
   * The name of the phase in the kill chain.
   */
  phase_name: string;
  [k: string]: any;
}

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

export type Asset = (Core & {
  type: 'asset';
  id: Id;
  name: string;
  description?: string;
  category?: string;
  kind_of_asset?: string;
  category_ext: string[];
  compromised?: boolean;
  owner_aware?: boolean;
  technical_characteristics?: Array<{ field: string; data: string }>;
});

/**
 * Attack Patterns are a type of TTP that describe ways that adversaries attempt to compromise targets.
 */
export type AttackPattern = (Core & {
  /**
 * The type of this object, which MUST be the literal `attack-pattern`.
 */
  type?: 'attack-pattern';
  id?: Id;
  /**
 * The name used to identify the Attack Pattern.
 */
  name?: string;
  /**
 * A description that provides more details and context about the Attack Pattern, potentially including its purpose and its key characteristics.
 */
  description?: string;
  /**
 * The list of kill chain phases for which this attack pattern is used.
 */
  kill_chain_phases?: KillChainPhase[];
  [k: string]: any;
});

/**
 * A Campaign is a grouping of adversary behavior that describes a set of malicious activities or attacks that occur over a period of time against a specific set of targets.
 */
export type Campaign = (Core & {
  /**
 * The type of this object, which MUST be the literal `campaign`.
 */
  type?: 'campaign';
  id?: Id;
  /**
 * The name used to identify the Campaign.
 */
  name?: string;
  /**
 * A description that provides more details and context about the Campaign, potentially including its purpose and its key characteristics.
 */
  description?: string;
  /**
 * Alternative names used to identify this campaign.
 */
  aliases?: string[];
  first_seen?: Timestamp;
  last_seen?: Timestamp;
  /**
 * This field defines the Campaign’s primary goal, objective, desired outcome, or intended effect.
 */
  objective?: string;
  [k: string]: any;
});

/**
 * A Course of Action is an action taken either to prevent an attack or to respond to an attack that is in progress.
 */
export type CourseOfAction = (Core & {
  /**
 * The type of this object, which MUST be the literal `course-of-action`.
 */
  type?: 'course-of-action';
  id?: Id;
  /**
 * The name used to identify the Course of Action.
 */
  name?: string;
  /**
 * A description that provides more details and context about this object, potentially including its purpose and its key characteristics.
 */
  description?: string;
  [k: string]: any;
});

/**
 * Identities can represent actual individuals, organizations, or groups (e.g., ACME, Inc.) as well as classes of individuals, organizations, or groups.
 */
export type Identity = (Core & {
  /**
 * The type of this object, which MUST be the literal `identity`.
 */
  type?: 'identity';
  id?: Id;
  /**
 * The list of roles that this Identity performs (e.g., CEO, Domain Administrators, Doctors, Hospital, or Retailer). No open vocabulary is yet defined for this property.
 */
  labels?: string[];
  /**
 * The name of this Identity.
 */
  name?: string;
  /**
 * A description that provides more details and context about the Identity.
 */
  description?: string;
  /**
 * The type of entity that this Identity describes, e.g., an individual or organization. Open Vocab - identity-class-ov
 */
  identity_class?: string;
  /**
 * The list of sectors that this Identity belongs to. Open Vocab - industry-sector-ov
 */
  sectors?: string[];
  /**
 * The contact information (e-mail, phone number, etc.) for this Identity.
 */
  contact_information?: string;
  [k: string]: any;
});

/**
 * Indicators contain a pattern that can be used to detect suspicious or malicious cyber activity.
 */
export type Indicator = (Core & {
  /**
 * The type of this object, which MUST be the literal `indicator`.
 */
  type?: 'indicator';
  id?: Id;
  /**
 * This field is an Open Vocabulary that specifies the type of indicator. Open vocab - indicator-label-ov
 */
  labels?: string[];
  /**
 * The name used to identify the Indicator.
 */
  name?: string;
  /**
 * A description that provides the recipient with context about this Indicator potentially including its purpose and its key characteristics.
 */
  description?: string;
  /**
 * The detection pattern for this indicator. The default language is STIX Patterning.
 */
  pattern?: string;
  valid_from?: Timestamp;
  valid_until?: Timestamp;
  /**
 * The phases of the kill chain that this indicator detects.
 */
  kill_chain_phases?: KillChainPhase[];
  [k: string]: any;
});

/**
 * An Intrusion Set is a grouped set of adversary behavior and resources with common properties that is believed to be orchestrated by a single organization.
 */
export type IntrusionSet = (Core & {
  /**
 * The type of this object, which MUST be the literal `intrusion-set`.
 */
  type?: 'intrusion-set';
  id?: Id;
  /**
 * The name used to identify the Intrusion Set.
 */
  name?: string;
  /**
 * Provides more context and details about the Intrusion Set object.
 */
  description?: string;
  /**
 * Alternative names used to identify this Intrusion Set.
 */
  aliases?: string[];
  first_seen?: Timestamp;
  last_seen?: Timestamp;
  /**
 * The high level goals of this Intrusion Set, namely, what are they trying to do.
 */
  goals?: string[];
  /**
 * This defines the organizational level at which this Intrusion Set typically works. Open Vocab - attack-resource-level-ov
 */
  resource_level?: string;
  /**
 * The primary reason, motivation, or purpose behind this Intrusion Set. Open Vocab - attack-motivation-ov
 */
  primary_motivation?: string;
  /**
 * The secondary reasons, motivations, or purposes behind this Intrusion Set. Open Vocab - attack-motivation-ov
 */
  secondary_motivations?: string[];
  [k: string]: any;
});

/**
 * Malware is a type of TTP that is also known as malicious code and malicious software, refers to a program that is inserted into a system, usually covertly, with the intent of compromising the confidentiality, integrity, or availability of the victim's data, applications, or operating system (OS) or of otherwise annoying or disrupting the victim.
 */
export type Malware = (Core & {
  /**
 * The type of this object, which MUST be the literal `malware`.
 */
  type?: 'malware';
  id?: Id;
  /**
 * The type of malware being described. Open Vocab - malware-label-ov
 */
  labels?: string[];
  /**
 * The name used to identify the Malware.
 */
  name?: string;
  /**
 * Provides more context and details about the Malware object.
 */
  description?: string;
  /**
 * The list of kill chain phases for which this Malware instance can be used.
 */
  kill_chain_phases?: KillChainPhase[];
  [k: string]: any;
});

export type ObservedData = (Core & {
  /**
 * The type of this object, which MUST be the literal `observed-data`.
 */
  type?: 'observed-data';
  id?: Id;
  first_observed?: Timestamp;
  last_observed?: Timestamp;
  /**
 * The number of times the data represented in the objects property was observed. This MUST be an integer between 1 and 999,999,999 inclusive.
 */
  number_observed?: number;
  /**
 * A dictionary of Cyber Observable Objects that describes the single 'fact' that was observed.
 */
  objects?: Record<string, any>;
  [k: string]: any;
});

/**
 * Reports are collections of threat intelligence focused on one or more topics, such as a description of a threat actor, malware, or attack technique, including context and related details.
 */
export type Report = (Core & {
  /**
 * The type of this object, which MUST be the literal `report`.
 */
  type?: 'report';
  id?: Id;
  /**
 * This field is an Open Vocabulary that specifies the primary subject of this report. The suggested values for this field are in report-label-ov.
 */
  labels?: string[];
  /**
 * The name used to identify the Report.
 */
  name?: string;
  /**
 * A description that provides more details and context about Report.
 */
  description?: string;
  published?: Timestamp;
  /**
 * Specifies the STIX Objects that are referred to by this Report.
 */
  object_refs?: Identifier[];
  [k: string]: any;
});

/**
 * Threat Actors are actual individuals, groups, or organizations believed to be operating with malicious intent.
 */
export type ThreatActor = (Core & {
  /**
 * The type of this object, which MUST be the literal `threat-actor`.
 */
  type?: 'threat-actor';
  id?: Id;
  /**
 * This field specifies the type of threat actor. Open Vocab - threat-actor-label-ov
 */
  labels?: string[];
  /**
 * A name used to identify this Threat Actor or Threat Actor group.
 */
  name?: string;
  /**
 * A description that provides more details and context about the Threat Actor.
 */
  description?: string;
  /**
 * A list of other names that this Threat Actor is believed to use.
 */
  aliases?: string[];
  /**
 * This is a list of roles the Threat Actor plays. Open Vocab - threat-actor-role-ov
 */
  roles?: string[];
  /**
 * The high level goals of this Threat Actor, namely, what are they trying to do.
 */
  goals?: string[];
  /**
 * The skill, specific knowledge, special training, or expertise a Threat Actor must have to perform the attack. Open Vocab - threat-actor-sophistication-ov
 */
  sophistication?: string;
  /**
 * This defines the organizational level at which this Threat Actor typically works. Open Vocab - attack-resource-level-ov
 */
  resource_level?: string;
  /**
 * The primary reason, motivation, or purpose behind this Threat Actor. Open Vocab - attack-motivation-ov
 */
  primary_motivation?: string;
  /**
 * The secondary reasons, motivations, or purposes behind this Threat Actor. Open Vocab - attack-motivation-ov
 */
  secondary_motivations?: string[];
  /**
 * The personal reasons, motivations, or purposes of the Threat Actor regardless of organizational goals. Open Vocab - attack-motivation-ov
 */
  personal_motivations?: string[];
  [k: string]: any;
});

export type Tool = (Core & {
  /**
 * The type of this object, which MUST be the literal `tool`.
 */
  type?: 'tool';
  id?: Id;
  /**
 * The kind(s) of tool(s) being described. Open Vocab - tool-label-ov
 */
  labels?: string[];
  /**
 * The name used to identify the Tool.
 */
  name?: string;
  /**
 * Provides more context and details about the Tool object.
 */
  description?: string;
  /**
 * The version identifier associated with the tool.
 */
  tool_version?: string;
  /**
 * The list of kill chain phases for which this Tool instance can be used.
 */
  kill_chain_phases?: KillChainPhase[];
  [k: string]: any;
});

/**
 * A Vulnerability is a mistake in software that can be directly used by a hacker to gain access to a system or network.
 */
export type Vulnerability = (Core & {
  /**
 * The type of this object, which MUST be the literal `vulnerability`.
 */
  type?: 'vulnerability';
  id?: Id;
  /**
 * The name used to identify the Vulnerability.
 */
  name?: string;
  /**
 * A description that provides more details and context about the Vulnerability.
 */
  description?: string;
  [k: string]: any;
});

/**
 * The Relationship object is used to link together two SDOs in order to describe how they are related to each other.
 */
export type Relationship = (Core & {
  /**
 * The type of this object, which MUST be the literal `relationship`.
 */
  type?: 'relationship';
  id?: Id;
  /**
 * The name used to identify the type of relationship.
 */
  relationship_type?: string;
  /**
 * A description that helps provide context about the relationship.
 */
  description?: string;
  /**
 * The ID of the source (from) object.
 */
  source_ref?: Identifier;
  /**
 * The ID of the target (to) object.
 */
  target_ref?: Identifier;
});

/**
 * A Sighting denotes the belief that something in CTI (e.g., an indicator, malware, tool, threat actor, etc.) was seen.
 */
export type Sighting = (Core & {
  /**
 * The type of this object, which MUST be the literal `sighting`.
 */
  type?: 'sighting';
  id?: Id;
  first_seen?: Timestamp;
  last_seen?: Timestamp;
  /**
 * This is an integer between 0 and 999,999,999 inclusive and represents the number of times the object was sighted.
 */
  count?: number;
  /**
 * An ID reference to the object that has been sighted.
 */
  sighting_of_ref?: Identifier;
  /**
 * A list of ID references to the Observed Data objects that contain the raw cyber data for this Sighting.
 */
  observed_data_refs?: Identifier[];
  /**
 * The ID of the Victim Target objects of the entities that saw the sighting.
 */
  where_sighted_refs?: Identifier[];
  /**
 * The summary property indicates whether the Sighting should be considered summary data.
 */
  summary?: boolean;
});

export interface CyberObservableCore {
  /**
   * Indicates that this object is an Observable Object. The value of this property MUST be a valid Observable Object type name, but to allow for custom objects this has been removed from the schema.
   */
  type: string;
  /**
   * Specifies a textual description of the Object.
   */
  description?: string;
  extensions?: Dictionary;
}

/**
 * Specifies any extensions of the object, as a dictionary.
 */
export type Dictionary = Record<string, any>;

/**
 * The Artifact Object permits capturing an array of bytes (8-bits), as a base64-encoded string string, or linking to a file-like payload.
 */
export type Artifact = (CyberObservableCore & {
  /**
 * The value of this property MUST be `artifact`.
 */
  type?: 'artifact';
  /**
 * The value of this property MUST be a valid MIME type as specified in the IANA Media Types registry.
 */
  mime_type?: string;
  [k: string]: any;
});

/**
 * Common properties and behavior across all Cyber Observable Objects.
 */

/**
 * The AS object represents the properties of an Autonomous Systems (AS).
 */
export type AutonomousSystem = (CyberObservableCore & {
  /**
 * The value of this property MUST be `autonomous-system`.
 */
  type?: 'autonomous-system';
  /**
 * Specifies the number assigned to the AS. Such assignments are typically performed by a Regional Internet Registries (RIR).
 */
  number: number;
  /**
 * Specifies the name of the AS.
 */
  name?: string;
  /**
 * Specifies the name of the Regional Internet Registry (RIR) that assigned the number to the AS.
 */
  rir?: string;
  [k: string]: any;
});

/**
 * The Directory Object represents the properties common to a file system directory.
 */
export type Directory = (CyberObservableCore & {
  /**
 * The value of this property MUST be `directory`.
 */
  type?: 'directory';
  /**
 * Specifies the path, as originally observed, to the directory on the file system.
 */
  path: string;
  /**
 * Specifies the observed encoding for the path.
 */
  path_enc?: string;
  created?: Timestamp;
  modified?: Timestamp;
  accessed?: Timestamp;
  /**
 * Specifies a list of references to other File and/or Directory Objects contained within the directory.
 */
  contains_refs?: string[];
  [k: string]: any;
});

/**
 * The Domain Name represents the properties of a network domain name.
 */
export type DomainName = (CyberObservableCore & {
  /**
 * The value of this property MUST be `domain-name`.
 */
  type?: 'domain-name';
  /**
 * Specifies the value of the domain name.
 */
  value: string;
  /**
 * Specifies a list of references to one or more IP addresses or domain names that the domain name resolves to.
 */
  resolves_to_refs?: string[];
  [k: string]: any;
});

/**
 * The Email Address Object represents a single email address.
 */
export type EmailAddr = (CyberObservableCore & {
  /**
 * The value of this property MUST be `email-addr`.
 */
  type?: 'email-addr';
  /**
 * Specifies a single email address. This MUST not include the display name.
 */
  value: string;
  /**
 * Specifies a single email display name, i.e., the name that is displayed to the human user of a mail application.
 */
  display_name?: string;
  /**
 * Specifies the user account that the email address belongs to, as a reference to a User Account Object.
 */
  belongs_to_ref?: string;
  [k: string]: any;
});

/**
 * The Email Message Object represents an instance of an email message.
 */
export type EmailMessage = (CyberObservableCore & {
  /**
 * The value of this property MUST be `email-message`.
 */
  type?: 'email-message';
  date?: Timestamp;
  /**
 * Specifies the value of the 'Content-Type' header of the email message.
 */
  content_type?: string;
  /**
 * Specifies the value of the 'From:' header of the email message.
 */
  from_ref?: string;
  /**
 * Specifies the value of the 'From' field of the email message
 */
  sender_ref?: string;
  /**
 * Specifies the mailboxes that are 'To:' recipients of the email message
 */
  to_refs?: string[];
  /**
 * Specifies the mailboxes that are 'CC:' recipients of the email message
 */
  cc_refs?: string[];
  /**
 * Specifies the mailboxes that are 'BCC:' recipients of the email message.
 */
  bcc_refs?: string[];
  /**
 * Specifies the subject of the email message.
 */
  subject?: string;
  /**
 * Specifies one or more Received header fields that may be included in the email headers.
 */
  received_lines?: string[];
  /**
 * Specifies any other header fields found in the email message, as a dictionary.
 */
  additional_header_fields?: Record<string, any>;
  /**
 * Specifies the raw binary contents of the email message, including both the headers and body, as a reference to an Artifact Object.
 */
  raw_email_ref?: string;
  [k: string]: any;
});

/**
 * The File Object represents the properties of a file.
 */
export type File = (CyberObservableCore & {
  /**
 * The value of this property MUST be `file`.
 */
  type?: 'file';
  /**
 * The File Object defines the following extensions. In addition to these, producers MAY create their own. Extensions: ntfs-ext, raster-image-ext, pdf-ext, archive-ext, windows-pebinary-ext
 */
  extensions?: Record<string, Dictionary>;
  hashes?: Dictionary;
  /**
 * Specifies the size of the file, in bytes, as a non-negative integer.
 */
  size?: number;
  /**
 * Specifies the name of the file.
 */
  name?: string;
  /**
 * Specifies the observed encoding for the name of the file.
 */
  name_enc?: string;
  magic_number_hex?: Hex;
  /**
 * Specifies the MIME type name specified for the file, e.g., 'application/msword'.
 */
  mime_type?: string;
  created?: Timestamp;
  modified?: Timestamp;
  accessed?: Timestamp;
  /**
 * Specifies the parent directory of the file, as a reference to a Directory Object.
 */
  parent_directory_ref?: string;
  /**
 * Specifies a list of references to other Observable Objects contained within the file.
 */
  contains_refs?: string[];
  /**
 * Specifies the content of the file, represented as an Artifact Object.
 */
  content_ref?: string;
  [k: string]: any;
});

/**
 * Specifies the hexadecimal constant ('magic number') associated with a specific file format that corresponds to the file, if applicable.
 */
export type Hex = string;

/**
 * The IPv4 Address Object represents one or more IPv4 addresses expressed using CIDR notation.
 */
export type Ipv4Addr = (CyberObservableCore & {
  /**
 * The value of this property MUST be `ipv4-addr`.
 */
  type?: 'ipv4-addr';
  /**
 * Specifies one or more IPv4 addresses expressed using CIDR notation.
 */
  value: string;
  /**
 * Specifies a list of references to one or more Layer 2 Media Access Control (MAC) addresses that the IPv4 address resolves to.
 */
  resolves_to_refs?: string[];
  /**
 * Specifies a reference to one or more autonomous systems (AS) that the IPv4 address belongs to.
 */
  belongs_to_refs?: string[];
  [k: string]: any;
});

/**
 * The IPv6 Address Object represents one or more IPv6 addresses expressed using CIDR notation.
 */
export type Ipv6Addr = (CyberObservableCore & {
  /**
 * The value of this property MUST be `ipv6-addr`.
 */
  type?: 'ipv6-addr';
  /**
 * Specifies one or more IPv6 addresses expressed using CIDR notation.
 */
  value: string;
  /**
 * Specifies a list of references to one or more Layer 2 Media Access Control (MAC) addresses that the IPv6 address resolves to.
 */
  resolves_to_refs?: string[];
  /**
 * Specifies a reference to one or more autonomous systems (AS) that the IPv6 address belongs to.
 */
  belongs_to_refs?: string[];
  [k: string]: any;
});

export interface MarkingDefinition {
  type: 'marking definition';
  id: Identifier;
  created_by_ref?: Identifier;
  created: Timestamp;
  definition_type: 'statement';
  definition: {
    statement: string;
  };
}

export interface ObjectMarkingRelationship extends Relationship {
  type: 'relationship';
  relationship_type: 'applies-to';
  id: Identifier;
  source_ref: Identifier;
  target_ref: Identifier;
  created: Timestamp;
  modified: Timestamp;
  description: string;
}

export class ObjectMarkingRelationship implements ObjectMarkingRelationship {
  public type: 'relationship';
  public relationship_type: 'applies-to';
  public id: Identifier;
  public source_ref: Identifier;
  public target_ref: Identifier;
  public created: Timestamp;
  public modified: Timestamp;
  public description: string;

  constructor (source_ref: Identifier, target_ref: Identifier, created: Timestamp, modified: Timestamp) {
    this.source_ref = source_ref;
    this.target_ref = target_ref;
    this.created = created;
    this.modified = modified;
    this.id = 'applies-to--' + uuid.v4();
    this.type = 'relationship';
    this.relationship_type = 'applies-to';
  }
}

export interface CreatedByRelationship extends Relationship {
  type: 'relationship';
  relationship_type: 'created-by';
  source_ref: Id;
  target_ref: Id;
  id: Id;
  description: string;
  created: Timestamp;
  modified: Timestamp;
}

export function CreatedByRelationshipFactory (src_ref: Identifier, tgt_ref: Identifier, ceate_time: Timestamp, mod_time: Timestamp): CreatedByRelationship {
  const ret = {
    type: 'relationship',
    relationship_type: 'created-by',
    source_ref: src_ref,
    target_ref: tgt_ref,
    id: 'created-by--' + uuid.v4(),
    description: '',
    created: ceate_time,
    modified: mod_time
  };
  return ret as CreatedByRelationship;
}
