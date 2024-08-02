import { Dictionary } from "./Core";

export interface CyberObservableCore {
    /**
     * Indicates that this object is an Observable Object. The value of this property MUST be a valid Observable Object type name, but to allow for custom objects this has been removed from the schema.
     */
    type: string;
    /**
     * Specifies a textual description of the Object.
     */
    description?: string;
    extensions?: Dictionary;
}