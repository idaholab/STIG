import { GranularMarking } from './GranularMarking';

// These are the properties common to all
// SDOs, SROs, SCOs, and SMOs.

// These are also the properties common to all
// SDOs, SCOs, and SMOs.
export type StixObject = {
  type: string;
  spec_version?: string;
  id: string; // STIX type "identifier"
  object_marking_refs?: string[]; // STIX type "list of type identifier"
  granular_markings?: GranularMarking[];
  // Provides for the properties not common to all
  // SDOs, SROs, SCOs, and SMOs
  // eslint-disable-next-line
  [propertyName: string]: any;
};
