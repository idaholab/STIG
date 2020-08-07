/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { BrowserWindow, Menu, app, MenuItemConstructorOptions, MenuItem } from "electron";
import * as Electron from 'electron';
import { openDatabaseConfigurationDialogMain } from './configuration-dialog-main';
import { StigSettings } from '../storage';

const stig_settings = StigSettings.Instance;

function change_layout(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send("layout", item.label.toLowerCase()); }
    stig_settings.layout = item.label;
    item.checked = true;
}

function copy_selected(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send("copy_selected", item.label); }
}

function paste_elements(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send("paste_elements", item.label); }
}

function cut_selected(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send("cut_selected", item.label); }
}

function commit_all(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) {
        focusedWindow.webContents.send("commit_all", item.label);
    }
}

// function commit_selected(item: MenuItem, focusedWindow: BrowserWindow) {
//     if (focusedWindow) {
//         focusedWindow.webContents.send("commit_selected", item.label);
//     }
// }

function invert_selection(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) {
        focusedWindow.webContents.send("invert_selected", item.label);
    }
}

function export_all(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) {
        focusedWindow.webContents.send("export_all", item.label);
    }
}

function export_selected(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) {
        focusedWindow.webContents.send("export_selected", item.label);
    }
}

function select_all(item: MenuItem, focusedWindow: BrowserWindow) {
    if (focusedWindow) { focusedWindow.webContents.send("select_all", item.label); }
}
// function export_graph(item: MenuItem, focusedWindow: BrowserWindow) {
//     if (focusedWindow) {
//         focusedWindow.webContents.send("export_graph", item.label);
//     }
// }

// const db = new StigDB(ConfigurationStorageService.Instance.get().host, ConfigurationStorageService.Instance.get().name, window.cycore);
// const to_save: CollectionElements = window.cycore.$('[!saved]');
// const results:StixObject[] = []
// to_save.forEach( (ele: CollectionElements, _i: number, _eles: CollectionElements) => {
//     const stix_obj = ele.data('raw_data');
//     db.updateDB(stix_obj)
//     .then(result=>{
//         results.push(...result);
//     })
//     .catch( (e) =>{
//         console.log(e)}
//     );
// });


