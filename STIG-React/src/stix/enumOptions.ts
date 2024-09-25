// These enums contain the options that will
// populate the various enum selection lists
// for the enumTypes in schema.ts

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

// TODO: Uncomment once network_socket_address_family_enum, 
// network_socket_type_enum get referenced in schema.ts

// enum network_socket_address_family_enum {
//   AF_UNSPEC = "AF_UNSPEC",
//   AF_INET = "AF_INET",
//   AF_IPX = "AF_IPX",
//   AF_APPLETALK = "AF_APPLETALK",
//   AF_NETBIOS = "AF_NETBIOS",
//   AF_INET6 = "AF_INET6",
//   AF_IRDA = "AF_IRDA",
//   AF_BTH = "AF_BTH",
// }

// enum network_socket_type_enum {
//   SOCK_STREAM = "SOCK_STREAM",
//   AF_ISOCK_DGRAMNET = "AF_ISOCK_DGRAMNET",
//   SOCK_RAW = "SOCK_RAW",
//   SOCK_RDM = "SOCK_RDM",
//   SOCK_SEQPACKET = "SOCK_SEQPACKET",
// }

enum opinion_enum {
  strongly_disagree = "strongly-disagree",
  disagree = "disagree",
  neutral = "neutral",
  agree = "agree",
  strongly_agree = "strongly-agree",
}

// TODO Uncomment once windows_integrity_level_enum,
// windows_registry_datatype_enum, windows_service_start_type_enum,
// windows_service_type_enum, windows_service_status_enum
// get referenced in schema.ts

// enum windows_integrity_level_enum {
//   low = "low",
//   medium = "medium",
//   high = "high",
//   system = "system",
// }

// enum windows_registry_datatype_enum {
//   REG_NONE = "REG_NONE",
//   REG_SZ = "REG_SZ",
//   REG_EXPAND_SZ = "REG_EXPAND_SZ",
//   REG_BINARY = "REG_BINARY",
//   REG_DWORD = "REG_DWORD",
//   REG_DWORD_BIG_ENDIAN = "REG_DWORD_BIG_ENDIAN",
//   REG_DWORD_LITTLE_ENDIAN = "REG_DWORD_LITTLE_ENDIAN",
//   REG_LINK = "REG_LINK",
//   REG_MULTI_SZ = "REG_MULTI_SZ",
//   REG_RESOURCE_LIST = "REG_RESOURCE_LIST",
//   REG_FULL_RESOURCE_DESCRIPTION = "REG_FULL_RESOURCE_DESCRIPTION",
//   REG_RESOURCE_REQUIREMENTS_LIST = "REG_RESOURCE_REQUIREMENTS_LIST",
//   REG_QWORD = "REG_QWORD",
//   REG_INVALID_TYPE = "REG_INVALID_TYPE",
// }

// enum windows_service_start_type_enum {
//   SERVICE_AUTO_START = "SERVICE_AUTO_START",
//   SERVICE_BOOT_START = "SERVICE_BOOT_START",
//   SERVICE_DEMAND_START = "SERVICE_DEMAND_START",
//   SERVICE_DISABLED = "SERVICE_DISABLED",
//   SERVICE_SYSTEM_ALERT = "SERVICE_SYSTEM_ALERT",
// }

// enum windows_service_type_enum {
//   SERVICE_KERNEL_DRIVER = "SERVICE_KERNEL_DRIVER",
//   SERVICE_FILE_SYSTEM_DRIVER = "SERVICE_FILE_SYSTEM_DRIVER",
//   SERVICE_WIN32_OWN_PROCESS = "SERVICE_WIN32_OWN_PROCESS",
//   SERVICE_WIN32_SHARE_PROCESS = "SERVICE_WIN32_SHARE_PROCESS",
// }

// enum windows_service_status_enum {
//   SERVICE_CONTINUE_PENDING = "SERVICE_CONTINUE_PENDING",
//   SERVICE_PAUSE_PENDING = "SERVICE_PAUSE_PENDING",
//   SERVICE_PAUSED = "SERVICE_PAUSED",
//   SERVICE_RUNNING = "SERVICE_RUNNING",
//   SERVICE_START_PENDING = "SERVICE_START_PENDING",
//   SERVICE_STOP_PENDING = "SERVICE_STOP_PENDING",
//   SERVICE_STOPPED = "SERVICE_STOPPED",
// }
