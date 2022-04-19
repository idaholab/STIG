import * as diffpatch from "jsondiffpatch";
import { StixObject } from "../stix";
import { IDatabaseConfigOptions } from "../storage/database-configuration-storage";
import { schema } from "./schema"

export function use_db(config: IDatabaseConfigOptions) {
    fetch("/use_db", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({config: config})
    }).then(res => res.json()).then(data => {
        console.log(data)
        if (data.message) {
            $(".message-status").html(data.message)
        }

        check_db()
    })
}

export async function commit(stix: StixObject) {
    if (stix && checkProps(stix)) {
        // Only commit if the object is valid
        return await fetch('/commit', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: stix})
        }).then(() => {return true})
    } else {
        return false;
    }
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

export async function check_db() {
    let db = await fetch("/check_db", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(response => {return response.data})

    // console.log("Connected to database:", db)
    if (db) {
        // $("#db-status").data("value", `${db}: Connected`)
        document.getElementById("db-status").innerHTML = db
        document.getElementById("db-status").className = "db-status-green"
    } else {
        // $("#db-status").data("value", "DB not connected")
        document.getElementById("db-status").innerHTML = "not connected"
        document.getElementById("db-status").className = "db-status-red"
    }
}

export function checkProps(object : StixObject): Boolean {
    let schemaObject = schema.classes.find(c => {return c.name === object.type})
    // Get the requireed props from the schema
    let reqProps = schemaObject.properties.filter(prop => {return prop.mandatory})
    // Get the required props from the super classes
    for (const superClass of schemaObject.superClasses) {

        let superClassObject = schema.classes.find(c => {
            let name = c.name.replace(/-/g, '')
            return name === superClass
        })
        if (superClassObject) {
            let superReqProps = superClassObject.properties.filter(prop => {return prop.mandatory})
            reqProps.concat(superReqProps)
        }
    }

    for (const prop of reqProps) {
        // console.log(prop.name, prop.mandatory)

        // id_ only exists on the database side. Skip this.
        if (prop.name === "id_") continue;
        
        if (object[prop.name] === undefined) {
            console.log("Prop not found on object")

            // Return false to indicate that this object is invalid
            return false

        }
    }

    return true
}