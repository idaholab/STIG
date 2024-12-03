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

const StixPropsPanel: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState<SchemaSTIXProperty[]>([]);
  const [showJson, setShowJson] = useState<boolean>(false);
  // Used to determine which STIX properties the selected STIX object can have
  const [stixTypeProps, setStixTypeProps] = useState<SchemaSTIXProperty[]>([]);

  return <div className="drawer flex flex-col w-full h-full p-4">
    <PropsPanelHeader
      selectedProperties={selectedProperties}
      setSelectedProperties={setSelectedProperties}
      stixTypeProps={stixTypeProps}
      setStixTypeProps={setStixTypeProps}
      setIsShowingJson={setShowJson}
    />
    <FormSTIXPropsPanel
      selectedProperties={selectedProperties}
      stixTypeProps={stixTypeProps}
      showJson={showJson}
    />
    <SaveButtons />
  </div>;
};

function PropsPanelHeader({ selectedProperties, setSelectedProperties, 
  stixTypeProps, setStixTypeProps, setIsShowingJson }: {
  selectedProperties: SchemaSTIXProperty[],
  setSelectedProperties: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>,
  stixTypeProps: SchemaSTIXProperty[],
  setStixTypeProps: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>,
  setIsShowingJson: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const { selectedSTIXObject } = useStixPropsContext();
  const [showJsonPanel, setShowJsonPanel] = useState<boolean>(false);

  const [stixTypeDesc, setStixTypeDesc] = useState<SchemaSTIXClass>();
  useEffect(() => {
    const schemaObject = schema.find(c => c.name === selectedSTIXObject?.type);
    if (typeof schemaObject !== 'object') {
      return;
    }

    const properties = getSTIXPropsFromSchema(schemaObject);
    const propertyDescriptionObject = propertyDescriptions.find(group => group.name === selectedSTIXObject?.type);
    if (propertyDescriptionObject) {
      const propertyDescriptions = getSTIXPropDescriptions(propertyDescriptionObject);
      properties.forEach((prop) => {
        prop.propertyDescription = propertyDescriptions[prop.name] || undefined;
      });
    }

    setStixTypeProps(properties);
    setStixTypeDesc(schemaObject);
  }, [selectedSTIXObject?.id]);
  // When stixTypeProps gets set for the object or changes
  // when clicking on a different object, update the selectedProperties
  useEffect(() => {
    setSelectedProperties(stixTypeProps.filter(prop => prop.mandatory || selectedSTIXObject?.[prop.name] != undefined));
  }, [stixTypeProps]);

  function toggleJSONPropertyView() {
    const isShowingJson: boolean = !showJsonPanel;
    setShowJsonPanel(isShowingJson);
    setIsShowingJson(isShowingJson)
  }
  return <>
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl">
        {selectedSTIXObject && ("type" in selectedSTIXObject) ?
          stencilItems.find(stencilItem => {
            return selectedSTIXObject.type === stencilItem.id
          })?.alt ?? "Relationship"
          : null
        }
      </h1>
    </div>
    <div className='flex gap-2 mb-4'>
      <ButtonSTIXJSON size={'standard'} showJson={showJsonPanel} setIsShowingJson={toggleJSONPropertyView} />
      {!showJsonPanel ?
        <FormSTIXPropertySelection
          propertyOptions={stixTypeProps}
          selectedProperties={selectedProperties}
          setSelectedProperties={setSelectedProperties}
          size={'standard'}
        />
        : null
      }
    </div>
    <p className='mb-4'>{stixTypeDesc?.description}</p>
  </>;
}

export default StixPropsPanel;