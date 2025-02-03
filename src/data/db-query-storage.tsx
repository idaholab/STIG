// This file contains the functions to store information about 
// DB Queries in the user's browser's local storage

import { v4 as uuidv4 } from 'uuid';
import { DBQuery } from "@/types/DBQuery";

export function initializeDBQueryStorage() {
    localStorage.setItem('dbQueries', JSON.stringify([]));
}

export function addDBQuery(newQueryText: string) {
    const dbQueriesParsed = readDBQueryStorage();
    if(!dbQueriesParsed.length) {
        initializeDBQueryStorage();
    }
    // Check that the query is not already stored
    if(!dbQueriesParsed.find(queryEntry => queryEntry.query === newQueryText)) {
        dbQueriesParsed.push({id: uuidv4(), query: newQueryText});
        localStorage.setItem('dbQueries', JSON.stringify(dbQueriesParsed));
    }
}

export function removeDBQuery(queryToDeleteId: string) {
    const dbQueriesParsed = readDBQueryStorage();
    const newDBQueriesParsed:DBQuery[] = [];
    dbQueriesParsed.map(dbQuery => {
        if(dbQuery.id !== queryToDeleteId) {
            newDBQueriesParsed.push(dbQuery);
        }
    });
    localStorage.setItem('dbQueries', JSON.stringify(newDBQueriesParsed));
}

export function readDBQueryStorage(): DBQuery[] {
    const dbQueries = localStorage.getItem('dbQueries');
    const dbQueriesParsed = dbQueries ? JSON.parse(dbQueries) : [];
    return dbQueriesParsed;
}
