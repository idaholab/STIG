/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { app, BrowserWindow, ipcMain, Event, BrowserWindowConstructorOptions } from 'electron';
import * as unhandled from 'electron-unhandled';
import * as path from 'path';
import * as config_menu from './ui/main-window-menu';
import * as window_manager from './ui/window-manager';
import { DatabaseConfigurationStorage } from './storage';
import { openDatabaseConfigurationDialogMain } from './ui/configuration-dialog-main';
import { IDatabaseConfigOptions } from './storage/database-configuration-storage';

// tslint:disable-next-line:no-var-requires
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

config_menu.setup();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

function createWindow() {
  const window_options: BrowserWindowConstructorOptions = {
    width: 1024,
    // width: winmgr.width,
    height: 768,
    // height: winmgr.height,
    // x: winmgr.x > 0 ? winmgr.x : undefined,
    // y: winmgr.y > 0 ? winmgr.x : undefined,
    icon: path.join(__dirname, '../assets/icons/png/64x64.png'),
  };
  const winmgr = window_manager.instance;
  if (!winmgr.is_initial()) {
    window_options.x = winmgr.x;
    window_options.y = winmgr.y;
    window_options.width = winmgr.width;
    window_options.height = winmgr.height;
    window_options.fullscreen = winmgr.isFullScreen;
    // window_options.webPreferences.nodeIntegration = false;
  }
  mainWindow = new BrowserWindow(window_options);
  if (winmgr.maximize) {
    mainWindow.maximize();
  }
  winmgr.window = mainWindow;
  window_manager.set_events();

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  ipcMain.on("openDialog", (event: Event) => {
    return event.returnValue = JSON.stringify(DatabaseConfigurationStorage.Instance.currentConfig());
  });

  ipcMain.on("closeDialog", (data: IDatabaseConfigOptions) => {
    DatabaseConfigurationStorage.Instance.save(data);
  });

  ipcMain.on("prompt", () => {
    openDatabaseConfigurationDialogMain(mainWindow);
  });

  ipcMain.on("useDatabase", (_event: Electron.Event, options: IDatabaseConfigOptions) => {
    mainWindow.webContents.send('database_reconfigured', options);
  });

  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window_manager.remove_events();
    mainWindow = null;
  });

  // mainWindow.on('unresponsive', () => {
  //   const options = {
  //     type: 'info',
  //     title: 'Main Process Hanging',
  //     message: 'This process is hanging.',
  //     buttons: ['Reload', "Close"],
  //   };
  //   dialog.showMessageBox(options, (index) => {
  //     if (index === 0) { mainWindow.reload(); } else { mainWindow.close(); }
  //   });
  // });

//   mainWindow.webContents.on('crashed', () => {
//     const options = {
//       type: 'info',
//       title: 'Renderer Process Crashed',
//       message: 'This process has crashed.',
//       buttons: ['Reload', 'Close'],
//     };
//     dialog.showMessageBox(options, (index) => {
//       if (index === 0) { mainWindow.reload(); } else { mainWindow.close(); }
//     });
//   });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  unhandled();
  if (mainWindow === null) {
    createWindow();
  }
});
