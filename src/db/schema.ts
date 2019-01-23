/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { PropertyCreateConfig } from "orientjs";

export interface IOrientJSONClassOptions {
    name: string;
    superClasses: string[];
    properties: PropertyCreateConfig[];
}

export interface ISchemaFile {
    classes: IOrientJSONClassOptions[];
}

export const schema: ISchemaFile = {
    classes: [
        {
            name: "core",
            superClasses: ["V"],
            properties: [
                { name: "id_", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "type", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "created", type: "DateTime", mandatory: true, notNull: true, collate: "default" },
                { name: "modified", type: "DateTime", mandatory: true, notNull: true, collate: "default" },
                { name: "created_by_ref", type: "String", collate: "default" },
                { name: "object_marking_refs", type: "EmbeddedList", collate: "default" },
                { name: "labels", type: "EmbeddedList", collate: "default" },
                { name: "revoked", type: "Boolean", mandatory: true, notNull: true, collate: "default", default: "False" },
                { name: "external_references", type: "EmbeddedList", collate: "default" },
                { name: "granular_markings", type: "EmbeddedList", collate: "default" },
            ],
        },
        {
            name: "relationship",
            superClasses: ["E"],
            properties: [
                { name: "id_", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "type", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "created", type: "DateTime", mandatory: true, notNull: true, collate: "default" },
                { name: "modified", type: "DateTime", mandatory: true, notNull: true, collate: "default" },
                { name: "created_by_ref", type: "String", collate: "default" },
                { name: "external_references", type: "EmbeddedList", collate: "default" },
                { name: "relationship_type", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "revoked", type: "Boolean", mandatory: true, notNull: true, collate: "default", default: "False" },
                { name: "source_ref", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "target_ref", type: "String", mandatory: true, notNull: true, collate: "default" },
            ],
        },
        {
            name: "asset",
            superClasses: ["core"],
            properties: [
                { name: "category", type: "String", collate: "default" },
                { name: "category_ext", type: "EmbeddedList", collate: "default" },
                { name: "compromised", type: "Boolean", collate: "default", default: "False" },
                { name: "description", type: "String", collate: "default" },
                { name: "kind_of_asset", type: "String", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "owner_aware", type: "Boolean", collate: "default", default: "False" },
                { name: "technical_characteristics", type: "EmbeddedList", collate: "default" },
            ],
        },
        {
            name: "attack-pattern",
            superClasses: ["core"],
            properties: [
                { name: "description", type: "String", collate: "default" },
                { name: "kill_chain_phases", type: "EmbeddedList", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
            ],
        },
        {
            name: "attributed_to",
            superClasses: ["relationship"],
            properties: [
            ],
        },
        {
            name: "campaign",
            superClasses: ["core"],
            properties: [
                { name: "aliases", type: "EmbeddedList", collate: "default" },
                { name: "description", type: "String", collate: "default" },
                { name: "first_seen", type: "DateTime", collate: "default" },
                { name: "last_seen", type: "DateTime", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "objective", type: "String", collate: "default" },
            ],
        },
        {
            name: "course-of-action",
            superClasses: ["core"],
            properties: [
                { name: "description", type: "String", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                {name: "action", type: "String"},
            ],
        },
        {
            name: "identity",
            superClasses: ["core"],
            properties: [
                { name: "contact_information", type: "String", collate: "default" },
                { name: "description", type: "String", collate: "default" },
                { name: "identity_class", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "sectors", type: "String", collate: "default" },
            ],
        },
        {
            name: "impersonates",
            superClasses: ["relationship"],
            properties: [
            ],
        },
        {
            name: "indicates",
            superClasses: ["relationship"],
            properties: [
            ],
        },
        {
            name: "indicator",
            superClasses: ["core"],
            properties: [
                { name: "description", type: "String", collate: "default" },
                { name: "kill_chain_phases", type: "EmbeddedList", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "pattern", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "valid_from", type: "DateTime", collate: "default" },
                { name: "valid_until", type: "DateTime", collate: "default" },
            ],
        },
        {
            name: "intrusion-set",
            superClasses: ["core"],
            properties: [
                { name: "aliases", type: "EmbeddedList", collate: "default" },
                { name: "description", type: "String", collate: "default" },
                { name: "first_seen", type: "DateTime", collate: "default" },
                { name: "goals", type: "EmbeddedList", collate: "default" },
                { name: "last_seen", type: "DateTime", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "primary_motivation", type: "String", collate: "default" },
                { name: "resource_level", type: "String", collate: "default" },
                { name: "secondary_motivations", type: "EmbeddedList", collate: "default" },
            ],
        },
        {
            name: "malware",
            superClasses: ["core"],
            properties: [
                { name: "description", type: "String", collate: "default" },
                { name: "kill_chain_phases", type: "EmbeddedList", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
            ],
        },
        {
            name: "marking-definition",
            superClasses: ["core"],
            properties: [
                { name: "definition", type: "EmbeddedMap", collate: "default" },
                { name: "definition_type", type: "String", collate: "default" },
            ],
        },
        {
            name: "mitigates",
            superClasses: ["relationship"],
            properties: [
            ],
        },
        {
            name: "observed-data",
            superClasses: ["core"],
            properties: [
                { name: "first_observed", type: "DateTime", collate: "default" },
                { name: "last_observed", type: "DateTime", collate: "default" },
                { name: "number_observed", type: "Integer", mandatory: true, notNull: true, collate: "default" },
                { name: "objects_", type: "EmbeddedMap", collate: "default" },
            ],
        },
        {
            name: "related_to",
            superClasses: ["relationship"],
            properties: [
            ],
        },

        {
            name: "report",
            superClasses: ["core"],
            properties: [
                { name: "description", type: "String", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "object_refs", type: "EmbeddedList", collate: "default" },
                { name: "published", type: "DateTime", collate: "default" },
            ],
        },
        {
            name: "targets",
            superClasses: ["relationship"],
            properties: [
            ],
        },
        {
            name: "threat-actor",
            superClasses: ["core"],
            properties: [
                { name: "aliases", type: "EmbeddedList", collate: "default" },
                { name: "description", type: "String", collate: "default" },
                { name: "goals", type: "EmbeddedList", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "personal_motivations", type: "EmbeddedList", collate: "default" },
                { name: "primary_motivation", type: "String", collate: "default" },
                { name: "resource_level", type: "String", collate: "default" },
                { name: "roles", type: "EmbeddedList", collate: "default" },
                { name: "secondary_motivations", type: "EmbeddedList", collate: "default" },
                { name: "sophistication", type: "String", collate: "default" },
            ],
        },
        {
            name: "tool",
            superClasses: ["core"],
            properties: [
                { name: "description", type: "String", collate: "default" },
                { name: "kill_chain_phases", type: "EmbeddedList", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
                { name: "tool_version", type: "String", collate: "default" },
            ],
        },
        {
            name: "uses",
            superClasses: ["relationship"],
            properties: [
            ],
        },
        {
            name: "variant_of",
            superClasses: ["relationship"],
            properties: [
            ],
        },
        {
            name: "vulnerability",
            superClasses: ["core"],
            properties: [
                { name: "description", type: "String", collate: "default" },
                { name: "name", type: "String", mandatory: true, notNull: true, collate: "default" },
            ],
        },
    ],
};
