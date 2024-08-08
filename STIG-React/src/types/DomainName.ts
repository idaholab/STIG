import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The Domain Name represents the properties of a network domain name.
 */
export type DomainName = (CyberObservableCore & {
    /**
   * The value of this property MUST be `domain-name`.
   */
    type?: 'domain-name';
    /**
   * Specifies the value of the domain name.
   */
    value: string;
    /**
   * Specifies a list of references to one or more IP addresses or domain names that the domain name resolves to.
   */
    resolves_to_refs?: string[];
    [k: string]: any;
});