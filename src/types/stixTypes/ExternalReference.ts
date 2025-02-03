export type ExternalReference = {
    /**
     * The source within which the external-reference is defined 
     * (system, registry, organization, etc.)
     */
    source_name: string;
    description?: string;
    url?: string;
    hashes?: {[hashAlgorithmName: string]: string}; // STIX type "hashes"
    /**
     * An identifier for the external reference content.
     */
    external_id?: string;
};