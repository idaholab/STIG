import React, { useState } from 'react';
import { currentDB, get_diff } from '@/util/DbFunctions';
import { Delta } from 'diffpatch';
import { StixObject } from '@/types/stixTypes/StixObject';
import { Core } from 'cytoscape';
import { cycore2stix } from '@/stix/stix';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';

interface DBUpdateProps {
  cy?: Core;
  selector: string;
}

const diffStyle = { color: "black", marginLeft: "20pt", width: "fit-content" };
const insertStyle = { backgroundColor: "rgb(var(--color-success-light-rgb))", ...diffStyle };
const deleteStyle = { backgroundColor: "rgb(var(--color-error-light-rgb))", ...diffStyle };
function * formatDiff(diff: Delta) {
  let k = 0;
  const entries = Object.entries(diff) as [string, any[]][];
  entries.sort(([a],[b]) => a.localeCompare(b));
  for (const [key, val] of entries) {
    switch(val.length) {
      case 1: yield <div key={k++} style={insertStyle}>"{key}": {JSON.stringify(val[0])}</div>; continue;
      case 2: yield <>
        <div key={k++} style={deleteStyle}>"{key}": {JSON.stringify(val[0])}</div>
        <div key={k++} style={insertStyle}>"{key}": {JSON.stringify(val[1])}</div>
      </>; continue;
      case 3: yield <div key={k++} style={deleteStyle}>"{key}": {JSON.stringify(val[0])}</div>; continue;
    }
  }
}

const DBUpdateModal: React.FC<DBUpdateProps> = ({ cy, selector }) => {
  const [state, setState] = useState({ nodes: 0, edges: 0, diffs: [] as [StixObject, Delta][], isCalculated: false });
  if (!state.isCalculated) {
    const cynodes = cy?.nodes(selector) ?? [];
    const nodeids = new Set(cynodes.map(n => n.id()));
    const nodes = cynodes.map(cycore2stix).filter(s => s !== undefined);
    const cyedges = cy?.edges(selector).filter(e => nodeids.has(e.source().id()) && nodeids.has(e.target().id())) ?? [];
    const edges = cyedges.map(cycore2stix).filter(s => s !== undefined) as StixRelationshipObject[];

    if (nodes.length + edges.length > 0) {
      get_diff(nodes, edges).then(diffs => setState({ nodes: nodes.length, edges: edges.length, diffs, isCalculated: true }));
    }
  }
  return <div className='h-full relative'>{
    !currentDB || currentDB.is_closed() ? <h2>Error: No Database Connection</h2> :
    (state.isCalculated && state.diffs.length == 0) ? <h2>No Changes</h2> :
    !state.isCalculated ? <h3>Calculating Diff... ({state.nodes}/{state.edges})</h3> : <>
      <h2>Commit These Changes? ({state.nodes}/{state.edges})</h2>
      {state.diffs.map(([obj, diff], i) =>
        <div key={i}>
          <h3>{obj.type}: {obj.id}</h3>
          {"{"}
          {[...formatDiff(diff)]}
          {"}"}
        </div>
      )}
    </>
  }</div>;
};

export default DBUpdateModal;
