import React, { createContext, useContext, useState } from 'react';

type StigContextType = {
  isDrawerOpen: boolean;
  cyInstance: cytoscape.Core | undefined;
  toggleDrawer: () => void;
  setCyInstance: React.Dispatch<React.SetStateAction<cytoscape.Core | undefined>>;
};

const StigContext = createContext<StigContextType | undefined>(undefined);

export const useStigContext = () => {
  const context = useContext(StigContext);
  if (!context) {
    throw new Error('useStigContext must be used within a StigContextProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const StigContextProvider: React.FC<Props> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cyInstance, setCyInstance] = useState<cytoscape.Core | undefined>(undefined);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <StigContext.Provider value={{ isDrawerOpen, toggleDrawer, cyInstance, setCyInstance }}>
      {children}
    </StigContext.Provider>
  );
};