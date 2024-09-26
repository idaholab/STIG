// All STIX Object types supported in schema.ts
// and their super classes.
export type SchemaSTIXClassName = 
  // Top-level schema.ts classes:
  "core" | "cyber-observable-core" | "relationship" | "sighting" |
  "language-meta-core" | "marking-meta-core" | 
  // Children schema.ts classes:
  "analysis-of" | "artifact" | "attack-pattern" | "attributed-to" | 
  "autonomous-system" | "based-on" | "beacons-to" | "campaign" | 
  "characterizes" | "communicates-with" | "compromises" | "consists-of" | 
  "controls" | "course-of-action" | "delivers" | "directory" | 
  "domain-name" | "downloads" | "drops" | "dynamic-analysis-of" | "email-addr" |
  "email-message" | "exfiltrates-to" | "exploits" | "extension-definition" |
  "file" | "grouping" | "has" | "hosts" | "identity" | "impersonates" |
  "indicates" | "indicator" | "infrastructure" | "intrusion-set" |
  "investigates" | "ipv4-addr" | "ipv6-addr" | "language-content" |
  "location" | "mac-addr" | "malware" | "malware-analysis" | 
  "marking-definition" | "mitigates" | "mutex" | "network-traffic" | "note" |
  "observed-data" | "opinion" | "originates-from" | "owns" | "process" |
  "related-to" | "report" | "software" | "static-analysis-of" | "targets" |
  "threat-actor" | "tool" | "url" | "user-account" | "uses" | "variant-of" |
  "vulnerability" | "windows-registry-key" | "x509-certificate";