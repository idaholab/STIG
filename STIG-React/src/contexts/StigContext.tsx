import { LayoutsType } from '@/graph/graphOptions';
import { defaultLayout, getLayoutSettingsFromStore, runGraphLayout, saveLayoutToLocalStorage } from '@/util/GraphUtils';
import React, { createContext, useContext, useState } from 'react';

type StigContextType = {
  isPropertyPanelOpen: boolean;
  setIsPropertyPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  panelWidth: number;
  setPanelWidth: React.Dispatch<React.SetStateAction<number>>;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cyInstance: cytoscape.Core | undefined;
  togglePropertyPanel: () => void;
  setCyInstance: React.Dispatch<React.SetStateAction<cytoscape.Core | undefined>>;
  getStigLayoutSettingsFromStore: () => string;
  storeStigLayoutSettings: (layout: string) => void;
  runLayout: (layoutType: string, cyInstance: cytoscape.Core) => void;
  storedLayout: string;
};

const StigContext = createContext<StigContextType | undefined>(undefined);

export const useStigContext = () => {
  const context = useContext(StigContext);
  if (!context) {
    throw new Error('useStigContext must be used within a StigContextProvider');
  }
  return context;
};

export type StigSettingsOptions = {
  layout: string;
}

type Props = {
  children: React.ReactNode;
};

export const StigContextProvider: React.FC<Props> = ({ children }) => {
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(480); // Default width in pixels
  const [cyInstance, setCyInstance] = useState<cytoscape.Core | undefined>(undefined);

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const [storedLayout, setStoredLayout] = useState<string>(defaultLayout);

  const storeStigLayoutSettings = (layout: string) => {
    saveLayoutToLocalStorage(layout);
  }
  const getStigLayoutSettingsFromStore = (): string => {
    return getLayoutSettingsFromStore();
  }
  const runLayout = (layoutType: keyof LayoutsType, cyInstance: cytoscape.Core) => {
    runGraphLayout(layoutType, cyInstance);
    setStoredLayout(getStigLayoutSettingsFromStore());
  }

  const togglePropertyPanel = () => {
    setIsPropertyPanelOpen(!isPropertyPanelOpen);
  };

  return (
    <StigContext.Provider value={{
      isPropertyPanelOpen, setIsPropertyPanelOpen,
      panelWidth, setPanelWidth, togglePropertyPanel,
      isDrawerOpen, setIsDrawerOpen,
      cyInstance, setCyInstance,
      getStigLayoutSettingsFromStore,
      storeStigLayoutSettings,
      runLayout, storedLayout }}>
      {children}
    </StigContext.Provider>
  );
};