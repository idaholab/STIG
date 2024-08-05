import React from 'react';
import Dropdown from '../core/Dropdown';

const Graph: React.FC = () => {
  return (
    <Dropdown
        title="Graph"
    >
        <li><a>Option 1</a></li>
        <li><a>Option 2</a></li>
    </Dropdown>
  );
};

export default Graph;
