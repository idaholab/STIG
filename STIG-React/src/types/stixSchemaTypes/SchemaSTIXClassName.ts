// All STIX Object types supported in schema.ts and propertyDescriptions.ts
// and their super classes.
export type SchemaSTIXClassName = 
  // Top-level schema.ts/propertyDescriptions.ts classes:
  "core" | "cyber-observable-core" | "relationship" | "sighting" |
  "language-meta-core" | "marking-meta-core" | 

  // Top-level propertyDescriptions.ts classes:
  "external-reference" | "granular-marking" | "kill-chain-phase" | 
  "windows-registry-value-type" | "x509-v3-extensions-type" |

  // Children schema.ts/propertyDescriptions.ts classes:
  "artifact" | "attack-pattern" | 
  "autonomous-system" | "campaign" | 
  "course-of-action" | "directory" | 
  "domain-name" | "email-addr" |
  "email-message" | "extension-definition" |
  "file" | "grouping" | "identity" |
  "indicator" | "infrastructure" | "intrusion-set" |
  "ipv4-addr" | "ipv6-addr" | "language-content" |
  "location" | "mac-addr" | "malware" | "malware-analysis" | 
  "marking-definition" | "mutex" | "network-traffic" | "note" |
  "observed-data" | "opinion" | "process" |
  "report" | "software" |
  "threat-actor" | "tool" | "url" | "user-account" |
  "vulnerability" | "windows-registry-key" | "x509-certificate" |

  // Children schema.ts classes:
  "analysis-of" | "attributed-to" | "based-on" | "beacons-to" |
  "characterizes" | "communicates-with" | "compromises" |  "consists-of" |
  "controls" | "delivers" | "downloads" | "drops" | "dynamic-analysis-of" |
  "exfiltrates-to" | "exploits" | "has" | "hosts" | "impersonates" |
  "indicates" | "investigates" | "mitigates" | "originates-from" | "owns" |
  "related-to" | "static-analysis-of" | "targets" | "uses" | "variant-of"