import { IDatabaseConfigOptions } from "../storage/database-configuration-storage";

export function use_db(config: IDatabaseConfigOptions) {
    fetch("/use_db", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({config: config})
    })
}

export function commit(stix: string) {
    fetch('/commit', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({data: stix})
    })
}