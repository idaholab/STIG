/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

export interface IDatabaseConfigOptions {
  host: string;
  db?: string;
  name: string;
  username: string;
  password: string;
  admin_user?: string;
  admin_password?: string;
}

export type IDatabaseConfigMap = Record<string, IDatabaseConfigOptions>;

export interface IDatabaseConfigurationStorageStructure {
  current: string;
  configs: IDatabaseConfigMap;
}

const defaultDbConfig: IDatabaseConfigurationStorageStructure = {
  configs: {
    stig: {
      host: 'neo4j://localhost',
      name: 'stig',
      username: 'admin',
      password: 'admin',
    }
  },
  current: 'stig'
};

/**
 * @description Stores database configuration
 * @export
 * @class ConfigurationStorageService
 */
export class DatabaseConfigurationStorage {
  private static instance: DatabaseConfigurationStorage;
  private readonly store: IDatabaseConfigurationStorageStructure;

  private constructor () {
    const settingsJson = localStorage.getItem('dbConfig');
    this.store = settingsJson ? JSON.parse(settingsJson) : defaultDbConfig;
  }

  private saveConfigs () {
    localStorage.setItem('dbConfig', JSON.stringify(this.store));
  }

  static get Instance (): DatabaseConfigurationStorage {
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
  public save (options: IDatabaseConfigOptions) {
    this.store.configs[options.name] = options;
    this.saveConfigs();
  }

  public get (key: string): IDatabaseConfigOptions {
    return this.store.configs[key];
  }

  public keys (): string[] {
    return Object.keys(this.store.configs);
  }

  public get current (): string {
    return this.store.current;
  }

  public set current (name: string) {
    this.store.current = name;
    this.saveConfigs();
  }

  public get configs (): IDatabaseConfigMap {
    return this.store.configs;
  }

  public currentConfig (): IDatabaseConfigOptions {
    return this.store.configs[this.store.current];
  }

  public removeConfig (name: string) {
    const configs = this.store.configs;
    if (name in configs) {
      delete configs[name];
      this.store.configs = configs;
      this.saveConfigs();
    }
  }
}
