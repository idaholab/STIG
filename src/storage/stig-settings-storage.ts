/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import e from "express";

// import ElectronStore = require("electron-store");
// import { Rectangle } from 'electron';

export interface IStigSettingsOptions {
    layout: string;
    // bounds: Rectangle;
    // maximize: boolean;
    // fullScreen: boolean;
}

export class StigSettings {
    private static instance: StigSettings;
    private store: IStigSettingsOptions;
    
    public async getSettings() {
        if (!this.store) {
            let settings = await fetch('/data?name=stigSettings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            console.log(settings.layout)
            if (!settings.layout) {
                settings = {layout: "grid"}
                this.saveSettings()
            } 

            this.store = settings
            
        }

        console.log("<settings> store: ", JSON.stringify(this.store))

        return this.store
    }

    private saveSettings() {
        console.log("Saving settings: ", JSON.stringify(this.store))
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: 'stigSettings', data: this.store})
        })
    }

    public setLayout(layout: string) {
        this.store.layout = layout;
        this.saveSettings();
    }

    static get Instance(): StigSettings {
        if (StigSettings.instance === undefined) {
            StigSettings.instance = new StigSettings();
        }
        return StigSettings.instance;
    }

    public set layout(layout: string) {
        this.store.layout = layout;
        this.saveSettings()
    }

    public get layout(): string {
        return this.store?.layout;
    }

}
