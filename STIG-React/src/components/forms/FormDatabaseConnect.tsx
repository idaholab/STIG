import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import FormElementTextInput from './formElements/FormElementTextInput';
import FormElementPasswordInput from './formElements/FormElementPasswordInput';
import ButtonBasic from '../elements/ButtonBasic';
import FormElementSelect from './formElements/FormElementSelect';
import ButtonIcon from '../elements/ButtonIcon';
import { addDBConfig, editDBConfig, initializeDBConfigStorage, readDBConfigStorage, removeDBConfig } from '../../data/database-configuration';
import { DBProfile } from '@/interfaces/DBProfile';

const FormDatabaseConnect: React.FC = () => {
  let dbProfiles = readDBConfigStorage();
  if(!dbProfiles.length) {
    initializeDBConfigStorage();
  }

  const dbTypeOptions = [
    "Neo4j"
  ];

  const [selectedProfile, setSelectedProfile] = useState<DBProfile | undefined>();
  // DB Profile form fields
  const [profileName, setProfileName] = useState<string>("");
  const [databaseType, setDatabaseType] = useState<string>(dbTypeOptions[0]);
  const [host, setHost] = useState<string>("");
  const [databaseName, setDatabaseName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isFormComplete, setIsFormComplete] = useState(true);
  const [inDBDeleteProcess, setInDBDeleteProcess] = useState(false);

  useEffect(() => {
    setProfileName(selectedProfile?.ProfileName ?? "");
    setDatabaseType(selectedProfile?.DatabaseType ?? dbTypeOptions[0]);
    setHost(selectedProfile?.Host ?? "");
    setDatabaseName(selectedProfile?.DatabaseName ?? "");
    setUsername(selectedProfile?.Username ?? "");
    setPassword(selectedProfile?.Password ?? "");
  }, [selectedProfile]);

  return (
    <>
      {inDBDeleteProcess ?
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
        : null
      }
      <div className='grid grid-rows-8 grid-flow-col'>
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
        <FormElementTextInput
          placeholder="Profile Name"
          value={profileName}
          onChange={(event) => {setProfileName(event.target.value)}}
          className='mb-1'
          disabled={inDBDeleteProcess}
        />
        <FormElementSelect
          placeholder="Database Type"
          value={databaseType}
          options={dbTypeOptions}
          onChange={(event) => {setDatabaseType(event.target.value)}}
          className='mb-1'
          disabled={inDBDeleteProcess}
        />
        <FormElementTextInput
          placeholder="Host"
          value={host}
          onChange={(event) => {setHost(event.target.value)}}
          className='mb-1'
          disabled={inDBDeleteProcess}
        />
        <FormElementTextInput
          placeholder="Database Name"
          value={databaseName}
          onChange={(event) => {setDatabaseName(event.target.value)}}
          className='mb-1'
          disabled={inDBDeleteProcess}
        />
        <FormElementTextInput
          placeholder="Username"
          value={username}
          onChange={(event) => {setUsername(event.target.value)}}
          className='mb-1'
          disabled={inDBDeleteProcess}
        />
        <FormElementPasswordInput
          placeholder="Password"
          value={password}
          onChange={(event) => {setPassword(event.target.value)}}
          className='mb-1'
          disabled={inDBDeleteProcess}
        />
        <div className="flex justify-end">
          <ButtonBasic 
            label="Save" 
            color="btn-primary"
            additionalClasses={"btn-sm" + (inDBDeleteProcess ? " btn-disabled" : "")}
            onClick={() => {
              // Validate form data
              if(profileName === "" || databaseType === "" ||
                host === "" || databaseName === "" ||
                username === "" || password === ""
              ) {
                setIsFormComplete(false);
                return;
              } else {
                setIsFormComplete(true);
              }
              // Save form data
              if(selectedProfile) {
                // Edit selected database profile
                editDBConfig({
                  Id: selectedProfile.Id,
                  ProfileName: profileName,
                  DatabaseType: databaseType,
                  Host: host,
                  DatabaseName: databaseName,
                  Username: username,
                  Password: password
                });
              } else {
                // Create a new database profile
                addDBConfig({
                  Id: uuidv4(),
                  ProfileName: profileName,
                  DatabaseType: databaseType,
                  Host: host,
                  DatabaseName: databaseName,
                  Username: username,
                  Password: password
                });
              }
            }}
          />
        </div>
        {!isFormComplete ?
          <p className="flex justify-end text-red-600">
            Please double check that all fields above have been completed.
          </p>
          : null
        }
      </div>
    </>
  );
};

export default FormDatabaseConnect;
