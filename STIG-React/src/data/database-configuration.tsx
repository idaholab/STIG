import { DBProfile } from "@/interfaces/DBProfile";

// This file contains the functions to store information about 
// DB Profiles in the user's browser's local storage

export function initializeDBConfigStorage() {
    localStorage.setItem('dbConfig', JSON.stringify([]));
}

export function addDBConfig(newConfig: DBProfile) {
    const dbConfigs = localStorage.getItem('dbConfig');
    const dbConfigsJSON:DBProfile[] = dbConfigs ? JSON.parse(dbConfigs) : [];
    dbConfigsJSON.push(newConfig);
    localStorage.setItem('dbConfig', JSON.stringify(dbConfigsJSON));
}

export function removeDBConfig(configToDeleteId: string) {
    const dbConfigs = localStorage.getItem('dbConfig');
    const dbConfigsJSON:DBProfile[] = dbConfigs ? JSON.parse(dbConfigs) : [];
    let newDBConfigsJSON:DBProfile[] = [];
    dbConfigsJSON.map(dbConfig => {
        if(dbConfig.Id !== configToDeleteId) {
            newDBConfigsJSON.push(dbConfig);
        }
    });
    localStorage.setItem('dbConfig', JSON.stringify(newDBConfigsJSON));
}

export function editDBConfig(editedConfig: DBProfile) {
    removeDBConfig(editedConfig.Id);
    addDBConfig(editedConfig);
}

export function readDBConfigStorage(): DBProfile[] {
    const dbConfigs = localStorage.getItem('dbConfig');
    return dbConfigs ? JSON.parse(dbConfigs) : [];
}
