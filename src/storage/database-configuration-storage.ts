/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import ElectronStore = require("electron-store");

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
    private store: ElectronStore<IDatabaseConfigurationStorageStructure>;
    private constructor() {
        this.store = new ElectronStore<IDatabaseConfigurationStorageStructure>({ name: "stig/db_config" });
        if (!this.store.has("configs") || (Object.keys(this.store.get("configs")).length === 0)) {
            this.create_default();
        }
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
        this.store.set('configs', configmap);
        this.current = 'stig';
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
        const configs = this.store.get('configs');
        configs[options.name] = options;
        this.store.set('configs', configs);
    }

    public get(key: string): IDatabaseConfigOptions {
        return this.configs[key];
    }

    public keys(): string[] {
        return Object.keys(this.configs);
    }

    public get current(): string {
        return this.store.get('current',  undefined);
    }

    public set current(name: string) {
        this.store.set('current', name);
    }

    public get configs(): IDatabaseConfigMap {
        return this.store.get('configs');
    }

    public currentConfig(): IDatabaseConfigOptions {
        return this.configs[this.current];
    }

    public removeConfig(name: string) {
        const configs = this.store.get('configs');
        if (name in configs) {
            delete configs[name];
            this.store.set('configs', configs);
        }
    }
}
