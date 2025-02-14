import React, { useEffect, useState } from 'react';
import { useStixPropsContext } from '../contexts/StixPropsContext.tsx';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty.ts';
import { SchemaSTIXClass } from '@/types/stixSchemaTypes/SchemaSTIXClass.ts';
import { schema } from '@/stix/schema.ts';
import { getSTIXPropsFromSchema } from '@/stix/getSTIXPropsFromSchema.ts';
import FormSTIXPropsPanel from '@/components/forms/FormSTIXPropsPanel.tsx';
import { stencilItems } from '@/components/elements/StencilItems.ts';
import FormSTIXPropertySelection from '@/components/forms/FormSTIXPropertySelection.tsx';
import ButtonSTIXJSON from '@/components/elements/ButtonSTIXJSON.tsx';
import { propertyDescriptions } from '@/stix/propertyDescriptions.ts';
import { getSTIXPropDescriptions } from '@/stix/getSTIXPropDescriptions.ts';
import SaveButtons from '@/components/elements/SaveButtons.tsx';
import { useStigContext } from '@/contexts/StigContext.tsx';
import AlertComponent from '@/components/elements/AlertComponent.tsx';
import TabsComponent from '@/components/elements/TabsComponent.tsx';
import {
  mdiRocketLaunchOutline,
  mdiDatabaseOutline,
  mdiDatabaseEyeOutline,
  mdiLayersTripleOutline,
  mdiDatabaseCogOutline,
  mdiCogOutline,
} from '@mdi/js';
import ContextLayouts from '@/components/dropdowns/ContextLayouts.tsx';
import DBProfileLayout from './DBProfile.tsx';
import DBOperationsContainer from './DBOperationsContainer.tsx';
import DBExamplesContainer from './DBExamplesContainer.tsx';

type TabContent = {
  label: string;
  icon: string;
  content?: React.ReactNode;
};

type GraphPanelProperties = {
  selectedProperties: SchemaSTIXProperty[];
  setSelectedProperties: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
  stixTypeProps: SchemaSTIXProperty[];
  setStixTypeProps: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
  showJson?: boolean;
  setIsShowingJson: React.Dispatch<React.SetStateAction<boolean>>;
  activeGraphTab?: number;
  setActiveGraphTab?: React.Dispatch<React.SetStateAction<number>>;
};

const StixPropsPanel: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState<SchemaSTIXProperty[]>([]);
  const [showJson, setShowJson] = useState<boolean>(false);
  // Used to determine which STIX properties the selected STIX object can have
  const [stixTypeProps, setStixTypeProps] = useState<SchemaSTIXProperty[]>([]);
  //const [activeGraphTab, setActiveGraphTab] = useState<number>(0);

  const { activePropertiesPanelTab, setActivePropertiesPanelTab } = useStigContext();

  return (
    <PropertiesAndAdvancedTabs
      selectedProperties={selectedProperties}
      setSelectedProperties={setSelectedProperties}
      stixTypeProps={stixTypeProps}
      setStixTypeProps={setStixTypeProps}
      showJson={showJson}
      setIsShowingJson={setShowJson}
      activeGraphTab={activePropertiesPanelTab}
      setActiveGraphTab={setActivePropertiesPanelTab}
    />
  );
};

const PropsPanelHeader: React.FC<GraphPanelProperties> = ({
  selectedProperties,
  setSelectedProperties,
  stixTypeProps,
  setStixTypeProps,
  setIsShowingJson,
}) => {
  const { selectedSTIXObject } = useStixPropsContext();
  const [showJsonPanel, setShowJsonPanel] = useState<boolean>(false);

  const [stixTypeDesc, setStixTypeDesc] = useState<SchemaSTIXClass>();
  useEffect(() => {
    const schemaObject = schema.find((c) => c.name === selectedSTIXObject?.type);
    if (typeof schemaObject !== 'object') {
      return;
    }

    const properties = getSTIXPropsFromSchema(schemaObject);
    const propertyDescriptionObject = propertyDescriptions.find((group) => group.name === selectedSTIXObject?.type);
    if (propertyDescriptionObject) {
      const propertyDescriptions = getSTIXPropDescriptions(propertyDescriptionObject);
      properties.forEach((prop) => {
        prop.propertyDescription = propertyDescriptions[prop.name] || undefined;
      });
    }

    setStixTypeProps(properties);
    setStixTypeDesc(schemaObject);
  }, [selectedSTIXObject?.id, selectedSTIXObject]);


  // When stixTypeProps gets set for the object or changes
  // when clicking on a different object, update the selectedProperties
  useEffect(() => {
    setSelectedProperties(stixTypeProps.filter((prop) => prop.mandatory || selectedSTIXObject?.[prop.name] != undefined));
  }, [stixTypeProps, selectedSTIXObject]);

  function toggleJSONPropertyView() {
    const isShowingJson: boolean = !showJsonPanel;
    setShowJsonPanel(isShowingJson);
    setIsShowingJson(isShowingJson);
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">
          {selectedSTIXObject && 'type' in selectedSTIXObject
            ? (stencilItems.find((stencilItem) => {
              return selectedSTIXObject.type === stencilItem.id;
            })?.alt ?? 'Relationship')
            : null}
        </h1>
      </div>
      <div className="flex gap-2 mb-4">
        <ButtonSTIXJSON size={'standard'} showJson={showJsonPanel} setIsShowingJson={toggleJSONPropertyView} />
        {!showJsonPanel ? (
          <FormSTIXPropertySelection
            propertyOptions={stixTypeProps}
            selectedProperties={selectedProperties}
            setSelectedProperties={setSelectedProperties}
            size={'standard'}
          />
        ) : null}
      </div>
      <p className="mb-4">{stixTypeDesc?.description}</p>
    </>
  );
};

