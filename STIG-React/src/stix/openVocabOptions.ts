// These variables contain the options that will
// populate the various open-vocab selection lists
// for the openVocabTypes in schema.ts

const account_type_ov = [
  "facebook",
  "ldap",
  "nis",
  "openid",
  "radius",
  "skype",
  "tacacs",
  "twitter",
  "unix",
  "windows-local",
  "windows-domain"
];

const attack_motivation_ov = [
  "accidental",
  "coercion",
  "dominance",
  "ideology",
  "notoriety",
  "organizational-gain",
  "personal-gain",
  "personal-satisfaction",
  "revenge",
  "unpredictable"
];

const attack_resource_level_ov = [
  "individual",
  "club",
  "contest",
  "team",
  "organization",
  "government"
];

const grouping_context_ov = [
  "suspicious-activity",
  "malware-analysis",
  "unspecified"
];

const hash_algorithm_ov = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-512",
  "SHA3-256",
  "SHA3-512",
  "SSDEEP",
  "TLSH"
];

const identity_class_ov = [
  "individual",
  "group",
  "system",
  "organization",
  "class",
  "unknown"
];

const implementation_language_ov = [
  "applescript",
  "bash",
  "c",
  "c++",
  "c#",
  "go",
  "java",
  "javascript",
  "lua",
  "objective-c",
  "perl",
  "php",
  "powershell",
  "python",
  "ruby",
  "scala",
  "swift",
  "typescript",
  "visual-basic",
  "x86-32",
  "x86-64"
];

const indicator_type_ov = [
  "anomalous-activity",
  "anonymization",
  "benign",
  "compromised",
  "malicious-activity",
  "attribution",
  "unknown"
];

const industry_sector_ov = [
  "agriculture",
  "aerospace",
  "automotive",
  "chemical",
  "commercial",
  "communications",
  "construction",
  "defense",
  "education",
  "energy",
  "entertainment",
  "financial-services",
  "government ",
  "emergency-services",
  "government-local",
  "government-national",
  "government-public-services",
  "government-regional",
  "healthcare",
  "hospitality-leisure",
  "infrastructure ",
  "dams",
  "nuclear",
  "water",
  "insurance",
  "manufacturing",
  "mining",
  "non-profit",
  "pharmaceuticals",
  "retail",
  "technology",
  "telecommunications",
  "transportation",
  "utilities"
];

const infrastructure_type_ov = [
  "amplification",
  "anonymization",
  "botnet",
  "command-and-control",
  "exfiltration",
  "hosting-malware",
  "hosting-target-lists",
  "phishing",
  "reconnaissance",
  "staging",
  "unknown"
];

const malware_result_ov = [
  "malicious",
  "suspicious",
  "benign ",
  "unknown"
];

const malware_capabilities_ov = [
  "accesses-remote-machines",
  "anti-debugging",
  "anti-disassembly",
  "anti-emulation",
  "anti-memory-forensics",
  "anti-sandbox",
  "anti-vm",
  "captures-input-peripherals",
  "captures-output-peripherals",
  "captures-system-state-data",
  "cleans-traces-of-infection",
  "commits-fraud",
  "communicates-with-c2",
  "compromises-data-availability",
  "compromises-data-integrity",
  "compromises-system-availability",
  "controls-local-machine",
  "degrades-security-software",
  "degrades-system-updates",
  "determines-c2-server",
  "emails-spam",
  "escalates-privileges",
  "evades-av",
  "exfiltrates-data",
  "fingerprints-host",
  "hides-artifacts",
  "hides-executing-code",
  "infects-files",
  "infects-remote-machines",
  "installs-other-components",
  "persists-after-system-reboot",
  "prevents-artifact-access",
  "prevents-artifact-deletion",
  "probes-network-environment",
  "self-modifies",
  "steals-authentication-credentials",
  "violates-system-operational-integrity"
];

