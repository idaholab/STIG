import { Core, Identifier } from "./Core";

/**
 * The Relationship object is used to link together two SDOs in order to describe how they are related to each other.
 */
export type Relationship = (Core & {
    /**
   * The type of this object, which MUST be the literal `relationship`.
   */
    type?: 'relationship';
    id?: Identifier;
    /**
   * The name used to identify the type of relationship.
   */
    relationship_type?: string;
    /**
   * A description that helps provide context about the relationship.
   */
    description?: string;
    /**
   * The ID of the source (from) object.
   */
    source_ref?: Identifier;
    /**
   * The ID of the target (to) object.
   */
    target_ref?: Identifier;
});