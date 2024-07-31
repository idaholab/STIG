import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The IPv4 Address Object represents one or more IPv4 addresses expressed using CIDR notation.
 */
export type Ipv4Addr = (CyberObservableCore & {
    /**
   * The value of this property MUST be `ipv4-addr`.
   */
    type?: 'ipv4-addr';
    /**
   * Specifies one or more IPv4 addresses expressed using CIDR notation.
   */
    value: string;
    /**
   * Specifies a list of references to one or more Layer 2 Media Access Control (MAC) addresses that the IPv4 address resolves to.
   */
    resolves_to_refs?: string[];
    /**
   * Specifies a reference to one or more autonomous systems (AS) that the IPv4 address belongs to.
   */
    belongs_to_refs?: string[];
    [k: string]: any;
});