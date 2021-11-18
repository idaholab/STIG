/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { textChangeRangeIsUnchanged } from "typescript";

// import ElectronStore = require("electron-store");

export interface IDatabaseConfigOptions {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    usetoken?: true;
    admin_user?: string;
    admin_password?: string;
}

export interface IDatabaseConfigMap {
    [index: string]: IDatabaseConfigOptions;
}

export interface IDatabaseConfigurationStorageStructure  {
    current: string;
    configs: IDatabaseConfigMap;
}

/**
 * @description Stores database configuration
 * @export
 * @class ConfigurationStorageService
 */
export class DatabaseConfigurationStorage {
    private static instance: DatabaseConfigurationStorage;
    // private store: ElectronStore<IDatabaseConfigurationStorageStructure>;
    private store: IDatabaseConfigurationStorageStructure;
    // private constructor() {
    //     // this.store = new ElectronStore<IDatabaseConfigurationStorageStructure>({ name: "stig/db_config" });
        
    //     fetch('/data', {
    //         method: 'GET',
    //         body: JSON.stringify({name: 'dbConfig'})
    //     }).then(response => response.json())
    //     .then(data => {
    //         if (data) {
    //             this.store = JSON.parse(data)
    //         } else {
    //             this.create_default();
    //         }
    //     })
    // }

    public async getConfigs() {
        if (!this.store) {
            let config = await fetch('/data?name=dbConfig', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            console.log(config.configs)
            if (!config.configs) {
                this.create_default()
            } else {
                this.store = config
            }
            
            
        }

        console.log("<database> store: ", JSON.stringify(this.store))

        return this.store
    }

    private saveConfigs() {
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: 'dbConfig', data: this.store})
        })
    }

    public create_default() {
        const initial: IDatabaseConfigOptions = {
            host: 'localhost',
            port: 2424,
            name: 'stig',
            username: 'admin',
            password: 'admin',
            usetoken: true,
        };
        const configmap: IDatabaseConfigMap = {
            [initial.name]: initial,
        };
        this.store = {configs: configmap, current: 'stig'}
        this.saveConfigs();
    }

    static get Instance(): DatabaseConfigurationStorage {
        if (DatabaseConfigurationStorage.instance === undefined) {
            DatabaseConfigurationStorage.instance = new DatabaseConfigurationStorage();
        }
        return DatabaseConfigurationStorage.instance;
    }

    /**
     * @description Save the database configuration to file
     * @param {IDatabaseConfigOptions} options
     * @memberof ConfigurationStorageService
     */
    public save(options: IDatabaseConfigOptions) {
        this.store.configs[options.name] = options;
        this.saveConfigs();
    }

    public get(key: string): IDatabaseConfigOptions {
        return this.store.configs[key];
    }

    public keys(): string[] {
        console.log("Database store: ", this.store)
        return Object.keys(this.store.configs);
    }

    public get current(): string {
        return this.store.current;
    }

    public set current(name: string) {
        this.store.current = name;
        this.saveConfigs();
    }

    public get configs(): IDatabaseConfigMap {
        return this.store.configs;
    }

    public currentConfig(): IDatabaseConfigOptions {
        return this.store.configs[this.store.current];
    }

    public removeConfig(name: string) {
        const configs = this.store.configs;
        if (name in configs) {
            delete configs[name];
            this.store.configs = configs;
            this.saveConfigs();
        }
    }
}
