import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import FormElementTextInput from './formElements/FormElementTextInput';
import FormElementPasswordInput from './formElements/FormElementPasswordInput';
import ButtonBasic from '../elements/ButtonBasic';
import FormElementSelect from './formElements/FormElementSelect';
import { addDBConfig, editDBConfig, readDBConfigStorage } from '../../data/database-configuration';
import { DBProfile } from '@/interfaces/DBProfile';
import ConnectedDBContext, { ConnectedDBContextType } from '../../contexts/ConnectedDBContext';
import ButtonAdvanced from '../elements/ButtonAdvanced';

export default function FormDatabaseConnect ({selectedProfile, setSelectedProfile, inDBDeleteProcess, 
  isFormComplete, setIsFormComplete, setDBProfiles}: 
  { selectedProfile: DBProfile | undefined,
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>
    inDBDeleteProcess: boolean,
    isFormComplete: boolean,
    setIsFormComplete: React.Dispatch<React.SetStateAction<boolean>>,
    setDBProfiles: React.Dispatch<React.SetStateAction<DBProfile[]>>
  }) {
  const dbTypeOptions = [
    "Neo4j"
  ];

  const { connectedDBProfile, setConnectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;

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
    <>
      <FormElementTextInput
        placeholder="Profile Name"
        value={profileName}
        onChange={(event) => {setProfileName(event.target.value)}}
        className='mb-1'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
      />
      <FormElementSelect
        placeholder="Database Type"
        value={databaseType}
        options={dbTypeOptions}
        onChange={(event) => {setDatabaseType(event.target.value)}}
        className='mb-1'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
      />
      <FormElementTextInput
        placeholder="Host"
        value={host}
        onChange={(event) => {setHost(event.target.value)}}
        className='mb-1'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
      />
      <FormElementTextInput
        placeholder="Database Name"
        value={databaseName}
        onChange={(event) => {setDatabaseName(event.target.value)}}
        className='mb-1'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
      />
      <FormElementTextInput
        placeholder="Username"
        value={username}
        onChange={(event) => {setUsername(event.target.value)}}
        className='mb-1'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
      />
      <FormElementPasswordInput
        placeholder="Password"
        value={password}
        onChange={(event) => {setPassword(event.target.value)}}
        className='mb-1'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
      />
      <div className="flex justify-end">
        <ButtonAdvanced 
          label={<>
            {selectedProfile && selectedProfile.Id === connectedDBProfile?.Id ? "Disconnect" : "Connect"}
            {isFormSubmitting ?
              <span className="loading loading-spinner loading-xs"></span>
              : null
            }
          </>}
          color="btn-secondary"
          additionalClasses={"btn-sm mt-2 mr-2" + 
            (inDBDeleteProcess || !selectedProfile || isFormSubmitting ? 
              " btn-disabled" : ""
            )
          }
          onClick={() => {
            setIsFormSubmitting(true);
            if(selectedProfile?.Id === connectedDBProfile?.Id) {
              // Disconnect
              setConnectedDBProfile(undefined);
            } else {
              // Connect
              setConnectedDBProfile(selectedProfile);
            }
            setIsFormSubmitting(false);
          }}
        />
        <ButtonBasic 
          label="Save" 
          color="btn-primary"
          additionalClasses={"btn-sm mt-2" + 
            (inDBDeleteProcess || (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)  || 
              isFormSubmitting ? 
              " btn-disabled" : ""
            )
          }
          onClick={() => {
            setIsFormSubmitting(true);
            // Validate form data
            if(profileName === "" || databaseType === "" ||
              host === "" || databaseName === "" ||
              username === "" || password === ""
            ) {
              setIsFormComplete(false);
              setIsFormSubmitting(false);
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
              const newDBProfile = {
                Id: uuidv4(),
                ProfileName: profileName,
                DatabaseType: databaseType,
                Host: host,
                DatabaseName: databaseName,
                Username: username,
                Password: password
              };
              addDBConfig(newDBProfile);
              setSelectedProfile(newDBProfile);
            }
            setDBProfiles(readDBConfigStorage());
            setIsFormSubmitting(false);
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
