import { StixObject } from "./stixTypes/StixObject";

export type STIGBundle = {
    type: 'bundle';
    id: string; // STIX type "identifier"
    objects: StixObject[];
    // A property specific to STIG (not STIX)
    // for optionally storing element graph positions
    metadata?: Array<{ id: string; position: { x: number; y: number } }>;
}