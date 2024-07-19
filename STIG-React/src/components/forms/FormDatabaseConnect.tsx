import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import FormElementTextInput from './formElements/FormElementTextInput';
import ButtonBasic from '../elements/ButtonBasic';
import FormElementSelect from './formElements/FormElementSelect';
import { addDBConfig, editDBConfig, readDBConfigStorage } from '../../data/db-profile-storage';
import { DBProfile } from '@/interfaces/DBProfile';
import ConnectedDBContext, { ConnectedDBContextType } from '../../contexts/ConnectedDBContext';
import ButtonAdvanced from '../elements/ButtonAdvanced';
import { connectToNeo4jDB, disconnectFromNeo4jDB } from '../../data/neo4j-connection';

export default function FormDatabaseConnect ({selectedProfile, setSelectedProfile, inDBDeleteProcess, 
  isFormComplete, setIsFormComplete, setDBProfiles, dbOperationSuccessful, setDBOperationSuccessful}: 
  { selectedProfile: DBProfile | undefined,
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>
    inDBDeleteProcess: boolean,
    isFormComplete: boolean,
    setIsFormComplete: React.Dispatch<React.SetStateAction<boolean>>,
    setDBProfiles: React.Dispatch<React.SetStateAction<DBProfile[]>>,
    dbOperationSuccessful: boolean,
    setDBOperationSuccessful: React.Dispatch<React.SetStateAction<boolean>>
  }) {
  const dbTypeOptions = [
    "Neo4j"
  ];

  const { connectedDBProfile, setConnectedDBProfile,
    connectedDBDriver, setConnectedDBDriver
  } = useContext(ConnectedDBContext) as ConnectedDBContextType;

  // DB Profile form fields
  const [profileName, setProfileName] = useState<string>("");
  const [databaseType, setDatabaseType] = useState<string>(dbTypeOptions[0]);
  const [host, setHost] = useState<string>("");
  // todo: Is Database Name the same as Database Type
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
        type="text"
        value={profileName}
        onChange={(event) => {setProfileName(event.target.value)}}
        className='mb-1 col-start-2'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Friendly name to label this database profile.'
        additionalInfoClasses='tooltip-left'
      />
      <FormElementSelect
        placeholder="Database Type"
        value={databaseType}
        options={dbTypeOptions}
        onChange={(event) => {setDatabaseType(event.target.value)}}
        className='mb-1 col-start-2'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Type of database. Only currently supported type is Neo4j.'
        additionalInfoClasses='tooltip-left'
      />
      <FormElementTextInput
        placeholder="Host"
        type="text"
        value={host}
        onChange={(event) => {setHost(event.target.value)}}
        className='mb-1 col-start-2'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Connection url. Ex: neo4j://localhost:7687'
        additionalInfoClasses='tooltip-left'
      />
      <FormElementTextInput
        placeholder="Database Name"
        type="text"
        value={databaseName}
        onChange={(event) => {setDatabaseName(event.target.value)}}
        className='mb-1 col-start-2'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        // todo: Figure out what this does...
        infoText='Addie needs to figure out what this does...'
        additionalInfoClasses='tooltip-left'
      />
      <FormElementTextInput
        placeholder="Username"
        type="text"
        value={username}
        onChange={(event) => {setUsername(event.target.value)}}
        className='mb-1 col-start-2'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Database username. Ex: neo4j'
        additionalInfoClasses='tooltip-left'
      />
      <FormElementTextInput
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => {setPassword(event.target.value)}}
        className='mb-1 col-start-2'
        disabled={inDBDeleteProcess || 
          (selectedProfile && selectedProfile.Id === connectedDBProfile?.Id)
        }
        includeInfo={true}
        infoText='Database password.'
        additionalInfoClasses='tooltip-left'
      />
      <div className="flex justify-end col-start-2">
        <ButtonAdvanced 
          label={<>
            {selectedProfile && selectedProfile.Id === connectedDBProfile?.Id ? "Disconnect" : "Connect"}
            {isFormSubmitting ?
              <span className="loading loading-spinner loading-xs"></span>
              : null
            }
            {!dbOperationSuccessful ?
              <div className="tooltip tooltip-bottom tooltip-error" data-tip="ERROR: Unable to Connect">
                <span className="material-icons text-red-700">
                  error_outline
                </span>
              </div>
              : null
            }
          </>}
          color="btn-secondary"
          additionalClasses={"btn-sm mt-2 mr-2" + 
            (inDBDeleteProcess || !selectedProfile || isFormSubmitting ? 
              " btn-disabled" : ""
            )
          }
          onClick={async () => {
            setIsFormSubmitting(true);
            if(selectedProfile?.Id === connectedDBProfile?.Id) {
              // Disconnect
              const successfulDisconnect = await disconnectFromNeo4jDB(connectedDBDriver);
              if(successfulDisconnect) {
                setConnectedDBProfile(undefined);
                setConnectedDBDriver(undefined);
                setDBOperationSuccessful(true);
              } else {
                setDBOperationSuccessful(false);
              }
            } else {
              // Connect
              if(selectedProfile) {
                const [newDriver, successfulConnection] = await connectToNeo4jDB(connectedDBDriver, selectedProfile)
                if(successfulConnection) {
                  setConnectedDBDriver(newDriver);
                  setConnectedDBProfile(selectedProfile);
                  setDBOperationSuccessful(true);
                } else {
                  // todo: Need to investigate incorrect credentials
                  // not giving an error
                  setDBOperationSuccessful(false);
                }
              }
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
            const newDBProfile = {
              Id: selectedProfile ? selectedProfile.Id : uuidv4(),
              ProfileName: profileName,
              DatabaseType: databaseType,
              Host: host,
              DatabaseName: databaseName,
              Username: username,
              Password: password
            };
            // Save form data
            if(selectedProfile) {
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
      </div>
      {!isFormComplete ?
        <p className="flex justify-end text-red-700">
          Please double check that all fields above have been completed.
        </p>
        : null
      }
    </>
  );
};
