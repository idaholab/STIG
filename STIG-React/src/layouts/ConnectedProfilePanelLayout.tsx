import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import { mdiStarOutline, mdiStar } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useContext } from 'react';

const ConnectedProfilePanelLayout: React.FC = () => {
  const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;
  return (
    <span className="flex items-center justify-center w-full h-fit mt-2 mb-4 p-4 border border-neutralc-500 dark:border-neutralc-600 rounded-full dark:bg-neutralc-900 bg-neutralc-100 dark:text-neutralc-50 text-neutralc-950">
      <span className={`mr-2 text-neutralc-900 dark:text-neutralc-100 text-nowrap`}>Connected Profile:</span>
      <span className="truncate flex items-center w-fit">
        <span className="w-[24px] mr-1 flex-none flex items-center">
          {connectedDBProfile !== undefined ? (
            <Icon path={mdiStar} size={1} />
          ) : (
            <Icon path={mdiStarOutline} size={1} className={`text-neutralc-400 dark:text-neutralc-500`} />
          )}
        </span>
        <span className={`truncate h-fit ${connectedDBProfile !== undefined ? '' : 'text-neutralc-500 dark:text-neutralc-400'}`}>
          {connectedDBProfile !== undefined ? connectedDBProfile?.ProfileName : 'Not Connected'}
        </span>
      </span>
    </span>
  );
};
export default ConnectedProfilePanelLayout;
