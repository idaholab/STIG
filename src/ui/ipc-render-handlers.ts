/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { CollectionReturnValue, EdgeCollection } from 'cytoscape';
import { StixObject } from '../stix';
import { commit, db_delete } from './dbFunctions';

/*************************************
 * Commit all
 *
 * Takes each object from the graph and commits them to the database
 */
export async function commit_all () {
  const nodes: CollectionReturnValue = window.cycore.$('nodes');
  const edges: CollectionReturnValue = window.cycore.$('edges');

  $('.message-status').html(`Committing ${nodes.length + edges.length} to the database...`);

  let count = 0;
  const invalid: string[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const ele = nodes[i];

    const stix_obj = ele.data('raw_data');

    if (stix_obj !== undefined) {
      // The spec_version is mandatory, but sometimes it doesn't exist on the objects.
      // This adds it if it isn't there already.
      // TODO: It might be better to just add the spec_version when an object is created.
      if (!stix_obj.spec_version) {
        stix_obj.spec_version = '2.1';
      }

      if (await commit(stix_obj)) {
        count++;
        ele.data('saved', true);
      } else {
        invalid.push(stix_obj.id);
      }
    }
    const idx = count + invalid.length;
    const total = nodes.length + edges.length;
    $('.message-status').html(`Committing object ${idx} / ${total} to the database...`);
  }

  for (let i = 0; i < edges.length; i++) {
    const ele = edges[i];

    const stix_obj = ele.data('raw_data');
    // console.log(stix_obj);

    if (stix_obj !== undefined) {
      // The spec_version is mandatory, but sometimes it doesn't exist on the objects.
      // This adds it if it isn't there already.
      // TODO: It might be better to just add the spec_version when an object is created.
      if (!stix_obj.spec_version) {
        stix_obj.spec_version = '2.1';
      }

      // Don't commit edges connected to invalid nodes
      if (!invalid.includes(stix_obj.source_ref) && !invalid.includes(stix_obj.target_ref)) {
        if (await commit(stix_obj)) {
          count++;
          ele.data('saved', true);
        } else {
          invalid.push(stix_obj.id);
        }
      } else {
        invalid.push(stix_obj);
      }
    }
    $('.message-status')
      .html(`Committing object ${count + invalid.length} / ${nodes.length + edges.length} to the database...`);
  }

  $('.message-status').html(`Committed ${count} objects to the database. ${invalid.length} objects were not commited.`);
}

// user selected delete selected from dropdown
// TODO: test single edge delete
export function delete_selected () {
  const selected: CollectionReturnValue = window.cycore.$(':selected');
  const vis: CollectionReturnValue = window.cycore.$(':visible');
  const edges: EdgeCollection = selected.edgesWith(vis);
  const results: StixObject[] = [];

  // Delete incoming/outgoing edges first.
  edges.forEach((ele) => {
    const sro = ele.data('raw_data');
    void db_delete(sro);

    window.cycore.remove(ele);
  });

  selected.forEach((ele) => {
    const sdo = ele.data('raw_data');
    void db_delete(sdo);

    window.cycore.remove(ele);
  });

  $('.message-status').html(`Deleted ${results.length} objects from the database.`);
}
