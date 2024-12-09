import React, { useEffect, useState } from 'react';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import ButtonSTIXJSON from '../../elements/ButtonSTIXJSON';
import FormSTIXPropertySelection from '../FormSTIXPropertySelection';
import { inferSTIXType } from '@/stix/inferSTIXType';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { UIPropertyType } from '@/types/UIPropertyType';
import { SchemaSTIXType } from '@/types/stixSchemaTypes/SchemaSTIXType';
import FormElementSelect from './FormElementSelect';
import { StixObject } from '@/types/stixTypes/StixObject';
import { STIXPropertyRenderer } from '../STIXPropertyRenderer';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
import { handlePropertyUpdate } from '@/stix/handlePropertyUpdate';
import StixJSONView from '@/layouts/StixJSONView';

type Props = {
  dictionary: StixObject;
  parentSTIXObject: StixObject | undefined;
  setParentSTIXObject: (obj: StixObject | undefined) => void;
  // Needed so that a Dictionary within a Dictionary can have its type changed
  parentDictionaryProps?: SchemaSTIXProperty[];
  setParentDictionaryProps?: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
  parentSelectedProperties?: SchemaSTIXProperty[];
  setParentSelectedProperties?: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
  property: SchemaSTIXProperty;
  showTypeSelector?: boolean;
};

const stixUIToSchemaTypeConverter: Record<string,SchemaSTIXType> = {
  "string": "string",
  "array": "list",
  "boolean": "boolean",
  "integer": "integer",
  "object": "dictionary",
  "number": "float"
};

const typeToDefaultConverter: Record<string,any> = {
  "string": "",
  "array": [],
  "boolean": false,
  "integer": 0,
  "object": {},
  "number": 0,
};


const FormElementSTIXDictionary: React.FC<Props> = ({
  dictionary,
  parentSTIXObject,
  setParentSTIXObject,
  parentDictionaryProps,
  setParentDictionaryProps,
  parentSelectedProperties,
  setParentSelectedProperties,
  property,
  showTypeSelector
}) => {
  const [localSelectedProperties, setLocalSelectedProperties] = useState<SchemaSTIXProperty[]>([]);
  const [localDictionaryProps, setLocalDictionaryProps] = useState<SchemaSTIXProperty[]>([]);
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  useEffect(() => {
    if (!selectedSTIXObject) {
      setSelectedSTIXObject(dictionary);
      setSelectionExists(true);
    }
    setLocalDictionaryProps(_ => dictionary ?
      Object.keys(dictionary).map(key => ({ name: key, type: inferSTIXType(dictionary[key]) } as SchemaSTIXProperty))
      : []
    );
  }, [dictionary]);

  // Update the parent STIX object when its
  // embedded map child changes
  useEffect(() => {
    setParentSTIXObject({ ...parentSTIXObject, [property?.name || '']: selectedSTIXObject } as StixObject);
  }, [selectedSTIXObject]);

  const handlePropertyTypeChange = (
    propName: string, newType: UIPropertyType,
    dictionaryProps?: SchemaSTIXProperty[],
    setDictionaryProps?: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>,
    selectedProperties?: SchemaSTIXProperty[],
    setSelectedProperties?: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>
  ) => {
    // If no embedded map or selected properties are passed in, just use
    // the ones from the current component
    if (!dictionaryProps) {
      dictionaryProps = localDictionaryProps;
    }
    if (!setDictionaryProps) {
      setDictionaryProps = setLocalDictionaryProps;
    }
    if (!selectedProperties) {
      selectedProperties = localSelectedProperties;
    }
    if (!setSelectedProperties) {
      setSelectedProperties = setLocalSelectedProperties;
    }

    const dictionaryPropIndex = dictionaryProps.findIndex(prop => prop.name === propName);
    const oldType = dictionaryProps[dictionaryPropIndex].type;
    dictionaryProps[dictionaryPropIndex].type = stixUIToSchemaTypeConverter[newType];
    setDictionaryProps([...dictionaryProps]);

    const selectedPropertiesIndex = selectedProperties.findIndex(prop => prop.name === propName);
    selectedProperties[selectedPropertiesIndex].type = stixUIToSchemaTypeConverter[newType];
    setSelectedProperties([...selectedProperties]);

    if (oldType === "dictionary") {
      setParentSTIXObject({ ...parentSTIXObject, [propName]: typeToDefaultConverter[newType] } as StixObject);
    } else {
      handlePropertyUpdate(typeToDefaultConverter[newType], propName, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
    }
  };

  const [showJsonPanel, setShowJsonPanel] = useState<boolean>(false);
  function toggleJSONPropertyView() {
    setShowJsonPanel(!showJsonPanel);
  }

  return (
    <>
      <div className={`flex ${showTypeSelector ? "gap-2 items-center" : "flex-col"}`}>
        <STIXPropertyLabel
          propName={property ? property?.name : ''}
          propertyType={property ? property.type : undefined}
          showTypeSelector={showTypeSelector}
          additionalLabelClasses='mr-2'
          includeInfo={!!property.propertyDescription && property.propertyDescription?.length > 0}
          infoText={property.propertyDescription}
        />
        {showTypeSelector ?
          <FormElementSelect
            options={["array", "string", "integer", "boolean", "number", "object"]}
            value={"object"}
            onChange={(event) => {
              handlePropertyTypeChange(
                property?.name || '',
                event.target.value as UIPropertyType,
                parentDictionaryProps,
                setParentDictionaryProps,
                parentSelectedProperties,
                setParentSelectedProperties
              );
            }}
            additionalClasses='select-xs dark:bg-neutralc-900 w-fit'
            includeInfo={false}
          />
          : null
        }
      </div>
      <div className='flex gap-2 mb-2 items-center'>
        <ButtonSTIXJSON size={'small'} type='btn-neutralc' showJson={showJsonPanel} setIsShowingJson={toggleJSONPropertyView} />
        {!showJsonPanel ?
          <FormSTIXPropertySelection
            propertyOptions={localDictionaryProps}
            setPropertyOptions={setLocalDictionaryProps}
            selectedProperties={localSelectedProperties}
            setSelectedProperties={setLocalSelectedProperties}
            includeAddNew
            size={'small'}
            onAdd={p => handlePropertyUpdate(typeToDefaultConverter[p.type], p.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists) }
          />
          : null
        }
      </div>

      <div className="ml-4">
        {showJsonPanel && <StixJSONView rows={10} /> }
        {!showJsonPanel && localSelectedProperties.map((selectedProperty, i) =>
          <STIXPropertyRenderer
            key={i}
            property={selectedProperty}
            showTypeSelector
            onTypeChange={(event) => {
              handlePropertyTypeChange(selectedProperty.name, event.target.value as UIPropertyType);
            }}
            parentDictionaryProps={localDictionaryProps}
            setParentDictionaryProps={setLocalDictionaryProps}
            parentSelectedProperties={localSelectedProperties}
            setParentSelectedProperties={setLocalSelectedProperties}
          />
        )}
      </div>
    </>
  );
};

export default FormElementSTIXDictionary;