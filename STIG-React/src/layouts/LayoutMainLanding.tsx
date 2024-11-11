import Graph from '@/graph/CytoGraph';
import React from 'react';

import { ConnectedDBProvider } from '../contexts/ConnectedDBContext';
import Menu from '@/components/core/Menu';
import ButtonClearGraph from '@/components/core/ButtonClearGraph';
import Notifications from '@/components/core/Notifications';

const LayoutMainLanding: React.FC = () => {
  return (
    <div id="graphContainer" className="relative h-full w-full overflow-hidden">
      <div className='m-4 flex flex-wrap items-start justify-between'>
        <Menu />
        <ButtonClearGraph />
      </div>
      <div id="graph" className="h-full w-full">
        <Graph />
      </div>
      <Notifications />
    </div>
  );
};

export default LayoutMainLanding;

