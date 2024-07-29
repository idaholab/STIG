import React, { createContext, useContext, useState } from 'react';

type StixPropsContextType = {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
};

const StixPropsContext = createContext<StixPropsContextType | undefined>(undefined);

export const useStixPropsContext = () => {
  const context = useContext(StixPropsContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerContextProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const DrawerContextProvider: React.FC<Props> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <StixPropsContext.Provider value={{ isDrawerOpen, toggleDrawer }}>
      {children}
    </StixPropsContext.Provider>
  );
};
