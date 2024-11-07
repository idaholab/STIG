import React, { useState } from 'react';
import { currentDB, get_diff } from '@/util/DbFunctions';
import { Delta } from 'diffpatch';
import { StixObject } from '@/types/stixTypes/StixObject';
import { Core } from 'cytoscape';
import { cycore2stix } from '@/stix/stix';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { isRelationship } from '@/db/neo4j/isRelationship';

interface DBUpdateCyProps {
  type: "cytoscape";
  cy?: Core;
  selector: string;
}

interface DBUpdateObjsProps {
  type: "objects";
  objects: StixObject[];
}

type DBUpdateProps = DBUpdateCyProps | DBUpdateObjsProps;

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

const DBUpdateModal: React.FC<DBUpdateProps> = (props) => {
  let nodes: StixObject[];
  let edges: StixRelationshipObject[];
  if (props.type === "objects") {
    [nodes, edges] = [[],[]];
    for (const obj of props.objects) {
      (isRelationship(obj) ? edges : nodes).push(obj);
    }
  } else {
    const { cy, selector } = props;
    const cynodes = cy?.nodes(selector) ?? [];
    const nodeids = new Set(cynodes.map(n => n.id()));
    nodes = cynodes.map(cycore2stix).filter(s => s !== undefined);
    const cyedges = cy?.edges(selector).filter(e => nodeids.has(e.source().id()) && nodeids.has(e.target().id())) ?? [];
    edges = cyedges.map(cycore2stix).filter(s => s !== undefined) as StixRelationshipObject[];
  }
  const [state, setState] = useState({ diffs: [] as [StixObject, Delta][], isCalculated: false });
  if (nodes.length + edges.length > 0 && !state.isCalculated) {
    get_diff(nodes, edges as StixRelationshipObject[]).then(diffs => setState({ diffs, isCalculated: true }));
  }

  return <div className='h-full relative'>{
    !currentDB || currentDB.is_closed() ? <h2>Error: No Database Connection</h2> :
    nodes.length + edges.length == 0 || (state.isCalculated && state.diffs.length == 0) ? <h2>No Changes</h2> :
    !state.isCalculated ? <h3>Calculating Diff... ({nodes.length}/{edges.length})</h3> : <>
      <h2>Commit These Changes? ({nodes.length}/{edges.length})</h2>
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
