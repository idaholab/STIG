// These type names correspond to STIX types
// that show up as list of type SchemaSTIXListType
// in our schema.ts file.
export type SchemaSTIXListType =
  | 'string'
  | 'external-reference'
  | 'identifier'
  | 'granular-marking'
  | 'kill-chain-phase'
  | 'email-mime-part-type'
  | 'enum'
  | 'open-vocab'
  | 'windows-registry-value-type';
