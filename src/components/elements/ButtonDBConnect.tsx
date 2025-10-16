import React, { useContext } from 'react';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import ButtonBasic from '../elements/ButtonBasic';
import { connectToNeo4jDB, disconnectFromNeo4jDB } from '@/data/neo4j-connection';
import { DBProfile } from '@/types/DBProfile';
import { editDBConfig } from '@/data/db-profile-storage';
import { close_db, use_db } from '@/util/DbFunctions';
import Icon from '@mdi/react';
import { mdiAlertCircleOutline } from '@mdi/js';

interface ButtonDBConnectProps {
    dbProfile?: DBProfile;
    additionalButtonClasses?: string;
    isConnectProcessing: boolean;
    setIsConnectProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    inDBDeleteProcess?: boolean;
}

const ButtonDBConnect: React.FC<ButtonDBConnectProps> = ({
    dbProfile, additionalButtonClasses,
    isConnectProcessing, setIsConnectProcessing,
    inDBDeleteProcess
}) => {
    const { connectedDBProfile, setConnectedDBProfile,
        connectedDBDriver, setConnectedDBDriver,
    } = useContext(ConnectedDBContext) as ConnectedDBContextType;
    return (
        <ButtonBasic
            label={<span className='flex items-center'>
                {(dbProfile && dbProfile.Id === connectedDBProfile?.Id) ? "Disconnect" : "Connect"}
                {isConnectProcessing ?
                    <span className="loading loading-spinner loading-xs"></span>
                    : null
                }
                {dbProfile && !dbProfile?.LastDBOperationSuccessful ?
                    <div className="flex items-center ml-1 tooltip tooltip-bottom tooltip-error" data-tip="ERROR: Unable to Connect">
                        <Icon path={mdiAlertCircleOutline} size={.7} className="!dark:text-error text-error-light" />
                    </div>
                    : null
                }
            </span>}
            type="btn-neutralc"
            disabled={inDBDeleteProcess || !dbProfile || isConnectProcessing}
            additionalClasses={`${additionalButtonClasses}`}
            onClick={async () => {
                setIsConnectProcessing(true);
                if (dbProfile && dbProfile?.Id === connectedDBProfile?.Id) {
                    // Disconnect
                    await disconnectFromNeo4jDB(connectedDBDriver);
                    close_db();
                    setConnectedDBProfile(undefined);
                    setConnectedDBDriver(undefined);
                    dbProfile.LastDBOperationSuccessful = true;
                    editDBConfig(dbProfile);
                } else {
                    // Connect
                    if (dbProfile) {
                        const [newDriver, successfulConnection] = await connectToNeo4jDB(connectedDBDriver, dbProfile)
                        if (successfulConnection) {
                            setConnectedDBDriver(newDriver);
                            setConnectedDBProfile(dbProfile);
                            dbProfile.LastDBOperationSuccessful = true;
                            editDBConfig(dbProfile);
                            await use_db(dbProfile);
                        } else {
                            dbProfile.LastDBOperationSuccessful = false;
                            editDBConfig(dbProfile);
                        }
                    }
                }
                setIsConnectProcessing(false);
            }}
        />
    );
};

export default ButtonDBConnect;
