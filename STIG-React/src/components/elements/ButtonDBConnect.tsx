import React, { useContext } from 'react';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import ButtonBasic from '../elements/ButtonBasic';
import { connectToNeo4jDB, disconnectFromNeo4jDB } from '@/data/neo4j-connection';
import { DBProfile } from '@/types/DBProfile';
import { editDBConfig } from '@/data/db-profile-storage';
import { close_db, query, use_db } from '@/util/DbFunctions';
import { IDatabaseConfigOptions } from '@/storage/database-configuration-storage';

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
            label={<>
                {(dbProfile && dbProfile.Id === connectedDBProfile?.Id) ? "Disconnect" : "Connect"}
                {isConnectProcessing ?
                    <span className="loading loading-spinner loading-xs"></span>
                    : null
                }
                {dbProfile && !dbProfile?.LastDBOperationSuccessful ?
                    <div className="tooltip tooltip-bottom tooltip-error" data-tip="ERROR: Unable to Connect">
                        <span className="material-icons text-red-700">
                            error_outline
                        </span>
                    </div>
                    : null
                }
            </>}
            color="btn-secondary"
            additionalClasses={`${additionalButtonClasses}` +
                (inDBDeleteProcess || !dbProfile || isConnectProcessing ?
                    " btn-disabled" : ""
                )
            }
            onClick={async () => {
                setIsConnectProcessing(true);
                if (dbProfile && dbProfile?.Id === connectedDBProfile?.Id) {
                    // Disconnect
                    const successfulDisconnect = await disconnectFromNeo4jDB(connectedDBDriver);
                    close_db();
                    if (successfulDisconnect) {
                        setConnectedDBProfile(undefined);
                        setConnectedDBDriver(undefined);
                        dbProfile.LastDBOperationSuccessful = true;
                        editDBConfig(dbProfile);
                    } else {
                        dbProfile.LastDBOperationSuccessful = false;
                        editDBConfig(dbProfile);
                    }
                } else {
                    // Connect
                    if(dbProfile) {
                        const [newDriver, successfulConnection] = await connectToNeo4jDB(connectedDBDriver, dbProfile)
                        if (successfulConnection) {
                            setConnectedDBDriver(newDriver);
                            setConnectedDBProfile(dbProfile);
                            dbProfile.LastDBOperationSuccessful = true;
                            editDBConfig(dbProfile);
                            let conf: IDatabaseConfigOptions = {
                                host: dbProfile.Host,
                                db: dbProfile.DatabaseName,
                                name: dbProfile.ProfileName,
                                username: dbProfile.Username,
                                password: dbProfile.Password,
                                admin_user: dbProfile.Username,
                                admin_password: dbProfile.Password,
                            }
                            await use_db(conf);
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
