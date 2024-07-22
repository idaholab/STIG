import { DBProfile } from "@/interfaces/DBProfile";
import { Driver } from "neo4j-driver";
import React, { createContext, useState } from "react";

export type ConnectedDBContextType = {
    connectedDBProfile: DBProfile | undefined,
    setConnectedDBProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>,
    connectedDBDriver: Driver | undefined;
    setConnectedDBDriver: React.Dispatch<React.SetStateAction<Driver | undefined>>
}
export const ConnectedDBContext = createContext<ConnectedDBContextType | null>(null);
export function ConnectedDBProvider({ children }: { children: React.ReactNode }){
    const [connectedDBProfile, setConnectedDBProfile] = useState<DBProfile | undefined>(undefined);
    const [connectedDBDriver, setConnectedDBDriver] = useState<Driver | undefined>(undefined);

    return <ConnectedDBContext.Provider value={{
        connectedDBProfile, setConnectedDBProfile, connectedDBDriver, setConnectedDBDriver
    }}>{children}</ConnectedDBContext.Provider>
}
export default ConnectedDBContext
