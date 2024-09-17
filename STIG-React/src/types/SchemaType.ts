import { hash } from "crypto";


// export type SchemaType =
//   "String" | "EmbeddedList" | "Boolean" |
//   "Integer" | "DateTime" | "Binary" |
//   "EmbeddedMap" | "Float";

export type SchemaType =
  Binary | Boolean | Dictionary | external_reference | Float | Hashes | Hex |
  Identifier | Integer | kill_chain_phase | String | Timestamp | open_vocab | Enum |
  /*List |*/ granular_marking | email_mime_part_type | windows_registry_value_type | x509_v3_extensions_type;

export type s_SchemaType =
  "Binary" | "Boolean" | "Dictionary" | "external_reference" | "Float" | "Hashes" | "Hex" |
  "Identifier" | "Integer" | "kill_chain_phase" | "String" | "Timestamp" | "open_vocab" | "Enum" |
  "List" | "granular_marking" | "email_mime_part_type" | "windows_registry_value_type" | "x509_v3_extensions_type" | 'EmbeddedMap';

export type Binary = string;
export type Boolean = boolean;
export type Dictionary = {};
export type Float = number;
export type Hashes = { [key in hash_algorithm_ov]: string; };
export type Hex = string;
export type Identifier = string;
export type Integer = number;

export type List<T> = T[];
export type String = string;
export type Timestamp = string;

export type external_reference = {
  source_name: string
  description: string
  url: string
  hashes: Hashes
  external_id: string
};
export type kill_chain_phase = {
  kill_chain_name: string
  phase_name: string
};
export type granular_marking = {
  lang: String
  marking_ref: Identifier
  selectors: List<String>
}
export type email_mime_part_type = {
  body: String
  body_raw_ref: Identifier
  content_type: String
  content_disposition: String
}
export type windows_registry_value_type = {
  name: String
  data: String
  data_type: windows_registry_datatype_enum
}
export type x509_v3_extensions_type = {
  basic_constraints: String
  name_constraints: String
  policy_constraints: String
  key_usage: String
  extended_key_usage: String
  subject_key_identifier: String
  authority_key_identifier: String
  subject_alternative_name: String
  issuer_alternative_name: String
  subject_directory_attributes: String
  crl_distribution_points: String
  inhibit_any_policy: String
  private_key_usage_period_not_before: Identifier
  private_key_usage_period_not_after: Identifier
  certificate_policies: String
  policy_mappings: String
}


export type open_vocab =
  string | account_type_ov | attack_motivation_ov | attack_resource_level_ov | hash_algorithm_ov |
  identity_class_ov | implementation_language_ov | indicator_type_ov | industry_sector_ov |
  infrastructure_type_ov | malware_result_ov | malware_capabilities_ov | malware_type_ov |
  pattern_type_ov | processor_architecture_ov | region_ov | report_type_ov | threat_actor_type_ov |
  threat_actor_role_ov | threat_actor_sophistication_ov | tool_type_ov | windows_pebinary_type_ov | grouping_context_ov;

export type s_open_vocab =
  "string" | "account_type_ov" | "attack_motivation_ov" | "attack_resource_level_ov" | "hash_algorithm_ov" |
  "identity_class_ov" | "implementation_language_ov" | "indicator_type_ov" | "industry_sector_ov" |
  "infrastructure_type_ov" | "malware_result_ov" | "malware_capabilities_ov" | "malware_type_ov" |
  "pattern_type_ov" | "processor_architecture_ov" | "region_ov" | "report_type_ov" | "threat_actor_type_ov" |
  "threat_actor_role_ov" | "threat_actor_sophistication_ov" | "tool_type_ov" | "windows_pebinary_type_ov" | "grouping_context_ov";

export type Enum =
  encryption_algorithm_enum | extension_type_enum | network_socket_address_family_enum |
  network_socket_type_enum | opinion_enum | windows_integrity_level_enum |
  windows_registry_datatype_enum | windows_service_start_type_enum |
  windows_service_type_enum | windows_service_status_enum;

export type s_Enum =
  "encryption_algorithm_enum" | "extension_type_enum" | "network_socket_address_family_enum" |
  "network_socket_type_enum" | "opinion_enum" | "windows_integrity_level_enum" |
  "windows_registry_datatype_enum" | "windows_service_start_type_enum" |
  "windows_service_type_enum" | "windows_service_status_enum";


