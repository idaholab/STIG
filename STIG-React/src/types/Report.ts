import { Core, Identifier, Timestamp } from "./Core";

/**
 * Reports are collections of threat intelligence focused on one or more topics, such as a description of a threat actor, malware, or attack technique, including context and related details.
 */
export type Report = (Core & {
    /**
   * The type of this object, which MUST be the literal `report`.
   */
    type?: 'report';
    id?: Identifier;
    /**
   * This field is an Open Vocabulary that specifies the primary subject of this report. The suggested values for this field are in report-label-ov.
   */
    labels?: string[];
    /**
   * The name used to identify the Report.
   */
    name?: string;
    /**
   * A description that provides more details and context about Report.
   */
    description?: string;
    published?: Timestamp;
    /**
   * Specifies the STIX Objects that are referred to by this Report.
   */
    object_refs?: Identifier[];
    [k: string]: any;
});