const malware_type_ov = [
  "adware",
  "backdoor",
  "bot",
  "bootkit",
  "ddos",
  "downloader",
  "dropper",
  "exploit-kit",
  "keylogger",
  "ransomware",
  "remote-access-trojan",
  "resource-exploitation",
  "rogue-security-software",
  "rootkit",
  "screen-capture",
  "spyware",
  "trojan",
  "unknown",
  "virus",
  "webshell",
  "wiper",
  "worm"
];

const pattern_type_ov = [
  "stix",
  "pcre",
  "sigma",
  "snort",
  "suricata",
  "yara"
];

const processor_architecture_ov = [
  "alpha",
  "arm",
  "ia-64",
  "mips",
  "powerpc",
  "sparc",
  "x86",
  "x86-64"
];

const region_ov = [
  "africa ",
  "eastern-africa",
  "middle-africa",
  "northern-africa",
  "southern-africa",
  "western-africa",
  "americas",
  "caribbean",
  "central-america",
  "latin-america-caribbean",
  "northern-america",
  "south-america",
  "asia ",
  "central-asia",
  "eastern-asia",
  "southern-asia",
  "south-eastern-asia",
  "western-asia",
  "europe ",
  "eastern-europe",
  "northern-europe",
  "southern-europe",
  "western-europe",
  "oceania",
  "antarctica",
  "australia-new-zealand",
  "melanesia",
  "micronesia",
  "polynesia"
];

const report_type_ov = [
  "attack-pattern",
  "campaign",
  "identity",
  "indicator",
  "intrusion-set",
  "malware",
  "observed-data",
  "threat-actor",
  "threat-report",
  "tool",
  "vulnerability"
];

const threat_actor_type_ov = [
  "activist",
  "competitor",
  "crime-syndicate",
  "criminal",
  "hacker",
  "insider-accidental",
  "insider-disgruntled",
  "nation-state",
  "sensationalist",
  "spy",
  "terrorist",
  "unknown"
];

const threat_actor_role_ov = [
  "agent",
  "director",
  "independent",
  "infrastructure-architect",
  "infrastructure-operator",
  "malware-author",
  "sponsor"
];

const threat_actor_sophistication_ov = [
  "none",
  "minimal",
  "intermediate",
  "advanced",
  "expert",
  "innovator",
  "strategic"
];

const tool_type_ov = [
  "denial-of-service",
  "exploitation",
  "information-gathering",
  "network-capture",
  "credential-exploitation",
  "remote-access",
  "vulnerability-scanning",
  "unknown"
];

// TODO: Uncomment once windows-pebinary-type-ov gets 
// referenced in schema.ts

// const windows_pebinary_type_ov = [
//   "dll",
//   "exe",
//   "sys"
// ];

export const open_vocab_options = {
  "account-type-ov": account_type_ov,
  "attack-motivation-ov": attack_motivation_ov,
  "attack-resource-level-ov": attack_resource_level_ov,
  "grouping-context-ov": grouping_context_ov,
  "hash-algorithm-ov": hash_algorithm_ov,
  "identity-class-ov": identity_class_ov,
  "implementation-language-ov": implementation_language_ov,
  "indicator-type-ov": indicator_type_ov,
  "industry-sector-ov": industry_sector_ov,
  "infrastructure-type-ov": infrastructure_type_ov,
  "malware-result-ov": malware_result_ov,
  "malware-capabilities-ov": malware_capabilities_ov,
  "malware-type-ov": malware_type_ov,
  "pattern-type-ov": pattern_type_ov,
  "processor-architecture-ov": processor_architecture_ov,
  "region-ov": region_ov,
  "report-type-ov": report_type_ov,
  "threat-actor-type-ov": threat_actor_type_ov,
  "threat-actor-role-ov": threat_actor_role_ov,
  "threat-actor-sophistication-ov": threat_actor_sophistication_ov,
  "tool-type-ov": tool_type_ov,
  // TODO: Uncomment once windows-pebinary-type-ov gets 
  // referenced in schema.ts
  // "windows-pebinary-type-ov": windows_pebinary_type_ov
}