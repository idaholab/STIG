/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as ST from "../types/SchemaType";

export type PropertyConfig = {
  name: string;
  type: ST.s_SchemaType;
  listType?: ST.s_SchemaType
  enumType?: ST.s_Enum | ST.s_open_vocab
  mandatory?: boolean;
  notNull?: boolean;
  default?: string;
  min?: number;
  max?: number;
  propertyDescription?: string;
}

export type IJSONClassOptions = {
  name: string;
  superClasses: string[];
  description?: string;
  properties: PropertyConfig[];
}

type ISchemaFile = {
  classes: IJSONClassOptions[];
}

/*ATTN: TODO: Add the following custom types:
  list of <type> where they can be the following types
  * kill-chain-phase
      description: "The kill-chain-phase represents a phase in a kill chain.",
  * external-reference
  * identifier (perhaps of subtypes which are object types)
  * granular-marking
  * list of type open-vocab?
  * string
  * email-mime-part-type
  * alternate-data-stream-type
  * windows-pe-section-type
  * windows-registry-value-type
  * enum
  * list of type <STIX Object>

  All types include the following:
  binary
  boolean
  dictionary
  enum
  external-reference
  float
  hashes
  hex
  identifier
  integer
  kill-chain-phase
  list
  observable-container
  open-vocab
  string
  timestamp
*/

