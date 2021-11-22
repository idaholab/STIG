import { IDatabaseConfigOptions } from "../storage/database-configuration-storage";

export function use_db(config: IDatabaseConfigOptions) {
    console.log(config)
    fetch("/use_db", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({config: config})
    })
}