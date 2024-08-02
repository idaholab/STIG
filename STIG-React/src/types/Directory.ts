import { Timestamp } from "./Core";
import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The Directory Object represents the properties common to a file system directory.
 */
export type Directory = (CyberObservableCore & {
    /**
   * The value of this property MUST be `directory`.
   */
    type?: 'directory';
    /**
   * Specifies the path, as originally observed, to the directory on the file system.
   */
    path: string;
    /**
   * Specifies the observed encoding for the path.
   */
    path_enc?: string;
    created?: Timestamp;
    modified?: Timestamp;
    accessed?: Timestamp;
    /**
   * Specifies a list of references to other File and/or Directory Objects contained within the directory.
   */
    contains_refs?: string[];
    [k: string]: any;
});