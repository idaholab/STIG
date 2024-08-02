import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The IPv6 Address Object represents one or more IPv6 addresses expressed using CIDR notation.
 */
export type Ipv6Addr = (CyberObservableCore & {
    /**
   * The value of this property MUST be `ipv6-addr`.
   */
    type?: 'ipv6-addr';
    /**
   * Specifies one or more IPv6 addresses expressed using CIDR notation.
   */
    value: string;
    /**
   * Specifies a list of references to one or more Layer 2 Media Access Control (MAC) addresses that the IPv6 address resolves to.
   */
    resolves_to_refs?: string[];
    /**
   * Specifies a reference to one or more autonomous systems (AS) that the IPv6 address belongs to.
   */
    belongs_to_refs?: string[];
    [k: string]: any;
});