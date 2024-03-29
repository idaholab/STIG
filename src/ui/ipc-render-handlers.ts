/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

// import { ipcRenderer, dialog } from "electron";
import { CollectionReturnValue, NodeSingular, EdgeCollection, CollectionElements, SingularElementReturnValue} from 'cytoscape';
// import { StigDB } from '../db';
import { StixObject } from '../stix';
// import { open } from 'fs';
import { commit, db_delete } from '../db/dbFunctions';

const getNodeMetadata = (nodes) => {
    return nodes.map(obj => ({
        id: obj.id(),
        position: obj.position(),
    }))
}

/*************************************
 * Commit all
 * 
 * Takes each object from the graph and commits them to the database
 */
export async function commit_all() {
    // const db = new StigDB(DatabaseConfigurationStorage.Instance.current);
    const nodes: CollectionReturnValue = window.cycore.$('nodes');
    const edges: CollectionReturnValue = window.cycore.$('edges');

    $('.message-status').html(`Committing ${nodes.length + edges.length} to the database...`);

    let count = 0;
    let invalid = [];

    for (let i = 0; i < nodes.length; i++) {
        let ele = nodes[i]

        const stix_obj = ele.data('raw_data');
        // console.log(stix_obj);

        if (stix_obj !== undefined) {

            // The spec_version is mandatory, but sometimes it doesn't exist on the objects.
            // This adds it if it isn't there already.
            // TODO: It might be better to just add the spec_version when an object is created.
            if (!stix_obj.spec_version) {
                stix_obj.spec_version = "2.1"
            }

            if (await commit(stix_obj)) {
                count++
                ele.data("saved", true);
            } else {
                invalid.push(stix_obj.id)
            }
        }
        $('.message-status').html(`Committing object ${count + invalid.length} / ${nodes.length + edges.length} to the database...`);
    }

    for (let i = 0; i < edges.length; i++) {
        let ele = edges[i]

        const stix_obj = ele.data('raw_data');
     //console.log(stix_obj);

        if (stix_obj !== undefined) {

            // The spec_version is mandatory, but sometimes it doesn't exist on the objects.
            // This adds it if it isn't there already.
            // TODO: It might be better to just add the spec_version when an object is created.
            if (!stix_obj.spec_version) {
                stix_obj.spec_version = "2.1"
            }

            // Don't commit edges connected to invalid nodes
            if (!invalid.includes(stix_obj.source_ref) && !invalid.includes(stix_obj.target_ref)) {
                if (await commit(stix_obj)) {
                    count++
                    ele.data("saved", true);
                } else {
                    invalid.push(stix_obj.id)
                }
            } else {
                invalid.push(stix_obj)
            }
            
        }  
        $('.message-status').html(`Committing object ${count + invalid.length} / ${nodes.length + edges.length} to the database...`);
    }

    $('.message-status').html(`Committed ${count} objects to the database. ${invalid.length} objects were not commited.`);

}

    //user selected delete selected from dropdown
    //TODO: test single edge delete
    export async function delete_selected() {
        // const db = new StigDB(DatabaseConfigurationStorage.Instance.current);
        const selected: CollectionReturnValue = window.cycore.$(':selected');
        // const to_save: CollectionReturnValue = window.cycore.$('[saved]');
        const vis: CollectionReturnValue = window.cycore.$(':visible');
        const edges: EdgeCollection = selected.edgesWith(vis);
        let sdoresults: StixObject[] = [];
        let sroresults: StixObject[] = [];
        let results: StixObject[] = [];

        //Delete incoming/outgoing edges first.
        edges.forEach((ele) => {
            const sro = ele.data('raw_data');
            db_delete(sro)

            window.cycore.remove(ele);
        });

        selected.forEach((ele) => {
            const sdo = ele.data('raw_data');
            db_delete(sdo)

            window.cycore.remove(ele);
        });

        $('.message-status').html(`Deleted ${results} objects from the database.`);
    }

//     //user selected delete view from db
//     ipcRenderer.on("delete_all", () => {
//         const db = new StigDB(DatabaseConfigurationStorage.Instance.current);
//         const to_save: CollectionReturnValue = window.cycore.$('[saved]');
//         const results: StixObject[] = [];

//         console.log('our db: ', db);        

//         //delete all things in graph that are in our to_save list
//         console.log('saved: ', to_save);
//         let toDelete: any[] = [];
//         to_save.forEach( (ele) => {
//             //sometimes to_save has an undefined element
//             if(ele.data('raw_data')!==undefined){
//                 const stix_id = ele.data('raw_data').id;
//                 console.log('all id to delete', stix_id);
//                 toDelete.push(stix_id);
//             }
//         });
//         console.log('deleting: ', toDelete);
    
//         $('.message-status').html("deleted from databases")

//     });

//     ipcRenderer.on("invert_selected", () => {
//         const unselected = window.cycore.$(':unselected');
//         const selected = window.cycore.$(':selected');
//         selected.unselect();
//         unselected.select();
//     });

//     ipcRenderer.on("export_selected", () => {
//         const bundle_id = 'bundle--' + uuid.v4();
//         const bundle = { type: 'bundle', id: bundle_id, objects: [] } as BundleType;
        
//         let nodes = window.cycore.$(':selected');
//         nodes.each((ele) => {
//             if (ele.length === 0) {
//                 return;
//             }
//             //logic to remove null on json export
//             if(ele.data('raw_data')!==undefined){
//                 bundle.objects.push(ele.data('raw_data'));
//             }
//         });

//         const jsonToSave = JSON.stringify(bundle);
//         const jsonBundleSave = new Blob([jsonToSave], { type: "application/json" });
//         fileSaver.saveAs(jsonBundleSave, "bundle.json");
//         $('.message-status').html(`Exported ${bundle.objects.length} objects`);

//     });

//     ipcRenderer.on("export_all", async () => {

//         const bundle_id = 'bundle--' + uuid.v4();
//         const bundle = { type: 'bundle', id: bundle_id, objects: [] } as BundleType;
//         let nodes = window.cycore.$(':visible');
//         nodes = nodes.union(nodes.connectedEdges());
//         nodes.each((ele) => {
//             if (ele.length === 0) {
//                 return;
//             }
//             //logic to remove null on json export
//             if(ele.data('raw_data')!==undefined){
//                 bundle.objects.push(ele.data('raw_data'));
//             }
//             });
//         bundle.metadata = getNodeMetadata(nodes);

//         // Convert to JSON and save
//         const jsonToSave = JSON.stringify(bundle);
//         const jsonBundleSave = new Blob([jsonToSave], { type: "application/json" });
//         fileSaver.saveAs(jsonBundleSave, "bundle.json");
//         $('.message-status').html(`Exported ${bundle.objects.length} objects`);
//     });

//     ipcRenderer.on("export_metadata", async () => {

//         let nodes = window.cycore.$(':visible')

//         const jsonObj = JSON.stringify({metadata: getNodeMetadata(nodes)}, null, 2);
//         const blob = new Blob([jsonObj], { type: "application/json" });
//         fileSaver.saveAs(blob, "metadata.json");
//         $('.message-status').html("exported metadata")
//     })
//     ipcRenderer.on("select_all", () => {
//         window.cycore.elements().select();
//     });

//     ipcRenderer.on("OpenDatabaseConfiguration", () => {
//         openDatabaseConfiguration();
//     });

//     ipcRenderer.on("NewDatabaseConfiguration", () => {
//         newDatabaseConfiguration();
//     });
// }
