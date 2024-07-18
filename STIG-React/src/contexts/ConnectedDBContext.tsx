import { DBProfile } from "@/interfaces/DBProfile";
import React, { createContext, useState } from "react";

export type ConnectedDBContextType = {
    connectedDBProfile: DBProfile | undefined,
    setConnectedDBProfile: React.Dispatch<React.SetStateAction<DBProfile | undefined>>
}
export const ConnectedDBContext = createContext<ConnectedDBContextType | null>(null);
export function ConnectedDBProvider({ children }: { children: React.ReactNode }){
    const [connectedDBProfile, setConnectedDBProfile] = useState<DBProfile | undefined>(undefined);

    return <ConnectedDBContext.Provider value={{
        connectedDBProfile, setConnectedDBProfile
    }}>{children}</ConnectedDBContext.Provider>
}
export default ConnectedDBContext
