import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import FormElementTextInput from './formElements/FormElementTextInput';
import FormElementPasswordInput from './formElements/FormElementPasswordInput';
import ButtonBasic from '../elements/ButtonBasic';
import FormElementSelect from './formElements/FormElementSelect';
import { addDBConfig, editDBConfig } from '../../data/database-configuration';
import { DBProfile } from '@/interfaces/DBProfile';

export default function FormDatabaseConnect ({selectedProfile, inDBDeleteProcess, 
  isFormComplete, setIsFormComplete}: 
  { selectedProfile: DBProfile | undefined,
    inDBDeleteProcess: boolean,
    isFormComplete: boolean,
    setIsFormComplete: React.Dispatch<React.SetStateAction<boolean>>
  }) {
  const dbTypeOptions = [
    "Neo4j"
  ];

  // DB Profile form fields
  const [profileName, setProfileName] = useState<string>("");
  const [databaseType, setDatabaseType] = useState<string>(dbTypeOptions[0]);
  const [host, setHost] = useState<string>("");
  const [databaseName, setDatabaseName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
    </>
  );
};
