import { Identifier } from "./Core";

export type ExternalReference = ({
    /**
     * The source within which the external-reference is defined (system, registry, organization, etc.)
     */
    source_name: string;
    /**
     * An identifier for the external reference content.
     */
    external_id: Identifier;
    [k: string]: any;
} | Record<string, any>);