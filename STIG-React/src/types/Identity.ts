import { Core, Identifier } from "./Core";

/**
 * Identities can represent actual individuals, organizations, or groups (e.g., ACME, Inc.) as well as classes of individuals, organizations, or groups.
 */
export type Identity = (Core & {
    /**
   * The type of this object, which MUST be the literal `identity`.
   */
    type?: 'identity';
    id?: Identifier;
    /**
   * The list of roles that this Identity performs (e.g., CEO, Domain Administrators, Doctors, Hospital, or Retailer). No open vocabulary is yet defined for this property.
   */
    labels?: string[];
    /**
   * The name of this Identity.
   */
    name?: string;
    /**
   * A description that provides more details and context about the Identity.
   */
    description?: string;
    /**
   * The type of entity that this Identity describes, e.g., an individual or organization. Open Vocab - identity-class-ov
   */
    identity_class?: string;
    /**
   * The list of sectors that this Identity belongs to. Open Vocab - industry-sector-ov
   */
    sectors?: string[];
    /**
   * The contact information (e-mail, phone number, etc.) for this Identity.
   */
    contact_information?: string;
    [k: string]: any;
});