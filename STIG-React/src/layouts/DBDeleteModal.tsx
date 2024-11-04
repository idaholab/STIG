import { NodeSingular } from 'cytoscape';
import { cycore2stix } from '@/stix/stix';
import React from 'react';

interface DBDeleteProps {
  nodes: NodeSingular[];
}

const DBDeleteModal: React.FC<DBDeleteProps> = ({nodes}) => {
  const stix_nodes = nodes.map(cycore2stix).filter(s => s !== undefined);

  return stix_nodes.length == 0 ? <div className='h-full relative'>
    <h2>Nothing to Delete</h2>
    {stix_nodes.map(node => <div key={node.id}>{node.type}: {node.id}</div>)}
  </div> : <div className='h-full relative'>
    <h2>Delete These Nodes?</h2>
    {stix_nodes.map(node => <div>{node.type}: {node.id}</div>)}
  </div>;
};

export default DBDeleteModal;
