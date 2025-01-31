export type GranularMarking = {
  lang?: string;
  marking_ref?: string; // STIX type "identifier"
  /**
   * A list of selectors for content contained within
   * the STIX object in which this property appears.
   */
  selectors: string[];
};
