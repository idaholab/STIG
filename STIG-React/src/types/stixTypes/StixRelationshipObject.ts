import { StixObject } from "./StixObject";
import { ExternalReference } from "./ExternalReference";

// These are the properties common to all SROs
export type StixRelationshipObject = StixObject & {
  spec_version: string; // required for SROs
  created_by_ref?: string;  // STIX type "identifier"
  created: string;  // STIX type "timestamp"
  modified: string; // STIX type "timestamp"
  revoked?: boolean;
  labels?: string[];
  confidence?: number;  // STIX type "integer"
  lang?: string;
  external_references?: ExternalReference[];
  extensions?: {[key: string]: any};  // STIX type "dictionary"
  // Provides for the properties not common between
  // the Generic Relationship SRO and the Sighting SRO
  [propertyName: string]: any;
}