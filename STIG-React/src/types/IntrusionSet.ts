import { Core, Identifier, Timestamp } from "./Core";

/**
 * An Intrusion Set is a grouped set of adversary behavior and resources with common properties that is believed to be orchestrated by a single organization.
 */
export type IntrusionSet = (Core & {
    /**
   * The type of this object, which MUST be the literal `intrusion-set`.
   */
    type?: 'intrusion-set';
    id?: Identifier;
    /**
   * The name used to identify the Intrusion Set.
   */
    name?: string;
    /**
   * Provides more context and details about the Intrusion Set object.
   */
    description?: string;
    /**
   * Alternative names used to identify this Intrusion Set.
   */
    aliases?: string[];
    first_seen?: Timestamp;
    last_seen?: Timestamp;
    /**
   * The high level goals of this Intrusion Set, namely, what are they trying to do.
   */
    goals?: string[];
    /**
   * This defines the organizational level at which this Intrusion Set typically works. Open Vocab - attack-resource-level-ov
   */
    resource_level?: string;
    /**
   * The primary reason, motivation, or purpose behind this Intrusion Set. Open Vocab - attack-motivation-ov
   */
    primary_motivation?: string;
    /**
   * The secondary reasons, motivations, or purposes behind this Intrusion Set. Open Vocab - attack-motivation-ov
   */
    secondary_motivations?: string[];
    [k: string]: any;
});