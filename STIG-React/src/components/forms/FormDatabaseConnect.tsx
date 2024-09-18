import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormElementTextInput from './formElements/FormElementTextInput';
import ButtonBasic from '../elements/ButtonBasic';
import FormElementSelect from './formElements/FormElementSelect';
import { addDBConfig, editDBConfig, readDBConfigStorage } from '../../data/db-profile-storage';
import { DBProfile } from '@/types/DBProfile';
import ConnectedDBContext, { ConnectedDBContextType } from '../../contexts/ConnectedDBContext';
import ButtonDBConnect from '../elements/ButtonDBConnect';

export default function FormDatabaseConnect({ selectedProfile, setSelectedProfile, inDBDeleteProcess,
  isFormComplete, setIsFormComplete, setDBProfiles }:
  {
    selectedProfile: DBProfile | undefined,
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>
    inDBDeleteProcess: boolean,
    isFormComplete: boolean,
    setIsFormComplete: React.Dispatch<React.SetStateAction<boolean>>,
    setDBProfiles: React.Dispatch<React.SetStateAction<DBProfile[]>>
  }) {
  const dbTypeOptions = [
    "Neo4j"
  ];

  const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;

  // DB Profile form fields
  const [profileName, setProfileName] = useState<string>("");
  const [databaseType, setDatabaseType] = useState<string>(dbTypeOptions[0]);
  const [host, setHost] = useState<string>("");
  const [databaseName, setDatabaseName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  useEffect(() => {
    setProfileName(selectedProfile?.ProfileName ?? "");
    setDatabaseType(selectedProfile?.DatabaseType ?? dbTypeOptions[0]);
    setHost(selectedProfile?.Host ?? "");
    setDatabaseName(selectedProfile?.DatabaseName ?? "");
    setUsername(selectedProfile?.Username ?? "");
    setPassword(selectedProfile?.Password ?? "");
  }, [selectedProfile]);

  return (
    <div className='flex basis-3/6 flex-col'>
      <FormElementTextInput
        label="Profile Name *"
        type="text"
        value={profileName}
        onChange={(event) => { setProfileName(event.target.value) }}
        className='mb-2'
        disabled={inDBDeleteProcess ||
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Friendly label for this database profile'
        infoIcon='info_outline'
        additionalInputClasses='input-sm'
        additionalInfoClasses='tooltip-left'
        additionalLabelClasses='mr-5 w-48'
      />
      <FormElementSelect
        label="Database Type *"
        value={databaseType}
        options={dbTypeOptions}
        onChange={(event) => { setDatabaseType(event.target.value) }}
        className='mb-2'
        disabled={inDBDeleteProcess ||
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Type of database. Only currently supported type is Neo4j'
        additionalInfoClasses='tooltip-left'
        additionalClasses={'w-full'}
      />
      <FormElementTextInput
        label="Host *"
        type="text"
        value={host}
        onChange={(event) => { setHost(event.target.value) }}
        className='mb-2'
        disabled={inDBDeleteProcess ||
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Connection url. Ex: neo4j://localhost:7687'
        infoIcon='info_outline'
        additionalInputClasses='input-sm'
        additionalInfoClasses='tooltip-left'
        additionalLabelClasses='mr-5 w-48'
      />
      <FormElementTextInput
        label="Database Name *"
        type="text"
        value={databaseName}
        onChange={(event) => { setDatabaseName(event.target.value) }}
        className='mb-2'
        disabled={inDBDeleteProcess ||
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Database name to operate on. Ex: neo4j'
        infoIcon='info_outline'
        additionalInputClasses='input-sm'
        additionalInfoClasses='tooltip-left'
        additionalLabelClasses='mr-5 w-48'
      />
      <FormElementTextInput
        label="Username *"
        type="text"
        value={username}
        onChange={(event) => { setUsername(event.target.value) }}
        className='mb-2'
        disabled={inDBDeleteProcess ||
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Database username. Ex: neo4j'
        infoIcon='info_outline'
        additionalInputClasses='input-sm'
        additionalInfoClasses='tooltip-left'
        additionalLabelClasses='mr-5 w-48'
      />
      <FormElementTextInput
        label="Password *"
        type="password"
        value={password}
        onChange={(event) => { setPassword(event.target.value) }}
        className='mb-2'
        disabled={inDBDeleteProcess ||
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Database password'
        infoIcon='info_outline'
        additionalInputClasses='input-sm'
        additionalInfoClasses='tooltip-left'
        additionalLabelClasses='mr-5 w-48'
      />
      <div className="flex justify-between items-center">
        <span>* Required</span>
        <span>
          <ButtonDBConnect
            dbProfile={selectedProfile}
            additionalButtonClasses='btn-sm mt-2 mr-2'
            isConnectProcessing={isFormSubmitting}
            setIsConnectProcessing={setIsFormSubmitting}
            inDBDeleteProcess={inDBDeleteProcess}
          />
          <ButtonBasic
            label="Save"
            color="btn-primary"
            additionalClasses={"btn-sm mt-2" +
              (inDBDeleteProcess || (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id) ||
                isFormSubmitting ?
                " btn-disabled" : ""
              )
            }
            onClick={() => {
              setIsFormSubmitting(true);
              // Validate form data
              if (profileName === "" || databaseType === "" ||
                host === "" || databaseName === "" ||
                username === "" || password === ""
              ) {
                setIsFormComplete(false);
                setIsFormSubmitting(false);
                return;
              } else {
                setIsFormComplete(true);
              }
              const newDBProfile = {
                Id: selectedProfile ? selectedProfile.Id : uuidv4(),
                ProfileName: profileName,
                DatabaseType: databaseType,
                Host: host,
                DatabaseName: databaseName,
                Username: username,
                Password: password,
                LastDBOperationSuccessful: true
              };
              // Save form data
              if (selectedProfile) {
                // Edit selected database profile
                editDBConfig(newDBProfile);
              } else {
                // Create a new database profile
                addDBConfig(newDBProfile);
              }
              setSelectedProfile(newDBProfile);
              setDBProfiles(readDBConfigStorage());
              setIsFormSubmitting(false);
            }}
          />
        </span>
      </div>

      <p className="flex justify-end dark:text-red-300 text-red-700 mt-2 h-[20px]">
        {!isFormComplete ? 'Please complete all the required information.' : undefined}
      </p>

    </div>
  );
}
