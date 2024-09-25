// These type names correspond to STIX types
// that show up as open-vocab of type SchemaSTIXOpenVocabType
// in our schema.ts file.

// TODO: Add in "windows-pebinary-type-ov" once it is referenced in schema.ts
export type SchemaSTIXOpenVocabType =
  "account-type-ov" | "attack-motivation-ov" | "attack-resource-level-ov" |
  "grouping-context-ov" | "identity-class-ov" | "implementation-language-ov" | 
  "indicator-type-ov" | "industry-sector-ov" |
  "infrastructure-type-ov" | "malware-result-ov" | "malware-capabilities-ov" |
  "malware-type-ov" | "pattern-type-ov" | "processor-architecture-ov" |
  "region-ov" | "report-type-ov" | "threat-actor-type-ov" |
  "threat-actor-role-ov" | "threat-actor-sophistication-ov" | 'tool-type-ov';