enum account_type_ov {
  facebook = "facebook",
  ldap = "ldap",
  nis = "nis",
  openid = "openid",
  radius = "radius",
  skype = "skype",
  tacacs = "tacacs",
  twitter = "twitter",
  unix = "unix",
  windows_local = "windows-local",
  windows_domain = "windows-domain",
}
enum attack_motivation_ov {
  accidental = "accidental",
  coercion = "coercion",
  dominance = "dominance",
  ideology = "ideology",
  notoriety = "notoriety",
  organizational_gain = "organizational-gain",
  personal_gain = "personal-gain",
  personal_satisfaction = "personal-satisfaction",
  revenge = "revenge",
  unpredictable = "unpredictable",
}
enum attack_resource_level_ov {
  individual = "individual",
  club = "club",
  contest = "contest",
  team = "team",
  organization = "organization",
  government = "government",
}
enum grouping_context_ov {
  suspicious_activity = "suspicious-activity",
  malware_analysis = "malware-analysis",
  unspecified = "unspecified",
}
enum hash_algorithm_ov {
  MD5 = "MD5",
  SHA_1 = "SHA-1",
  SHA_256 = "SHA-256",
  SHA_512 = "SHA-512",
  SHA3_256 = "SHA3-256",
  SHA3_512 = "SHA3-512",
  SSDEEP = "SSDEEP",
  TLSH = "TLSH",
}
enum identity_class_ov {
  individual = "individual",
  group = "group",
  system = "system",
  organization = "organization",
  class = "class",
  unknown = "unknown",
}
enum implementation_language_ov {
  applescript = "applescript",
  bash = "bash",
  c = "c",
  cpp = "c++",
  c_sharp = "c#",
  go = "go",
  java = "java",
  javascript = "javascript",
  lua = "lua",
  objective_c = "objective-c",
  perl = "perl",
  php = "php",
  powershell = "powershell",
  python = "python",
  ruby = "ruby",
  scala = "scala",
  swift = "swift",
  typescript = "typescript",
  visual_basic = "visual-basic",
  x86_32 = "x86-32",
  x86_64 = "x86-64",
}
enum indicator_type_ov {
  anomalous_activity = "anomalous-activity",
  anonymization = "anonymization",
  benign = "benign",
  compromised = "compromised",
  malicious_activity = "malicious-activity",
  attribution = "attribution",
  unknown = "unknown",
}
enum industry_sector_ov {
  agriculture = "agriculture",
  aerospace = "aerospace",
  automotive = "automotive",
  chemical = "chemical",
  commercial = "commercial",
  communications = "communications",
  construction = "construction",
  defense = "defense",
  education = "education",
  energy = "energy",
  entertainment = "entertainment",
  financial_services = "financial-services",
  government = "government ",
  emergency_services = "emergency-services",
  government_local = "government-local",
  government_national = "government-national",
  government_public_services = "government-public-services",
  government_regional = "government-regional",
  healthcare = "healthcare",
  hospitality_leisure = "hospitality-leisure",
  infrastructure = "infrastructure ",
  dams = "dams",
  nuclear = "nuclear",
  water = "water",
  insurance = "insurance",
  manufacturing = "manufacturing",
  mining = "mining",
  non_profit = "non-profit",
  pharmaceuticals = "pharmaceuticals",
  retail = "retail",
  technology = "technology",
  telecommunications = "telecommunications",
  transportation = "transportation",
  utilities = "utilities",
}
enum infrastructure_type_ov {
  amplification = "amplification",
  anonymization = "anonymization",
  botnet = "botnet",
  command_and_control = "command-and-control",
  exfiltration = "exfiltration",
  hosting_malware = "hosting-malware",
  hosting_target_lists = "hosting-target-lists",
  phishing = "phishing",
  reconnaissance = "reconnaissance",
  staging = "staging",
  unknown = "unknown",
}
enum malware_result_ov {
  malicious = "malicious",
  suspicious = "suspicious",
  benign = "benign ",
  unknown = "unknown",
}
enum malware_capabilities_ov {
  accesses_remote_machines = "accesses-remote-machines",
  anti_debugging = "anti-debugging",
  anti_disassembly = "anti-disassembly",
  anti_emulation = "anti-emulation",
  anti_memory_forensics = "anti-memory-forensics",
  anti_sandbox = "anti-sandbox",
  anti_vm = "anti-vm",
  captures_input_peripherals = "captures-input-peripherals",
  captures_output_peripherals = "captures-output-peripherals",
  captures_system_state_data = "captures-system-state-data",
  cleans_traces_of_infection = "cleans-traces-of-infection",
  commits_fraud = "commits-fraud",
  communicates_with_c2 = "communicates-with-c2",
  compromises_data_availability = "compromises-data-availability",
  compromises_data_integrity = "compromises-data-integrity",
  compromises_system_availability = "compromises-system-availability",
  controls_local_machine = "controls-local-machine",
  degrades_security_software = "degrades-security-software",
  degrades_system_updates = "degrades-system-updates",
  determines_c2_server = "determines-c2-server",
  emails_spam = "emails-spam",
  escalates_privileges = "escalates-privileges",
  evades_av = "evades-av",
  exfiltrates_data = "exfiltrates-data",
  fingerprints_host = "fingerprints-host",
  hides_artifacts = "hides-artifacts",
  hides_executing_code = "hides-executing-code",
  infects_files = "infects-files",
  infects_remote_machines = "infects-remote-machines",
  installs_other_components = "installs-other-components",
  persists_after_system_reboot = "persists-after-system-reboot",
  prevents_artifact_access = "prevents-artifact-access",
  prevents_artifact_deletion = "prevents-artifact-deletion",
  probes_network_environment = "probes-network-environment",
  self_modifies = "self-modifies",
  steals_authentication_credentials = "steals-authentication-credentials",
  violates_system_operational_integrity = "violates-system-operational-integrity",
}
enum malware_type_ov {
  adware = "adware",
  backdoor = "backdoor",
  bot = "bot",
  bootkit = "bootkit",
  ddos = "ddos",
  downloader = "downloader",
  dropper = "dropper",
  exploit_kit = "exploit-kit",
  keylogger = "keylogger",
  ransomware = "ransomware",
  remote_access_trojan = "remote-access-trojan",
  resource_exploitation = "resource-exploitation",
  rogue_security_software = "rogue-security-software",
  rootkit = "rootkit",
  screen_capture = "screen-capture",
  spyware = "spyware",
  trojan = "trojan",
  unknown = "unknown",
  virus = "virus",
  webshell = "webshell",
  wiper = "wiper",
  worm = "worm",
}
enum pattern_type_ov {
  stix = "stix",
  pcre = "pcre",
  sigma = "sigma",
  snort = "snort",
  suricata = "suricata",
  yara = "yara",
}
enum processor_architecture_ov {
  alpha = "alpha",
  arm = "arm",
  ia_64 = "ia-64",
  mips = "mips",
  powerpc = "powerpc",
  sparc = "sparc",
  x86 = "x86",
  x86_64 = "x86-64",
}
enum region_ov {
  africa = "africa ",
  eastern_africa = "eastern-africa",
  middle_africa = "middle-africa",
  northern_africa = "northern-africa",
  southern_africa = "southern-africa",
  western_africa = "western-africa",
  americas = "americas ",
  caribbean = "caribbean",
  central_america = "central-america",
  latin_america_caribbean = "latin-america-caribbean",
  northern_america = "northern-america",
  south_america = "south-america",
  asia = "asia ",
  central_asia = "central-asia",
  eastern_asia = "eastern-asia",
  southern_asia = "southern-asia",
  south_eastern_asia = "south-eastern-asia",
  western_asia = "western-asia",
  europe = "europe ",
  eastern_europe = "eastern-europe",
  northern_europe = "northern-europe",
  southern_europe = "southern-europe",
  western_europe = "western-europe",
  oceania = "oceania ",
  antarctica = "antarctica",
  australia_new_zealand = "australia-new-zealand",
  melanesia = "melanesia",
  micronesia = "micronesia",
  polynesia = "polynesia",
}
enum report_type_ov {
  attack_pattern = "attack-pattern",
  campaign = "campaign",
  identity = "identity",
  indicator = "indicator",
  intrusion_set = "intrusion-set",
  malware = "malware",
  observed_data = "observed-data",
  threat_actor = "threat-actor",
  threat_report = "threat-report",
  tool = "tool",
  vulnerability = "vulnerability",
}
enum threat_actor_type_ov {
  activist = "activist",
  competitor = "competitor",
  crime_syndicate = "crime-syndicate",
  criminal = "criminal",
  hacker = "hacker",
  insider_accidental = "insider-accidental",
  insider_disgruntled = "insider-disgruntled",
  nation_state = "nation-state",
  sensationalist = "sensationalist",
  spy = "spy",
  terrorist = "terrorist",
  unknown = "unknown",
}
enum threat_actor_role_ov {
  agent = "agent",
  director = "director",
  independent = "independent",
  infrastructure_architect = "infrastructure-architect",
  infrastructure_operator = "infrastructure-operator",
  malware_author = "malware-author",
  sponsor = "sponsor",
}
enum threat_actor_sophistication_ov {
  none = "none",
  minimal = "minimal",
  intermediate = "intermediate",
  advanced = "advanced",
  expert = "expert",
  innovator = "innovator",
  strategic = "strategic",
}
enum tool_type_ov {
  denial_of_service = "denial-of-service",
  exploitation = "exploitation",
  information_gathering = "information-gathering",
  network_capture = "network-capture",
  credential_exploitation = "credential-exploitation",
  remote_access = "remote-access",
  vulnerability_scanning = "vulnerability-scanning",
  unknown = "unknown",
}
enum windows_pebinary_type_ov {
  dll = "dll",
  exe = "exe",
  sys = "sys",
}

