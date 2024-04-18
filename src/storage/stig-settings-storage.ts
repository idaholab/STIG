/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

export interface IStigSettingsOptions {
  layout: string;
  // bounds: Rectangle;
  // maximize: boolean;
  // fullScreen: boolean;
}

export class StigSettings {
  private static instance: StigSettings;
  private readonly store: IStigSettingsOptions;

  private constructor () {
    const settingsJson = localStorage.getItem('stigSettings');
    this.store = settingsJson ? JSON.parse(settingsJson) : { layout: 'grid' };
  }

  public getSettings () {
    return this.store;
  }

  static get Instance (): StigSettings {
    if (StigSettings.instance === undefined) {
      StigSettings.instance = new StigSettings();
    }
    return StigSettings.instance;
  }

  public set layout (layout: string) {
    this.store.layout = layout;
    localStorage.setItem('stigSettings', JSON.stringify(this.store));
  }

  public get layout (): string {
    return this.store.layout;
  }
}
