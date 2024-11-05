import React, { useState } from 'react';
import { currentDB, get_diff } from '@/util/DbFunctions';
import { Delta } from 'diffpatch';
import { StixObject } from '@/types/stixTypes/StixObject';

interface DBUpdateProps {
  nodes: StixObject[];
}

const diffStyle = { color: "black", marginLeft: "20pt", width: "fit-content" };
const insertStyle = { backgroundColor: "#AAFFAA", ...diffStyle };
const deleteStyle = { backgroundColor: "#FFAAAA", ...diffStyle };
function * formatDiff(diff: Delta) {
  let k = 0;
  for (const [key, val] of Object.entries(diff) as [string, any[]][]) {
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

const DBUpdateModal: React.FC<DBUpdateProps> = ({nodes}) => {
  const [state, setState] = useState({ diffs: [] as [StixObject, Delta][], isCalculated: false });
  if (nodes.length && !state.isCalculated) {
    get_diff(nodes).then(diffs => setState({ diffs, isCalculated: true }));
  }

  return <div className='h-full relative'>{
    !currentDB || currentDB.is_closed() ? <h2>Error: No Database Connection</h2> :
    nodes.length == 0 || (state.isCalculated && state.diffs.length == 0) ? <h2>No Changes</h2> :
    !state.isCalculated ? <h3>Calculating Diff...</h3> : <>
      <h2>Commit These Changes?</h2>
      {state.diffs.map(([obj, diff]) =>
        <div key={obj.id}>
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
