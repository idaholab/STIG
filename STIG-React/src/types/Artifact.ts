import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The Artifact Object permits capturing an array of bytes (8-bits), as a base64-encoded string string, or linking to a file-like payload.
 */
export type Artifact = (CyberObservableCore & {
    /**
   * The value of this property MUST be `artifact`.
   */
    type?: 'artifact';
    /**
   * The value of this property MUST be a valid MIME type as specified in the IANA Media Types registry.
   */
    mime_type?: string;
    [k: string]: any;
});