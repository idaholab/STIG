import { Dictionary, Hex, Timestamp } from "./Core";
import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The File Object represents the properties of a file.
 */
export type File = (CyberObservableCore & {
    /**
   * The value of this property MUST be `file`.
   */
    type?: 'file';
    /**
   * The File Object defines the following extensions. In addition to these, producers MAY create their own. Extensions: ntfs-ext, raster-image-ext, pdf-ext, archive-ext, windows-pebinary-ext
   */
    extensions?: Record<string, Dictionary>;
    hashes?: Dictionary;
    /**
   * Specifies the size of the file, in bytes, as a non-negative integer.
   */
    size?: number;
    /**
   * Specifies the name of the file.
   */
    name?: string;
    /**
   * Specifies the observed encoding for the name of the file.
   */
    name_enc?: string;
    magic_number_hex?: Hex;
    /**
   * Specifies the MIME type name specified for the file, e.g., 'application/msword'.
   */
    mime_type?: string;
    created?: Timestamp;
    modified?: Timestamp;
    accessed?: Timestamp;
    /**
   * Specifies the parent directory of the file, as a reference to a Directory Object.
   */
    parent_directory_ref?: string;
    /**
   * Specifies a list of references to other Observable Objects contained within the file.
   */
    contains_refs?: string[];
    /**
   * Specifies the content of the file, represented as an Artifact Object.
   */
    content_ref?: string;
    [k: string]: any;
});