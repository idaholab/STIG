import { StixObject } from '@/types/Core';
import React, { createContext, useContext, useState } from 'react';

type StixPropsContextType = {
  // Had to add the "any" to this typing because VS Code was
  // not happy with any way I was attempting to check if a property
  // existed in the StixObject before attempting to use said property.
  selectedSTIXObject: StixObject | undefined | any;
  setSelectedSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>;
};

const StixPropsContext = createContext<StixPropsContextType | undefined>(undefined);

export const useStixPropsContext = () => {
  const context = useContext(StixPropsContext);
  if (!context) {
    throw new Error('useStixPropsContext must be used within a STIXPropsContextProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const StixPropsContextProvider: React.FC<Props> = ({ children }) => {
  const [selectedSTIXObject, setSelectedSTIXObject] = useState<StixObject | undefined>();

  return (
    <StixPropsContext.Provider value={{ selectedSTIXObject, setSelectedSTIXObject }}>
      {children}
    </StixPropsContext.Provider>
  );
};
