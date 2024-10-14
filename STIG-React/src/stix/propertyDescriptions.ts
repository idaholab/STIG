import { SchemaSTIXPropertyDescription } from "../types/stixSchemaTypes/SchemaSTIXPropertyDescription";

export const propertyDescriptions: SchemaSTIXPropertyDescription[] = [
    {
        name: 'core',
        superClasses: [],
        properties: {
            type: "The type property identifies the type of STIX Object (SDO, Relationship Object, etc). The value of the type field MUST be one of the types defined by a STIX Object (e.g., indicator).",
            spec_version: "The version of the STIX specification used to represent this object.",
            id: "The id property universally and uniquely identifies this object.",
            created_by_ref: "The ID of the Source object that describes who created this object.",
            labels: "The labels property specifies a set of terms used to describe this object.",
            created: "The created property represents the time at which the first version of this object was created. The timstamp value MUST be precise to the nearest millisecond.",
            modified: "The modified property represents the time that this particular version of the object was modified. The timstamp value MUST be precise to the nearest millisecond.",
            revoked: "The revoked property indicates whether the object has been revoked.",
            confidence: "Identifies the confidence that the creator has in the correctness of their data.",
            lang: "Identifies the language of the text content in this object.",
            external_references: "A list of external references which refers to non-STIX information.",
            object_marking_refs: "The list of marking-definition objects to be applied to this object.",
            granular_markings: "The set of granular markings that apply to this object.",
            extensions: "Specifies any extensions of the object, as a dictionary.",
        }
    },
    {
        name: 'cyber-observable-core',
        superClasses: [],
        properties: {
            type: "Indicates that this object is an Observable Object. The value of this property MUST be a valid Observable Object type name, but to allow for custom objects this has been removed from the schema.",
            spec_version: "The version of the STIX specification used to represent the content in this cyber-observable.",
            object_marking_refs: "The list of marking-definition objects to be applied to this object.",
            granular_markings: "The set of granular markings that apply to this object.",
            defanged: "Defines whether or not the data contained within the object has been defanged.",
            id: "Specifies the identifier of the observable object, as a string.",
            extensions: "Specifies any extensions of the object, as a dictionary.",
        }
    },
    {
        name: 'relationship',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `relationship`.",
            relationship_type: "The name used to identify the type of relationship.",
            description: "A description that helps provide context about the relationship.",
            source_ref: "The ID of the source (from) object.",
            target_ref: "The ID of the target (to) object.",
            start_time: "This optional timestamp represents the earliest time at which the Relationship between the objects exists. If this property is a future timestamp, at the time the updated property is defined, then this represents an estimate by the producer of the intelligence of the earliest time at which relationship will be asserted to be true.",
            stop_time: "The latest time at which the Relationship between the objects exists. If this property is a future timestamp, at the time the updated property is defined, then this represents an estimate by the producer of the intelligence of the latest time at which relationship will be asserted to be true.",
        }
    },
    {
        name: 'sighting',
        superClasses: [],
        properties: {
            type: "The type of this object, which MUST be the literal `sighting`.",
            description: "A description that provides more details and context about the Sighting.",
            first_seen: "The beginning of the time window during which the SDO referenced by the sighting_of_ref property was sighted.",
            last_seen: "The end of the time window during which the SDO referenced by the sighting_of_ref property was sighted.",
            count: "This is an integer between 0 and 999,999,999 inclusive and represents the number of times the object was sighted.",
            sighting_of_ref: "An ID reference to the object that has been sighted.",
            observed_data_refs: "A list of ID references to the Observed Data objects that contain the raw cyber data for this Sighting.",
            where_sighted_refs: "A list of ID references to the Identity or Location objects describing the entities or types of entities that saw the sighting.",
            summary: "The summary property indicates whether the Sighting should be considered summary data. ",
        }
    },
    {
        name: 'language-meta-core',
        superClasses: [],
        properties: {
            type: "The type of this object, which MUST be the literal `language-content`.",
            spec_version: "The version of the STIX specification used to represent this object.",
            id: "The id property universally and uniquely identifies this object.",
            created_by_ref: "The ID of the Source object that describes who created this object.",
            labels: "The labels property specifies a set of terms used to describe this object.",
            created: "The created property represents the time at which the first version of this object was created. The timstamp value MUST be precise to the nearest millisecond.",
            modified: "The modified property represents the time that this particular version of the object was modified. The timstamp value MUST be precise to the nearest millisecond.",
            revoked: "The revoked property indicates whether the object has been revoked.",
            confidence: "Identifies the confidence that the creator has in the correctness of their data.",
            external_references: "A list of external references which refers to non-STIX information.",
            object_marking_refs: "The list of marking-definition objects to be applied to this object.",
            granular_markings: "The set of granular markings that apply to this object.",
        }
    },
    {
        name: 'marking-meta-core',
        superClasses: [],
        properties: {
            type: "The type of this object, which MUST be the literal `marking-definition`.",
            spec_version: "The version of the STIX specification used to represent this object.",
            id: "The id property universally and uniquely identifies this object.",
            name: "A name used to identify the Marking Definition.",
            created_by_ref: "The created_by_ref property specifies the ID of the identity object that describes the entity that created this Marking Definition.",
            created: "The created property represents the time at which the first version of this Marking Definition object was created.",
            external_references: "A list of external references which refers to non-STIX information.",
            object_marking_refs: "The object_marking_refs property specifies a list of IDs of marking-definition objects that apply to this Marking Definition.",
            granular_markings: "The granular_markings property specifies a list of granular markings applied to this object.",
            extensions: "Specifies any extensions of the object, as a dictionary.",
        }
    },
    {
        name: 'artifact',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `artifact`.",
            mime_type: "The value of this property MUST be a valid MIME type as specified in the IANA Media Types registry.",
            payload_bin: "Specifies the binary data contained in the artifact as a base64-encoded string.",
            url: "The value of this property MUST be a valid URL that resolves to the unencoded content.",
            hashes: "Specifies a dictionary of hashes for the contents of the url or the payload_bin.  This MUST be provided when the url property is present.",
            encryption_algorithm: "If the artifact is encrypted, specifies the type of encryption algorithm the binary data  (either via payload_bin or url) is encoded in.",
            decryption_key: "Specifies the decryption key for the encrypted binary data (either via payload_bin or url).",
        }
    },
    {
        name: 'attack-pattern',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `attack-pattern`.",
            aliases: "Alternative names used to identify this Attack Pattern.",
            name: "The name used to identify the Attack Pattern.",
            description: "A description that provides more details and context about the Attack Pattern, potentially including its purpose and its key characteristics.",
            kill_chain_phases: "The list of kill chain phases for which this attack pattern is used.",
        }
    },
    {
        name: 'autonomous-system',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `autonomous-system`.",
            number: "Specifies the number assigned to the AS. Such assignments are typically performed by a Regional Internet Registries (RIR).",
            name: "Specifies the name of the AS.",
            rir: "Specifies the name of the Regional Internet Registry (RIR) that assigned the number to the AS.",
        }
    },
    {
        name: 'campaign',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `campaign`.",
            name: "The name used to identify the Campaign.",
            description: "A description that provides more details and context about the Campaign, potentially including its purpose and its key characteristics.",
            aliases: "Alternative names used to identify this campaign.",
            first_seen: "The time that this Campaign was first seen.",
            last_seen: "The time that this Campaign was last seen.",
            objective: "This field defines the Campaign's primary goal, objective, desired outcome, or intended effect.",
        }
    },
    {
        name: 'course-of-action',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `course-of-action`.",
            name: "The name used to identify the Course of Action.",
            description: "A description that provides more details and context about this object, potentially including its purpose and its key characteristics.",
        }
    },
    {
        name: 'directory',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `directory`.",
            path: "Specifies the path, as originally observed, to the directory on the file system.",
            path_enc: "Specifies the observed encoding for the path.",
            ctime: "Specifies the date/time the directory was created.",
            mtime: "Specifies the date/time the directory was last written to/modified.",
            atime: "Specifies the date/time the directory was last accessed.",
            contains_refs: "Specifies a list of references to other File and/or Directory Objects contained within the directory.",
        }
    },
    {
        name: 'domain-name',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `domain-name`.",
            value: "Specifies the value of the domain name.",
            resolves_to_refs: "Specifies a list of references to one or more IP addresses or domain names that the domain name resolves to.",
        }
    },
    {
        name: 'email-addr',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `email-addr`.",
            value: "Specifies a single email address. This MUST not include the display name.",
            display_name: "Specifies a single email display name, i.e., the name that is displayed to the human user of a mail application.",
            belongs_to_ref: "Specifies the user account that the email address belongs to, as a reference to a User Account Object.",
        }
    },
    {
        name: 'email-message',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `email-message`.",
            date: "Specifies the date/time that the email message was sent.",
            content_type: "Specifies the value of the 'Content-Type' header of the email message.",
            from_ref: "Specifies the value of the 'From:' header of the email message.",
            sender_ref: "Specifies the value of the 'From' field of the email message.",
            to_refs: "Specifies the mailboxes that are 'To:' recipients of the email message.",
            cc_refs: "Specifies the mailboxes that are 'CC:' recipients of the email message.",
            bcc_refs: "Specifies the mailboxes that are 'BCC:' recipients of the email message.",
            message_id: "Specifies the Message-ID field of the email message.",
            subject: "Specifies the subject of the email message.",
            received_lines: "Specifies one or more Received header fields that may be included in the email headers.",
            additional_header_fields: "Specifies any other header fields found in the email message, as a dictionary.",
            raw_email_ref: "Specifies the raw binary contents of the email message, including both the headers and body, as a reference to an Artifact Object.",
            is_multipart: "Indicates whether the email body contains multiple MIME parts.",
            body: "Specifies a string containing the email body. This field MAY only be used if is_multipart is false.",
            body_multipart: "Specifies a list of the MIME parts that make up the email body. This property MAY only be used if is_multipart is true."
        }
    },
    {
        name: 'extension-definition',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `extension-definition`.",
            name: "A name used for display purposes during execution, development, or debugging.",
            description: "A detailed explanation of what data the extension conveys and how it is intended to be used.",
            schema: "The normative definition of the extension, either as a URL or as plain text explaining the definition.",
            version: "The version of this extension.",
            extension_types: "Which extension types are contained within this extension.",
            extension_properties: "The list of new property names that are added to an object by this extension",
        }
    },
    {
        name: 'file',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `file`.",
            extensions: "The File Object defines the following extensions. In addition to these, producers MAY create their own. Extensions: ntfs-ext, raster-image-ext, pdf-ext, archive-ext, windows-pebinary-ext",
            hashes: "Specifies a dictionary of hashes for the file.",
            size: "Specifies the size of the file, in bytes, as a non-negative integer.",
            name: "Specifies the name of the file.",
            name_enc: "Specifies the observed encoding for the name of the file.",
            magic_number_hex: "Specifies the hexadecimal constant ('magic number') associated with a specific file format that corresponds to the file, if applicable.",
            mime_type: "Specifies the MIME type name specified for the file, e.g., 'application/msword'.",
            ctime: "Specifies the date/time the file was created.",
            mtime: "Specifies the date/time the file was last written to/modified.",
            atime: "Specifies the date/time the file was last accessed.",
            parent_directory_ref: "Specifies the parent directory of the file, as a reference to a Directory Object.",
            contains_refs: "Specifies a list of references to other Observable Objects contained within the file.",
            content_ref: "Specifies the content of the file, represented as an Artifact Object.",
        }
    },
    {
        name: 'grouping',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `grouping`.",
            name: "A name used to identify the Grouping.",
            description: "A description which provides more details and context about the Grouping, potentially including the purpose and key characteristics.",
            context: "A short description of the particular context shared by the content referenced by the Grouping.",
            object_refs: "The STIX Objects (SDOs and SROs) that  are referred to by this Grouping.",
        }
    },
    {
        name: 'identity',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `identity`.",
            roles: "The list of roles that this Identity performs (e.g., CEO, Domain Administrators, Doctors, Hospital, or Retailer). No open vocabulary is yet defined for this property.",
            name: "The name of this Identity.",
            description: "A description that provides more details and context about the Identity.",
            identity_class: "The type of entity that this Identity describes, e.g., an individual or organization. Open Vocab - identity-class-ov",
            sectors: "The list of sectors that this Identity belongs to. Open Vocab - industry-sector-ov",
            contact_information: "The contact information (e-mail, phone number, etc.) for this Identity.",
        }
    },
    {
        name: 'indicator',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `indicator`.",
            indicator_types: "This field is an Open Vocabulary that specifies the type of indicator. Open vocab - indicator-type-ov",
            name: "The name used to identify the Indicator.",
            description: "A description that provides the recipient with context about this Indicator potentially including its purpose and its key characteristics.",
            pattern: "The detection pattern for this indicator.",
            pattern_type: "The type of pattern used in this indicator.",
            pattern_version: "The version of the pattern that is used.",
            valid_from: "The time from which this indicator should be considered valuable intelligence.",
            valid_until: "The time at which this indicator should no longer be considered valuable intelligence.",
            kill_chain_phases: "The phases of the kill chain that this indicator detects.",
        }
    },
    {
        name: 'infrastructure',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `infrastructure`.",
            name: "The name used to identify the Infrastructure.",
            description: "A description that provides more details and context about this Infrastructure potentially including its purpose and its key characteristics.",
            infrastructure_types: "This field is an Open Vocabulary that specifies the type of infrastructure. Open vocab - infrastructure-type-ov",
            aliases: "Alternative names used to identify this Infrastructure.",
            kill_chain_phases: "The list of kill chain phases for which this infrastructure is used.",
            first_seen: "The time that this infrastructure was first seen performing malicious activities.",
            last_seen: "The time that this infrastructure was last seen performing malicious activities.",
        }
    },
    {
        name: 'intrusion-set',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `intrusion-set`.",
            name: "The name used to identify the Intrusion Set.",
            description: "Provides more context and details about the Intrusion Set object.",
            aliases: "Alternative names used to identify this Intrusion Set.",
            first_seen: "The time that this Intrusion Set was first seen.",
            last_seen: "The time that this Intrusion Set was last seen.",
            goals: "The high level goals of this Intrusion Set, namely, what are they trying to do.",
            resource_level: "This defines the organizational level at which this Intrusion Set typically works. Open Vocab - attack-resource-level-ov",
            primary_motivation: "The primary reason, motivation, or purpose behind this Intrusion Set. Open Vocab - attack-motivation-ov",
            secondary_motivations: "The secondary reasons, motivations, or purposes behind this Intrusion Set. Open Vocab - attack-motivation-ov",
        }
    },
    {
        name: 'ipv4-addr',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `ipv4-addr`.",
            value: "Specifies one or more IPv4 addresses expressed using CIDR notation.",
            resolves_to_refs: "Specifies a list of references to one or more Layer 2 Media Access Control (MAC) addresses that the IPv4 address resolves to.",
            belongs_to_refs: "Specifies a reference to one or more autonomous systems (AS) that the IPv4 address belongs to.",
        }
    },
    {
        name: 'ipv6-addr',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `ipv6-addr`.",
            value: "Specifies one or more IPv6 addresses expressed using CIDR notation.",
            resolves_to_refs: "Specifies a list of references to one or more Layer 2 Media Access Control (MAC) addresses that the IPv6 address resolves to.",
            belongs_to_refs: "Specifies a reference to one or more autonomous systems (AS) that the IPv6 address belongs to.",
        }
    },
    {
        name: 'language-content',
        superClasses: ['language-meta-core'],
        properties: {
            object_ref: "Identifies the object that this Language Content applies to.",
            object_modified: "Identifies the modified time of the object that this Language Content applies to.",
            contents: "Contains the actual Language Content (translation).",
        }
    },
    {
        name: 'location',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `location`.",
            description: "A textual description of the Location.",
            name: "A name used to identify the Location.",
            latitude: "The latitude of the Location in decimal degrees.",
            longitude: "The longitude of the Location in decimal degrees.",
            precision: "Defines the precision of the coordinates specified by the latitude and longitude properties, measured in meters.",
            region: "The region that this Location describes.",
            country: "The country that this Location describes.",
            administrative_area: "The state, province, or other sub-national administrative area that this Location describes.",
            city: "The city that this Location describes.",
            street_address: "The street address that this Location describes.",
            postal_code: "The postal code for this Location.",
        }
    },
    {
        name: 'mac-addr',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `mac-addr`.",
            value: "Specifies one or more mac addresses expressed using CIDR notation.",
        }
    },
    {
        name: 'malware',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `malware`.",
            aliases: "Alternative names used to identify this Malware or Malware family.",
            first_seen: "The time that the malware instance or family was first seen.",
            last_seen: "The time that the malware family or malware instance was last seen.",
            operating_system_refs: "The operating systems that the malware family or malware instance is executable on.",
            architecture_execution_envs: "The processor architectures (e.g., x86, ARM, etc.) that the malware instance or family is executable on. Open Vocab - processor-architecture-os.",
            implementation_languages: "The programming language(s) used to implement the malware instance or family. Open Vocab - implementation-language-ov.",
            capabilities: "Specifies any capabilities identified for the malware instance or family. Open Vocab - malware-capabilities-ov.",
            sample_refs: "The sample_refs property specifies a list of identifiers of the SCO file or artifact objects associated with this malware instance(s) or family.",
            malware_types: "The type of malware being described. Open Vocab - malware-type-ov",
            name: "The name used to identify the Malware.",
            description: "Provides more context and details about the Malware object.",
            kill_chain_phases: "The list of kill chain phases for which this Malware instance can be used.",
            is_family: "Whether the object represents a malware family (if true) or a malware instance (if false)."
        }
    },
    {
        name: 'malware-analysis',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `malware-analysis`.",
            product: "The name of the analysis engine or product that was used for this analysis.",
            version: "The version of the analysis product that was used to perform this analysis.",
            configuration_version: "The version of the analysis product configuration that was used to perform this analysis.",
            modules: "The particular analysis product modules that were used to perform the analysis.",
            analysis_engine_version: "The version of the analysis engine or product that was used to perform this analysis.",
            analysis_definition_version: "The version of the analysis definitions used by the analysis tool.",
            submitted: "The date and time that this malware was first submitted for scanning or analysis.",
            analysis_started: "The date and time that the malware analysis was initiated.",
            analysis_ended: "The date and time that the malware analysis ended.",
            result_name: "The classification result or name assigned to the malware instance by the scanner tool.",
            result: "The classification result as determined by the scanner or tool analysis process.",
            host_vm_ref: "A description of the virtual machine environment used to host the guest operating system (if applicable) that was used for the dynamic analysis of the malware instance or family.",
            operating_system_ref: "The operating system that was used to perform the dynamic analysis.",
            installed_software_refs: "Any non-standard software installed on the operating system used for the dynamic analysis of the malware instance or family.",
            analysis_sco_refs: "The list of STIX objects that were captured during the analysis process.",
            sample_ref: "Refers to the object this analysis was performed against.",
        }
    },
    {
        name: 'marking-definition',
        superClasses: ['marking-meta-core'],
        properties: {
            name: "A name used to identify this TLP Marking Definition.",
            definition_type: "The definition_type property identifies the type of Marking Definition.",
            definition: "The definition property contains the marking object itself.",
        }
    },
    {
        name: 'mutex',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `mutex`.",
            name: "Specifies the name of the mutex object.",
        }
    },
    {
        name: 'network-traffic',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `network-traffic`.",
            extensions: "The Network Traffic Object defines the following extensions. In addition to these, producers MAY create their own. Extensions: http-ext, tcp-ext, icmp-ext, socket-ext",
            start: "Specifies the date/time the network traffic was initiated, if known.",
            end: "Specifies the date/time the network traffic ended, if known.",
            src_ref: "Specifies the source of the network traffic, as a reference to an Observable Object.",
            dst_ref: "Specifies the destination of the network traffic, as a reference to an Observable Object.",
            src_port: "Specifies the source port used in the network traffic, as an integer. The port value MUST be in the range of 0 - 65535.",
            dst_port: "Specifies the destination port used in the network traffic, as an integer. The port value MUST be in the range of 0 - 65535.",
            protocols: "Specifies the protocols observed in the network traffic, along with their corresponding state.",
            src_byte_count: "Specifies the number of bytes sent from the source to the destination.",
            dst_byte_count: "Specifies the number of bytes sent from the destination to the source.",
            src_packets: "Specifies the number of packets sent from the source to the destination.",
            dst_packets: "Specifies the number of packets sent destination to the source.",
            ipfix: "Specifies any IP Flow Information Export (IPFIX) data for the traffic.",
            src_payload_ref: "Specifies the bytes sent from the source to the destination.",
            dst_payload_ref: "Specifies the bytes sent from the source to the destination.",
            encapsulates_refs: "Links to other network-traffic objects encapsulated by a network-traffic.",
            encapsulated_by_ref: "Links to another network-traffic object which encapsulates this object.",
            is_active: "Indicates whether the network traffic is still ongoing."
        }
    },
    {
        name: 'note',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `note`.",
            abstract: "A brief summary of the note.",
            content: "The content of the note.",
            authors: "The name of the author(s) of this note (e.g., the analyst(s) that created it).",
            object_refs: "The STIX Objects (SDOs and SROs) that the note is being applied to.",
        }
    },
    {
        name: 'observed-data',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `observed-data`.",
            first_observed: "The beginning of the time window that the data was observed during.",
            last_observed: "The end of the time window that the data was observed during.",
            number_observed: "The number of times the data represented in the objects property was observed. This MUST be an integer between 1 and 999,999,999 inclusive.",
            objects: "A dictionary of Cyber Observable Objects that describes the single 'fact' that was observed.",
            object_refs: "A list of SCOs and SROs representing the observation.",
        }
    },
    {
        name: 'opinion',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `opinion`.",
            explanation: "An explanation of why the producer has this Opinion.",
            authors: "The name of the author(s) of this opinion (e.g., the analyst(s) that created it).",
            object_refs: "The STIX Objects (SDOs and SROs) that the opinion is being applied to.",
            opinion: "The opinion that the producer has about about all of the STIX Object(s) listed in the object_refs property.",
        }
    },
    {
        name: 'process',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `process`.",
            extensions: "The Process Object defines the following extensions. In addition to these, producers MAY create their own. Extensions: windows-process-ext, windows-service-ext.",
            is_hidden: "Specifies whether the process is hidden.",
            pid: "Specifies the Process ID, or PID, of the process.",
            created_time: "Specifies the date/time at which the process was created.",
            cwd: "Specifies the current working directory of the process.",
            command_line: "Specifies the full command line used in executing the process, including the process name (which may be specified individually via the binary_ref.name property) and any arguments.",
            environment_variables: "Specifies the list of environment variables associated with the process as a dictionary.",
            opened_connection_refs: "Specifies the list of network connections opened by the process, as a reference to one or more Network Traffic Objects.",
            creator_user_ref: "Specifies the user that created the process, as a reference to a User Account Object.",
            image_ref: "Specifies the executable binary that was executed as the process image, as a reference to a File Object.",
            parent_ref: "Specifies the other process that spawned (i.e. is the parent of) this one, as represented by a Process Object.",
            child_refs: "Specifies the other processes that were spawned by (i.e. children of) this process, as a reference to one or more other Process Objects.",
        }
    },
    {
        name: 'report',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `report`.",
            report_types: "This field is an Open Vocabulary that specifies the primary subject of this report. The suggested values for this field are in report-type-ov.",
            name: "The name used to identify the Report.",
            description: "A description that provides more details and context about Report.",
            published: "The date that this report object was officially published by the creator of this report.",
            object_refs: "Specifies the STIX Objects that are referred to by this Report.",
        }
    },
    {
        name: 'software',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `software`.",
            name: "Specifies the name of the software.",
            cpe: "Specifies the Common Platform Enumeration (CPE) entry for the software, if available. The value for this property MUST be a CPE v2.3 entry from the official NVD CPE Dictionary.",
            swid: "Specifies the Software Identification (SWID) Tags entry for the software, if available.",
            languages: "Specifies the languages supported by the software. The value of each list member MUST be an ISO 639-2 language code.",
            vendor: "Specifies the name of the vendor of the software.",
            version: "Specifies the version of the software.",
        }
    },
    {
        name: 'threat-actor',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `threat-actor`.",
            threat_actor_types: "This field specifies the type of threat actor. Open Vocab - threat-actor-type-ov",
            name: "A name used to identify this Threat Actor or Threat Actor group.",
            description: "A description that provides more details and context about the Threat Actor.",
            aliases: "A list of other names that this Threat Actor is believed to use.",
            roles: "This is a list of roles the Threat Actor plays. Open Vocab - threat-actor-role-ov",
            goals: "The high level goals of this Threat Actor, namely, what are they trying to do.",
            first_seen: "The time that this Threat Actor was first seen.",
            last_seen: "The time that this Threat Actor was last seen.",
            sophistication: "The skill, specific knowledge, special training, or expertise a Threat Actor must have to perform the attack. Open Vocab - threat-actor-sophistication-ov",
            resource_level: "This defines the organizational level at which this Threat Actor typically works. Open Vocab - attack-resource-level-ov",
            primary_motivation: "The primary reason, motivation, or purpose behind this Threat Actor. Open Vocab - attack-motivation-ov",
            secondary_motivations: "The secondary reasons, motivations, or purposes behind this Threat Actor. Open Vocab - attack-motivation-ov",
            personal_motivations: "The personal reasons, motivations, or purposes of the Threat Actor regardless of organizational goals. Open Vocab - attack-motivation-ov",
        }
    },
    {
        name: 'tool',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `tool`.",
            aliases: "Alternative names used to identify this Tool.",
            tool_types: "The kind(s) of tool(s) being described. Open Vocab - tool-type-ov",
            name: "The name used to identify the Tool.",
            description: "Provides more context and details about the Tool object.",
            tool_version: "The version identifier associated with the tool.",
            kill_chain_phases: "The list of kill chain phases for which this Tool instance can be used.",
        }
    },
    {
        name: 'url',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `url`.",
            value: "Specifies the value of the URL.",
        }
    },
    {
        name: 'user-account',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `user-account`.",
            extensions: "The User Account Object defines the following extensions. In addition to these, producers MAY create their own. Extensions: unix-account-ext.",
            user_id: "Specifies the identifier of the account.",
            credential: "Specifies a cleartext credential. This is only intended to be used in capturing metadata from malware analysis (e.g., a hard-coded domain administrator password that the malware attempts to use for lateral movement) and SHOULD NOT be used for sharing of PII.",
            account_login: "Specifies the account login string, used in cases where the user_id property specifies something other than what a user would type when they login.",
            account_type: "Specifies the type of the account. This is an open vocabulary and values SHOULD come from the account-type-ov vocabulary.",
            display_name: "Specifies the display name of the account, to be shown in user interfaces, if applicable.",
            is_service_account: "Indicates that the account is associated with a network service or system process (daemon), not a specific individual.",
            is_privileged: "Specifies that the account has elevated privileges (i.e., in the case of root on Unix or the Windows Administrator account).",
            can_escalate_privs: "Specifies that the account has the ability to escalate privileges (i.e., in the case of sudo on Unix or a Windows Domain Admin account).",
            is_disabled: "Specifies if the account is disabled.",
            account_created: "Specifies when the account was created.",
            account_expires: "Specifies the expiration date of the account.",
            credential_last_changed: "Specifies when the account credential was last changed.",
            account_first_login: "Specifies when the account was first accessed.",
            account_last_login: "Specifies when the account was last accessed."
        }
    },
    {
        name: 'vulnerability',
        superClasses: ['core'],
        properties: {
            type: "The type of this object, which MUST be the literal `vulnerability`.",
            name: "The name used to identify the Vulnerability.",
            description: "A description that provides more details and context about the Vulnerability.",
        }
    },
    {
        name: 'windows-registry-key',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `windows-registry-key`.",
            key: "Specifies the full registry key including the hive.",
            values: "Specifies the values found under the registry key.",
            modified_time: "Specifies the last date/time that the registry key was modified.",
            creator_user_ref: "Specifies a reference to a user account, represented as a User Account Object, that created the registry key.",
            number_of_subkeys: "Specifies the number of subkeys contained under the registry key.",
        }
    },
    {
        name: 'x509-certificate',
        superClasses: ['cyber-observable-core'],
        properties: {
            type: "The value of this property MUST be `x509-certificate`.",
            is_self_signed: "Specifies whether the certificate is self-signed, i.e., whether it is signed by the same entity whose identity it certifies.",
            hashes: "Specifies any hashes that were calculated for the entire contents of the certificate.",
            version: "Specifies the version of the encoded certificate.",
            serial_number: "Specifies the unique identifier for the certificate, as issued by a specific Certificate Authority.",
            signature_algorithm: "Specifies the name of the algorithm used to sign the certificate.",
            issuer: "Specifies the name of the Certificate Authority that issued the certificate.",
            validity_not_before: "Specifies the date on which the certificate validity period begins.",
            validity_not_after: "Specifies the date on which the certificate validity period ends.",
            subject: "Specifies the name of the entity associated with the public key stored in the subject public key field of the certificate.",
            subject_public_key_algorithm: "Specifies the name of the algorithm with which to encrypt data being sent to the subject.",
            subject_public_key_modulus: "Specifies the modulus portion of the subject's public RSA key.",
            subject_public_key_exponent: "Specifies the exponent portion of the subject's public RSA key, as an integer.",
            x509_v3_extensions: "Specifies any standard X.509 v3 extensions that may be used in the certificate.",
        }
    },
    {
        name: 'windows-registry-value-type',
        superClasses: [],
        properties: {
            name: "Specifies the name of the registry value. For specifying the default value in a registry key, an empty string MUST be used.",
            data: "Specifies the data contained in the registry value.",
            data_type: "Specifies the registry (REG_*) data type used in the registry value. The values of this property MUST come from the windows-registry-datatype-enum enumeration.",
        }
    },
    {
        name: 'granular-marking',
        superClasses: [],
        properties: {
            selectors: "A list of selectors for content contained within the STIX object in which this property appears.",
            lang: "Identifies the language of the text identified by this marking.",
            marking_ref: "The marking_ref property specifies the ID of the marking-defintion object that describes the marking."
        }
    },
    {
        name: 'kill-chain-phase',
        superClasses: [],
        properties: {
            kill_chain_name: "The name of the kill chain. The value of this property SHOULD be all lowercase and SHOULD use hyphens instead of spaces or underscores as word separators.",
            phase_name: "The name of the phase in the kill chain. The value of this property SHOULD be all lowercase and SHOULD use hyphens instead of spaces or underscores as word separators.",
        }
    },
    {
        name: 'x509-v3-extensions-type',
        superClasses: [],
        properties: {
            basic_constraints: "Specifies a multi-valued extension which indicates whether a certificate is a CA certificate.",
            name_constraints: "Specifies a namespace within which all subject names in subsequent certificates in a certification path MUST be located.",
            policy_constraints: "Specifies any constraints on path validation for certificates issued to CAs.",
            key_usage: "Specifies a multi-valued extension consisting of a list of names of the permitted key usages.",
            extended_key_usage: "Specifies a list of usages indicating purposes for which the certificate public key can be used for.",
            subject_key_identifier: "Specifies the identifier that provides a means of identifying certificates that contain a particular public key.",
            authority_key_identifier: "Specifies the identifier that provides a means of identifying the public key corresponding to the private key used to sign a certificate.",
            subject_alternative_name: "Specifies the additional identities to be bound to the subject of the certificate.",
            issuer_alternative_name: "Specifies the additional identities to be bound to the issuer of the certificate.",
            subject_directory_attributes: "Specifies the identification attributes (e.g., nationality) of the subject.",
            crl_distribution_points: "Specifies how CRL information is obtained.",
            inhibit_any_policy: "Specifies the number of additional certificates that may appear in the path before anyPolicy is no longer permitted.",
            private_key_usage_period_not_before: "Specifies the date on which the validity period begins for the private key, if it is different from the validity period of the certificate.",
            private_key_usage_period_not_after: "Specifies the date on which the validity period ends for the private key, if it is different from the validity period of the certificate.",
            certificate_policies: "Specifies a sequence of one or more policy information terms, each of which consists of an object identifier (OID) and optional qualifiers.",
            policy_mappings: "Specifies one or more pairs of OIDs; each pair includes an issuerDomainPolicy and a subjectDomainPolicy",
        }
    }
];




