import { StixObject } from '@/types/stixTypes/StixObject';
import React, { createContext, useContext, useState } from 'react';

type StixPropsContextType = {
  selectionExists: boolean;
  setSelectionExists: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSTIXObject: StixObject | undefined;
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
  const [selectionExists, setSelectionExists] = useState<boolean>(false);

  return (
    <StixPropsContext.Provider value={{ selectedSTIXObject, setSelectedSTIXObject, selectionExists, setSelectionExists }}>
      {children}
    </StixPropsContext.Provider>
  );
};
