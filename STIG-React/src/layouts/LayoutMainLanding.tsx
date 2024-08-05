import Graph from '@/components/Graphs/CytoGraph';
import React from 'react';

import { ConnectedDBProvider } from '../contexts/ConnectedDBContext';
import Menu from '@/components/core/Menu';

const LayoutMainLanding: React.FC = () => {
  return (
    <div id="graph" className="relative h-full w-full overflow-hidden">
      <ConnectedDBProvider>
        <Menu/>
      </ConnectedDBProvider>
      <div id="graph" className="h-full">
        <Graph />
      </div>
    </div>
  );
};

export default LayoutMainLanding;

