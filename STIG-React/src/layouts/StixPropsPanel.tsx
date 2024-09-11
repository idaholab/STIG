import React, { useEffect, useState } from 'react';
import { useStigContext } from '@/contexts/StigContext.tsx';
import { useStixPropsContext } from '../contexts/StixPropsContext.tsx';
import {IJSONClassOptions, PropertyConfig, schema } from '@/types/schema.ts';
import { getSTIXPropsFromSchema } from '@/stix/getSTIXPropsFromSchema.ts';
import FormSTIXPropsPanel from '@/components/forms/FormSTIXPropsPanel.tsx';
import { stencilItems } from '@/components/elements/StencilItems.ts';
import FormSTIXPropertySelection from '@/components/forms/FormSTIXPropertySelection.tsx';
import ButtonSTIXJSON from '@/components/elements/ButtonSTIXJSON.tsx';

const StixPropsPanel: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState<PropertyConfig[]>([]);
  const [showJson, setShowJson] = useState<boolean>(false);
  return (
    <div className={`drawer flex flex-col w-full h-full p-4 overflow-y-scroll scrollbar`}>
      <PropsPanelHeader
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
        setIsShowingJson={setShowJson}
      />
      <FormSTIXPropsPanel
        selectedProperties={selectedProperties}
        showJson={showJson}
      />
    </div>
  );
};

function PropsPanelHeader({ selectedProperties, setSelectedProperties, setIsShowingJson }: {
  selectedProperties: PropertyConfig[],
  setSelectedProperties: React.Dispatch<React.SetStateAction<PropertyConfig[]>>,
  setIsShowingJson: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { toggleDrawer } = useStigContext();
  const { selectedSTIXObject } = useStixPropsContext();
  const [showJsonPanel, setShowJsonPanel] = useState<boolean>(false);

  /*
  //TODO: Remove all this related code that grabbed the descriptions from the schema files
  // Import the STIX object's correct json schema file to later 
  // get the STIX object type's description
  const [stixTypeSchema, setSTIXTypeSchema] = useState<any>();
  const stixObjectType = stencilItems.find(stencilItem => {
    return stencilItem.id === selectedSTIXObject?.type
  })?.type ?? "sro";
  const schemaPath = stixObjectType === "sdo" ? "domain_objects" :
    stixObjectType === "sco" ? "observables" :
      stixObjectType === "smo" ? "meta_objects" :
        "relationships";
  if (selectedSTIXObject?.type) {
    import(`../static/jsedit/${schemaPath}/${selectedSTIXObject?.type + '.json'}`)
      .then(schema => {
        setSTIXTypeSchema(schema);
      });
  }
  */

  // Used to determine which STIX properties the selected STIX object can have
  const [stixTypeProps, setStixTypeProps] = useState<PropertyConfig[]>([]);
  const [stixTypeDesc, setStixTypeDesc] = useState<IJSONClassOptions>();
  useEffect(() => {
    const schemaObject = schema.classes.find(c => { return c.name === selectedSTIXObject?.type; });
    if (typeof schemaObject !== 'object') {
      return;
    }
    setStixTypeProps(getSTIXPropsFromSchema(schemaObject));
    setStixTypeDesc(schemaObject);
  }, [selectedSTIXObject?.id]);
  // When stixTypeProps gets set for the object or changes
  // when clicking on a different object, update the selectedProperties
  useEffect(() => {
    setSelectedProperties(stixTypeProps.filter(prop => prop.mandatory));
  }, [stixTypeProps]);

  function toggleJSONPropertyView() {
    const isShowingJson: boolean = !showJsonPanel;
    setShowJsonPanel(isShowingJson);
    setIsShowingJson(isShowingJson)
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg">
          {selectedSTIXObject && ("type" in selectedSTIXObject) ?
            stencilItems.find(stencilItem => {
              return selectedSTIXObject.type === stencilItem.id
            })?.alt ?? "Relationship"
            : null
          }
        </h1>
        <button
          className="btn border-none text-gray-900 dark:text-gray-100 shadow-none"
          onClick={toggleDrawer}
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className='flex gap-2 mb-4'>
        <ButtonSTIXJSON showJson={showJsonPanel} setIsShowingJson={toggleJSONPropertyView} />
        <FormSTIXPropertySelection
          propertyOptions={stixTypeProps}
          selectedProperties={selectedProperties}
          setSelectedProperties={setSelectedProperties}
        />
      </div>
      <p className='mb-4'>{stixTypeDesc?.description}</p>
    </>
  );
}

export default StixPropsPanel;