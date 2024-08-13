import Graph from '@/components/Graphs/CytoGraph';
import React from 'react';

import { ConnectedDBProvider } from '../contexts/ConnectedDBContext';
import Menu from '@/components/core/Menu';
import ButtonClearGraph from '@/components/core/ButtonClearGraph';

const LayoutMainLanding: React.FC = () => {
  return (
    <div id="graphContainer" className="relative h-full w-full overflow-hidden">
      <div className='m-4 flex flex-wrap items-start justify-between'>
        <ConnectedDBProvider>
          <Menu />
        </ConnectedDBProvider>
        <ButtonClearGraph />
      </div>

      <div id="graph" className="h-full w-full">
        <Graph />
      </div>
    </div>
  );
};

export default LayoutMainLanding;

