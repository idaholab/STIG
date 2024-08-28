import React, { useEffect, useState } from 'react';

import { useStigContext } from '@/contexts/StigContext.tsx';
import { useStixPropsContext } from '../contexts/StixPropsContext.tsx';
import { PropertyConfig, schema } from '@/types/schema.ts';
import { getSTIXPropsFromSchema } from '@/stix/getSTIXPropsFromSchema.ts';
import FormSTIXPropsPanel from '@/components/forms/FormSTIXPropsPanel.tsx';
import { stencilItems } from '@/components/elements/StencilItems.ts';
import FormSTIXJSON from '@/components/forms/FormSTIXJSON.tsx';
import FormSTIXPropertySelection from '@/components/forms/FormSTIXPropertySelection.tsx';

const StixPropsPanel: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState<PropertyConfig[]>([]);

  return (
    <div className={`drawer flex flex-col w-full h-full p-4 overflow-y-scroll scrollbar`}>
      <PropsPanelHeader
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
      />
      <FormSTIXPropsPanel
        selectedProperties={selectedProperties}
      />
    </div>
  );
};

function PropsPanelHeader({ selectedProperties, setSelectedProperties }:{
  selectedProperties: PropertyConfig[],
  setSelectedProperties: React.Dispatch<React.SetStateAction<PropertyConfig[]>>
}) {
  const { toggleDrawer } = useStigContext();
  const { selectedSTIXObject } = useStixPropsContext();

  // Import the STIX object's correct json schema file to later 
  // get the STIX object type's description
  // TODO: Grab description from schema.ts
  const [stixTypeSchema, setSTIXTypeSchema] = useState<any>();
  const stixObjectType = stencilItems.find(stencilItem => {
    return stencilItem.id === selectedSTIXObject?.type
  })?.type;
  const schemaPath = stixObjectType === "sdo" ? "domain_objects" : 
    stixObjectType === "sco" ? "observables" : "meta_objects";
  if(selectedSTIXObject?.type) {
    import(`../static/jsedit/${schemaPath}/${selectedSTIXObject?.type + '.json'}`)
      .then( schema => {
        setSTIXTypeSchema(schema);
      });
  }

  // Used to determine which STIX properties the selected STIX object can have
  const [stixTypeProps, setStixTypeProps] = useState<PropertyConfig[]>([]);
  useEffect(() => {
    const schemaObject = schema.classes.find(c => { return c.name === selectedSTIXObject?.type; });
    if (typeof schemaObject !== 'object') {
      return;
    }
    setStixTypeProps(getSTIXPropsFromSchema(schemaObject));
  }, [selectedSTIXObject?.id]);

  // When stixTypeProps gets set for the object or changes
  // when clicking on a different object, update the selectedProperties
  useEffect(() => {
    setSelectedProperties(stixTypeProps.filter(prop => prop.mandatory));
  }, [stixTypeProps]);

  const jsonViewSelectedSTIXObject = {...selectedSTIXObject};
  delete jsonViewSelectedSTIXObject.raw_data;
  delete jsonViewSelectedSTIXObject.label;

  return(
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg">
          {selectedSTIXObject && ("label" in selectedSTIXObject) ? selectedSTIXObject?.label : "Relationship"}
        </h1>
        <button
          className="btn border-none text-gray-900 dark:text-gray-100 shadow-none"
          onClick={toggleDrawer}
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className='flex gap-2 mb-4'>
        <FormSTIXJSON
          jsonContents={jsonViewSelectedSTIXObject}
        />
        <FormSTIXPropertySelection
          propertyOptions={stixTypeProps}
          selectedProperties={selectedProperties}
          setSelectedProperties={setSelectedProperties}
        />
      </div>
      <p className='mb-4'>{stixTypeSchema?.description}</p>
    </>
  );
}

export default StixPropsPanel;