const template: MenuItemConstructorOptions[] = [
    // {
    //     label: 'File',
    //     submenu: [
    //         {
    //             label: 'Save...',
    //             role: 'save',
    //         },
    //         {
    //             label: 'Open...',
    //             role: 'open',
    //         },
    //         {
    //             label: 'Quit',
    //             role: 'quit',
    //         },
    //     ],
    // },
    {
        label: 'Edit',
        submenu: [
            // {
            //     label: 'Undo',
            //     accelerator: 'CmdOrCtrl+Z',
            //     role: 'undo'
            // }, {
            //     label: 'Redo',
            //     accelerator: 'Shift+CmdOrCtrl+Z',
            //     role: 'redo'
            // }, {
            //     type: 'separator'
            // },
            {
                label: 'Configure Database',
                submenu: [
                    {
                        label: 'Database Connection...',
                        accelerator: 'CmdOrCtrl+,',
                        click: (_, focusedWindow) => {
                            if (focusedWindow) {
                                openDatabaseConfigurationDialogMain(focusedWindow);
                            }
                        },
                    },
                    // {
                    //     label: 'Create New Database...',
                    //     click: (_, focusedWindow) => {
                    //         if (focusedWindow) {
                    //             newDatabaseDialog(focusedWindow);
                    //         }
                    //     },
                    // },
                ],
            },
            {
                type: 'separator',
            },
            {
                label: 'Select All Text',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall',
            },
            {
                label: 'Copy Text',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy',
            },
            {
                label: 'Cut Text',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut',
            },
            {
                label: 'Paste Text',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste',
            },
        ],
    },
    {
        label: 'Graph',
        submenu: [
            {
                label: 'Copy Selected Elements',
                click: copy_selected,
                accelerator: 'Shift+CmdOrCtrl+C',
            },
            {
                label: 'Cut Selected Elements',
                click: cut_selected,
                accelerator: 'Shift+CmdOrCtrl+X',
            },
            {
                label: 'Paste Elements',
                click: paste_elements,
                accelerator: 'Shift+CmdOrCtrl+V',
            },
            {
                label: 'Commit All Elements',
                click: commit_all,
            },
            {
                label: 'Select All Elements',
                accelerator: 'Shift+CmdOrCtrl+A',
                click: select_all,
            },
            {
                label: 'Invert Selection',
                accelerator: 'Shift+CmdOrCtrl+I',
                click: invert_selection,
            },
            {
                label: 'Export...',
                submenu: [
                    {
                        label: 'Selected Elements...',
                        click: export_selected,
                    },
                    {
                        label: 'All Elements...',
                        click: export_all,
                    },
                    // {
                    //     label: 'Export graph...',
                    //     click: export_graph,
                    // },
                ],
            },
            // {
            //     label: 'Commit...',
            //     submenu: [
            //         {
            //             label: 'Selected Elements...',
            //             click: commit_selected,
            //         },
            //         {
            //             label: 'All Elements...',
            //             click: commit_all,
            //         },
            //     ],
            // },
        ],
    },
    {
        label: 'Layout',
        id: 'layout',
        submenu: [
            {
                label: 'Cose',
                id: 'cose',
                click: change_layout,
                type: 'radio',
                checked: true,
            }, {
                label: 'Cola',
                id: 'cola',
                click: change_layout,
                type: 'radio',
            }, {
                label: 'Circle',
                id: 'circle',
                click: change_layout,
                type: 'radio',
            }, {
                label: 'Spread',
                id: 'spread',
                click: change_layout,
                type: 'radio',
            }, {
                label: 'Cose_Bilkent',
                id: 'cose_bilkent',
                click: change_layout,
                type: 'radio',
            }, {
                label: 'Klay',
                id: 'klay',
                click: change_layout,
                type: 'radio',
            }, {
                label: 'Dagre',
                id: 'dagre',
                click: change_layout,
                type: 'radio',
            },
            // {
            //     label: 'Euler',
            //     click: change_layout,
            //     type: 'radio'
            // }, {
            //     label: 'Ngraph',
            //     click: change_layout,
            //     type: 'radio'
            // },
            {
                label: 'Random',
                id: 'random',
                click: change_layout,
                type: 'radio',
            }, {
                label: 'Concentric',
                id: 'concentric',
                click: change_layout,
                type: 'radio',
            }, {
                label: 'Breadthfirst',
                id: 'breadthfirst',
                click: change_layout,
                type: 'radio',
            },
            {
                label: 'Grid',
                id: 'grid',
                click: change_layout,
                type: 'radio',
            },
        ],
    },
    {
        label: 'View',
        submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: (_, focusedWindow) => {
                if (focusedWindow) {
                    // on reload, start fresh and close any old
                    // open secondary windows
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach((win) => {
                            if (win.id > 1) {
                                win.close();
                            }
                        });
                    }
                    focusedWindow.reload();
                }
            },
        }, {
            label: 'Toggle Full Screen',
            accelerator: (() => {
                if (process.platform === 'darwin') {
                    return 'Ctrl+Command+F';
                } else {
                    return 'F11';
                }
            })(),
            click: (_, focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            },
        }, {
            label: 'Toggle Developer Tools',
            accelerator: (() => {
                if (process.platform === 'darwin') {
                    return 'Alt+Command+I';
                } else {
                    return 'Ctrl+Shift+I';
                }
            })(),
            click: (_, focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.webContents.toggleDevTools();
                }
            },
        }, {
            type: 'separator',
        }, {
            label: 'Window',
            role: 'window',
            submenu: [{
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize',
            }, {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close',
            }, {
                type: 'separator',
            }, {
                label: 'Reopen Window',
                accelerator: 'CmdOrCtrl+Shift+T',
                enabled: false,
                // key: 'reopenMenuItem',
                click: () => {
                    app.emit('activate');
                },
            }],
        }],
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click: () => {
                Electron.shell.openExternal('http://electron.atom.io');
            },
        }],
    }];

