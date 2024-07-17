import { DBProfile } from "@/interfaces/DBProfile";

// This file contains the functions to store information about 
// DB Profiles in the user's browser's local storage

export function initializeDBConfigStorage() {
    localStorage.setItem('dbConfig', JSON.stringify([]));
}

export function addDBConfig(newConfig: DBProfile) {
    const dbConfigs = localStorage.getItem('dbConfig');
    const dbConfigsParsed:DBProfile[] = dbConfigs ? JSON.parse(dbConfigs) : [];
    dbConfigsParsed.push(newConfig);
    localStorage.setItem('dbConfig', JSON.stringify(dbConfigsParsed));
}

export function removeDBConfig(configToDeleteId: string) {
    const dbConfigs = localStorage.getItem('dbConfig');
    const dbConfigsParsed:DBProfile[] = dbConfigs ? JSON.parse(dbConfigs) : [];
    let newDBConfigsParsed:DBProfile[] = [];
    dbConfigsParsed.map(dbConfig => {
        if(dbConfig.Id !== configToDeleteId) {
            newDBConfigsParsed.push(dbConfig);
        }
    });
    localStorage.setItem('dbConfig', JSON.stringify(newDBConfigsParsed));
}

export function editDBConfig(editedConfig: DBProfile) {
    removeDBConfig(editedConfig.Id);
    addDBConfig(editedConfig);
}

export function readDBConfigStorage(): DBProfile[] {
    const dbConfigs = localStorage.getItem('dbConfig');
    const dbConfigsParsed = dbConfigs ? JSON.parse(dbConfigs) : [];
    // Order DBConfigs by ProfileName
    dbConfigsParsed.sort((a:DBProfile, b:DBProfile) => {
        return a.ProfileName.localeCompare(b.ProfileName);
    })
    return dbConfigsParsed;
}
