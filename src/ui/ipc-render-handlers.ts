/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { ipcRenderer, dialog } from "electron";
import { CollectionReturnValue, NodeSingular} from 'cytoscape';
import { StigDB } from '../db';
import { StixObject } from '../stix';
import { DatabaseConfigurationStorage } from '../storage';
import { open } from 'fs';
import { openDatabaseConfiguration } from './database-config-widget';
import { newDatabaseConfiguration } from './new-database-widget';

export function setHandlers() {
    ipcRenderer.on("commit_all", () => {
        const db = new StigDB(DatabaseConfigurationStorage.Instance.current);
        const to_save: CollectionReturnValue = window.cycore.$('[!saved]');
        const results: StixObject[] = [];
        const edges: StixObject[] = [];
        to_save.forEach((ele: NodeSingular, _i: number, _eles: CollectionReturnValue) => {
            const stix_obj = ele.data('raw_data');
            if (stix_obj === undefined) { return; }
            if (stix_obj['type'] === 'relationship') {
                // save edges for after all the nodes are done
                edges.push(stix_obj);
                return;
            }
            db.updateDB(stix_obj)
                .then((result) => {
                    results.push(...result);
                })
                .catch((e) => {
                    // tslint:disable-next-line:no-console
                    console.error(e);
                },
            );
        });
        //do the edges
        edges.forEach((stix_obj: StixObject, _i: number, _eles: StixObject[]) => {
            db.updateDB(stix_obj)
                .then((result) => {
                    results.push(...result);
                })
                .catch((e) => {
                    // tslint:disable-next-line:no-console
                    console.error(e);
                },
            );
        })
    });

    ipcRenderer.on("invert_selected", () => {
        const unselected = window.cycore.$(':unselected');
        const selected = window.cycore.$(':selected');
        selected.unselect();
        unselected.select();
    });

    ipcRenderer.on("export_all", async () => {
        const filename = await dialog.showSaveDialog({title: 'Export All as JSON'});
        if (filename) {
            open(filename, 'w', (err, fd) => {
                if (err) { throw err; }
                if (!fd) { return; }
            });
        }
    });

    ipcRenderer.on("select_all", () => {
        window.cycore.elements().select();
    });

    ipcRenderer.on("OpenDatabaseConfiguration", () => {
        openDatabaseConfiguration();
    });

    ipcRenderer.on("NewDatabaseConfiguration", () => {
        newDatabaseConfiguration();
    });
}
