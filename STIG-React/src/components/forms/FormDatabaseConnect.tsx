import React, { useEffect, useState } from 'react';

import FormElementTextInput from './formElements/FormElementTextInput';
import FormElementPasswordInput from './formElements/FormElementPasswordInput';
import ButtonBasic from '../elements/ButtonBasic';
import FormElementSelect from './formElements/FormElementSelect';

const FormDatabaseConnect: React.FC = () => {
  // todo: Remove
  const dbProfiles:DBProfile[] = [
    {
      Id: "868feb99-9015-4cad-8e46-a6c18bc1c880",
      ProfileName: "Neo4j Profile 1",
      DatabaseType: "Neo4j",
      Host: "http://profile1",
      DatabaseName: "Neo4j",
      Username: "Neo4j",
      Password: "toor"
    }, 
    {
      Id: "36bd38f0-74b3-4338-a057-33fc62f7e1ce",
      ProfileName: "Neo4j Profile 2",
      DatabaseType: "Neo4j",
      Host: "bolt://catchdev1:7687",
      DatabaseName: "Neo4jInstance1",
      Username: "Neo4jDbUserName",
      Password: "wordswordswords"
    }, 
    {
      Id: "b2467060-0cb2-4e1d-a582-6d95de286ba6",
      ProfileName: "Neo4j Profile 3",
      DatabaseType: "Neo4j",
      Host: "http://profile1",
      DatabaseName: "Neo4j",
      Username: "Neo4j",
      Password: "toor"
    }, 
    {
      Id: "c939c166-6c61-4e0c-8532-d8daa96838dd",
      ProfileName: "Neo4j Profile 4",
      DatabaseType: "Neo4j",
      Host: "http://profile1",
      DatabaseName: "Neo4j",
      Username: "Neo4j",
      Password: "toor"
    },
    // {
    //   Id: "f8d6f6d6-e004-453f-b9a4-a485ea25b015",
    //   ProfileName: "Neo4j Profile 5",
    //   DatabaseType: "Neo4j",
    //   Host: "http://profile1",
    //   DatabaseName: "Neo4j",
    //   Username: "Neo4j",
    //   Password: "toor"
    // },
    // {
    //   Id: "bf21bbe8-5c4d-40d4-b291-1408e0bffeee",
    //   ProfileName: "Neo4j Profile 6",
    //   DatabaseType: "Neo4j",
    //   Host: "http://profile1",
    //   DatabaseName: "Neo4j",
    //   Username: "Neo4j",
    //   Password: "toor"
    // },
    // {
    //   Id: "b64394d4-d1f5-4e16-8202-69f0af66774a",
    //   ProfileName: "Neo4j Profile 7",
    //   DatabaseType: "Neo4j",
    //   Host: "http://profile1",
    //   DatabaseName: "Neo4j",
    //   Username: "Neo4j",
    //   Password: "toor"
    // },
    // {
    //   Id: "b64394d4-d1f5-4e16-8202-69f0af66774a",
    //   ProfileName: "Neo4j Profile 7",
    //   DatabaseType: "Neo4j",
    //   Host: "http://profile1",
    //   DatabaseName: "Neo4j",
    //   Username: "Neo4j",
    //   Password: "toor"
    // }
  ];

  const [selectedProfile, setSelectedProfile] = useState<DBProfile | undefined>();
  const [profileName, setProfileName] = useState<string | undefined>();
  const [databaseType, setDatabaseType] = useState<string | undefined>();
  const [host, setHost] = useState<string | undefined>();
  const [databaseName, setDatabaseName] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  useEffect(() => {
    console.log("In useEffect");
    setProfileName(selectedProfile?.ProfileName ?? undefined);
    setDatabaseType(selectedProfile?.DatabaseType ?? undefined);
    setHost(selectedProfile?.Host ?? undefined);
    setDatabaseName(selectedProfile?.DatabaseName ?? undefined);
    setUsername(selectedProfile?.Username ?? undefined);
    setPassword(selectedProfile?.Password ?? undefined);
  }, [selectedProfile]);

  return (
    <div className='grid grid-rows-7 grid-flow-col'>
      <ul className="overflow-y-scroll row-span-7 menu bg-gray-800 rounded-box w-56 h-252">
        {dbProfiles.map((profile) => {
          return(
            <li key={profile.Id}>
              <a
                className={selectedProfile?.Id === profile.Id ? "bg-primary" : ""}
                onClick={() => {setSelectedProfile(profile)}}
              >
                {profile.ProfileName}
              </a>
            </li>
          );
        })}
        <li className="absolute bottom-12">
          <ButtonBasic
            label="+ NEW"
            additionalClasses='btn-sm'
            onClick={() => {setSelectedProfile(undefined)}}
          />
        </li>
      </ul>
      <FormElementTextInput
        placeholder="Profile Name"
        value={profileName}
        onChange={(event) => {setProfileName(event.target.value)}}
        className='mb-1'
      />
      <FormElementSelect
        placeholder="Database Type"
        value={databaseType}
        options={["Neo4j"]}
        onChange={(event) => {setDatabaseType(event.target.value)}}
        className='mb-1'
      />
      <FormElementTextInput
        placeholder="Host"
        value={host}
        onChange={(event) => {setHost(event.target.value)}}
        className='mb-1'
      />
      <FormElementTextInput
        placeholder="Database Name"
        value={databaseName}
        onChange={(event) => {setDatabaseName(event.target.value)}}
        className='mb-1'
      />
      <FormElementTextInput
        placeholder="Username"
        value={username}
        onChange={(event) => {setUsername(event.target.value)}}
        className='mb-1'
      />
      <FormElementPasswordInput
        placeholder="Password"
        value={password}
        onChange={(event) => {setPassword(event.target.value)}}
        className='mb-1'
      />
      <div className="flex justify-end">
        <ButtonBasic 
          label="Save" 
          color="btn-primary"
          additionalClasses="btn-sm"
        />
      </div>
    </div>
  );
};

export default FormDatabaseConnect;
