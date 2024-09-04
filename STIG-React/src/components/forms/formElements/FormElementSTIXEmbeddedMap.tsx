import React, { useEffect, useState } from 'react';
import { PropertyConfig } from '@/types/schema';
import FormSTIXJSON from '../FormSTIXJSON';
import FormElementSTIXPropertySelection from '../FormSTIXPropertySelection';
import { inferSTIXType } from '@/stix/inferSTIXType';
import { STIXPropertyRenderer } from '../FormSTIXPropsPanel';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { UIPropertyType } from '@/types/UIPropertyType';
import { SchemaType } from '@/types/SchemaType';
import FormElementSelect from './FormElementSelect';
import { StixObject } from '@/types/Core';

type Props = {
  propName: string;
  // Had to add the "any" to this typing because VS Code was
  // not happy with any way I was attempting to check if a property
  // existed in the Object before attempting to use said property.
  embeddedMap: Object | any;
  showTypeSelector?: boolean;
  // Had to add the "any" to this typing because VS Code was
  // not happy with any way I was attempting to check if a property
  // existed in the StixObject before attempting to use said property.
  parentSTIXObject: StixObject | undefined | any;
  setParentSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>;
  // Needed so that an EmbeddedMap within an EmbeddedMap can have its type changed
  parentEmbeddedMapProps?: PropertyConfig[];
  setParentEmbeddedMapProps?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
  parentSelectedProperties?: PropertyConfig[];
  setParentSelectedProperties?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
};

const FormElementSTIXEmbeddedMap: React.FC<Props> = ({
  propName,
  embeddedMap,
  showTypeSelector,
  parentSTIXObject,
  setParentSTIXObject,
  parentEmbeddedMapProps,
  setParentEmbeddedMapProps,
  parentSelectedProperties,
  setParentSelectedProperties
}) => {
  const [localSelectedProperties, setLocalSelectedProperties] = useState<PropertyConfig[]>([]);
  const [localEmbeddedMapProps, setLocalEmbeddedMapProps] = useState<PropertyConfig[]>([]);
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  useEffect(() => {
    if (!selectedSTIXObject) {
      setSelectedSTIXObject(embeddedMap);
      setLocalEmbeddedMapProps(embeddedMap ?
        Object.keys(embeddedMap).map(key => {
          return { name: key, type: inferSTIXType(embeddedMap[key]) }
        })
        : []
      );
    }
  }, [embeddedMap]);

  // Update the parent STIX object when its
  // embedded map child changes
  useEffect(() => {
    const tempParentSTIXObject = { ...parentSTIXObject };
    tempParentSTIXObject[propName] = selectedSTIXObject;
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
    "array": "EmbeddedList",
    "boolean": "Boolean",
    "integer": "Integer",
    "object": "EmbeddedMap",
    "number": "Float"
  };

  const handlePropertyTypeChange = (
    propName: string, newType: UIPropertyType,
    embeddedMapProps?: PropertyConfig[],
    setEmbeddedMapProps?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>,
    selectedProperties?: PropertyConfig[],
    setSelectedProperties?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>
  ) => {
    // If no embedded map or selected properties are passed in, just use
    // the ones from the current component
    if (!embeddedMapProps) {
      embeddedMapProps = localEmbeddedMapProps;
    }
    if (!setEmbeddedMapProps) {
      setEmbeddedMapProps = setLocalEmbeddedMapProps;
    }
    if (!selectedProperties) {
      selectedProperties = localSelectedProperties;
    }
    if (!setSelectedProperties) {
      setSelectedProperties = setLocalSelectedProperties;
    }
    // Update embeddedMapProps
    const tempEmbeddedMapProps = [...embeddedMapProps];
    const embeddedMapPropIndex = tempEmbeddedMapProps.findIndex(prop => {
      return prop.name === propName;
    });
    const oldType = embeddedMapProps[embeddedMapPropIndex].type;
    tempEmbeddedMapProps[embeddedMapPropIndex].type = stixUIToSchemaTypeConverter[newType] as SchemaType;
    setEmbeddedMapProps(tempEmbeddedMapProps);
    // Update selectedProperties
    const tempSelectedProperties = [...selectedProperties];
    const selectedPropertiesIndex = tempSelectedProperties.findIndex(prop => {
      return prop.name === propName;
    });
    tempSelectedProperties[selectedPropertiesIndex].type = stixUIToSchemaTypeConverter[newType] as SchemaType;
    setSelectedProperties(tempSelectedProperties);

    // When changing to an array, clear the value of the propName
    // so the application does not try to map over an object 
    // that isn't an array and subsequently crash
    if (newType === "array") {
      if (oldType === "EmbeddedMap") {
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
      if (oldType === "EmbeddedMap") {
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

  return (
    <>
      <div className='flex gap-2 mb-2 items-center'>
        <span>{propName}</span>
        {showTypeSelector ?
          <FormElementSelect
            options={["array", "string", "integer", "boolean", "number", "object"]}
            value={"object"}
            onChange={(event) => {
              handlePropertyTypeChange(
                propName,
                event.target.value as UIPropertyType,
                parentEmbeddedMapProps,
                setParentEmbeddedMapProps,
                parentSelectedProperties,
                setParentSelectedProperties
              );
            }}
            additionalClasses='select-xs dark:bg-gray-900'
          />
          : null
        }
      </div>
      <div className='flex gap-2 mb-2 items-center'>
        <FormSTIXJSON />
        <FormElementSTIXPropertySelection
          propertyOptions={localEmbeddedMapProps}
          setPropertyOptions={setLocalEmbeddedMapProps}
          selectedProperties={localSelectedProperties}
          setSelectedProperties={setLocalSelectedProperties}
          includeAddNew
        />
      </div>
      <div className="ml-4">
        {localSelectedProperties.map((selectedProperty, i) =>
          <STIXPropertyRenderer
            key={i}
            property={selectedProperty}
            handlePropertyUpdate={handlePropertyUpdate}
            showTypeSelector
            onTypeChange={(event) => {
              handlePropertyTypeChange(selectedProperty.name, event.target.value as UIPropertyType);
            }}
            parentEmbeddedMapProps={localEmbeddedMapProps}
            setParentEmbeddedMapProps={setLocalEmbeddedMapProps}
            parentSelectedProperties={localSelectedProperties}
            setParentSelectedProperties={setLocalSelectedProperties}
          />
        )}
      </div>
    </>
  );
};

export default FormElementSTIXEmbeddedMap;