import { Core, Identifier, Timestamp } from "./Core";

export type ObservedData = (Core & {
    /**
   * The type of this object, which MUST be the literal `observed-data`.
   */
    type?: 'observed-data';
    id?: Identifier;
    first_observed?: Timestamp;
    last_observed?: Timestamp;
    /**
   * The number of times the data represented in the objects property was observed. This MUST be an integer between 1 and 999,999,999 inclusive.
   */
    number_observed?: number;
    /**
   * A dictionary of Cyber Observable Objects that describes the single 'fact' that was observed.
   */
    objects?: Record<string, any>;
    [k: string]: any;
});