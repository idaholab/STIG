import { SchemaSTIXEnumType } from "./SchemaSTIXEnumType";
import { SchemaSTIXOpenVocabType } from "./SchemaSTIXOpenVocabType";

// These type names correspond to STIX types
// that show up as property types
// in our schema.ts file.
export type SchemaSTIXType =
  "binary" | // A sequence of bytes.
  "boolean" | // A value of true or false.
  "dictionary" | // A set of key/value pairs.
  "enum" | // A value from a STIX Enumeration.
  "external-reference" | // A non-STIX identifier or reference to other related external content.
  "float" | // An IEEE 754 [IEEE 754-2008] double-precision number.
  "hashes" | // One or more cryptographic hashes.
  "hex" | // An array of octets as hexadecimal.
  "identifier" | // An identifier (ID) is for STIX Objects.
  "integer" | // A whole number.
  "kill-chain-phase" | // A name and a phase of a kill chain.
  "list" | // A sequence of values ordered based on how they appear in the list. The phrasing "list of type <type>" is used to indicate that all values within the list MUST conform to the specified type.
  "observable-container" | // One or more STIX Cyber-observable Objects in the deprecated Cyber Observable Container.
  "open-vocab" | // A value from a STIX open (open-vocab) or suggested vocabulary.
  "string" | // A series of Unicode characters.
  "timestamp" | // A time value (date and time).
  "x509-v3-extensions-type";

// These type names correspond to STIX types
// that show up as list of type SchemaSTIXListType
// in our schema.ts file.
export type SchemaSTIXListType =
  "string" | "external-reference" | "identifier" | "granular-marking" |
  "kill-chain-phase" | "email-mime-part-type" | "enum" | "open-vocab" |
  "windows-registry-value-type";

export type SchemaSTIXGranularMarkingType = {
  lang?: string;
  marking_ref: string;
  selectors: string[];
};

export type SchemaSTIXProperty = {
  name: string;
  mandatory?: boolean;
  notNull?: boolean;
  propertyDescription?: string;
} & ({
  type: "binary" | "hex" | "string" | "external-reference" | "identifier" | "kill-chain-phase" | "timestamp";
  default?: string;
} | {
  type: "boolean";
  default?: boolean;
 } | {
  type: "dictionary";
  default?: Record<string, any>;
 } | {
  type: "hashes";
  default?: string[];
 } | {
  type: "observable-container" | "x509-v3-extensions-type";
  default?: any;
} | {
  type: "list";
  listType: "string" | "external-reference" | "identifier" | "kill-chain-phase" | "email-mime-part-type" | "windows-registry-value-type";
  default?: any[];
} | {
  type: "list";
  listType: "enum";
  enumType: SchemaSTIXEnumType;
  default?: string[];
} | {
  type: "list";
  listType: "open-vocab";
  openVocabType: SchemaSTIXOpenVocabType;
  default?: string[];
} | {
  type: "list";
  listType: "granular-marking"
  default?: SchemaSTIXGranularMarkingType[];
} | {
  type: "enum";
  enumType: SchemaSTIXEnumType;
  default?: string;
} | {
  type: "open-vocab";
  openVocabType: SchemaSTIXOpenVocabType;
  default?: string;
} | {
  type: "integer" | "float"
  default?: number;
  min?: number;
  max?: number;
});