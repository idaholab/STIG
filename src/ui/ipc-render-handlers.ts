/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { ipcRenderer, dialog } from "electron";
import { CollectionReturnValue, NodeSingular, EdgeCollection, CollectionElements} from 'cytoscape';
import { StigDB } from '../db';
import { StixObject, BundleType } from '../stix';
import { DatabaseConfigurationStorage } from '../storage';
// import { open } from 'fs';
import { openDatabaseConfiguration } from './database-config-widget';
import { newDatabaseConfiguration } from './new-database-widget';
import * as fileSaver from 'file-saver';
import * as uuid from 'uuid';

const getNodeMetadata = (nodes) => {
    return nodes.map(obj => ({
        id: obj.id(),
        position: obj.position(),
    }))
}

export async function setHandlers() {
    ipcRenderer.on("commit_all", async () => {
        const db = await StigDB.new(DatabaseConfigurationStorage.Instance.current);
        const to_save: CollectionReturnValue = window.cycore.$('[!saved]');
        const results: StixObject[] = [];
        const edges: StixObject[] = [];
        let numObjects = to_save.size();
        let itemsProcessed = 0;

        async function saveEdges(e: StixObject[]) {
            //do the edges
            e.forEach((stix_obj: StixObject) => {
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
            console.log(stix_obj);
            if (stix_obj === undefined) {
                numObjects--;
                return;
            }
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
                    $('.message-status').html(`Committed ${numObjects} objects to the database.`);
            }
            });
    });

    //user selected delete selected from dropdown
    //TODO: test single edge delete
    ipcRenderer.on("delete_selected", async () => {
        const db = await StigDB.new(DatabaseConfigurationStorage.Instance.current);
        const selected: CollectionReturnValue = window.cycore.$(':selected');
        // const to_save: CollectionReturnValue = window.cycore.$('[saved]');
        const vis: CollectionReturnValue = window.cycore.$(':visible');
        const edges: EdgeCollection = selected.edgesWith(vis);
        let sdoresults: StixObject[] = [];
        let sroresults: StixObject[] = [];
        let results: StixObject[] = [];

        async function delSelectedVertex(stix_obj: StixObject) {
            await db.sdoDestroyedUI(stix_obj)
                .then((result) => {
                    results.push(...result);
                })
                .catch((e) => {
                    // tslint:disable-next-line:no-console
                    console.error(e);
                });
        }

        async function delSelectedEdge(edge_obj: StixObject) {
            await db.sroDestroyedUI(edge_obj)
                .then((result) => {
                    results.push(...result);
                })
                .catch((e) => {
                    // tslint:disable-next-line:no-console
                    console.error(e);
                });

        }
        //Delete incoming/outgoing edges first.
        await edges.forEach(async (ele) => {
            const sro = ele.data('raw_data');
            await delSelectedEdge(sro);

            window.cycore.remove(ele);
        });

        await selected.forEach(async (ele) => {
            const sdo = ele.data('raw_data');
            await delSelectedVertex(sdo);

            window.cycore.remove(ele);
        });

        $('.message-status').html(`Deleted ${results} objects from the database.`);
    });

    //user selected delete view from db
    ipcRenderer.on("delete_all", async () => {
        const db = await StigDB.new(DatabaseConfigurationStorage.Instance.current);
        const to_save: CollectionReturnValue = window.cycore.$('[saved]');
        const results: StixObject[] = [];

        console.log('our db: ', db);

        //delete all things in graph that are in our to_save list
        console.log('saved: ', to_save);
        let toDelete: any[] = [];
        to_save.forEach( (ele) => {
            //sometimes to_save has an undefined element
            if(ele.data('raw_data')!==undefined){
                const stix_id = ele.data('raw_data').id;
                console.log('all id to delete', stix_id);
                toDelete.push(stix_id);
            }
        });
        console.log('deleting: ', toDelete);

        $('.message-status').html("deleted from databases")

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
        bundle.metadata = getNodeMetadata(nodes);

        // Convert to JSON and save
        const jsonToSave = JSON.stringify(bundle);
        const jsonBundleSave = new Blob([jsonToSave], { type: "application/json" });
        fileSaver.saveAs(jsonBundleSave, "bundle.json");
        $('.message-status').html(`Exported ${bundle.objects.length} objects`);
    });

    ipcRenderer.on("export_metadata", async () => {

        let nodes = window.cycore.$(':visible')

        const jsonObj = JSON.stringify({metadata: getNodeMetadata(nodes)}, null, 2);
        const blob = new Blob([jsonObj], { type: "application/json" });
        fileSaver.saveAs(blob, "metadata.json");
        $('.message-status').html("exported metadata")
    })
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
