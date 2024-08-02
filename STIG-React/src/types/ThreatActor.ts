import { Core, Identifier } from "./Core";

/**
 * Threat Actors are actual individuals, groups, or organizations believed to be operating with malicious intent.
 */
export type ThreatActor = (Core & {
    /**
   * The type of this object, which MUST be the literal `threat-actor`.
   */
    type?: 'threat-actor';
    id?: Identifier;
    /**
   * This field specifies the type of threat actor. Open Vocab - threat-actor-label-ov
   */
    labels?: string[];
    /**
   * A name used to identify this Threat Actor or Threat Actor group.
   */
    name?: string;
    /**
   * A description that provides more details and context about the Threat Actor.
   */
    description?: string;
    /**
   * A list of other names that this Threat Actor is believed to use.
   */
    aliases?: string[];
    /**
   * This is a list of roles the Threat Actor plays. Open Vocab - threat-actor-role-ov
   */
    roles?: string[];
    /**
   * The high level goals of this Threat Actor, namely, what are they trying to do.
   */
    goals?: string[];
    /**
   * The skill, specific knowledge, special training, or expertise a Threat Actor must have to perform the attack. Open Vocab - threat-actor-sophistication-ov
   */
    sophistication?: string;
    /**
   * This defines the organizational level at which this Threat Actor typically works. Open Vocab - attack-resource-level-ov
   */
    resource_level?: string;
    /**
   * The primary reason, motivation, or purpose behind this Threat Actor. Open Vocab - attack-motivation-ov
   */
    primary_motivation?: string;
    /**
   * The secondary reasons, motivations, or purposes behind this Threat Actor. Open Vocab - attack-motivation-ov
   */
    secondary_motivations?: string[];
    /**
   * The personal reasons, motivations, or purposes of the Threat Actor regardless of organizational goals. Open Vocab - attack-motivation-ov
   */
    personal_motivations?: string[];
    [k: string]: any;
});