// These variables contain the options that will
// populate the various enum selection lists
// for the enumTypes in schema.ts

const encryption_algorithm_enum = [
  "AES-256-GCM",
  "ChaCha20-Poly1305",
  "mime-type-indicated"
];

const extension_type_enum = [
  "new-sdo",
  "new-sco",
  "new-sro",
  "property-extension",
  "toplevel-property-extension"
];

// TODO: Uncomment once network-socket-address-family-enum, 
// network-socket-type-enum get referenced in schema.ts

// const network_socket_address_family_enum = [
//   "AF_UNSPEC",
//   "AF_INET",
//   "AF_IPX",
//   "AF_APPLETALK",
//   "AF_NETBIOS",
//   "AF_INET6",
//   "AF_IRDA",
//   "AF_BTH"
// ];

// const network_socket_type_enum = [
//   "SOCK_STREAM",
//   "AF_ISOCK_DGRAMNET",
//   "SOCK_RAW",
//   "SOCK_RDM",
//   "SOCK_SEQPACKET"
// ];

const opinion_enum = [
  "strongly-disagree",
  "disagree",
  "neutral",
  "agree",
  "strongly-agree"
];

// TODO Uncomment once windows-integrity-level-enum,
// windows-registry-datatype-enum, windows-service-start-type-enum,
// windows-service-type-enum, windows-service-status-enum
// get referenced in schema.ts

// const windows_integrity_level_enum = [
//   "low",
//   "medium",
//   "high",
//   "system"
// ];

// const windows_registry_datatype_enum = [
//   "REG_NONE",
//   "REG_SZ",
//   "REG_EXPAND_SZ",
//   "REG_BINARY",
//   "REG_DWORD",
//   "REG_DWORD_BIG_ENDIAN",
//   "REG_DWORD_LITTLE_ENDIAN",
//   "REG_LINK",
//   "REG_MULTI_SZ",
//   "REG_RESOURCE_LIST",
//   "REG_FULL_RESOURCE_DESCRIPTION",
//   "REG_RESOURCE_REQUIREMENTS_LIST",
//   "REG_QWORD",
//   "REG_INVALID_TYPE"
// ];

// const windows_service_start_type_enum = [
//   "SERVICE_AUTO_START",
//   "SERVICE_BOOT_START",
//   "SERVICE_DEMAND_START",
//   "SERVICE_DISABLED",
//   "SERVICE_SYSTEM_ALERT"
// ];

// const windows_service_type_enum = [
//   "SERVICE_KERNEL_DRIVER",
//   "SERVICE_FILE_SYSTEM_DRIVER",
//   "SERVICE_WIN32_OWN_PROCESS",
//   "SERVICE_WIN32_SHARE_PROCESS"
// ];

// const windows_service_status_enum = [
//   "SERVICE_CONTINUE_PENDING",
//   "SERVICE_PAUSE_PENDING",
//   "SERVICE_PAUSED",
//   "SERVICE_RUNNING",
//   "SERVICE_START_PENDING",
//   "SERVICE_STOP_PENDING",
//   "SERVICE_STOPPED"
// ];

export const enum_options = {
  "encryption-algorithm-enum": encryption_algorithm_enum,
  "extension-type-enum": extension_type_enum,
  // TODO: Uncomment once network-socket-address-family-enum, 
  // network-socket-type-enum get referenced in schema.ts
  // "network-socket-address-family-enum": network_socket_address_family_enum,
  // "network-socket-type-enum": network_socket_type_enum,
  "opinion-enum": opinion_enum,
  // TODO Uncomment once windows-integrity-level-enum,
  // windows-registry-datatype-enum, windows-service-start-type-enum,
  // windows-service-type-enum, windows-service-status-enum
  // get referenced in schema.ts
  // "windows-integrity-level-enum": windows_integrity_level_enum,
  // "windows-registry-datatype-enum": windows_registry_datatype_enum,
  // "windows-service-start-type-enum": windows_service_start_type_enum,
  // "windows-service-type-enum": windows_service_type_enum,
  // "windows-service-status-enum": windows_service_status_enum
}