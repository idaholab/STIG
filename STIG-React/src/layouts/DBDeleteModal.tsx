import { StixObject } from '@/types/stixTypes/StixObject';
import React from 'react';

interface DBDeleteProps {
  nodes: StixObject[];
}

const DBDeleteModal: React.FC<DBDeleteProps> = ({nodes}) => {
  return nodes.length == 0 ? <div className='h-full relative'>
    <h2>Nothing to Delete</h2>
    {nodes.map(node => <div key={node.id}>{node.type}: {node.id}</div>)}
  </div> : <div className='h-full relative'>
    <h2>Delete These Nodes?</h2>
    {nodes.map(node => <div>{node.type}: {node.id}</div>)}
  </div>;
};

export default DBDeleteModal;
