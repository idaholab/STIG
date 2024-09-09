/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { CollectionReturnValue, EdgeCollection, SingularElementArgument } from 'cytoscape';
import { StixObject, Relationship } from '../stix';
import { commit, db_delete } from './dbFunctions';

function cycore2stix (o: SingularElementArgument) {
  // TODO: actually create STIX
  const n = o.data('raw_data');
  return n === undefined
    ? n
    : {
        // The spec_version is mandatory, but sometimes it doesn't exist on the objects.
        // This adds it if it isn't there already.
        // TODO: It might be better to just add the spec_version when an object is created.
        spec_version: '2.1',
        ...n
      };
}

/*************************************
 * Commit all
 *
 * Takes each object from the graph and commits them to the database
 */
export async function commit_all () {
  let nodes = window.cycore.$('nodes');
  let edges = window.cycore.$('edges');
  const stix_nodes: StixObject[] = nodes.map(cycore2stix).filter(s => s !== undefined);
  const stix_edges: Relationship[] = edges.map(cycore2stix).filter(s => s !== undefined);

  $('.message-status').html(`Committing ${nodes.length + edges.length} to the database...`);
  const [cnodes, cedges] = await commit(stix_nodes, stix_edges);

  for (let i = 0; i < nodes.length; i++) {
    const ele = nodes[i];
    if (ele.data('raw_data') == undefined){
      nodes = nodes.filter(obj => {return obj !== ele});
      continue;
    }
    const { id } = ele.data('raw_data');
    if (cnodes.has(id)) {
      ele.data('saved', true);
    }
  }

  for (let i = 0; i < edges.length; i++) {
    const ele = edges[i];
    const { id } = ele.data('raw_data');
    if (ele.data('raw_data') == undefined){
      nodes = nodes.filter(obj => {return obj !== ele});
      continue;
    }
    if (cedges.has(id)) {
      ele.data('saved', true);
    }
  }

  $('.message-status').html(`Committed ${cnodes.size}/${stix_nodes.length} nodes and ${cedges.size}/${stix_edges.length} edges to the database.`);
}

// user selected delete selected from dropdown
// TODO: test single edge delete
export function delete_selected () {
  const selected: CollectionReturnValue = window.cycore.$(':selected');
  const vis: CollectionReturnValue = window.cycore.$(':visible');
  const edges: EdgeCollection = selected.edgesWith(vis);

  // Delete incoming/outgoing edges first.
  edges.forEach((ele) => { window.cycore.remove(ele); });

  selected.forEach((ele) => {
    // deleting a node deletes the edges connected to it as well
    void db_delete(ele.data('raw_data'));
    window.cycore.remove(ele);
  });

  $('.message-status').html(`Deleted ${selected.length + edges.length} objects from the database.`);
}