const PropertiesAndAdvancedTabs: React.FC<GraphPanelProperties> = ({
  selectedProperties,
  setSelectedProperties,
  stixTypeProps,
  setStixTypeProps,
  showJson,
  setIsShowingJson,
  activeGraphTab,
  setActiveGraphTab,
}) => {
  const { selectedSTIXObject } = useStixPropsContext();
  // const [activeTab, setActiveTab] = useState(0);
  const tabs: TabContent[] = [
    {
      label: 'Properties',
      icon: mdiCogOutline,
      content: (
        <>
          {selectedSTIXObject ? (
            <div className={`drawer flex flex-col w-full h-full p-4 scrollbar`}>
              <PropsPanelHeader
                selectedProperties={selectedProperties}
                setSelectedProperties={setSelectedProperties}
                stixTypeProps={stixTypeProps}
                setStixTypeProps={setStixTypeProps}
                setIsShowingJson={setIsShowingJson}
              />
              <FormSTIXPropsPanel
                selectedProperties={selectedProperties}
                stixTypeProps={stixTypeProps}
                showJson={showJson || false}
              />
              <SaveButtons />
            </div>
          ) : (
            <div className="mt-4">
              <AlertComponent
                className="dark:text-neutralc-100"
                alertText={`No graph element selected. Select an element on the graph to view it's properties.`}
                alertType="warning"
              />
            </div>
          )}
        </>
      ),
    },
    {
      label: 'Advanced',
      icon: mdiRocketLaunchOutline,
      content: (
        <div className={`flex w-full h-full overflow-hidden`}>
          <DatabaseContextLayoutsTabs />
        </div>
      ),
    },
  ];

  return (
    <div className="outerTabs flex mt-1 w-full h-full overflow-hidden">
      <TabsComponent
        tabs={tabs}
        setActiveTab={setActiveGraphTab || (() => { })}
        activeTab={activeGraphTab}
        extraContainerClassName={'flex-1'}
      />
    </div>
  );
};

const DatabaseContextLayoutsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // const [activeTab, setActiveTab] = useState(0);
  const tabs: TabContent[] = [
    {
      label: 'Database',
      icon: mdiDatabaseOutline,
      content: (
        <div className={`profileOperationsTabs flex h-full w-full overflow-hidden`}>
          <ProfileOperationsTabs />
        </div>
      ),
    },
    {
      label: 'Context Layouts',
      icon: mdiLayersTripleOutline,
      content: (
        <div className={`ContextLayouts flex h-full w-full scrollbar`}>
          <ContextLayouts />
        </div>
      ),
    },
  ];

  return (
    <TabsComponent
      tabs={tabs}
      setActiveTab={setActiveTab}
      activeTab={activeTab}
      extraContainerClassName={'flex mt-1'}
    ></TabsComponent>
  );
};

const ProfileOperationsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // const [activeTab, setActiveTab] = useState(0);
  const tabs: TabContent[] = [
    {
      label: 'Profile',
      icon: mdiDatabaseEyeOutline,
      content: (
        <div className={`dbProfileContainer flex w-full h-full scrollbar`}>
          <DBProfileLayout />
        </div>
      ),
    },
    {
      label: 'Operations',
      icon: mdiDatabaseCogOutline,
      content: (
        <div className={`dbOperationsContainer flex h-full w-full scrollbar`}>
          <DBOperationsContainer />
        </div>
      ),
    },
    {
      label: 'Examples',
      icon: mdiDatabaseEyeOutline,
      content: (
        <div className={`dbExamplesContainer flex h-full w-full scrollbar`}>
          <DBExamplesContainer />
        </div>
      ),
    },
  ];

  return <TabsComponent tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} extraContainerClassName={'flex mt-1'} />;
};

export default StixPropsPanel;
