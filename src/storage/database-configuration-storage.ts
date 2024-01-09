/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

export interface IDatabaseConfigOptions {
  host: string
  port: number
  name: string
  username: string
  password: string
  usetoken?: true
  admin_user?: string
  admin_password?: string
}

export type IDatabaseConfigMap = Record<string, IDatabaseConfigOptions>;

export interface IDatabaseConfigurationStorageStructure {
  current: string
  configs: IDatabaseConfigMap
}

export interface TaxiiParams {
  url: string
  apiroot_name: string
  collection_id: string
  username: string
  password: string
}

/**
 * @description Stores database configuration
 * @export
 * @class ConfigurationStorageService
 */
export class DatabaseConfigurationStorage {
  private static instance: DatabaseConfigurationStorage;
  private store: IDatabaseConfigurationStorageStructure;

  public async getConfigs () {
    if (!this.store) {
      const response = await fetch('/data?name=dbConfig', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const config = await response.json();
      if (!config.configs) {
        this.create_default();
      } else {
        this.store = config;
      }
    }

    return this.store;
  }

  private saveConfigs () {
    void fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'dbConfig', data: this.store })
    });
  }

  public create_default () {
    const initial: IDatabaseConfigOptions = {
      host: 'localhost',
      port: 2424,
      name: 'stig',
      username: 'admin',
      password: 'admin',
      usetoken: true
    };
    const configmap: IDatabaseConfigMap = {
      [initial.name]: initial
    };
    this.store = { configs: configmap, current: 'stig' };
    this.saveConfigs();
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
