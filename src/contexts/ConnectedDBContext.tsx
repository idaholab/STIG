import { initializeDBConfigStorage, readDBConfigStorage } from "@/data/db-profile-storage";
import { DBProfile } from "@/types/DBProfile";
import { ApiStigDB } from "@/db/api";
import { setCurrentDB } from "@/util/DbFunctions";
import React, { createContext, useEffect, useState } from "react";

export type ConnectedDBContextType = {
    connectedDBProfile?: DBProfile;
    setConnectedDBProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>;
    isDBConnected: boolean;
    setIsDBConnected: React.Dispatch<React.SetStateAction<boolean>>;
    savedDBProfiles: DBProfile[];
    setSavedDBProfiles: React.Dispatch<React.SetStateAction<DBProfile[]>>;
    selectedProfile?: DBProfile;
    setSelectedProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>;
}
export const ConnectedDBContext = createContext<ConnectedDBContextType>({
    savedDBProfiles: [],
    isDBConnected: false,
    setConnectedDBProfile() {},
    setIsDBConnected() {},
    setSavedDBProfiles() {},
    setSelectedProfile() {},
});
export function ConnectedDBProvider({ children }: { children: React.ReactNode }){
    const [connectedDBProfile, setConnectedDBProfile] = useState<DBProfile | undefined>(undefined);
    const [isDBConnected, setIsDBConnected] = useState(false);
    const [savedDBProfiles, setSavedDBProfiles] = useState(readDBConfigStorage());
    if(!savedDBProfiles.length) {
        initializeDBConfigStorage();
    }
    const [selectedProfile, setSelectedProfile] = useState<DBProfile | undefined>();

    // Check if the server auto-connected to Neo4j on its own (via NEO4J_AUTOCONNECT).
    // dbConnected alone isn't enough to show this -- the DB connection is a single
    // shared server-side instance, so dbConnected can be true because *another*
    // tab or user connected it manually. Only autoConnected means it was genuinely
    // the server's own startup auto-connect, so only that gets shown here.
    useEffect(() => {
        if (connectedDBProfile) return; // already connected via UI
        const checkHealth = async () => {
            try {
                const res = await fetch('/api/health');
                const data = await res.json();
                if (data.autoConnected) {
                    const autoProfile: DBProfile = {
                        Id: 'auto',
                        ProfileName: 'Server (auto-connected)',
                        DatabaseType: 'Neo4j',
                        Host: '',
                        DatabaseName: data.databaseName || '',
                        Username: '',
                        Password: '',
                        LastDBOperationSuccessful: true,
                    };
                    // Initialize the client-side DB so queries route through the API
                    const apiDb = new ApiStigDB();
                    apiDb.markConnected(autoProfile);
                    setCurrentDB(apiDb);
                    setIsDBConnected(true);
                    setConnectedDBProfile(autoProfile);
                }
            } catch { /* server not reachable yet */ }
        };
        // Poll a few times since Neo4j may still be starting
        const interval = setInterval(checkHealth, 3000);
        checkHealth();
        return () => clearInterval(interval);
    }, [connectedDBProfile]);

    return (
        <ConnectedDBContext.Provider value={{
            connectedDBProfile, setConnectedDBProfile, isDBConnected, setIsDBConnected,
            savedDBProfiles, setSavedDBProfiles, selectedProfile, setSelectedProfile
        }}>{children}</ConnectedDBContext.Provider>
    );
}

export default ConnectedDBContext;
