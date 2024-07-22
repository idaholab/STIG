
import Graph from '@/components/Graphs/CytoGraph';
import React from 'react';

import { DialogBasic } from '../components/elements/DialogBasic';
import DBProfileModal from './DBProfileModal';
import { ConnectedDBProvider } from '../contexts/ConnectedDBContext';

const LayoutMainLanding: React.FC = () => {
  return (
    <div id="graph" className="relative h-full w-full">
      <ConnectedDBProvider>
        <DialogBasic
          title="Database Settings"
          buttonType="icon"
          buttonIcon="add"
          buttonColor='btn-secondary'
          buttonSize="btn-xs"
          showFormButtons={false}
        >
          <DBProfileModal />
        </DialogBasic>
      </ConnectedDBProvider>
      <div id="graph" className="h-full">
        <Graph />
      </div>
    </div>
  );
};

export default LayoutMainLanding;