//ATTN: TODO: INVESTIGATE COLLATE AND IF IT'S USED FOR ANYTHING AND IF IT IS ANYTHING BESIDES 'default'
//TODO: fix any sting types that should be more specific into their proper thing
//TODO: make better descriptions for anything that has a non-specific dictionary as it's field type so users know what to do there
export const schema: ISchemaFile = {
  classes: [
    {
      name: 'core',
      superClasses: ['V'],
      properties: [
        { name: 'id', type: 'Identifier', mandatory: true, notNull: true, },
        { name: 'type', type: 'String', mandatory: true, notNull: true, },
        { name: 'spec_version', type: 'String', mandatory: true, notNull: true, },
        { name: 'created_by_ref', type: 'Identifier' },
        { name: 'created', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'modified', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'revoked', type: 'Boolean', default: 'False' },
        { name: 'labels', type: 'List', listType: 'String' },
        { name: 'confidence', type: 'Integer', min: 0, max: 100, },
        { name: 'lang', type: 'String' },
        { name: 'external_references', type: 'List', listType: "external_reference" },
        { name: 'object_marking_refs', type: 'List', listType: 'Identifier' },
        { name: 'granular_markings', type: 'List', listType: 'granular_marking' }
      ]
    },
    {
      name: 'cyber-observable-core',
      superClasses: ['V'],
      properties: [
        { name: 'id', type: 'Identifier', mandatory: true, notNull: true, },
        { name: 'type', type: 'String', mandatory: true, notNull: true, },
        { name: 'spec_version', type: 'String', default: '2.1' },
        { name: 'object_marking_refs', type: 'List', listType: 'Identifier' },
        { name: 'granular_markings', type: 'List', listType: 'granular_marking' },
        { name: 'extensions', type: 'Dictionary' },
        { name: 'defanged', type: 'Boolean', default: 'False' }
      ]
    },
    {
      name: 'relationship',
      description: "The Relationship object is used to link together two SDOs in order to describe how they are related to each other.",
      superClasses: ['E'],
      properties: [
        { name: 'id', type: 'Identifier', mandatory: true, notNull: true, },
        { name: 'type', type: 'String', mandatory: true, notNull: true, },
        { name: 'spec_version', type: 'String', mandatory: true, notNull: true, },
        { name: 'created_by_ref', type: 'Identifier' },
        { name: 'created', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'modified', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'revoked', type: 'Boolean', default: 'False' },
        { name: 'labels', type: 'List', listType: 'String' },
        { name: 'confidence', type: 'Integer', min: 0, max: 100, },
        { name: 'lang', type: 'String' },
        { name: 'external_references', type: 'List', listType: 'external_reference' },
        { name: 'object_marking_refs', type: 'List', listType: 'Identifier' },
        { name: 'granular_markings', type: 'List', listType: 'granular_marking' },
        // The following are not specified in the core of relationships, but all relationships require these so including here.
        { name: 'relationship_type', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'source_ref', type: 'Identifier', mandatory: true, notNull: true, },
        { name: 'target_ref', type: 'Identifier', mandatory: true, notNull: true, },
        { name: 'start_time', type: 'Timestamp' },
        { name: 'end_time', type: 'Timestamp' }
      ]
    },
    {
      name: 'sighting',
      description: "A Sighting denotes the belief that something in CTI (e.g., an indicator, malware, tool, threat actor, etc.) was seen.",
      superClasses: ['E'],
      properties: [
        { name: 'id_', type: 'Identifier', mandatory: true, notNull: true, },
        { name: 'type', type: 'String', mandatory: true, notNull: true, },
        { name: 'spec_version', type: 'String', mandatory: true, notNull: true, },
        { name: 'created_by_ref', type: 'Identifier' },
        { name: 'created', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'modified', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'revoked', type: 'Boolean', default: 'False' },
        { name: 'labels', type: 'List', listType: 'String' },
        { name: 'confidence', type: 'Integer' },
        { name: 'lang', type: 'String' },
        { name: 'external_references', type: 'List', listType: 'external_reference' },
        { name: 'object_marking_refs', type: 'List', listType: 'Identifier' },
        { name: 'granular_markings', type: 'List', listType: 'granular_marking' },
        // sighting specific.  TODO: Break out relationship-meta and include as superClass
        { name: 'description', type: 'String' },
        { name: 'first_seen', type: 'Timestamp' },
        { name: 'last_seen', type: 'Timestamp' },
        { name: 'count', type: 'Integer' },
        { name: 'sighting_of_ref', type: 'Identifier', mandatory: true, notNull: true, },
        { name: 'observed_data_refs', type: 'List', listType: 'Identifier' }, // observed data scos
        { name: 'where_sighted_refs', type: 'List', listType: 'Identifier' }, // identity or location sdos
        { name: 'summary', type: 'Boolean', default: 'False' }

      ]
    },
    {
      name: 'language-meta-core',
      superClasses: ['V'],
      properties: [
        { name: 'id', type: 'String', mandatory: true, notNull: true, },
        { name: 'type', type: 'String', mandatory: true, notNull: true, },
        { name: 'spec_version', type: 'String', mandatory: true, notNull: true, default: '2.1' },
        { name: 'created_by_ref', type: 'Identifier' },
        { name: 'created', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'modified', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'revoked', type: 'Boolean', default: 'False' },
        { name: 'labels', type: 'List', listType: 'String' },
        { name: 'confidence', type: 'Integer' },
        { name: 'external_references', type: 'List', listType: 'external_reference' },
        { name: 'object_marking_refs', type: 'List', listType: 'Identifier' },
        { name: 'granular_markings', type: 'List', listType: 'granular_marking' }
      ]
    },
    {
      name: 'marking-meta-core',
      superClasses: ['V'],
      properties: [
        { name: 'id', type: 'String', mandatory: true, notNull: true, },
        { name: 'type', type: 'String', mandatory: true, notNull: true, },
        { name: 'spec_version', type: 'String', mandatory: true, notNull: true, default: '2.1' },
        { name: 'created_by_ref', type: 'String' },
        { name: 'created', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'external_references', type: 'List', listType: 'external_reference' },
        { name: 'object_marking_refs', type: 'List', listType: 'Identifier' },
        { name: 'granular_markings', type: 'List', listType: 'granular_marking' }
      ]
    },
    {
      name: 'analysis_of',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'artifact',
      description: "The Artifact Object permits capturing an array of bytes (8-bits), as a base64-encoded string string, or linking to a file-like payload.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'mime_type', type: 'String' },
        { name: 'payload_bin', type: 'Binary' },
        { name: 'url', type: 'String' },
        { name: 'hashes', type: 'Hashes' },
        { name: 'encryption_algorithm', type: 'Enum', enumType: 'encryption_algorithm_enum' },
        { name: 'decryption_key', type: 'String' }
      ]
    },
    // {  // OLD NOT IN SPEC
    //     name: "asset",
    //     superClasses: ["core"],
    //     properties: [
    //         { name: "category", type: "String",  },
    //         { name: "category_ext", type: "EmbeddedList",  },
    //         { name: "compromised", type: "Boolean", , default: "False" },
    //         { name: "description", type: "String",  },
    //         { name: "kind_of_asset", type: "String",  },
    //         { name: "name", type: "String", mandatory: true, notNull: true,  },
    //         { name: "owner_aware", type: "Boolean", , default: "False" },
    //         { name: "technical_characteristics", type: "EmbeddedList",  },
    //     ],
    // },
    {
      name: 'attack-pattern',
      description: "Attack Patterns are a type of TTP that describe ways that adversaries attempt to compromise targets.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'aliases', type: 'List' },
        { name: 'kill_chain_phases', type: 'List', listType: 'kill_chain_phase' }
      ]
    },
    {
      name: 'attributed_to',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'autonomous-system',
      description: "The AS object represents the properties of an Autonomous Systems (AS).",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'number', type: 'Integer', mandatory: true, notNull: true, },
        { name: 'name', type: 'String' },
        { name: 'rir', type: 'String' }
      ]
    },
    {
      name: 'based_on',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'beacons_to',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'campaign',
      description: "A Campaign is a grouping of adversary behavior that describes a set of malicious activities or attacks that occur over a period of time against a specific set of targets.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'aliases', type: 'List', listType: 'String' },
        { name: 'first_seen', type: 'Timestamp' },
        { name: 'last_seen', type: 'Timestamp' },
        { name: 'objective', type: 'String' }
      ]
    },
    {
      name: 'characterizes',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'communicates_with',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'compromises',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'consists_of',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'controls',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'course-of-action',
      description: "A Course of Action is an action taken either to prevent an attack or to respond to an attack that is in progress. ",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'action', type: 'String' }, //ATTN: This is reserved, but not currently implemented in the spec
      ]
    },
    {
      name: 'delivers',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'directory',
      description: "The Directory Object represents the properties common to a file system directory.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'path', type: 'String', mandatory: true, notNull: true, },
        { name: 'path_enc', type: 'String' },
        { name: 'ctime', type: 'Timestamp' },
        { name: 'mtime', type: 'Timestamp' },
        { name: 'atime', type: 'Timestamp' },
        { name: 'contains_refs', type: 'List', listType: 'Identifier' }
      ]
    },
    {
      name: 'domain-name',
      description: "The Domain Name represents the properties of a network domain name.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'value', type: 'String', mandatory: true, notNull: true, },
        { name: 'resolves_to_refs', type: 'List', listType: 'Identifier' }
      ]
    },
    {
      name: 'downloads',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'drops',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'dynamic_analysis_of',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'email-addr',
      description: "The Email Address Object represents a single email address.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'value', type: 'String', mandatory: true, notNull: true, },
        { name: 'display_name', type: 'String' },
        { name: 'belongs_to_ref', type: 'Identifier' }
      ]
    },
    {
      name: 'email-message',
      description: "The Email Message Object represents an instance of an email message.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'is_multipart', type: 'Boolean', mandatory: true, notNull: true, },
        { name: 'date', type: 'Timestamp' },
        { name: 'content_type', type: 'String' },
        { name: 'from_ref', type: 'Identifier' },
        { name: 'sender_ref', type: 'Identifier' },
        { name: 'to_refs', type: 'List', listType: 'Identifier' },
        { name: 'cc_refs', type: 'List', listType: 'Identifier' },
        { name: 'bcc_refs', type: 'List', listType: 'Identifier' },
        { name: 'message_id', type: 'String' },
        { name: 'subject', type: 'String' },
        { name: 'received_lines', type: 'List', listType: 'String' },
        { name: 'additional_header_fields', type: 'Dictionary' },
        { name: 'body', type: 'String' },
        { name: 'body_multipart', type: 'List', listType: 'email_mime_part_type' },
        { name: 'raw_email_ref', type: 'Identifier' }
      ]
    },
    {
      name: 'exfiltrates_to',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'exploits',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'extension-definition',
      description: "The extension-definition object represents a specific extension.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String' },
        { name: 'schema', type: 'String', mandatory: true, notNull: true, },
        { name: 'version', type: 'String', mandatory: true, notNull: true, },
        { name: 'extension_types', type: 'List', listType: 'Enum', mandatory: true, notNull: true, },
        { name: 'extension_properties', type: 'List', listType: 'String' }
      ]
    },
    {
      name: 'file',
      description: "The File Object represents the properties of a file.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'hashes', type: 'Hashes' },
        { name: 'size', type: 'Integer', min: 0 },
        { name: 'name', type: 'String' },
        { name: 'name_enc', type: 'String' },
        { name: 'magic_number_hex', type: 'Hex' },
        { name: 'mime_type', type: 'String' },
        { name: 'ctime', type: 'Timestamp' },
        { name: 'mtime', type: 'Timestamp' },
        { name: 'atime', type: 'Timestamp' },
        { name: 'parent_directory_ref', type: 'Identifier' },
        { name: 'contains_refs', type: 'List', listType: 'Identifier' },
        { name: 'content_ref', type: 'Identifier' }
      ]
    },
    {
      name: 'grouping',
      description: "A Grouping object explicitly asserts that the referenced STIX Objects have a shared content.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String' },
        { name: 'description', type: 'String' },
        { name: 'context', type: 'open_vocab', enumType: 'grouping_context_ov', mandatory: true, notNull: true, },
        { name: 'object_refs', type: 'List', listType: 'Identifier', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'has',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'hosts',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'identity',
      description: "Identities can represent actual individuals, organizations, or groups (e.g., ACME, Inc.) as well as classes of individuals, organizations, or groups.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true },
        { name: 'description', type: 'String' },
        { name: 'roles', type: 'List', listType: 'String' },
        { name: 'identity_class', type: 'open_vocab', enumType: "identity_class_ov" },
        { name: 'sectors', type: 'List', listType: 'open_vocab', enumType: "industry_sector_ov" },
        { name: 'contact_information', type: 'String' }
      ]
    },
    {
      name: 'impersonates',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'indicates',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'indicator',
      description: "Indicators contain a pattern that can be used to detect suspicious or malicious cyber activity.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String' },
        { name: 'description', type: 'String' },
        { name: 'indicator_types', type: 'List', listType: 'open_vocab', enumType: 'pattern_type_ov', notNull: true, },
        { name: 'pattern', type: 'String', mandatory: true, notNull: true, },
        { name: 'pattern_type', type: 'open_vocab', enumType: 'pattern_type_ov', notNull: true, },
        { name: 'pattern_version', type: 'String' },
        { name: 'valid_from', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'valid_until', type: 'Timestamp' },
        { name: 'kill_chain_phases', type: 'List', listType: 'kill_chain_phase' }
      ]
    },
    {
      name: 'infrastructure',
      description: "Infrastructure objects describe systems, software services, and associated physical or virtual resources.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'infrastructure_types', type: 'List', listType: 'open_vocab', enumType: "infrastructure_type_ov" },
        { name: 'aliases', type: 'List', listType: 'String' },
        { name: 'kill_chain_phases', type: 'List', listType: 'kill_chain_phase' },
        { name: 'first_seen', type: 'Timestamp' },
        { name: 'last_seen', type: 'Timestamp' }
      ]
    },
    {
      name: 'intrusion-set',
      description: "An Intrusion Set is a grouped set of adversary behavior and resources with common properties that is believed to be orchestrated by a single organization.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'aliases', type: 'List', listType: 'String' },
        { name: 'first_seen', type: 'Timestamp' },
        { name: 'last_seen', type: 'Timestamp' },
        { name: 'goals', type: 'List', listType: 'String' },
        { name: 'resource_level', type: 'open_vocab', enumType: "attack_resource_level_ov" },
        { name: 'primary_motivation', type: 'open_vocab', enumType: "attack_motivation_ov" },
        { name: 'secondary_motivations', type: 'List', listType: 'open_vocab', enumType: "attack_motivation_ov" }
      ]
    },
    {
      name: 'investigates',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'ipv4-addr',
      description: "The IPv4 Address Object represents one or more IPv4 addresses expressed using CIDR notation.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'value', type: 'String', mandatory: true, notNull: true, },
        { name: 'resolves_to_refs', type: 'List', listType: 'Identifier' },
        { name: 'belongs_to_refs', type: 'List', listType: 'Identifier' }
      ]
    },
    {
      name: 'ipv6-addr',
      description: "The IPv6 Address Object represents one or more IPv6 addresses expressed using CIDR notation.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'value', type: 'String', mandatory: true, notNull: true, },
        { name: 'resolves_to_refs', type: 'List', listType: 'Identifier' },
        { name: 'belongs_to_refs', type: 'List', listType: 'Identifier' }
      ]
    },
    {
      name: 'language-content',
      description: "The language-content object represents text content for STIX Objects represented in languages other than that of the original object.",
      superClasses: ['languagemetacore'],
      properties: [
        { name: 'object_ref', type: 'String', mandatory: true, notNull: true, },
        { name: 'object_modified', type: 'Timestamp' },
        { name: 'contents', type: 'Dictionary', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'location',
      description: "A Location represents a geographic location. The location may be described as any, some or all of the following: region (e.g., North America), civic address (e.g. New York, US), latitude and longitude.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String' },
        { name: 'description', type: 'String' },
        { name: 'latitude', type: 'Float' },
        { name: 'longitude', type: 'Float' },
        { name: 'precision', type: 'Float' },
        { name: 'region', type: 'open_vocab', enumType: "region_ov" },
        { name: 'country', type: 'String' },
        { name: 'administrative_area', type: 'String' },
        { name: 'city', type: 'String' },
        { name: 'street_address', type: 'String' },
        { name: 'postal_code', type: 'String' }
      ]
    },
    {
      name: 'mac-addr',
      description: "The MAC Address Object represents a single Media Access Control (MAC) address.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'value', type: 'String', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'malware',
      description: "Malware is a type of TTP that is also known as malicious code and malicious software, refers to a program that is inserted into a system, usually covertly, with the intent of compromising the confidentiality, integrity, or availability of the victim's data, applications, or operating system (OS) or of otherwise annoying or disrupting the victim.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String' },
        { name: 'description', type: 'String' },
        { name: 'malware_types', type: 'List', listType: 'open_vocab', enumType: 'malware_type_ov' },
        { name: 'is_family', type: 'Boolean', notNull: true, mandatory: true },
        { name: 'aliases', type: 'List', listType: 'String' },
        { name: 'kill_chain_phases', type: 'List', listType: 'kill_chain_phase' },
        { name: 'first_seen', type: 'Timestamp' },
        { name: 'last_seen', type: 'Timestamp' },
        { name: 'operating_system_refs', type: 'List', listType: 'Identifier' },
        { name: 'architecture_execution_envs', type: 'List', listType: 'open_vocab', enumType: 'processor_architecture_ov' },
        { name: 'implementaion_languages', type: 'List', listType: 'open_vocab', enumType: 'implementation_language_ov' },
        { name: 'capabilities', type: 'List', listType: 'open_vocab', enumType: 'malware_capabilities_ov' },
        { name: 'sample_refs', type: 'List', listType: 'Identifier' }
      ]
    },
    {
      name: 'malware-analysis',
      description: "Malware Analysis captures the metadata and results of a particular analysis performed (static or dynamic) on the malware instance or family.",
      superClasses: ['core'],
      properties: [
        { name: 'product', type: 'String', notNull: true, mandatory: true, },
        { name: 'version', type: 'String' },
        { name: 'host_vm_ref', type: 'Identifier' }, // The value of this property MUST be the identifier for a SCO software object.
        { name: 'operating_system_ref', type: 'Identifier' }, // The value of this property MUST be the identifier for a SCO software object.
        { name: 'installed_software_refs', type: 'List', listType: 'Identifier' }, // The value of this property MUST be the identifier for a SCO software object.
        { name: 'configuration_version', type: 'String' },
        { name: 'modules', type: 'List', listType: 'String' },
        { name: 'analysis_engine_version', type: 'String' },
        { name: 'analysis_definition_version', type: 'String' },
        { name: 'submitted', type: 'Timestamp' },
        { name: 'analysis_started', type: 'Timestamp' },
        { name: 'analysis_ended', type: 'Timestamp' },
        { name: "result_name", type: "String" },
        { name: "result", type: "open_vocab", enumType: 'malware_result_ov' }, //TODO: enforce open-vocab malware-result-ov
        { name: 'analysis_sco_refs', type: 'List', listType: 'Identifier' },
        { name: "sample_ref", type: "Identifier" },
      ]
    },
    {
      name: 'marking-definition',
      description: "The marking-definition object represents a specific marking.",
      superClasses: ['markingmetacore'],
      properties: [
        { name: 'name', type: 'String' },
        { name: 'definition_type', type: 'String' },
        { name: 'definition', type: 'Dictionary' }
      ]
    },
    {
      name: 'mitigates',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'mutex',
      description: "The Mutex Object represents the properties of a mutual exclusion (mutex) object.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'network-traffic',
      description: "The Network Traffic Object represents arbitrary network traffic that originates from a source and is addressed to a destination.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'start', type: 'Timestamp' },
        { name: 'end', type: 'Timestamp' },
        { name: 'is_active', type: 'Boolean' },
        { name: 'src_ref', type: 'Identifier' },
        { name: 'dst_ref', type: 'Identifier' },
        { name: 'src_port', type: 'Integer', min: 0, max: 65535, },
        { name: 'dst_port', type: 'Integer', min: 0, max: 65535, },
        { name: 'protocols', type: 'List', listType: 'String', mandatory: true },
        { name: 'src_byte_count', type: 'Integer', min: 0, },
        { name: 'dst_byte_count', type: 'Integer', min: 0, },
        { name: 'src_packets', type: 'Integer', min: 0, },
        { name: 'dst_packets', type: 'Integer', min: 0, },
        { name: 'ipfix', type: 'Dictionary' },
        { name: 'src_payload_ref', type: 'Identifier' },
        { name: 'dst_payload_ref', type: 'Identifier' },
        { name: 'encapsulates_refs', type: 'List', listType: 'Identifier' },
        { name: 'encapsulated_by_ref', type: 'Identifier' }
      ]
    },
    {
      name: 'note',
      description: "A Note is a comment or note containing informative text to help explain the context of one or more STIX Objects (SDOs or SROs) or to provide additional analysis that is not contained in the original object.",
      superClasses: ['core'],
      properties: [
        { name: 'abstract', type: 'String' },
        { name: 'content', type: 'String', mandatory: true, notNull: true, },
        { name: 'authors', type: 'List', listType: 'String' },
        { name: 'object_refs', type: 'List', listType: 'Identifier', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'observed-data',
      description: "Observed data conveys information that was observed on systems and networks, such as log data or network traffic, using the Cyber Observable specification.",
      superClasses: ['core'],
      properties: [
        { name: 'first_observed', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'last_observed', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'number_observed', type: 'Integer', min: 1, mandatory: true, notNull: true, },
        { name: 'objects_refs', type: 'List', listType: 'Identifier' }
      ]
    },
    {
      name: 'opinion',
      description: "An Opinion is an assessment of the correctness of the information in a STIX Object produced by a different entity and captures the level of agreement or disagreement using a fixed scale.",
      superClasses: ['core'],
      properties: [
        { name: 'explanation', type: 'String' },
        { name: 'authors', type: 'List', listType: 'String' },
        { name: 'opinion', type: 'Enum', enumType: 'opinion_enum', mandatory: true, notNull: true, }, // TODO: enforce opinion-enum
        { name: 'object_refs', type: 'List', listType: 'Identifier', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'originates_from',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'owns',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'process',
      description: "The Process Object represents common properties of an instance of a computer program as executed on an operating system.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'is_hidden', type: 'Boolean' },
        { name: 'pid', type: 'Integer' },
        { name: 'created_time', type: 'Timestamp' },
        { name: 'cwd', type: 'String' },
        { name: 'command_line', type: 'String' },
        { name: 'environment_variables', type: 'Dictionary' },
        { name: 'opened_connection_refs', type: 'List', listType: 'Identifier' },
        { name: 'creator_user_ref', type: 'Identifier' },
        { name: 'image_ref', type: 'Identifier' },
        { name: 'parent_ref', type: 'Identifier' },
        { name: 'child_refs', type: 'List', listType: 'Identifier' }
      ]
    },
    {
      name: 'related_to',
      superClasses: ['relationship'],
      properties: [
      ]
    },

    {
      name: 'report',
      description: "Reports are collections of threat intelligence focused on one or more topics, such as a description of a threat actor, malware, or attack technique, including context and related details.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'report_types', type: 'List', listType: 'open_vocab', enumType: 'report_type_ov' },
        { name: 'published', type: 'Timestamp', mandatory: true, notNull: true, },
        { name: 'object_refs', type: 'List', listType: 'Identifier', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'software',
      description: "The Software Object represents high-level properties associated with software, including software products.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'cpe', type: 'String' },
        { name: 'languages', type: 'List', listType: 'String' },
        { name: 'vendor', type: 'String' },
        { name: 'version', type: 'String' }
      ]
    },
    {
      name: 'static_analysis_of',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'targets',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'threat-actor',
      description: "Threat Actors are actual individuals, groups, or organizations believed to be operating with malicious intent.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'threat_actor_types', type: 'List', listType: 'open_vocab', enumType: 'threat_actor_type_ov' },
        { name: 'aliases', type: 'List', listType: 'String' },
        { name: 'first_seen', type: 'Timestamp' },
        { name: 'last_seen', type: 'Timestamp' },
        { name: 'roles', type: 'List', listType: 'open_vocab', enumType: 'threat_actor_role_ov' },
        { name: 'goals', type: 'List', listType: 'String' },
        { name: 'sophistication', type: 'open_vocab', enumType: 'threat_actor_sophistication_ov' },
        { name: 'resource_level', type: 'open_vocab', enumType: 'attack_resource_level_ov' },
        { name: 'primary_motivation', type: 'open_vocab', enumType: 'attack_motivation_ov' },
        { name: 'secondary_motivations', type: 'List', listType: 'open_vocab', enumType: 'attack_motivation_ov' },
        { name: 'personal_motivations', type: 'List', listType: 'open_vocab', enumType: 'attack_motivation_ov' }
      ]
    },
    {
      name: 'tool',
      description: "Tools are legitimate software that can be used by threat actors to perform attacks.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
        { name: 'tool_types', type: 'List', listType: 'open_vocab', enumType: 'tool_type_ov' },
        { name: 'aliases', type: 'List', listType: 'String' },
        { name: 'kill_chain_phases', type: 'List', listType: 'kill_chain_phase' },
        { name: 'tool_version', type: 'String' }
      ]
    },
    {
      name: 'url',
      description: "The URL Object represents the properties of a uniform resource locator (URL).",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'value', type: 'String', mandatory: true, notNull: true, }
      ]
    },
    {
      name: 'user-account',
      description: "The User Account Object represents an instance of any type of user account, including but not limited to operating system, device, messaging service, and social media platform accounts.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'user_id', type: 'String' },
        { name: 'credential', type: 'String' },
        { name: 'account_login', type: 'String' },
        { name: 'account_type', type: 'open_vocab', enumType: 'account_type_ov' },
        { name: 'display_name', type: 'String' },
        { name: 'is_service_account', type: 'Boolean' },
        { name: 'is_privileged', type: 'Boolean' },
        { name: 'can_escalate_privs', type: 'Boolean' },
        { name: 'is_disabled', type: 'Boolean' },
        { name: 'account_created', type: 'Timestamp' },
        { name: 'account_expires', type: 'Timestamp' },
        { name: 'credential_last_changed', type: 'Timestamp' },
        { name: 'account_first_login', type: 'Timestamp' },
        { name: 'account_last_login', type: 'Timestamp' }
      ]
    },
    {
      name: 'uses',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'variant_of',
      superClasses: ['relationship'],
      properties: [
      ]
    },
    {
      name: 'vulnerability',
      description: "A Vulnerability is a mistake in software that can be directly used by a hacker to gain access to a system or network.",
      superClasses: ['core'],
      properties: [
        { name: 'name', type: 'String', mandatory: true, notNull: true, },
        { name: 'description', type: 'String' },
      ]
    },
    {
      name: 'windows-registry-key',
      description: "The Registry Key Object represents the properties of a Windows registry key.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'key', type: 'String' },
        { name: 'values', type: 'List', listType: 'windows_registry_value_type' },
        { name: 'modified_time', type: 'Timestamp' },
        { name: 'creator_user_ref', type: 'Identifier' },
        { name: 'number_of_subkeys', type: 'Integer', min: 0 }
      ]
    },
    {
      name: 'x509-certificate',
      description: "The X509 Certificate Object represents the properties of an X.509 certificate.",
      superClasses: ['cyberobservablecore'],
      properties: [
        { name: 'is_self_signed', type: 'Boolean' },
        { name: 'hashes', type: 'Hashes' },
        { name: 'version', type: 'String' },
        { name: 'serial_number', type: 'String' },
        { name: 'signature_algorithm', type: 'String' },
        { name: 'issuer', type: 'String' },
        { name: 'validity_not_before', type: 'Timestamp' },
        { name: 'validity_not_after', type: 'Timestamp' },
        { name: 'subject', type: 'String' },
        { name: 'subject_public_key_algorithm', type: 'String' },
        { name: 'subject_public_key_modulus', type: 'String' },
        { name: 'subject_public_key_exponent', type: 'Integer' },
        { name: 'x509_v3_extensions', type: 'x509_v3_extensions_type' }
      ]
    }
  ]
};
