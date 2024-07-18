import React from 'react';

import { DialogBasic } from '../components/elements/DialogBasic';
import DBProfileModal from './DBProfileModal';
import { ConnectedDBProvider } from '../contexts/ConnectedDBContext';

const LayoutMainLanding: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="p-10">
        <p>Main Page!</p>
        <ConnectedDBProvider>
          <DialogBasic
            title="Neo4j Database Settings"
            buttonType="icon"
            buttonIcon="add"
            buttonColor='btn-secondary'
            buttonSize="btn-xs"
            showFormButtons={false}
          >
            <DBProfileModal/>
          </DialogBasic>
        </ConnectedDBProvider>
      </div>  
    </div>
  );
};

export default LayoutMainLanding;
