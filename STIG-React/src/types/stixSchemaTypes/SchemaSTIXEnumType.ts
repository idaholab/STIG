// These type names correspond to STIX types
// that show up as enum of type SchemaSTIXEnumType
// or open-vocab of type SchemaSTIXEnumType
// in our schema.ts file.

// TODO: Add in "network-socket-address-family-enum",
// "network-socket-type-enum", "windows-integrity-level-enum",
// "windows-registry-datatype-enum", "windows-service-start-type-enum",
// "windows-service-type-enum", "windows-service-status-enum"
// once they are referenced in schema.ts
export type SchemaSTIXEnumType = 'encryption-algorithm-enum' | 'extension-type-enum' | 'opinion-enum';
