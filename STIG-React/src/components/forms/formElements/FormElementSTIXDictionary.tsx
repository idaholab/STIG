import React, { useEffect, useState } from 'react';
import { PropertyConfig } from '@/types/schema';
import ButtonSTIXJSON from '../../elements/ButtonSTIXJSON';
import FormElementSTIXPropertySelection from '../FormSTIXPropertySelection';
import { inferSTIXType } from '@/stix/inferSTIXType';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { UIPropertyType } from '@/types/UIPropertyType';
import { s_SchemaType } from '@/types/SchemaType';
import FormElementSelect from './FormElementSelect';
import { StixObject } from '@/types/Core';
import { STIXPropertyRenderer } from '../STIXPropertyRenderer';
import { STIXPropertyLabel } from '@/components/elements/STIXPropertyLabel';

type Props = {
  // Had to add the "any" to this typing because VS Code was
  // not happy with any way I was attempting to check if a property
  // existed in the Object before attempting to use said property.
  dictionary: Object | any;
  // Had to add the "any" to this typing because VS Code was
  // not happy with any way I was attempting to check if a property
  // existed in the StixObject before attempting to use said property.
  parentSTIXObject: StixObject | undefined | any;
  setParentSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>;
  // Needed so that a Dictionary within a Dictionary can have its type changed
  parentDictionaryProps?: PropertyConfig[];
  setParentDictionaryProps?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
  parentSelectedProperties?: PropertyConfig[];
  setParentSelectedProperties?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
  className?: string;
  property?: PropertyConfig;
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
};

