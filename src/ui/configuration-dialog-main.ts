/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { DatabaseConfigurationStorage } from "../storage";
import { IDatabaseConfigOptions } from '../storage/database-configuration-storage';

export function openDatabaseConfigurationDialogMain(parent: BrowserWindow) {
    parent.webContents.send("OpenDatabaseConfiguration");
}

export function newDatabaseDialogOld(parent: BrowserWindow) {
    let promptWindow = new BrowserWindow({
        width: 640, height: 480,
        parent,
        show: false,
        modal: true,
        alwaysOnTop: true,
        title: "Database Configuration",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
        },
    });

    promptWindow.once("closed", (_event: Electron.Event, _data: any) => {
        promptWindow = null;
    });

    ipcMain.on("DialogReady", (event: Electron.Event, _data: any) => {
        event.returnValue = DatabaseConfigurationStorage.Instance.currentConfig();
    });

    // Load the HTML dialog box
    promptWindow.loadURL("file://" + path.join(__dirname, "../static/new_database.html"));

    promptWindow.once("ready-to-show", () => {
        ipcMain.on("closeDialog", (_event: Electron.Event, data: IDatabaseConfigOptions) => {
            if (data !== undefined && data !== null) {
                DatabaseConfigurationStorage.Instance.save(data);
                DatabaseConfigurationStorage.Instance.current = data.name;
                parent.webContents.send('database_reconfigured', data);
            }
        });
        const config_options = DatabaseConfigurationStorage.Instance.currentConfig();
        config_options.name = '';
        promptWindow.webContents.send("config_options", config_options);
        promptWindow.show();
    });
}
