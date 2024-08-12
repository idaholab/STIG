import { initializeDBConfigStorage, readDBConfigStorage } from "@/data/db-profile-storage";
import { DBProfile } from "@/types/DBProfile";
import { Driver } from "neo4j-driver";
import React, { createContext, useState } from "react";

export type ConnectedDBContextType = {
    connectedDBProfile: DBProfile | undefined;
    setConnectedDBProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>;
    connectedDBDriver: Driver | undefined;
    setConnectedDBDriver: React.Dispatch<React.SetStateAction<Driver | undefined>>;
    savedDBProfiles: DBProfile[];
    setSavedDBProfiles: React.Dispatch<React.SetStateAction<DBProfile[]>>;
    selectedProfile: DBProfile | undefined;
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>;
}
export const ConnectedDBContext = createContext<ConnectedDBContextType | null>(null);
export function ConnectedDBProvider({ children }: { children: React.ReactNode }){
    const [connectedDBProfile, setConnectedDBProfile] = useState<DBProfile | undefined>(undefined);
    const [connectedDBDriver, setConnectedDBDriver] = useState<Driver | undefined>(undefined);
    const [savedDBProfiles, setSavedDBProfiles] = useState(readDBConfigStorage());
    if(!savedDBProfiles.length) {
        initializeDBConfigStorage();
    }
    const [selectedProfile, setSelectedProfile] = useState<DBProfile | undefined>();

    return <ConnectedDBContext.Provider value={{
        connectedDBProfile, setConnectedDBProfile, connectedDBDriver, setConnectedDBDriver,
        savedDBProfiles, setSavedDBProfiles, selectedProfile, setSelectedProfile
    }}>{children}</ConnectedDBContext.Provider>
}

export default ConnectedDBContext;
