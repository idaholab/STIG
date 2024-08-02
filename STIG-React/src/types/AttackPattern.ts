import { Core, Identifier } from "./Core";
import { KillChainPhase } from "./KillChainPhase";

/**
 * Attack Patterns are a type of TTP that describe ways that adversaries attempt to compromise targets.
 */
export type AttackPattern = (Core & {
    /**
   * The type of this object, which MUST be the literal `attack-pattern`.
   */
    type?: 'attack-pattern';
    id?: Identifier;
    /**
   * The name used to identify the Attack Pattern.
   */
    name?: string;
    /**
   * A description that provides more details and context about the Attack Pattern, potentially including its purpose and its key characteristics.
   */
    description?: string;
    /**
   * The list of kill chain phases for which this attack pattern is used.
   */
    kill_chain_phases?: KillChainPhase[];
    [k: string]: any;
});