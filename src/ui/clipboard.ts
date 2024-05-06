/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { Core } from '../stix';
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
    const parsed = JSON.parse(clipboard.readText());
    let objects: Core[];
    const test_stix = (i: any) => (i instanceof Object && Object.hasOwn(i, 'type') && Object.hasOwn(i, 'created'));
    if (Array.isArray(parsed)) {
      objects = parsed.every(test_stix) ? parsed : [];
    } else if (Object.hasOwn(parsed, 'type') && parsed.type !== 'bundle') {
      objects = test_stix(parsed) ? [parsed] as Core[] : [];
    } else {
      objects = [];
    }
    const graph = new GraphUtils(window.cycore);//, db);
    void graph.buildNodes(objects, 'GUI');
    graph.myLayout(StigSettings.Instance.layout);
  } catch {

  }
}
