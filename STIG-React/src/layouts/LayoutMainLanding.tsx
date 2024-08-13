import Graph from '@/components/Graphs/CytoGraph';
import React from 'react';

import { ConnectedDBProvider } from '../contexts/ConnectedDBContext';
import Menu from '@/components/core/Menu';
import ButtonClearGraph from '@/components/core/ButtonClearGraph';

const LayoutMainLanding: React.FC = () => {
  return (
    <div id="graphContainer" className="relative h-full w-full overflow-hidden">
      <ConnectedDBProvider>
        <Menu />
      </ConnectedDBProvider>
      <ButtonClearGraph />
      <div id="graph" className="h-full">
        <Graph />
      </div>
    </div>
  );
};

export default LayoutMainLanding;

