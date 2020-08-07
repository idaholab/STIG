/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { ipcRenderer, dialog } from "electron";
import { CollectionReturnValue, NodeSingular} from 'cytoscape';
import { StigDB } from '../db';
import { StixObject, BundleType } from '../stix';
import { DatabaseConfigurationStorage } from '../storage';
import { open } from 'fs';
import { openDatabaseConfiguration } from './database-config-widget';
import { newDatabaseConfiguration } from './new-database-widget';
import * as fileSaver from 'file-saver';
import * as uuid from 'uuid';

export async function setHandlers() {
    ipcRenderer.on("commit_all", () => {
        const db = new StigDB(DatabaseConfigurationStorage.Instance.current);
        const to_save: CollectionReturnValue = window.cycore.$('[!saved]');
        const results: StixObject[] = [];
        const edges: StixObject[] = [];
        let numObjects = to_save.size();
        let itemsProcessed = 0;

        async function saveEdges (edges: StixObject[]) { 
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
        }

        async function saveVertex(stix_obj: StixObject) {
            await db.updateDB(stix_obj)
            .then((result) => {
                results.push(...result);
            })
            .catch((e) => {
                // tslint:disable-next-line:no-console
                console.error(e);
            });
        }

        to_save.forEach(async (ele: NodeSingular, _i: number, _eles: CollectionReturnValue) => {
            const stix_obj = ele.data('raw_data');
            if (stix_obj === undefined) { return; }
            if (stix_obj['type'] === 'relationship') {
                // save edges for after all the nodes are done
                edges.push(stix_obj);
                itemsProcessed++;
                return;
            }

            await saveVertex(stix_obj);

            itemsProcessed++;
            //wait for all vertex to step through before saving edges
            if (itemsProcessed === numObjects){
                saveEdges(edges);
            }
        });

        $('.message-status').html(`Committed ${numObjects} objects`);

    });

    ipcRenderer.on("invert_selected", () => {
        const unselected = window.cycore.$(':unselected');
        const selected = window.cycore.$(':selected');
        selected.unselect();
        unselected.select();
    });

    ipcRenderer.on("export_selected", () => {
        const bundle_id = 'bundle--' + uuid.v4();
        const bundle = { type: 'bundle', id: bundle_id, objects: [] } as BundleType;
        
        let nodes = window.cycore.$(':selected');
        nodes.each((ele) => {
            if (ele.length === 0) {
                return;
            }
            //logic to remove null on json export
            if(ele.data('raw_data')!==undefined){
                bundle.objects.push(ele.data('raw_data'));
            }
        });

        const jsonToSave = JSON.stringify(bundle);
        const jsonBundleSave = new Blob([jsonToSave], { type: "application/json" });
        fileSaver.saveAs(jsonBundleSave, "bundle.json");
        $('.message-status').html(`Exported ${bundle.objects.length} objects`);

    });

    ipcRenderer.on("export_all", async () => {
        
        const bundle_id = 'bundle--' + uuid.v4();
        const bundle = { type: 'bundle', id: bundle_id, objects: [] } as BundleType;
        let nodes = window.cycore.$(':visible');
        nodes = nodes.union(nodes.connectedEdges());
        nodes.each((ele) => {
            if (ele.length === 0) {
                return;
            }
            //logic to remove null on json export
            if(ele.data('raw_data')!==undefined){
                bundle.objects.push(ele.data('raw_data'));
            }
        });

        // Convert to JSON and save
        const jsonToSave = JSON.stringify(bundle);
        const jsonBundleSave = new Blob([jsonToSave], { type: "application/json" });
        fileSaver.saveAs(jsonBundleSave, "bundle.json");
        $('.message-status').html(`Exported ${bundle.objects.length} objects`);
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
// export function saveFile(CollectionReturnValue node){
//     const bundle_id = 'bundle--' + uuid.v4();
//     const bundle = { type: 'bundle', id: bundle_id, objects: [] } as BundleType;
//     let nodesToSave = node;
//     nodesToSave = nodesToSave.union(nodesToSave.connectedEdges());
//     nodesToSave.each((ele) => {
//         if (ele.length === 0) {
//             return;
//         }
//         //logic to remove null on json export
//         if(ele.data('raw_data')!==undefined){
//             bundle.objects.push(ele.data('raw_data'));
//         }
//     });

//     // Convert to JSON and save
//     const jsonToSave = JSON.stringify(bundle);
//     const jsonBundleSave = new Blob([jsonToSave], { type: "application/json" });
//     fileSaver.saveAs(jsonBundleSave, "bundle.json");
//     $('.message-status').html(`Exported ${bundle.objects.length} objects`);
// }
