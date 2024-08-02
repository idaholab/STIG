import { Core, Identifier, Timestamp } from "./Core";

/**
 * A Sighting denotes the belief that something in CTI (e.g., an indicator, malware, tool, threat actor, etc.) was seen.
 */
export type Sighting = (Core & {
    /**
   * The type of this object, which MUST be the literal `sighting`.
   */
    type?: 'sighting';
    id?: Identifier;
    first_seen?: Timestamp;
    last_seen?: Timestamp;
    /**
   * This is an integer between 0 and 999,999,999 inclusive and represents the number of times the object was sighted.
   */
    count?: number;
    /**
   * An ID reference to the object that has been sighted.
   */
    sighting_of_ref?: Identifier;
    /**
   * A list of ID references to the Observed Data objects that contain the raw cyber data for this Sighting.
   */
    observed_data_refs?: Identifier[];
    /**
   * The ID of the Victim Target objects of the entities that saw the sighting.
   */
    where_sighted_refs?: Identifier[];
    /**
   * The summary property indicates whether the Sighting should be considered summary data.
   */
    summary?: boolean;
});