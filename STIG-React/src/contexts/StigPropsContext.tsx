import React, { createContext, useContext, useState } from 'react';

type StigPropsContextType = {
  isDrawerOpen: boolean;
  cyInstance: cytoscape.Core | undefined;
  toggleDrawer: () => void;
  setCyInstance: React.Dispatch<React.SetStateAction<cytoscape.Core | undefined>>;
};

const StixPropsContext = createContext<StigPropsContextType | undefined>(undefined);

export const useStigPropsContext = () => {
  const context = useContext(StixPropsContext);
  if (!context) {
    throw new Error('useStixPropsContext must be used within a StigContextProvider');
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
    <StixPropsContext.Provider value={{ isDrawerOpen, toggleDrawer, cyInstance, setCyInstance }}>
      {children}
    </StixPropsContext.Provider>
  );
};
