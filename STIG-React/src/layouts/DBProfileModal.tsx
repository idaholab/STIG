import React, { useContext, useState } from 'react';

import ButtonBasic from '../components/elements/ButtonBasic';
import ButtonIcon from '../components/elements/ButtonIcon';
import { editDBConfig, readDBConfigStorage, removeDBConfig } from '../data/db-profile-storage';
import { DBProfile } from '@/types/DBProfile';
import FormDatabaseConnect from '../components/forms/FormDatabaseConnect';
import ConnectedDBContext, { ConnectedDBContextType } from '../contexts/ConnectedDBContext';

const DBProfileModal: React.FC = () => {
  const {
    savedDBProfiles, setSavedDBProfiles, selectedProfile, setSelectedProfile
  } = useContext(ConnectedDBContext) as ConnectedDBContextType;

  const [isFormComplete, setIsFormComplete] = useState(true);
  const [inDBDeleteProcess, setInDBDeleteProcess] = useState(false);

  return (
    <div className='h-full relative'>
      {/* Database Delete Confirmation Dialog: */}
      {inDBDeleteProcess ?
        <DBDeleteConfirmationDialog
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          setInDBDeleteProcess={setInDBDeleteProcess}
          setDBProfiles={setSavedDBProfiles}
        />
        : undefined
      }
      <div className='flex flex-nowrap justify-between h-full'>
        {/* Database Profile Selector: */}
        <DBProfileSelector
          dbProfiles={savedDBProfiles}
          inDBDeleteProcess={inDBDeleteProcess}
          setInDBDeleteProcess={setInDBDeleteProcess}
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          setIsFormComplete={setIsFormComplete}
        />
        {/* Database Profile Form: */}
        <FormDatabaseConnect
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          inDBDeleteProcess={inDBDeleteProcess}
          isFormComplete={isFormComplete}
          setIsFormComplete={setIsFormComplete}
          setDBProfiles={setSavedDBProfiles}
        />
      </div>
    </div>
  );
};

function DBDeleteConfirmationDialog({ selectedProfile, setSelectedProfile, setInDBDeleteProcess,
  setDBProfiles
}:
  {
    selectedProfile: DBProfile | undefined,
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>,
    setInDBDeleteProcess: React.Dispatch<React.SetStateAction<boolean>>,
    setDBProfiles: React.Dispatch<React.SetStateAction<DBProfile[]>>
  }) {
  return (
    <div role="alert" className="alert text-base mb-8 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 text-gray-900 bg-accent-100 border-accent-900 dark:bg-accent-500 dark:border-accent-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-gray-900 dark:stroke-gray-900 h-10 w-10 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>
        Are you sure you wish to delete the profile for
        <span className="font-semibold">
          {selectedProfile?.ProfileName && selectedProfile?.ProfileName?.length > 50 ? ` '${selectedProfile?.ProfileName?.substring(0, 50)}'...` : ` '${selectedProfile?.ProfileName}'`}</span> ?
      </span>
      <ButtonBasic
        label={'Delete'}
        color={'btn-primary'}
        additionalClasses={`${'btn-sm'}`}
        onClick={() => {
          if (selectedProfile) {
            removeDBConfig(selectedProfile.Id);
            setInDBDeleteProcess(false);
            setSelectedProfile(undefined);
            setDBProfiles(readDBConfigStorage());
          }
        }}
      />

      <ButtonBasic
        label={'cancel'}
        color={'btn-ghost'}
        additionalClasses={`${'btn-sm text-gray-900'}`}
        onClick={() => {
          setInDBDeleteProcess(false);
        }}
      />
    </div>
  );
}

function DBProfileSelector({ dbProfiles, inDBDeleteProcess, setInDBDeleteProcess, selectedProfile,
  setSelectedProfile, setIsFormComplete }:
  {
    dbProfiles: DBProfile[],
    inDBDeleteProcess: boolean,
    setInDBDeleteProcess: React.Dispatch<React.SetStateAction<boolean>>,
    selectedProfile: DBProfile | undefined,
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>,
    setIsFormComplete: React.Dispatch<React.SetStateAction<boolean>>
  }
) {
  const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;

  return (
    <div className='rounded-box flex h-[256px]  bg-gray-300 dark:bg-gray-800 p-2 basis-2/5 '>
      <ul
        className="h-full flex flex-col flex-auto justify-between "
      >
        <div className={"scrollbar"}>
          {dbProfiles.map((profile) => {
            return (
              <li key={profile.Id} className={inDBDeleteProcess ? "disabled" : ""}>
                <a
                  className={!inDBDeleteProcess && selectedProfile?.Id === profile.Id ?
                    "bg-primary text-white hover:text-black dark:hover:text-white" : ""}
                  onClick={() => {
                    if (!inDBDeleteProcess) {
                      setSelectedProfile(profile);
                      setIsFormComplete(true);
                      profile.LastDBOperationSuccessful = true;
                      editDBConfig(profile);
                    }
                  }}
                >
                  {/* Display a star for the connected DB */}
                  {connectedDBProfile?.Id === profile.Id ?
                    <div className={`tooltip tooltip-right`} data-tip={"Connected"}>
                      <span className="material-icons">
                        star
                      </span>
                    </div>
                    : null
                  }
                  <div className={"truncate" + (connectedDBProfile?.Id !== profile.Id ? " ml-8" : "")}>
                    {profile.ProfileName}
                  </div>
                  {/* Display a trashcan for the selected DB
                as long as the selected DB is not connected */}
                  {selectedProfile?.Id === profile.Id &&
                    connectedDBProfile?.Id !== profile.Id ?
                    <div className="flex justify-end">
                      <ButtonIcon
                        label={"Delete Database Connection"}
                        color={"text-red-600"}
                        onClick={() => {
                          setInDBDeleteProcess(true);
                        }}
                        buttonIcon={"delete"}
                        buttonSize={"btn-xs"}
                      />
                    </div>
                    : null
                  }
                </a>
              </li>
            );
          })}
        </div>
        <li className="flex justify-start w-max">
          <ButtonBasic
            label="+ NEW"
            additionalClasses={"btn-sm mt-2" + (inDBDeleteProcess ? " btn-disabled" : "")}
            onClick={() => { setSelectedProfile(undefined) }}
          />
        </li>
      </ul>
    </div>
  );
}

export default DBProfileModal;
