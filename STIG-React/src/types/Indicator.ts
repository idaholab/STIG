import { Core, Identifier, Timestamp } from "./Core";
import { KillChainPhase } from "./KillChainPhase";

/**
 * Indicators contain a pattern that can be used to detect suspicious or malicious cyber activity.
 */
export type Indicator = (Core & {
    /**
   * The type of this object, which MUST be the literal `indicator`.
   */
    type?: 'indicator';
    id?: Identifier;
    /**
   * This field is an Open Vocabulary that specifies the type of indicator. Open vocab - indicator-label-ov
   */
    labels?: string[];
    /**
   * The name used to identify the Indicator.
   */
    name?: string;
    /**
   * A description that provides the recipient with context about this Indicator potentially including its purpose and its key characteristics.
   */
    description?: string;
    /**
   * The detection pattern for this indicator. The default language is STIX Patterning.
   */
    pattern?: string;
    valid_from?: Timestamp;
    valid_until?: Timestamp;
    /**
   * The phases of the kill chain that this indicator detects.
   */
    kill_chain_phases?: KillChainPhase[];
    [k: string]: any;
});