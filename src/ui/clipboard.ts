/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { clipboard, ipcRenderer } from 'electron';
import { BundleType, StixObject } from '../stix';
import { GraphUtils } from '../graph/graphFunctions';
import { StigDB } from '../db/db';
import { DatabaseConfigurationStorage } from '../storage';
import { StigSettings } from '../storage/stig-settings-storage';
import { JSONValue } from '../types/globals';

ipcRenderer.on("copy_selected", (_event: Electron.Event) => {
    graph_copy();
});

ipcRenderer.on("paste_elements", async (_event: Electron.Event) => {
    graph_paste();
});

export function graph_copy(): void {
    const copied: JSONValue[] = [];
    window.cycore.$(':selected').each(
        (ele: cytoscape.SingularElementArgument, _i: number, _eles: cytoscape.CollectionArgument) => {
            copied.push(ele.data('raw_data'));
        });
    clipboard.writeText(JSON.stringify(copied));
}

export async function graph_paste() {
    try {
        const parsed: StixObject | StixObject[] | BundleType = JSON.parse(clipboard.readText());
        const bundle: BundleType = {
            type: 'bundle',
            objects: [],
        };
        const test_stix = (i: any) => {
            const ret = i instanceof Object && i.hasOwnProperty('type') && i.hasOwnProperty('created');
            return ret;
        };
        if (Array.isArray(parsed)) {
            parsed.every(test_stix) ? bundle.objects = parsed : bundle.objects = [];
        } else if (parsed.hasOwnProperty('type') && parsed.type !== 'bundle' ) {
            test_stix(parsed) ? bundle.objects = [parsed] as StixObject[] : bundle.objects = [];
        }
        const db = await StigDB.new(DatabaseConfigurationStorage.Instance.current);

        const graph = new GraphUtils(window.cycore, db);
        graph.buildNodes(bundle);
        graph.myLayout(StigSettings.Instance.layout.toLowerCase());
        return;
    } catch {
        return;
    }
}

ipcRenderer.on("cut_selected", () => {
    const selected = window.cycore.$(':selected');
    graph_copy();
    window.cycore.remove(selected);
});
