import * as diffpatch from "jsondiffpatch";
import { StixObject } from "../stix";
import { IDatabaseConfigOptions } from "../storage/database-configuration-storage";
import { GraphQueryResult } from "./db_types";

export function use_db(config: IDatabaseConfigOptions) {
    fetch("/use_db", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({config: config})
    })
}

export async function commit(stix: StixObject) {
    return await fetch('/commit', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({data: stix})
    }).then(() => {return true})
}

export function db_delete(stix: StixObject) {
    fetch('/delete', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({data: stix})
    })
}

export async function query_incoming(stix: StixObject) : Promise<StixObject[]> {
    return await fetch("/query_incoming", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({id: stix.id})
    }).then(response => response.json()).then(response => {return response.data})
}

export async function query_outgoing(stix: StixObject) : Promise<StixObject[]> {
    return await fetch("/query_outgoing", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({id: stix.id})
    }).then(response => response.json()).then(response => {return response.data})
}

export async function query(query: string) : Promise<StixObject[]> {
    return await fetch("/query", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({query: query})
    }).then(response => response.json()).then(response => {return response.data})
}

export async function get_diff(stix: StixObject) : Promise<diffpatch.Delta> {
    return await fetch("/diff", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({data: stix})
    }).then(response => response.json()).then(response => {return response.data})
}