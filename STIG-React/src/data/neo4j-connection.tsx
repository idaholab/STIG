// This file contains the functions to manage Neo4j DB 
// connections

import { DBProfile } from "@/interfaces/DBProfile";
import neo4j, { Driver } from 'neo4j-driver';

export async function connectToNeo4jDB(oldDB: Driver | undefined, newDB: DBProfile): 
    Promise<[Driver | undefined, boolean]> 
{
    await oldDB?.close()
        .catch((err) => {
            // console.log("Disconnect unsuccessful. Error:", err);
            return [undefined, false];
        });
    // console.log("Disconnect successful.");
    try {
        const newDBDriver = neo4j.driver(
            newDB.Host,
            neo4j.auth.basic(newDB.Username, newDB.Password)
        );
        await newDBDriver.getServerInfo();
        // console.log("Neo4j DB Connection successful. New Driver:", newDBDriver);
        return [newDBDriver, true];
    } catch (error) {
        // console.log("Neo4j DB Connection unsuccessful. Error:", error);
        return [undefined, false];
    }
}

export async function disconnectFromNeo4jDB(oldDB: Driver | undefined) {
    await oldDB?.close()
        .catch((err) => {
            // console.log("Disconnect unsuccessful. Error:", err);
            return false;
        });
    // console.log("Disconnect successful.");
    return true;
}