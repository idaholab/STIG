import React, { useContext } from 'react';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import ButtonBasic from '../elements/ButtonBasic';
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
        isDBConnected, setIsDBConnected,
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
                    close_db();
                    setConnectedDBProfile(undefined);
                    setIsDBConnected(false);
                    dbProfile.LastDBOperationSuccessful = true;
                    editDBConfig(dbProfile);
                } else {
                    // Connect
                    if (dbProfile) {
                        try {
                            await use_db(dbProfile);
                            setIsDBConnected(true);
                            setConnectedDBProfile(dbProfile);
                            dbProfile.LastDBOperationSuccessful = true;
                            editDBConfig(dbProfile);
                        } catch {
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
