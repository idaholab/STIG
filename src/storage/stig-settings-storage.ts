/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import ElectronStore = require("electron-store");
import { Rectangle } from 'electron';

export interface IStigSettingsOptions {
    layout: string;
    bounds: Rectangle;
    maximize: boolean;
    fullScreen: boolean;
}

export class StigSettings {
    private static instance: StigSettings;
    private store: ElectronStore;

    private constructor() {
        this.store = new ElectronStore({ name: "stig_config" });
        if (!this.store.has("layout")) { this.store.set("layout", "Grid"); }
    }

    static get Instance(): StigSettings {
        if (StigSettings.instance === undefined) {
            StigSettings.instance = new StigSettings();
        }
        return StigSettings.instance;
    }

    public set layout(layout: string) {
        this.store.set("layout", layout);
    }

    public get layout(): string {
        return this.store.get("layout", "Grid");
    }

}
