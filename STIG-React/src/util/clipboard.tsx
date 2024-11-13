/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */


import { JSONValue } from 'cytoscape';
import { getLayoutSettingsFromStore, GraphUtils, runGraphLayout } from './GraphUtils';
import { StixObject } from '@/types/stixTypes/StixObject';
import { SafeStringify } from './SafeStringify';
import { useStigContext } from '@/contexts/StigContext';

const clipboard = {
  data: '',
  writeText: (text: string) => { clipboard.data = text; },
  readText: () => { return clipboard.data; }
};

export function graph_copy(cy: cytoscape.Core): void {
  const copied: JSONValue[] = [];
  const selectedElements = cy.elements(':selected');
  selectedElements.forEach((ele: cytoscape.SingularElementArgument) => {
    copied.push(ele.data('raw_data'));
  });
  const copiedText = SafeStringify(copied);
  //clipboard.writeText(SafeStringify(copied));
  // Use the Clipboard API to write the text to the system clipboard
  if (navigator.clipboard && window.isSecureContext) {
    // navigator.clipboard is available and the context is secure (HTTPS)
    navigator.clipboard.writeText(copiedText.toString()).then(
      () => {
        console.log('Copied to clipboard successfully!');
      },
      (err) => {
        console.error('Failed to copy to clipboard: ', err);
      }
    );
  } else {
    // Fallback: Copy to clipboard using a textarea element
    const textArea = document.createElement('textarea');
    textArea.value = copiedText.toString();
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'Copied to clipboard successfully!' : 'Failed to copy to clipboard';
      console.log(msg);
    } catch (err) {
      console.error('Failed to copy to clipboard: ', err);
    }
    document.body.removeChild(textArea);
  }
}

export function graph_paste(cy: cytoscape.Core): void {
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
    const graph = new GraphUtils(cy);//, db);
    void graph.buildNodes(objects, 'GUI');
    runGraphLayout(getLayoutSettingsFromStore(), cy);
  } catch (e) {
    console.error(e);
  }
}
