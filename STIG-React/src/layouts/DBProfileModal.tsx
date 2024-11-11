import React, { useContext, useState } from 'react';

import ButtonBasic from '../components/elements/ButtonBasic';
import ButtonIcon from '../components/elements/ButtonIcon';
import { editDBConfig, readDBConfigStorage, removeDBConfig } from '../data/db-profile-storage';
import { DBProfile } from '@/types/DBProfile';
import FormDatabaseConnect from '../components/forms/FormDatabaseConnect';
import ConnectedDBContext, { ConnectedDBContextType } from '../contexts/ConnectedDBContext';
import { DeleteCancelAlert } from '@/components/elements/DeleteCancelAlert';

const DBProfileModal: React.FC = () => {
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
    <div className='h-full relative'>
      {/* Database Delete Confirmation Dialog: */}
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
    <div className='rounded-box flex h-[452px] bg-neutralc-300 dark:bg-neutralc-800 p-2 basis-2/5 '>
      <ul className="h-full flex flex-col flex-auto justify-between">
        <div className={"scrollbar"}>
          {dbProfiles.map((profile) => {
            return (
              <li key={profile.Id} className={inDBDeleteProcess ? "disabled" : ""}>
                <a
                  className={getProfileListClassNames(profile)}
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
                        type={"text-error"}
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