function addUpdateMenuItems(items: MenuItemConstructorOptions[], position: number) {
    if (process.mas) { return; }

    const version = Electron.app.getVersion();
    // let updateItems: Partial<MenuItemConstructorOptions>[] = [{
    const updateItems: MenuItemConstructorOptions[] = [{
        label: `Version ${version}`,
        enabled: false,
    }, {
        label: 'Checking for Update',
        enabled: false,
        // key: 'checkingForUpdate'
    }, {
        label: 'Check for Update',
        visible: false,
        // key: 'checkForUpdate',
        click: () => {
            Electron.autoUpdater.checkForUpdates();
        },
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        // key: 'restartToUpdate',
        click: () => {
            Electron.autoUpdater.quitAndInstall();
        },
    }];
    items.splice(position, 0).concat(updateItems);
}

function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu();
    if (!menu) { return undefined; }

    let reopenMenuItem: MenuItemConstructorOptions;
    for (const item of menu.items as MenuItemConstructorOptions[]) {
        if (item.submenu) {
            for (const itm of (item.submenu as Menu).items) {
                if ((itm as MenuItemConstructorOptions).label === 'Reopen Window') {
                    reopenMenuItem = item;
                }
            }
        }
    }
    return reopenMenuItem;
}

function updateLayoutMenuSelection(): void {
    const layout = stig_settings.layout;
    const mainmenu = Menu.getApplicationMenu();
    if (!mainmenu) { return undefined; }

    for (const item of mainmenu.items as MenuItemConstructorOptions[]) {
        if (item.id === 'layout' && item.submenu) {
            const items = (item.submenu as Menu).items;
            for (const subitem of items) {
                if (subitem.id === layout.toLowerCase()) {
                    subitem.checked = true;
                }
            }
        }
    }
}

export function setup() {
    if (process.platform === 'darwin') {
        const name = 'Stig';
        template.unshift({
            label: 'Stig',
            submenu: [{
                label: `About ${name}`,
                role: 'about',
            }, {
                type: 'separator',
            }, {
                label: 'Services',
                role: 'services',
                submenu: [],
            }, {
                type: 'separator',
            }, {
                label: `Hide ${name}`,
                accelerator: 'Command+H',
                role: 'hide',
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers',
            }, {
                label: 'Show All',
                role: 'unhide',
            }, {
                type: 'separator',
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => {
                    app.quit();
                },
            }],
        });

        // Window menu.
        (template[3].submenu as MenuItemConstructorOptions[]).push({
            type: 'separator',
        }, {
                label: 'Bring All to Front',
                role: 'front',
            });
        addUpdateMenuItems(template[0].submenu as MenuItemConstructorOptions[], 1);
    }

    if (process.platform === 'win32') {
        const helpMenu = template[template.length - 1].submenu;
        addUpdateMenuItems(helpMenu as MenuItemConstructorOptions[], 0);
    }

    app.on('ready', () => {
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        updateLayoutMenuSelection();
    });

    app.on('browser-window-created', () => {
        const reopenMenuItem = findReopenMenuItem();
        if (reopenMenuItem) { reopenMenuItem.enabled = false; }
    });

    app.on('window-all-closed', () => {
        const reopenMenuItem = findReopenMenuItem();
        if (reopenMenuItem) { reopenMenuItem.enabled = true; }
    });
}

// exLinksBtn.addEventListener('click', function (event) {
// function openExternal(){
//     shell.openExternal('http://electron.atom.io')
//   }
// export function configurationMenuItems() {
//     const menu = Menu.getApplicationMenu()
//     if (process.mas) return
//     let editItem = findMenuItem('Edit');
//     if (!editItem) return;
//     let m = new MenuItem(template);
//     editItem.menu.append(m);
//     // menu.items[0].menu.append(m);
//     Menu.setApplicationMenu(menu)
// }
