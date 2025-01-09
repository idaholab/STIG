import { JSONValue } from 'cytoscape';
import { buildNodes, getLayoutSettingsFromStore, runGraphLayout } from './GraphUtils';
import { StixObject } from '@/types/stixTypes/StixObject';

export const clipboard = {
  data: '',
  writeText: (text: string) => { clipboard.data = text; },
  readText: () => { return clipboard.data; }
};

export function graphCopy(cy: cytoscape.Core): void {
  const copied: JSONValue[] = [];
  cy.$(':selected').forEach((ele: cytoscape.SingularElementArgument) => {
    copied.push(ele.data('raw_data'));
  });
  clipboard.writeText(JSON.stringify(copied));
}



export function graphPaste(cy: cytoscape.Core): void {
  try {
    const parsed = JSON.parse(clipboard.readText());
    let objects: StixObject[];
    const test_stix = (i: any) => (i instanceof Object && Object.hasOwn(i, 'type') && Object.hasOwn(i, 'created'));
    if (Array.isArray(parsed)) {
      objects = parsed.every(test_stix) ? parsed : [];
    } else if (Object.hasOwn(parsed, 'type') && parsed.type !== 'bundle') {
      objects = test_stix(parsed) ? [parsed] as StixObject[] : [];
    } else {
      objects = [];
    }
    buildNodes(cy, objects, 'GUI');
    runGraphLayout(getLayoutSettingsFromStore(), cy);
  } catch (e) {
    console.error(e);
  }
}