const FormElementSTIXDictionary: React.FC<Props> = ({
  dictionary,
  parentSTIXObject,
  setParentSTIXObject,
  parentDictionaryProps: parentDictionaryProps,
  setParentDictionaryProps: setParentDictionaryProps,
  parentSelectedProperties,
  setParentSelectedProperties,
  className,
  property,
  showTypeSelector,
  onTypeChange,
}) => {
  const [localSelectedProperties, setLocalSelectedProperties] = useState<PropertyConfig[]>([]);
  const [localDictionaryProps, setLocalDictionaryProps] = useState<PropertyConfig[]>([]);
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  useEffect(() => {
    if (!selectedSTIXObject) {
      setSelectedSTIXObject(dictionary);
      setLocalDictionaryProps(dictionary ?
        Object.keys(dictionary).map(key => {
          return { name: key, type: inferSTIXType(dictionary[key]) }
        })
        : []
      );
    }
  }, [dictionary]);

  // Update the parent STIX object when its
  // embedded map child changes
  useEffect(() => {
    const tempParentSTIXObject = { ...parentSTIXObject };
    tempParentSTIXObject[property?.name || ''] = selectedSTIXObject;
    setParentSTIXObject(tempParentSTIXObject);
  }, [selectedSTIXObject]);

  const handlePropertyUpdate = (
    newVal: string | boolean | number | Date | ArrayBuffer | null | undefined | [],
    propName: string
  ) => {
    let tempSelectedSTIXObject = { ...selectedSTIXObject };
    if (tempSelectedSTIXObject) {
      tempSelectedSTIXObject[propName] = newVal;
    }
    setSelectedSTIXObject(tempSelectedSTIXObject);
  };

  const stixUIToSchemaTypeConverter = {
    "string": "String",
    "array": "List",
    "boolean": "Boolean",
    "integer": "Integer",
    "object": "Dictionary",
    "number": "Float"
  };

  const handlePropertyTypeChange = (
    propName: string, newType: UIPropertyType,
    dictionaryProps?: PropertyConfig[],
    setDictionaryProps?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>,
    selectedProperties?: PropertyConfig[],
    setSelectedProperties?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>
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

    const tempDictionaryProps = [...dictionaryProps];
    const dictionaryPropIndex = tempDictionaryProps.findIndex(prop => {
      return prop.name === propName;
    });
    const oldType = dictionaryProps[dictionaryPropIndex].type;
    tempDictionaryProps[dictionaryPropIndex].type = stixUIToSchemaTypeConverter[newType] as s_SchemaType;
    setDictionaryProps(tempDictionaryProps);

    // Update selectedProperties
    const tempSelectedProperties = [...selectedProperties];
    const selectedPropertiesIndex = tempSelectedProperties.findIndex(prop => {
      return prop.name === propName;
    });
    tempSelectedProperties[selectedPropertiesIndex].type = stixUIToSchemaTypeConverter[newType] as s_SchemaType;
    setSelectedProperties(tempSelectedProperties);

    // When changing to an array, clear the value of the propName
    // so the application does not try to map over an object 
    // that isn't an array and subsequently crash
    if (newType === "array") {
      if (oldType === "Dictionary") {
        let tempParentSTIXObject = { ...parentSTIXObject };
        if (tempParentSTIXObject) {
          tempParentSTIXObject[propName] = [];
        }
        setParentSTIXObject(tempParentSTIXObject);
      } else {
        handlePropertyUpdate([], propName);
      }
    } else if (newType === "boolean") {
      // When changing to a boolean, clear the value of the propName
      // so the application does not give a "the `value` prop supplied
      // to <select> must be a scalar value if `multiple` is false" error
      if (oldType === "Dictionary") {
        let tempParentSTIXObject = { ...parentSTIXObject };
        if (tempParentSTIXObject) {
          tempParentSTIXObject[propName] = "";
        }
        setParentSTIXObject(tempParentSTIXObject);
      } else {
        handlePropertyUpdate("", propName);
      }
    }
  };

  const [showJsonPanel, setShowJsonPanel] = useState<boolean>(false);
  function toggleJSONPropertyView() {
    setShowJsonPanel(!showJsonPanel);
  }
  const [jsonText, setJsonText] = useState<string>('');
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      //const parsedJson = JSON.parse(value);
      // TODO: Return the JSON string to the parent or convert it back to a stix object to return to the parent.
      // Not part of task 106
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  useEffect(() => {
    if (selectedSTIXObject === undefined) {
      return;
    }
    const selectedSTIXObjectJSONString = { ...selectedSTIXObject };
    // delete selectedSTIXObjectJSONString.raw_data;
    // delete selectedSTIXObjectJSONString.label;
    setJsonText(JSON.stringify(selectedSTIXObjectJSONString, null, 2));
  }, [selectedSTIXObject]);

  return (
    <>
      <div className={`flex gap-2 items-center`}>
        <STIXPropertyLabel
          propName={property ? property?.name : ''}
          propertyType={property ? property.type : undefined}
          showTypeSelector={showTypeSelector}
          onTypeChange={onTypeChange}
          additionalLabelClasses='mr-2'
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
            additionalClasses='select-xs dark:bg-gray-900 w-fit'
            includeInfo={false}
          />
          : null
        }
      </div>
      <div className='flex gap-2 mb-2 items-center'>
        <ButtonSTIXJSON size={'small'} color='btn-secondary' showJson={showJsonPanel} setIsShowingJson={toggleJSONPropertyView} />
        <FormElementSTIXPropertySelection
          propertyOptions={localDictionaryProps}
          setPropertyOptions={setLocalDictionaryProps}
          selectedProperties={localSelectedProperties}
          setSelectedProperties={setLocalSelectedProperties}
          includeAddNew
          size={'small'}
        />
      </div>

      <div className="ml-4">
        {showJsonPanel && (
          <div className='form-stix-json flex h-full w-full mb-4'>
            <textarea
              rows={10}
              style={{ whiteSpace: 'pre', overflow: 'auto' }}
              className="flex flex-grow p-2 font-mono scrollbar h-full w-full rounded bg-gray-100 dark:bg-gray-900"
              onChange={handleJsonChange}
              value={jsonText}
            />
          </div>
        )}

        {!showJsonPanel && localSelectedProperties.map((selectedProperty, i) =>
          <STIXPropertyRenderer
            key={i}
            property={selectedProperty}
            handlePropertyUpdate={handlePropertyUpdate}
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