enum encryption_algorithm_enum {
  AES_256_GCM = "AES-256-GCM",
  ChaCha20_Poly1305 = "ChaCha20-Poly1305",
  mime_type_indicated = "mime-type-indicated",
}
enum extension_type_enum {
  new_sdo = "new-sdo",
  new_sco = "new-sco",
  new_sro = "new-sro",
  property_extension = "property-extension",
  toplevel_property_extension = "toplevel-property-extension",
}
enum network_socket_address_family_enum {
  AF_UNSPEC = "AF_UNSPEC",
  AF_INET = "AF_INET",
  AF_IPX = "AF_IPX",
  AF_APPLETALK = "AF_APPLETALK",
  AF_NETBIOS = "AF_NETBIOS",
  AF_INET6 = "AF_INET6",
  AF_IRDA = "AF_IRDA",
  AF_BTH = "AF_BTH",
}
enum network_socket_type_enum {
  SOCK_STREAM = "SOCK_STREAM",
  AF_ISOCK_DGRAMNET = "AF_ISOCK_DGRAMNET",
  SOCK_RAW = "SOCK_RAW",
  SOCK_RDM = "SOCK_RDM",
  SOCK_SEQPACKET = "SOCK_SEQPACKET",
}
enum opinion_enum {
  strongly_disagree = "strongly-disagree",
  disagree = "disagree",
  neutral = "neutral",
  agree = "agree",
  strongly_agree = "strongly-agree",
}
enum windows_integrity_level_enum {
  low = "low",
  medium = "medium",
  high = "high",
  system = "system",
}
enum windows_registry_datatype_enum {
  REG_NONE = "REG_NONE",
  REG_SZ = "REG_SZ",
  REG_EXPAND_SZ = "REG_EXPAND_SZ",
  REG_BINARY = "REG_BINARY",
  REG_DWORD = "REG_DWORD",
  REG_DWORD_BIG_ENDIAN = "REG_DWORD_BIG_ENDIAN",
  REG_DWORD_LITTLE_ENDIAN = "REG_DWORD_LITTLE_ENDIAN",
  REG_LINK = "REG_LINK",
  REG_MULTI_SZ = "REG_MULTI_SZ",
  REG_RESOURCE_LIST = "REG_RESOURCE_LIST",
  REG_FULL_RESOURCE_DESCRIPTION = "REG_FULL_RESOURCE_DESCRIPTION",
  REG_RESOURCE_REQUIREMENTS_LIST = "REG_RESOURCE_REQUIREMENTS_LIST",
  REG_QWORD = "REG_QWORD",
  REG_INVALID_TYPE = "REG_INVALID_TYPE",
}
enum windows_service_start_type_enum {
  SERVICE_AUTO_START = "SERVICE_AUTO_START",
  SERVICE_BOOT_START = "SERVICE_BOOT_START",
  SERVICE_DEMAND_START = "SERVICE_DEMAND_START",
  SERVICE_DISABLED = "SERVICE_DISABLED",
  SERVICE_SYSTEM_ALERT = "SERVICE_SYSTEM_ALERT",
}
enum windows_service_type_enum {
  SERVICE_KERNEL_DRIVER = "SERVICE_KERNEL_DRIVER",
  SERVICE_FILE_SYSTEM_DRIVER = "SERVICE_FILE_SYSTEM_DRIVER",
  SERVICE_WIN32_OWN_PROCESS = "SERVICE_WIN32_OWN_PROCESS",
  SERVICE_WIN32_SHARE_PROCESS = "SERVICE_WIN32_SHARE_PROCESS",
}
enum windows_service_status_enum {
  SERVICE_CONTINUE_PENDING = "SERVICE_CONTINUE_PENDING",
  SERVICE_PAUSE_PENDING = "SERVICE_PAUSE_PENDING",
  SERVICE_PAUSED = "SERVICE_PAUSED",
  SERVICE_RUNNING = "SERVICE_RUNNING",
  SERVICE_START_PENDING = "SERVICE_START_PENDING",
  SERVICE_STOP_PENDING = "SERVICE_STOP_PENDING",
  SERVICE_STOPPED = "SERVICE_STOPPED",
}

