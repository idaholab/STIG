import React, { useContext, useState } from 'react';
import { DialogBasic } from '../elements/DialogBasic';
import DBProfileModal from '@/layouts/DBProfileModal';
import Dropdown from '../core/Dropdown';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import ButtonDBConnect from '../elements/ButtonDBConnect';

const DatabaseProfile: React.FC = () => {
  const { 
    savedDBProfiles, connectedDBProfile, setSelectedProfile,
  } = useContext(ConnectedDBContext) as ConnectedDBContextType;

  const [isConnectProcessing, setIsConnectProcessing] = useState(false);
  
  return (
    <Dropdown
      title="Database Profile"
      includeDropdownArrow
    >
      <div className='w-[230px]'>
        <div className='grid'>
          <p className="menu-title text-gray-500 dark:text-gray-400 font-normal py-0">Profile:</p>
          <div className={savedDBProfiles.length ? 'col-start-2 justify-self-end' : 'grid'}>
            <DialogBasic
              dialogId="DBProfileModal"
              title="Database Settings"
              buttonColor='btn-ghost'
              buttonSize="btn-xs"
              showFormButtons={false}
              onClose={() => setSelectedProfile(undefined)}
              buttonLabel={!savedDBProfiles.length ? 
                <>
                  <span className="material-icons">
                    add_circle
                  </span>
                  NEW PROFILE
                </>
                : undefined
              }
              buttonType={savedDBProfiles.length ? 'icon' : undefined}
              buttonIcon={savedDBProfiles.length ? 'add_circle' : undefined}
              additionalButtonClasses={!savedDBProfiles.length ? "justify-start" : undefined}
            >
              <DBProfileModal />
            </DialogBasic>
          </div>
        </div>
        {savedDBProfiles.length ?
          <ul>
            {savedDBProfiles.map(dbProfile => {
              return(
                <li key={dbProfile.Id} className='grid hover:bg-primary hover:text-white group h-[40px]'>
                  <a
                    className='py-1 pr-1 self-center hover:bg-transparent'
                    onClick={() => {
                      setSelectedProfile(dbProfile);
                      const dialogElement = document.getElementById("DBProfileModal") as HTMLDialogElement;
                      dialogElement.showModal();
                    }}
                  >
                    {connectedDBProfile?.Id === dbProfile.Id ?
                      <div className={`tooltip tooltip-right`} data-tip={"Connected"}>
                        <span className="material-icons">
                          star
                        </span>
                      </div>
                      : null
                    }
                    <div className={"truncate" + (connectedDBProfile?.Id !== dbProfile.Id ? " ml-8" : "")}>
                      {dbProfile.ProfileName}
                    </div>
                  </a>
                  <span className='col-start-2 justify-self-end hover:bg-primary hover:text-white pl-1'>
                    <ButtonDBConnect
                      dbProfile={dbProfile}
                      additionalButtonClasses='btn-xs hidden group-hover:flex bg-primary hover:bg-primary text-white hover:text-white !border-white'
                      isConnectProcessing={isConnectProcessing}
                      setIsConnectProcessing={setIsConnectProcessing}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
          : null
        }
        <div className="divider dark:divider-neutral my-0"></div>
        <p className="menu-title text-gray-500 dark:text-gray-400 font-normal py-0">Database Actions:</p>
      </div>
    </Dropdown>
  );
};

export default DatabaseProfile;
