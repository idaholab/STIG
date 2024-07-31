import { Core, Identifier, Timestamp } from "./Core";

/**
 * A Campaign is a grouping of adversary behavior that describes a set of malicious activities or attacks that occur over a period of time against a specific set of targets.
 */
export type Campaign = (Core & {
    /**
   * The type of this object, which MUST be the literal `campaign`.
   */
    type?: 'campaign';
    id?: Identifier;
    /**
   * The name used to identify the Campaign.
   */
    name?: string;
    /**
   * A description that provides more details and context about the Campaign, potentially including its purpose and its key characteristics.
   */
    description?: string;
    /**
   * Alternative names used to identify this campaign.
   */
    aliases?: string[];
    first_seen?: Timestamp;
    last_seen?: Timestamp;
    /**
   * This field defines the Campaign’s primary goal, objective, desired outcome, or intended effect.
   */
    objective?: string;
    [k: string]: any;
});