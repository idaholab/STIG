import { GranularMarking } from "../stixTypes/GranularMarking";
import { KillChainPhase } from "../stixTypes/KillChainPhase";
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

export type SchemaSTIXStringType =
  "string" | "binary" | "hex" | "timestamp" | "external-reference" | "identifier";

// These type names correspond to STIX types
// that show up as list of type SchemaSTIXListType
// in our schema.ts file.
export type SchemaSTIXListType =
  "string" | "external-reference" | "identifier" | "granular-marking" |
  "kill-chain-phase" | "email-mime-part-type" | "enum" | "open-vocab" |
  "windows-registry-value-type";

export type BaseSchemaSTIXProperty = {
  name: string;
  mandatory?: boolean;
  notNull?: boolean;
  propertyDescription?: string;
}

export type HashAlgorithmOV = "MD5" | "SHA-1" | "SHA-256" | "SHA-512" | "SHA3-256" | "SHA3-512" | "SSDEEP" | "TLSH";

export type SchemaSTIXListProperty = BaseSchemaSTIXProperty & ({
  type: "list";
  listType: SchemaSTIXStringType | "email-mime-part-type" | "windows-registry-value-type";
  default?: string[];
} | {
  type: "list";
  listType: "kill-chain-phase";
  default?: KillChainPhase[];
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
  default?: GranularMarking[];
});

export type SchemaSTIXPrimitiveProperty = BaseSchemaSTIXProperty & ({
  type: SchemaSTIXStringType;
  default?: string;
} | {
  type: "kill-chain-phase";
  default?: KillChainPhase;
} | {
  type: "boolean";
  default?: boolean;
 } | {
  type: "dictionary";
  default?: Record<string, any>;
 } | {
  type: "hashes";
  default?: Record<HashAlgorithmOV,string>;
 } | {
  type: "observable-container" | "x509-v3-extensions-type";
  default?: any; // TODO: create more specific types
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

export type SchemaSTIXProperty = SchemaSTIXListProperty | SchemaSTIXPrimitiveProperty;