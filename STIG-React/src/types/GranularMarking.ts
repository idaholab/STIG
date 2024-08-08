import { Identifier } from "./Core";

export type GranularMarking = {
    /**
     * A list of selectors for content contained within the STIX object in which this property appears.
     */
    selectors: string[];
    marking_ref: (Identifier & Record<string, any>);
    [k: string]: any;
}