import React, { useContext, useState } from 'react';

import ButtonBasic from '../components/elements/ButtonBasic';
import ButtonIcon from '../components/elements/ButtonIcon';
import { editDBConfig, readDBConfigStorage, removeDBConfig } from '../data/db-profile-storage';
import { DBProfile } from '@/types/DBProfile';
import FormDatabaseConnect from '../components/forms/FormDatabaseConnect';
import ConnectedDBContext, { ConnectedDBContextType } from '../contexts/ConnectedDBContext';
import { DeleteCancelAlert } from '@/components/elements/DeleteCancelAlert';
import { mdiDeleteForever } from '@mdi/js';
import Icon from '@mdi/react';
import { mdilStar } from '@mdi/light-js';

const DBProfileLayout: React.FC = () => {
  const {
    savedDBProfiles, setSavedDBProfiles, selectedProfile, setSelectedProfile
  } = useContext(ConnectedDBContext) as ConnectedDBContextType;

  const [isFormComplete, setIsFormComplete] = useState(true);
  const [inDBDeleteProcess, setInDBDeleteProcess] = useState(false);

  const deleteProfile = () => {
    if (selectedProfile) {
      removeDBConfig(selectedProfile.Id);
      setInDBDeleteProcess(false);
      setSelectedProfile(undefined);
      setSavedDBProfiles(readDBConfigStorage());
    }
  }
  const cancelDeleteProfile = () => {
    setInDBDeleteProcess(false);
  }

  return (
    <div className='profileContainer flex flex-col h-fit w-full px-4 py-2'>
      {/* Database Delete Confirmation Dialog */}
      {inDBDeleteProcess ?
        <DeleteCancelAlert
          displayMessage={
            <span>
              Are you sure you wish to delete the profile for
              <span className="font-semibold">
                {selectedProfile?.ProfileName && selectedProfile?.ProfileName.length > 50
                  ? ` '${selectedProfile.ProfileName.substring(0, 50)}'...`
                  : ` '${selectedProfile?.ProfileName}'`}
              </span>?
            </span>
          }
          onDeleteClick={deleteProfile}
          onCancelClick={cancelDeleteProfile}
          className='w-fit py-0 px-4 absolute inset-2 flex items-center justify-center opacity-100 z-50 left'
        />
        : undefined
      }

      {/* Database Profile Selector */}
      <DBProfileSelector
        dbProfiles={savedDBProfiles}
        inDBDeleteProcess={inDBDeleteProcess}
        setInDBDeleteProcess={setInDBDeleteProcess}
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
        setIsFormComplete={setIsFormComplete}
      />

      {/* Database Profile Form */}
      <FormDatabaseConnect
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
        inDBDeleteProcess={inDBDeleteProcess}
        isFormComplete={isFormComplete}
        setIsFormComplete={setIsFormComplete}
        setDBProfiles={setSavedDBProfiles}
      />
    </div>
  );
};

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
  const profileSelectedClass = "bg-primary-700 hover:bg-primary text-neutralc-200 hover:text-white";
  const defaultClass = "bg-transparent hover:bg-primary hover:text-white";

  const getProfileListClassNames = (profile: DBProfile) => {
    return !inDBDeleteProcess && selectedProfile?.Id === profile.Id
      ? profileSelectedClass
      : defaultClass;
  };

  return (
    <div className='profileSelectorContainer flex flex-col h-full'>
      <div className='flex justify-between items-center w-full mb-2'>
        <span>Current Profiles</span>
        <ButtonBasic
          label="+ NEW"
          type="btn-neutralc"
          additionalClasses={"btn-xs" + (inDBDeleteProcess ? " btn-disabled" : "")}
          onClick={() => { setSelectedProfile(undefined) }}
        />
      </div>

      <div className='DBProfileSelector flex rounded-md bg-neutralc-300 dark:bg-neutralc-900 p-1 h-full'>
        <ul className="flex justify-between w-full min-h-[100px] max-h-[200px]">
          <div className={"flex flex-col h-full scrollbar"}>
            {dbProfiles.map((profile) => {
              return (
                <li key={profile.Id} className={inDBDeleteProcess ? "disabled" : "flex w-full"}>
                  <a
                    className={`py-1 px-2 flex justify-between items-center w-full ${getProfileListClassNames(profile)} `}
                    onClick={() => {
                      if (!inDBDeleteProcess) {
                        setSelectedProfile(profile);
                        setIsFormComplete(true);
                        profile.LastDBOperationSuccessful = true;
                        editDBConfig(profile);
                      }
                    }}
                  >
                    <span className='truncate flex items-center w-full'>
                      {/* Display a star for the connected DB */}
                      {connectedDBProfile?.Id === profile.Id ?
                        <div className={`tooltip tooltip-right flex items-center`} data-tip={"Connected"}>
                          <Icon path={mdilStar} size={1} className={`mr-2`} />
                        </div>
                        : null
                      }
                      <div className={`truncate items-center ${connectedDBProfile?.Id !== profile.Id ? "ml-8" : ""} `}>
                        {profile.ProfileName}
                      </div>
                    </span>
                    {/* Display a trashcan for the selected DB
                as long as the selected DB is not connected */}
                    {selectedProfile?.Id === profile.Id &&
                      connectedDBProfile?.Id !== profile.Id ?
                      <ButtonIcon
                        type={"text-error"}
                        onClick={() => {
                          setInDBDeleteProcess(true);
                        }}
                        buttonIcon={mdiDeleteForever}
                        iconText='Delete Database Connection'
                        buttonSize={"btn-xs"}
                      />
                      : null
                    }
                  </a>
                </li>
              );
            })}
          </div>
        </ul>
      </div>
    </div>
  );
}

export default DBProfileLayout;
