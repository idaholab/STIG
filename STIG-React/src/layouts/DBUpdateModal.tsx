import React, { useState } from 'react';
import { NodeSingular } from 'cytoscape';
import { cycore2stix } from '@/stix/stix';
import { get_diff } from '@/util/DbFunctions';
import { Delta, DiffPatcher } from 'diffpatch';
import { StixObject } from '@/types/stixTypes/StixObject';

interface DBUpdateProps {
  nodes: NodeSingular[];
}

const DBUpdateModal: React.FC<DBUpdateProps> = ({nodes}) => {
  const stix_nodes = nodes.map(cycore2stix).filter(s => s !== undefined);
  const [diffs, setDiffs] = useState([] as [StixObject, Delta][]);
  const [isCalculated, setCalculated] = useState(false);
  if (stix_nodes.length) get_diff(stix_nodes).then(ds => { setDiffs(ds); setCalculated(true); });

  const differ = new DiffPatcher();

  return <div className='h-full relative'>{
    stix_nodes.length == 0 || (isCalculated && diffs.length == 0) ? <h2>No Changes</h2> :
    !isCalculated ? <h3>Calculating Diff...</h3> : <>
      <h2>Commit These Changes?</h2>
      {diffs.map(([obj, diff]) => <div>
          <h3>{obj.type}: {obj.id}</h3>
          {differ.formatters.html(diff, obj)}
        </div>
      )}
    </>
  }</div>;
};

export default DBUpdateModal;
