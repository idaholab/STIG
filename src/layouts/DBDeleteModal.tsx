import { cycore2stix } from '@/stix/stix';
import { Core } from 'cytoscape';
import React from 'react';

interface DBDeleteProps {
  cy?: Core;
}

const DBDeleteModal: React.FC<DBDeleteProps> = ({cy}) => {
  const nodes = cy?.nodes(':selected').map(cycore2stix).filter(s => s !== undefined) ?? [];;
  const edges = cy?.edges(':selected').map(cycore2stix).filter(s => s !== undefined) ?? [];

  return nodes.length + edges.length == 0 ? <div className='h-full relative'>
    <h2>Nothing to Delete</h2>
    {nodes.map(node => <div key={node.id}>{node.type}: {node.id}</div>)}
  </div> : <div className='h-full relative'>
    <h2>Delete These Objects From the Database?</h2>
    {nodes.map((node, i) => <div key={i}>{node.type}: {node.id}</div>)}
    {edges.map((edge, i) => <div key={i}>{edge.type}: {edge.id}</div>)}
  </div>;
};

export default DBDeleteModal;
