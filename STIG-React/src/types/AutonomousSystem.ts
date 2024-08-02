import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The AS object represents the properties of an Autonomous Systems (AS).
 */
export type AutonomousSystem = (CyberObservableCore & {
    /**
   * The value of this property MUST be `autonomous-system`.
   */
    type?: 'autonomous-system';
    /**
   * Specifies the number assigned to the AS. Such assignments are typically performed by a Regional Internet Registries (RIR).
   */
    number: number;
    /**
   * Specifies the name of the AS.
   */
    name?: string;
    /**
   * Specifies the name of the Regional Internet Registry (RIR) that assigned the number to the AS.
   */
    rir?: string;
    [k: string]: any;
});