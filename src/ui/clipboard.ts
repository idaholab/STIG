/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { BundleType, StixObject } from '../stix';
import { GraphUtils } from '../graph/graphFunctions';
import { StigSettings } from '../storage/stig-settings-storage';
import { JSONValue } from '../types/globals';

const clipboard = {
  data: '',
  writeText: (text: string) => { clipboard.data = text; },
  readText: () => { return clipboard.data; }
};

export function graph_copy (): void {
  const copied: JSONValue[] = [];
  window.cycore.$(':selected').each(
    (ele: cytoscape.SingularElementArgument, _i: number, _eles: cytoscape.CollectionArgument) => {
      copied.push(ele.data('raw_data'));
    });
  clipboard.writeText(JSON.stringify(copied));
}

export function graph_paste (): void {
  try {
    const parsed: StixObject | StixObject[] | BundleType = JSON.parse(clipboard.readText());
    const bundle: BundleType = {
      type: 'bundle',
      objects: []
    };
    const test_stix = (i: any) => {
      const ret = i instanceof Object && Object.prototype.hasOwnProperty.call(i, 'type') && Object.prototype.hasOwnProperty.call(i, 'created');
      return ret;
    };
    if (Array.isArray(parsed)) {
      parsed.every(test_stix) ? bundle.objects = parsed : bundle.objects = [];
    } else if (Object.prototype.hasOwnProperty.call(parsed, 'type') && parsed.type !== 'bundle') {
      test_stix(parsed) ? bundle.objects = [parsed] as StixObject[] : bundle.objects = [];
    }
    // const db = new StigDB(DatabaseConfigurationStorage.Instance.current);
    const graph = new GraphUtils(window.cycore);//, db);
    void graph.buildNodes(bundle);
    graph.myLayout(StigSettings.Instance.layout);
  } catch {

  }
}

// ipcRenderer.on("cut_selected", () => {
//     const selected = window.cycore.$(':selected');
//     graph_copy();
//     window.cycore.remove(selected);
// });
