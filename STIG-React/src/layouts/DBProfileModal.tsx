import React, { useState } from 'react';

import ButtonBasic from '../components/elements/ButtonBasic';
import ButtonIcon from '../components/elements/ButtonIcon';
import { initializeDBConfigStorage, readDBConfigStorage, removeDBConfig } from '../data/database-configuration';
import { DBProfile } from '@/interfaces/DBProfile';
import FormDatabaseConnect from '../components/forms/FormDatabaseConnect';

const DBProfileModal: React.FC = () => {
  const [dbProfiles, setDBProfiles] = useState(readDBConfigStorage());
  if(!dbProfiles.length) {
    initializeDBConfigStorage();
  }
  const [selectedProfile, setSelectedProfile] = useState<DBProfile | undefined>();
  const [isFormComplete, setIsFormComplete] = useState(true);
  const [inDBDeleteProcess, setInDBDeleteProcess] = useState(false);

  return (
    <>
      {/* Database Delete Confirmation Dialog: */}
      {inDBDeleteProcess ?
        <DBDeleteConfirmationDialog
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          setInDBDeleteProcess={setInDBDeleteProcess}
          setDBProfiles={setDBProfiles}
        />
        : null
      }
      <div className='grid grid-rows-8 grid-flow-col'>
        {/* Database Profile Selector: */}
        <DBProfileSelector
          dbProfiles={dbProfiles}
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
          setDBProfiles={setDBProfiles}
        />
      </div>
    </>
  );
};

function DBDeleteConfirmationDialog({selectedProfile, setSelectedProfile, setInDBDeleteProcess, 
    setDBProfiles
  }: 
  { selectedProfile: DBProfile | undefined,
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>,
    setInDBDeleteProcess: React.Dispatch<React.SetStateAction<boolean>>,
    setDBProfiles: React.Dispatch<React.SetStateAction<DBProfile[]>>
  }) {
  return(
    <div role="alert" className="alert mb-8 w-6/12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-info h-6 w-6 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>Are you sure you wish to delete {selectedProfile?.ProfileName}?</span>
      <button 
        className="btn btn-sm btn-primary"
        onClick={() => {
          if(selectedProfile) {
            removeDBConfig(selectedProfile.Id);
            setInDBDeleteProcess(false);
            setSelectedProfile(undefined);
            setDBProfiles(readDBConfigStorage());
          }
        }}
      >
        Delete
      </button>
      <button 
        className="btn btn-sm"
        onClick={() => {
          setInDBDeleteProcess(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
}

function DBProfileSelector({dbProfiles, inDBDeleteProcess, setInDBDeleteProcess, selectedProfile, 
  setSelectedProfile, setIsFormComplete }:
  {
    dbProfiles: DBProfile[],
    inDBDeleteProcess: boolean,
    setInDBDeleteProcess: React.Dispatch<React.SetStateAction<boolean>>,
    selectedProfile: DBProfile | undefined,
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>,
    setIsFormComplete: React.Dispatch<React.SetStateAction<boolean>>,
  }
  ) {

  return(
    <ul className="overflow-y-scroll row-span-8 menu bg-gray-800 rounded-box w-56 h-252">
      {dbProfiles.map((profile) => {
        return(
          <li key={profile.Id} className={inDBDeleteProcess ? "disabled" : ""}>
            <a
              className={!inDBDeleteProcess && selectedProfile?.Id === profile.Id ? 
                "bg-primary" : ""}
              onClick={() => {
                if(!inDBDeleteProcess) {
                  setSelectedProfile(profile);
                  setIsFormComplete(true);
                }
              }}
            >
              {profile.ProfileName}
              {selectedProfile?.Id === profile.Id ?
                <div className="flex justify-end">
                  <ButtonIcon 
                    label={"Delete Database Connection"} 
                    color={"btn-ghost"} 
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
      <li className="absolute bottom-12">
        <ButtonBasic
          label="+ NEW"
          additionalClasses={"btn-sm" + (inDBDeleteProcess ? " btn-disabled" : "")}
          onClick={() => {setSelectedProfile(undefined)}}
        />
      </li>
    </ul>
  );
}

export default DBProfileModal;
