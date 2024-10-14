import React, { useEffect, useState } from 'react';
import { useStigContext } from '@/contexts/StigContext.tsx';
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
import ButtonBasic from '@/components/elements/ButtonBasic.tsx';
import ExportModal from './ExportModals.tsx';
import { exportAll, exportObject, exportSelected } from '@/util/GraphUtils.ts';
import { commit } from '@/util/DbFunctions.ts';
import { StixObject } from '@/types/stixTypes/StixObject.ts';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject.ts';

const StixPropsPanel: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState<SchemaSTIXProperty[]>([]);
  const [showJson, setShowJson] = useState<boolean>(false);
  const { selectedSTIXObject } = useStixPropsContext();

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
      <SaveButtons selected={selectedSTIXObject}/>
    </div>
  );
};

type SaveButton = {selected: StixObject| StixRelationshipObject | undefined};

const SaveButtons: React.FC<SaveButton> = ({selected})=>{
  const saverNeo4j = ()=>{savetoNeo4j(selected)};
  const saverJson = ()=>{savetojson(selected)};
  return (
    <>
    <div className='place-self-end mt-8 flex gap-2 mb-4'>
    <ButtonBasic
        label="Save to NEO4J"
        // color='btn-sm'
        additionalClasses='h-[48px] btn-sm '
        onClick={saverNeo4j}
      ></ButtonBasic>
      <ButtonBasic
        label="Save JSON"
        color='btn-primary'
        additionalClasses='h-[48px]'
        onClick={saverJson}
      ></ButtonBasic>
    </div>
    </>
  )
}
function savetoNeo4j(props: any){
  try{
    if (props !== undefined){
      (async ()=>{
        props.type !== "relationship" ? await commit([props],[]) : await commit([],[props]);
      })();
    }else{
      console.warn("attempted to submit object to Neo4j, but it is undefined");
    }
  }catch(err){
    console.error(err);
  }
}
function savetojson(obj: StixObject | StixRelationshipObject | undefined){
  // return (<><ExportModal exporter={exportSelected}/></>)
  if (obj!==undefined){exportObject(obj);}
}

function PropsPanelHeader({ selectedProperties, setSelectedProperties, setIsShowingJson }: {
  selectedProperties: SchemaSTIXProperty[],
  setSelectedProperties: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>,
  setIsShowingJson: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { toggleDrawer } = useStigContext();
  const { selectedSTIXObject } = useStixPropsContext();
  const [showJsonPanel, setShowJsonPanel] = useState<boolean>(false);

  // Used to determine which STIX properties the selected STIX object can have
  const [stixTypeProps, setStixTypeProps] = useState<SchemaSTIXProperty[]>([]);
  const [stixTypeDesc, setStixTypeDesc] = useState<SchemaSTIXClass>();
  useEffect(() => {
    const schemaObject = schema.find(c => { return c.name === selectedSTIXObject?.type; });
    if (typeof schemaObject !== 'object') {
      return;
    }

    const properties = getSTIXPropsFromSchema(schemaObject);
    const propertyDescriptionObject = propertyDescriptions.find((group) => group.name === selectedSTIXObject?.type);
    if(propertyDescriptionObject) {
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
    setSelectedProperties(stixTypeProps.filter(prop => prop.mandatory));
  }, [stixTypeProps]);

  function toggleJSONPropertyView() {
    const isShowingJson: boolean = !showJsonPanel;
    setShowJsonPanel(isShowingJson);
    setIsShowingJson(isShowingJson)
  }
  if (JSON.stringify(selectedSTIXObject)=="\"visual_edge\""){
    console.error("TODO: please make it so clicking visual edges doesn't pop up the property panel");
    return;
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
        <ButtonSTIXJSON size={'standard'} showJson={showJsonPanel} setIsShowingJson={toggleJSONPropertyView} />
        <FormSTIXPropertySelection
          propertyOptions={stixTypeProps}
          selectedProperties={selectedProperties}
          setSelectedProperties={setSelectedProperties}
          size={'standard'}
        />
      </div>
      <p className='mb-4'>{stixTypeDesc?.description}</p>
    </>
  );
}

export default StixPropsPanel;