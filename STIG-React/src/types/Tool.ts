import { Core, Identifier } from "./Core";
import { KillChainPhase } from "./KillChainPhase";

export type Tool = (Core & {
    /**
   * The type of this object, which MUST be the literal `tool`.
   */
    type?: 'tool';
    id?: Identifier;
    /**
   * The kind(s) of tool(s) being described. Open Vocab - tool-label-ov
   */
    labels?: string[];
    /**
   * The name used to identify the Tool.
   */
    name?: string;
    /**
   * Provides more context and details about the Tool object.
   */
    description?: string;
    /**
   * The version identifier associated with the tool.
   */
    tool_version?: string;
    /**
   * The list of kill chain phases for which this Tool instance can be used.
   */
    kill_chain_phases?: KillChainPhase[];
    [k: string]: any;
});