import { SchemaSTIXClass } from "@/types/stixSchemaTypes/SchemaSTIXClass";
import { enum_options } from "./enumOptions";

//TODO: fix any string types that should be more specific into their proper thing
export const schema: SchemaSTIXClass[] = [
  {
    name: 'core',
    superClasses: [],
    properties: [
      { name: 'id', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'type', type: 'string', mandatory: true, notNull: true, },
      { name: 'spec_version', type: 'string', mandatory: true, notNull: true, },
      { name: 'created_by_ref', type: 'identifier' },
      { name: 'created', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'modified', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'revoked', type: 'boolean', default: false },
      { name: 'labels', type: 'list', listType: 'string' },
      { name: 'confidence', type: 'integer', min: 0, max: 100, },
      { name: 'lang', type: 'string' },
      { name: 'external_references', type: 'list', listType: "external-reference" },
      { name: 'object_marking_refs', type: 'list', listType: 'identifier' },
      { name: 'granular_markings', type: 'list', listType: 'granular-marking' },
      { name: 'extensions', type: 'dictionary' }
    ]
  },
  {
    name: 'cyber-observable-core',
    superClasses: [],
    properties: [
      { name: 'id', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'type', type: 'string', mandatory: true, notNull: true, },
      { name: 'spec_version', type: 'string', default: '2.1' },
      { name: 'object_marking_refs', type: 'list', listType: 'identifier' },
      { name: 'granular_markings', type: 'list', listType: 'granular-marking' },
      { name: 'extensions', type: 'dictionary' },
      { name: 'defanged', type: 'boolean', default: false}
    ]
  },
  {
    name: 'relationship',
    description: "The Relationship object is used to link together two SDOs in order to describe how they are related to each other.",
    superClasses: [],
    properties: [
      { name: 'id', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'type', type: 'string', mandatory: true, notNull: true, },
      { name: 'spec_version', type: 'string', mandatory: true, notNull: true, },
      { name: 'created_by_ref', type: 'identifier' },
      { name: 'created', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'modified', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'revoked', type: 'boolean', default: false ,},
      { name: 'labels', type: 'list', listType: 'string' },
      { name: 'confidence', type: 'integer', min: 0, max: 100, },
      { name: 'lang', type: 'string' },
      { name: 'external_references', type: 'list', listType: 'external-reference' },
      { name: 'object_marking_refs', type: 'list', listType: 'identifier' },
      { name: 'granular_markings', type: 'list', listType: 'granular-marking' },
      { name: 'extensions', type: 'dictionary' },
      // The following are not specified in the core of relationships, but all relationships require these so including here.
      { name: 'relationship_type', type: 'string', mandatory: true, notNull: true, },
      { name: 'description', type: 'string' },
      { name: 'source_ref', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'target_ref', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'start_time', type: 'timestamp' },
      { name: 'stop_time', type: 'timestamp' }
    ]
  },
  {
    name: 'sighting',
    description: "A Sighting denotes the belief that something in CTI (e.g., an indicator, malware, tool, threat actor, etc.) was seen.",
    superClasses: [],
    properties: [
      { name: 'id', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'type', type: 'string', mandatory: true, notNull: true, },
      { name: 'spec_version', type: 'string', mandatory: true, notNull: true, },
      { name: 'created_by_ref', type: 'identifier' },
      { name: 'created', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'modified', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'revoked', type: 'boolean', default: false },
      { name: 'labels', type: 'list', listType: 'string' },
      { name: 'confidence', type: 'integer' },
      { name: 'lang', type: 'string' },
      { name: 'external_references', type: 'list', listType: 'external-reference' },
      { name: 'object_marking_refs', type: 'list', listType: 'identifier' },
      { name: 'granular_markings', type: 'list', listType: 'granular-marking' },
      // sighting specific.  TODO: Break out relationship-meta and include as superClass
      { name: 'description', type: 'string' },
      { name: 'first_seen', type: 'timestamp' },
      { name: 'last_seen', type: 'timestamp' },
      { name: 'count', type: 'integer' },
      { name: 'sighting_of_ref', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'observed_data_refs', type: 'list', listType: 'identifier' }, // observed data scos
      { name: 'where_sighted_refs', type: 'list', listType: 'identifier' }, // identity or location sdos
      { name: 'summary', type: 'boolean', default: false }

    ]
  },
  {
    name: 'language-meta-core',
    superClasses: [],
    properties: [
      { name: 'id', type: 'string', mandatory: true, notNull: true, },
      { name: 'type', type: 'string', mandatory: true, notNull: true, },
      { name: 'spec_version', type: 'string', mandatory: true, notNull: true, default: '2.1' },
      { name: 'created_by_ref', type: 'identifier' },
      { name: 'created', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'modified', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'revoked', type: 'boolean', default: false },
      { name: 'labels', type: 'list', listType: 'string' },
      { name: 'confidence', type: 'integer' },
      { name: 'external_references', type: 'list', listType: 'external-reference' },
      { name: 'object_marking_refs', type: 'list', listType: 'identifier' },
      { name: 'granular_markings', type: 'list', listType: 'granular-marking' },
      { name: 'extensions', type: 'dictionary' }
    ]
  },
  {
    name: 'marking-meta-core',
    superClasses: [],
    properties: [
      { name: 'id', type: 'string', mandatory: true, notNull: true, },
      { name: 'type', type: 'string', mandatory: true, notNull: true, },
      { name: 'spec_version', type: 'string', mandatory: true, notNull: true, default: '2.1' },
      { name: 'created_by_ref', type: 'string' },
      { name: 'created', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'external_references', type: 'list', listType: 'external-reference' },
      { name: 'object_marking_refs', type: 'list', listType: 'identifier' },
      { name: 'granular_markings', type: 'list', listType: 'granular-marking' },
      { name: 'extensions', type: 'dictionary' }

    ]
  },
  {
    name: 'extension-definition',
    description: "The extension-definition object represents a specific extension.",
    superClasses: [],
    properties: [
      { name: 'id', type: 'identifier', mandatory: true, notNull: true, },
      { name: 'type', type: 'string', mandatory: true, notNull: true, },
      { name: 'spec_version', type: 'string', mandatory: true, notNull: true, },
      { name: 'created', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'modified', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'created_by_ref', type: 'identifier' },
      
      { name: 'revoked', type: 'boolean', default: false },
      { name: 'labels', type: 'list', listType: 'string' },
      { name: 'external_references', type: 'list', listType: "external-reference" },
      { name: 'object_marking_refs', type: 'list', listType: 'identifier' },
      { name: 'granular_markings', type: 'list', listType: 'granular-marking' },

      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'schema', type: 'string', mandatory: true, notNull: true, },
      { name: 'version', type: 'string', mandatory: true, notNull: true, },
      { name: 'extension_types', type: 'list', listType: 'enum', enumType: 'extension-type-enum', 
        mandatory: true, notNull: true, default: [enum_options['extension-type-enum'][0]]},
      { name: 'extension_properties', type: 'list', listType: 'string' },

    ]
  },
  {
    name: 'analysis-of',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'artifact',
    description: "The Artifact Object permits capturing an array of bytes (8-bits), as a base64-encoded string string, or linking to a file-like payload.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'mime_type', type: 'string' },
      { name: 'payload_bin', type: 'binary' },
      { name: 'url', type: 'string' },
      { name: 'hashes', type: 'hashes' },
      { name: 'encryption_algorithm', type: 'enum', enumType: 'encryption-algorithm-enum' },
      { name: 'decryption_key', type: 'string' }
    ]
  },
  {
    name: 'attack-pattern',
    description: "Attack Patterns are a type of TTP that describe ways that adversaries attempt to compromise targets.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: "attack-pattern"},
      { name: 'description', type: 'string' },
      { name: 'aliases', type: 'list' },
      { name: 'kill_chain_phases', type: 'list', listType: 'kill-chain-phase' }
    ]
  },
  {
    name: 'attributed-to',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'autonomous-system',
    description: "The AS object represents the properties of an Autonomous Systems (AS).",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'number', type: 'integer', mandatory: true, notNull: true, },
      { name: 'name', type: 'string' },
      { name: 'rir', type: 'string' }
    ]
  },
  {
    name: 'based-on',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'beacons-to',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'campaign',
    description: "A Campaign is a grouping of adversary behavior that describes a set of malicious activities or attacks that occur over a period of time against a specific set of targets.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, default:"campaign"},
      { name: 'description', type: 'string' },
      { name: 'aliases', type: 'list', listType: 'string' },
      { name: 'first_seen', type: 'timestamp' },
      { name: 'last_seen', type: 'timestamp' },
      { name: 'objective', type: 'string' }
    ]
  },
  {
    name: 'characterizes',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'communicates-with',
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
    name: 'consists-of',
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
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: 'course-of-action'},
      { name: 'description', type: 'string' },
      // { name: 'action', type: 'string' }, //ATTN: This is reserved, but not currently implemented in the spec
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
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'path', type: 'string', mandatory: true, notNull: true, },
      { name: 'path_enc', type: 'string' },
      { name: 'ctime', type: 'timestamp' },
      { name: 'mtime', type: 'timestamp' },
      { name: 'atime', type: 'timestamp' },
      { name: 'contains_refs', type: 'list', listType: 'identifier' }
    ]
  },
  {
    name: 'domain-name',
    description: "The Domain Name represents the properties of a network domain name.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'value', type: 'string', mandatory: true, notNull: true, },
      { name: 'resolves_to_refs', type: 'list', listType: 'identifier' }
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
    name: 'dynamic-analysis-of',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'email-addr',
    description: "The Email Address Object represents a single email address.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'value', type: 'string', mandatory: true, notNull: true, },
      { name: 'display_name', type: 'string' },
      { name: 'belongs_to_ref', type: 'identifier' }
    ]
  },
  {
    name: 'email-message',
    description: "The Email Message Object represents an instance of an email message.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'is_multipart', type: 'boolean', mandatory: true, notNull: true },
      { name: 'date', type: 'timestamp' },
      { name: 'content_type', type: 'string' },
      { name: 'from_ref', type: 'identifier' },
      { name: 'sender_ref', type: 'identifier' },
      { name: 'to_refs', type: 'list', listType: 'identifier' },
      { name: 'cc_refs', type: 'list', listType: 'identifier' },
      { name: 'bcc_refs', type: 'list', listType: 'identifier' },
      { name: 'message_id', type: 'string' },
      { name: 'subject', type: 'string' },
      { name: 'received_lines', type: 'list', listType: 'string' },
      { name: 'additional_header_fields', type: 'dictionary' },
      { name: 'body', type: 'string' },
      { name: 'body_multipart', type: 'list', listType: 'email-mime-part-type' },
      { name: 'raw_email_ref', type: 'identifier' }
    ]
  },
  {
    name: 'exfiltrates-to',
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
    name: 'file',
    description: "The File Object represents the properties of a file.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'hashes', type: 'hashes' },
      { name: 'size', type: 'integer', min: 0 },
      { name: 'name', type: 'string' },
      { name: 'name_enc', type: 'string' },
      { name: 'magic_number_hex', type: 'hex' },
      { name: 'mime_type', type: 'string' },
      { name: 'ctime', type: 'timestamp' },
      { name: 'mtime', type: 'timestamp' },
      { name: 'atime', type: 'timestamp' },
      { name: 'parent_directory_ref', type: 'identifier' },
      { name: 'contains_refs', type: 'list', listType: 'identifier' },
      { name: 'content_ref', type: 'identifier' }
    ]
  },
  {
    name: 'grouping',
    description: "A Grouping object explicitly asserts that the referenced STIX Objects have a shared content.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'context', type: 'open-vocab', openVocabType: 'grouping-context-ov', mandatory: true, notNull: true, },
      { name: 'object_refs', type: 'list', listType: 'identifier', mandatory: true, notNull: true, }
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
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: 'identity'},
      { name: 'description', type: 'string' },
      { name: 'roles', type: 'list', listType: 'string' },
      { name: 'identity_class', type: 'open-vocab', openVocabType: "identity-class-ov" },
      { name: 'sectors', type: 'list', listType: 'open-vocab', openVocabType: "industry-sector-ov" },
      { name: 'contact_information', type: 'string' }
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
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'indicator_types', type: 'list', listType: 'open-vocab', openVocabType: 'indicator-type-ov', notNull: true},
      { name: 'pattern', type: 'string', mandatory: true, notNull: true, },
      { name: 'pattern_type', type: 'open-vocab', openVocabType: 'pattern-type-ov', notNull: true, },
      { name: 'pattern_version', type: 'string' },
      { name: 'valid_from', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'valid_until', type: 'timestamp' },
      { name: 'kill_chain_phases', type: 'list', listType: 'kill-chain-phase' }
    ]
  },
  {
    name: 'infrastructure',
    description: "Infrastructure objects describe systems, software services, and associated physical or virtual resources.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: 'infrastructure'},
      { name: 'description', type: 'string' },
      { name: 'infrastructure_types', type: 'list', listType: 'open-vocab', openVocabType: "infrastructure-type-ov" },
      { name: 'aliases', type: 'list', listType: 'string' },
      { name: 'kill_chain_phases', type: 'list', listType: 'kill-chain-phase' },
      { name: 'first_seen', type: 'timestamp' },
      { name: 'last_seen', type: 'timestamp' }
    ]
  },
  {
    name: 'intrusion-set',
    description: "An Intrusion Set is a grouped set of adversary behavior and resources with common properties that is believed to be orchestrated by a single organization.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: 'intrusion-set'},
      { name: 'description', type: 'string' },
      { name: 'aliases', type: 'list', listType: 'string' },
      { name: 'first_seen', type: 'timestamp' },
      { name: 'last_seen', type: 'timestamp' },
      { name: 'goals', type: 'list', listType: 'string' },
      { name: 'resource_level', type: 'open-vocab', openVocabType: "attack-resource-level-ov" },
      { name: 'primary_motivation', type: 'open-vocab', openVocabType: "attack-motivation-ov" },
      { name: 'secondary_motivations', type: 'list', listType: 'open-vocab', openVocabType: "attack-motivation-ov" }
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
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'value', type: 'string', mandatory: true, notNull: true, },
      { name: 'resolves_to_refs', type: 'list', listType: 'identifier' },
      { name: 'belongs_to_refs', type: 'list', listType: 'identifier' }
    ]
  },
  {
    name: 'ipv6-addr',
    description: "The IPv6 Address Object represents one or more IPv6 addresses expressed using CIDR notation.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'value', type: 'string', mandatory: true, notNull: true, },
      { name: 'resolves_to_refs', type: 'list', listType: 'identifier' },
      { name: 'belongs_to_refs', type: 'list', listType: 'identifier' }
    ]
  },
  {
    name: 'language-content',
    description: "The language-content object represents text content for STIX Objects represented in languages other than that of the original object.",
    superClasses: ['language-meta-core'],
    properties: [
      { name: 'object_ref', type: 'string', mandatory: true, notNull: true, },
      { name: 'object_modified', type: 'timestamp' },
      { name: 'contents', type: 'dictionary', mandatory: true, notNull: true, }
    ]
  },
  {
    name: 'location',
    description: "A Location represents a geographic location. The location may be described as any, some or all of the following: region (e.g., North America), civic address (e.g. New York, US), latitude and longitude.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'latitude', type: 'float' },
      { name: 'longitude', type: 'float' },
      { name: 'precision', type: 'float' },
      { name: 'region', type: 'open-vocab', openVocabType: "region-ov" },
      { name: 'country', type: 'string' },
      { name: 'administrative_area', type: 'string' },
      { name: 'city', type: 'string' },
      { name: 'street_address', type: 'string' },
      { name: 'postal_code', type: 'string' }
    ]
  },
  {
    name: 'mac-addr',
    description: "The MAC Address Object represents a single Media Access Control (MAC) address.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'value', type: 'string', mandatory: true, notNull: true, }
    ]
  },
  {
    name: 'malware',
    description: "Malware is a type of TTP that is also known as malicious code and malicious software, refers to a program that is inserted into a system, usually covertly, with the intent of compromising the confidentiality, integrity, or availability of the victim's data, applications, or operating system (OS) or of otherwise annoying or disrupting the victim.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'malware_types', type: 'list', listType: 'open-vocab', openVocabType: 'malware-type-ov' },
      { name: 'is_family', type: 'boolean', notNull: true, mandatory: true },
      { name: 'aliases', type: 'list', listType: 'string' },
      { name: 'kill_chain_phases', type: 'list', listType: 'kill-chain-phase' },
      { name: 'first_seen', type: 'timestamp' },
      { name: 'last_seen', type: 'timestamp' },
      { name: 'operating_system_refs', type: 'list', listType: 'identifier' },
      { name: 'architecture_execution_envs', type: 'list', listType: 'open-vocab', openVocabType: 'processor-architecture-ov' },
      { name: 'implementation_languages', type: 'list', listType: 'open-vocab', openVocabType: 'implementation-language-ov' },
      { name: 'capabilities', type: 'list', listType: 'open-vocab', openVocabType: 'malware-capabilities-ov' },
      { name: 'sample_refs', type: 'list', listType: 'identifier' }
    ]
  },
  {
    name: 'malware-analysis',
    description: "Malware Analysis captures the metadata and results of a particular analysis performed (static or dynamic) on the malware instance or family.",
    superClasses: ['core'],
    properties: [
      { name: 'product', type: 'string', notNull: true, mandatory: true, },
      { name: 'version', type: 'string' },
      { name: 'host_vm_ref', type: 'identifier' }, // The value of this property MUST be the identifier for a SCO software object.
      { name: 'operating_system_ref', type: 'identifier' }, // The value of this property MUST be the identifier for a SCO software object.
      { name: 'installed_software_refs', type: 'list', listType: 'identifier' }, // The value of this property MUST be the identifier for a SCO software object.
      { name: 'configuration_version', type: 'string' },
      { name: 'modules', type: 'list', listType: 'string' },
      { name: 'analysis_engine_version', type: 'string' },
      { name: 'analysis_definition_version', type: 'string' },
      { name: 'submitted', type: 'timestamp' },
      { name: 'analysis_started', type: 'timestamp' },
      { name: 'analysis_ended', type: 'timestamp' },
      { name: "result_name", type: "string" },
      { name: "result", type: "open-vocab", openVocabType: 'malware-result-ov' }, 
      { name: 'analysis_sco_refs', type: 'list', listType: 'identifier' },
      { name: "sample_ref", type: "identifier" },
    ]
  },
  {
    name: 'marking-definition',
    description: "The marking-definition object represents a specific marking.",
    superClasses: ['marking-meta-core'],
    properties: [
      { name: 'name', type: 'string' },
      { name: 'definition_type', type: 'string' },
      { name: 'definition', type: 'dictionary' }
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
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, }
    ]
  },
  {
    name: 'network-traffic',
    description: "The Network Traffic Object represents arbitrary network traffic that originates from a source and is addressed to a destination.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'start', type: 'timestamp' },
      { name: 'end', type: 'timestamp' },
      { name: 'is_active', type: 'boolean' },
      { name: 'src_ref', type: 'identifier' },
      { name: 'dst_ref', type: 'identifier' },
      { name: 'src_port', type: 'integer', min: 0, max: 65535, },
      { name: 'dst_port', type: 'integer', min: 0, max: 65535, },
      { name: 'protocols', type: 'list', listType: 'string', mandatory: true, notNull: true },
      { name: 'src_byte_count', type: 'integer', min: 0, },
      { name: 'dst_byte_count', type: 'integer', min: 0, },
      { name: 'src_packets', type: 'integer', min: 0, },
      { name: 'dst_packets', type: 'integer', min: 0, },
      { name: 'ipfix', type: 'dictionary' },
      { name: 'src_payload_ref', type: 'identifier' },
      { name: 'dst_payload_ref', type: 'identifier' },
      { name: 'encapsulates_refs', type: 'list', listType: 'identifier' },
      { name: 'encapsulated_by_ref', type: 'identifier' }
    ]
  },
  {
    name: 'note',
    description: "A Note is a comment or note containing informative text to help explain the context of one or more STIX Objects (SDOs or SROs) or to provide additional analysis that is not contained in the original object.",
    superClasses: ['core'],
    properties: [
      { name: 'abstract', type: 'string' },
      { name: 'content', type: 'string', mandatory: true, notNull: true, },
      { name: 'authors', type: 'list', listType: 'string' },
      { name: 'object_refs', type: 'list', listType: 'identifier', mandatory: true, notNull: true, }
    ]
  },
  {
    name: 'observed-data',
    description: "Observed data conveys information that was observed on systems and networks, such as log data or network traffic, using the Cyber Observable specification.",
    superClasses: ['core'],
    properties: [
      { name: 'first_observed', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'last_observed', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'number_observed', type: 'integer', min: 1, mandatory: true, notNull: true, },
      { name: 'object_refs', type: 'list', listType: 'identifier' }
    ]
  },
  {
    name: 'opinion',
    description: "An Opinion is an assessment of the correctness of the information in a STIX Object produced by a different entity and captures the level of agreement or disagreement using a fixed scale.",
    superClasses: ['core'],
    properties: [
      { name: 'explanation', type: 'string' },
      { name: 'authors', type: 'list', listType: 'string' },
      { name: 'opinion', type: 'enum', enumType: 'opinion-enum', mandatory: true, notNull: true, }, 
      { name: 'object_refs', type: 'list', listType: 'identifier', mandatory: true, notNull: true, }
    ]
  },
  {
    name: 'originates-from',
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
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'is_hidden', type: 'boolean' },
      { name: 'pid', type: 'integer' },
      { name: 'created_time', type: 'timestamp' },
      { name: 'cwd', type: 'string' },
      { name: 'command_line', type: 'string' },
      { name: 'environment_variables', type: 'dictionary' },
      { name: 'opened_connection_refs', type: 'list', listType: 'identifier' },
      { name: 'creator_user_ref', type: 'identifier' },
      { name: 'image_ref', type: 'identifier' },
      { name: 'parent_ref', type: 'identifier' },
      { name: 'child_refs', type: 'list', listType: 'identifier' }
    ]
  },
  {
    name: 'related-to',
    superClasses: ['relationship'],
    properties: [
    ]
  },

  {
    name: 'report',
    description: "Reports are collections of threat intelligence focused on one or more topics, such as a description of a threat actor, malware, or attack technique, including context and related details.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, },
      { name: 'description', type: 'string' },
      { name: 'report_types', type: 'list', listType: 'open-vocab', openVocabType: 'report-type-ov' },
      { name: 'published', type: 'timestamp', mandatory: true, notNull: true, },
      { name: 'object_refs', type: 'list', listType: 'identifier', mandatory: true, notNull: true, }
    ]
  },
  {
    name: 'software',
    description: "The Software Object represents high-level properties associated with software, including software products.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: 'software'},
      { name: 'cpe', type: 'string' },
      { name: 'languages', type: 'list', listType: 'string' },
      { name: 'vendor', type: 'string' },
      { name: 'version', type: 'string' }
    ]
  },
  {
    name: 'static-analysis-of',
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
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: 'threat-actor'},
      { name: 'description', type: 'string' },
      { name: 'threat_actor_types', type: 'list', listType: 'open-vocab', openVocabType: 'threat-actor-type-ov' },
      { name: 'aliases', type: 'list', listType: 'string' },
      { name: 'first_seen', type: 'timestamp' },
      { name: 'last_seen', type: 'timestamp' },
      { name: 'roles', type: 'list', listType: 'open-vocab', openVocabType: 'threat-actor-role-ov' },
      { name: 'goals', type: 'list', listType: 'string' },
      { name: 'sophistication', type: 'open-vocab', openVocabType: 'threat-actor-sophistication-ov' },
      { name: 'resource_level', type: 'open-vocab', openVocabType: 'attack-resource-level-ov' },
      { name: 'primary_motivation', type: 'open-vocab', openVocabType: 'attack-motivation-ov' },
      { name: 'secondary_motivations', type: 'list', listType: 'open-vocab', openVocabType: 'attack-motivation-ov' },
      { name: 'personal_motivations', type: 'list', listType: 'open-vocab', openVocabType: 'attack-motivation-ov' }
    ]
  },
  {
    name: 'tool',
    description: "Tools are legitimate software that can be used by threat actors to perform attacks.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, default: 'tool'},
      { name: 'description', type: 'string' },
      { name: 'tool_types', type: 'list', listType: 'open-vocab', openVocabType: 'tool-type-ov' },
      { name: 'aliases', type: 'list', listType: 'string' },
      { name: 'kill_chain_phases', type: 'list', listType: 'kill-chain-phase' },
      { name: 'tool_version', type: 'string' }
    ]
  },
  {
    name: 'url',
    description: "The URL Object represents the properties of a uniform resource locator (URL).",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'value', type: 'string', mandatory: true, notNull: true, }
    ]
  },
  {
    name: 'user-account',
    description: "The User Account Object represents an instance of any type of user account, including but not limited to operating system, device, messaging service, and social media platform accounts.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'user_id', type: 'string' },
      { name: 'credential', type: 'string' },
      { name: 'account_login', type: 'string' },
      { name: 'account_type', type: 'open-vocab', openVocabType: 'account-type-ov' },
      { name: 'display_name', type: 'string' },
      { name: 'is_service_account', type: 'boolean' },
      { name: 'is_privileged', type: 'boolean' },
      { name: 'can_escalate_privs', type: 'boolean' },
      { name: 'is_disabled', type: 'boolean' },
      { name: 'account_created', type: 'timestamp' },
      { name: 'account_expires', type: 'timestamp' },
      { name: 'credential_last_changed', type: 'timestamp' },
      { name: 'account_first_login', type: 'timestamp' },
      { name: 'account_last_login', type: 'timestamp' }
    ]
  },
  {
    name: 'uses',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'variant-of',
    superClasses: ['relationship'],
    properties: [
    ]
  },
  {
    name: 'vulnerability',
    description: "A Vulnerability is a mistake in software that can be directly used by a hacker to gain access to a system or network.",
    superClasses: ['core'],
    properties: [
      { name: 'name', type: 'string', mandatory: true, notNull: true, default:'vulnerability'},
      { name: 'description', type: 'string' },
    ]
  },
  {
    name: 'windows-registry-key',
    description: "The Registry Key Object represents the properties of a Windows registry key.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'key', type: 'string' },
      { name: 'values', type: 'list', listType: 'windows-registry-value-type' },
      { name: 'modified_time', type: 'timestamp' },
      { name: 'creator_user_ref', type: 'identifier' },
      { name: 'number_of_subkeys', type: 'integer', min: 0 }
    ]
  },
  {
    name: 'x509-certificate',
    description: "The X509 Certificate Object represents the properties of an X.509 certificate.",
    superClasses: ['cyber-observable-core'],
    properties: [
      { name: 'is_self_signed', type: 'boolean' },
      { name: 'hashes', type: 'hashes' },
      { name: 'version', type: 'string' },
      { name: 'serial_number', type: 'string' },
      { name: 'signature_algorithm', type: 'string' },
      { name: 'issuer', type: 'string' },
      { name: 'validity_not_before', type: 'timestamp' },
      { name: 'validity_not_after', type: 'timestamp' },
      { name: 'subject', type: 'string' },
      { name: 'subject_public_key_algorithm', type: 'string' },
      { name: 'subject_public_key_modulus', type: 'string' },
      { name: 'subject_public_key_exponent', type: 'integer' },
      { name: 'x509_v3_extensions', type: 'x509-v3-extensions-type' }
    ]
  }
];