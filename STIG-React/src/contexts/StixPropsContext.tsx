import { setProps } from '@/stix/stix';
import { StixObject } from '@/types/stixTypes/StixObject';
import React, { createContext, useContext, useState } from 'react';

type StixPropsContextType = {
  selectionExists: boolean;
  setSelectionExists: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSTIXObject: StixObject | undefined;
  setSelectedSTIXObject: (obj: StixObject | undefined) => void;
  nodesExist: boolean;
  setNodesExist: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [selectedSTIXObject, setSelectedSTIXObjectBase] = useState<StixObject | undefined>();
  const [selectionExists, setSelectionExists] = useState<boolean>(false);
  const [nodesExist, setNodesExist] = useState<boolean>(false);

  const setSelectedSTIXObject = (o: StixObject | undefined) => setSelectedSTIXObjectBase(o && setProps(o));

  return (
    <StixPropsContext.Provider
      value={{ selectedSTIXObject, setSelectedSTIXObject, selectionExists, setSelectionExists, nodesExist, setNodesExist }}
    >
      {children}
    </StixPropsContext.Provider>
  );
};
