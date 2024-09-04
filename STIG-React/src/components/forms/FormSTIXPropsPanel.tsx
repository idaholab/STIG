import React, { useState } from 'react';

import { StixPropsContextProvider, useStixPropsContext } from '@/contexts/StixPropsContext';
import { PropertyConfig } from '@/types/schema';
import FormElementTextInput from './formElements/FormElementTextInput';
import FormElementSelect from './formElements/FormElementSelect';
import FormElementSTIXEmbeddedList from './formElements/FormElementSTIXEmbeddedList';
import FormElementDatePicker from './formElements/FormElementDatePicker';
import FormElementFileInput from './formElements/FormElementFileInput';
import FormElementSTIXEmbeddedMap from './formElements/FormElementSTIXEmbeddedMap';
import { SchemaType } from '@/types/SchemaType';
import { useStigContext } from '@/contexts/StigContext';

export default function FormSTIXPropsPanel({ selectedProperties, selectedStixJson, showJson, isJsonDisabled }: {
  selectedProperties: PropertyConfig[],
  selectedStixJson: any,
  showJson: boolean
  isJsonDisabled: boolean
}) {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  const handlePropertyUpdate = (
    newVal: string | boolean | number | Date | ArrayBuffer | null | undefined | Object | [],
    propName: string
  ) => {
    const tempSelectedSTIXObject = { ...selectedSTIXObject };
    if (tempSelectedSTIXObject) {
      tempSelectedSTIXObject[propName] = newVal;
    }
    setSelectedSTIXObject(tempSelectedSTIXObject);
  };



  const [jsonText, setJsonText] = useState<string>(JSON.stringify(selectedStixJson, null, 2));
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsedJson = JSON.parse(value);
      // TODO: Return the JSON string to the parent or convert it back to a stix object to return to the parent.
      // Not part of task 106
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };


  return (
    <>
      {showJson ?
        <div className='form-stix-json flex h-full w-full'>
          <textarea
            style={{ whiteSpace: 'pre', overflow: 'auto' }}
            className="flex flex-grow p-2 font-mono scrollbar h-full w-full rounded bg-gray-100 dark:bg-gray-900"
            onChange={handleJsonChange}
            value={jsonText}
            disabled={isJsonDisabled}
          />
        </div>
        :
        <>
          <div className='flex justify-between mb-4'>
            <span>
              <span className='mr-3'>created</span>
              <FormElementDatePicker
                value={selectedSTIXObject && selectedSTIXObject["created"] !== undefined ?
                  selectedSTIXObject["created"]
                  : ""
                }
                onChange={([date]) => {
                  handlePropertyUpdate(date, "created");
                }}
                className='select-sm dark:bg-gray-900'
              />
            </span>
            <span>
              <span className='mr-3'>modified</span>
              <FormElementDatePicker
                value={selectedSTIXObject && selectedSTIXObject["modified"] !== undefined ?
                  selectedSTIXObject["modified"]
                  : ""
                }
                onChange={([date]) => {
                  handlePropertyUpdate(date, "modified");
                }}
                className='select-sm dark:bg-gray-900'
              />
            </span>
          </div>

          {selectedProperties.map((selectedProperty, i) =>
            <STIXPropertyRenderer
              key={i}
              property={selectedProperty}
              handlePropertyUpdate={handlePropertyUpdate}
            />
          )}
        </>
      }
    </>
  );
}

export function STIXPropertyRenderer({ property, handlePropertyUpdate, showTypeSelector, onTypeChange,
  parentEmbeddedMapProps, setParentEmbeddedMapProps,
  parentSelectedProperties, setParentSelectedProperties
}: {
  property: PropertyConfig,
  handlePropertyUpdate: (newVal: string | boolean | number | Date | ArrayBuffer | null | undefined,
    propName: string) => void,
  // The remaining properties are only passed in when the STIXPropertyRenderer
  // is used from within an EmbeddedMap component
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  // Needed so that an EmbeddedMap within an EmbeddedMap can have its type changed
  parentEmbeddedMapProps?: PropertyConfig[];
  setParentEmbeddedMapProps?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
  parentSelectedProperties?: PropertyConfig[];
  setParentSelectedProperties?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
}) {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();
  const { cyInstance } = useStigContext();

  switch (property.name) {
    case "created":
    case "modified":
      return (
        null
      );
    case "spec_version":
      return (
        <>
          <STIXPropertyTitle
            propName={property.name}
            type={property.type}
            showTypeSelector={showTypeSelector}
            onTypeChange={onTypeChange}
          />
          <FormElementSelect
            value={selectedSTIXObject && "spec_version" in selectedSTIXObject ?
              selectedSTIXObject.spec_version : ""
            }
            options={["2.0", "2.1"]}
            onChange={(event) => {
              handlePropertyUpdate(event.target.value, property.name);
            }}
            additionalClasses='mb-4 dark:bg-gray-900'
            // STIG does not currently support STIX 2.0
            disabled
          />
        </>
      );
    case "relationship_type":
      return (
        <>
          <STIXPropertyTitle
            propName={property.name}
            type={property.type}
            showTypeSelector={showTypeSelector}
            onTypeChange={onTypeChange}
          />
          <FormElementSelect
            value={selectedSTIXObject && "relationship_type" in selectedSTIXObject ?
              selectedSTIXObject.relationship_type : ""
            }
            // TODO: Figure out what determines which of these options are choices
            // and implement as part of schema.ts or here
            options={["uses", "targets", "delivers", "related-to", "created-by", "derived-from", "duplicate-of"]}
            onChange={(event) => {
              handlePropertyUpdate(event.target.value, property.name);
              // Get cytoscape element (by id)
              const ele = cyInstance?.getElementById(selectedSTIXObject.id.replace("relationship--", ""));
              // Update style for the element
              ele?.style('label', event.target.value);
            }}
            additionalClasses='mb-4 dark:bg-gray-900'
          />
        </>
      );
    default:
      // TODO: Make it possible to clear each type of form input
      switch (property.type) {
        case "String":
          return (
            <>
              <STIXPropertyTitle
                propName={property.name}
                type={property.type}
                showTypeSelector={showTypeSelector}
                onTypeChange={onTypeChange}
              />
              <FormElementTextInput
                type="text"
                value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                  selectedSTIXObject[property.name]
                  : ""
                }
                onChange={(event) => {
                  handlePropertyUpdate(event.target.value, property.name);
                }}
                disabled={property.name === "id" || property.name === "type" || property.name === "source_ref" || property.name === "target_ref"}
                additionalInputClasses='select-sm mb-4 dark:bg-gray-900'
              />
            </>
          );
        case "EmbeddedList":
          // TODO: Develop way to delete items (and reorganize list, 
          // clear list, and remove last item?)
          return (
            <>
              <STIXPropertyTitle
                propName={property.name}
                type={property.type}
                showTypeSelector={showTypeSelector}
                onTypeChange={onTypeChange}
              />
              <FormElementSTIXEmbeddedList
                label="item "
                propName={property.name}
                stixObj={selectedSTIXObject}
                setSTIXObj={setSelectedSTIXObject}
                className='mb-2'
                additionalInputClasses='select-sm dark:bg-gray-900'
                additionalLabelClasses='ml-6 mr-5 w-20'
                btnLabel="+ Item"
                btnColor="btn-primary"
                btnAdditionalClasses='btn-sm ml-6 mb-4'
              />
            </>
          );
        case "Boolean":
          return (
            <>
              <STIXPropertyTitle
                propName={property.name}
                type={property.type}
                showTypeSelector={showTypeSelector}
                onTypeChange={onTypeChange}
              />
              <FormElementSelect
                placeholder=''
                value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                  selectedSTIXObject[property.name]
                  : ""
                }
                options={["true", "false"]}
                onChange={(event) => {
                  handlePropertyUpdate(event.target.value === "true" ? true : false, property.name);
                }}
                additionalClasses='mb-4 dark:bg-gray-900'
              />
            </>
          );
        case "Integer":
        case "Float":
          return (
            <>
              <STIXPropertyTitle
                propName={property.name}
                type={property.type}
                showTypeSelector={showTypeSelector}
                onTypeChange={onTypeChange}
              />
              <FormElementTextInput
                type="number"
                min={property.min}
                max={property.max}
                value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                  selectedSTIXObject[property.name]
                  : ""
                }
                onChange={(event) => {
                  let number: string | number = event.target.value;
                  if (number !== "") {
                    number = Number(event.target.value);
                    if (property.max !== undefined && number > property.max) {
                      number = property.max;
                    } else if (property.min !== undefined && number < property.min) {
                      number = property.min;
                    }
                  }
                  handlePropertyUpdate(number, property.name);
                }}
                additionalInputClasses='select-sm mb-4 dark:bg-gray-900'
              />
            </>
          );
        case "DateTime":
          return (
            <>
              <STIXPropertyTitle
                propName={property.name}
                type={property.type}
                showTypeSelector={showTypeSelector}
                onTypeChange={onTypeChange}
              />
              <FormElementDatePicker
                value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                  selectedSTIXObject[property.name]
                  : ""
                }
                onChange={([date]) => {
                  handlePropertyUpdate(date, property.name);
                }}
                className='w-full select-sm mb-4 dark:bg-gray-900'
              />
            </>
          );
        case "Binary":
          return (
            <>
              <STIXPropertyTitle
                propName={property.name}
                type={property.type}
                showTypeSelector={showTypeSelector}
                onTypeChange={onTypeChange}
              />
              <FormElementFileInput
                buttonLabel='Upload'
                onFileChange={async (fileVal: string | ArrayBuffer | null | undefined) => {
                  handlePropertyUpdate(fileVal, property.name);
                }}
                additionalInputClasses='input-sm'
                additionalBtnClasses='btn-sm'
              />
            </>
          );
        case "EmbeddedMap":
          return (
            <StixPropsContextProvider>
              <FormElementSTIXEmbeddedMap
                propName={property.name}
                embeddedMap={selectedSTIXObject ? selectedSTIXObject[property.name] : undefined}
                showTypeSelector={showTypeSelector}
                parentSTIXObject={selectedSTIXObject}
                setParentSTIXObject={setSelectedSTIXObject}
                parentEmbeddedMapProps={parentEmbeddedMapProps}
                setParentEmbeddedMapProps={setParentEmbeddedMapProps}
                parentSelectedProperties={parentSelectedProperties}
                setParentSelectedProperties={setParentSelectedProperties}
              />
            </StixPropsContextProvider>
          );
        default:
          return (
            <STIXPropertyTitle
              propName={property.name}
              type={property.type}
              showTypeSelector={showTypeSelector}
              onTypeChange={onTypeChange}
            />
          );
      }
  }
}

function STIXPropertyTitle({ propName, type, showTypeSelector, onTypeChange }: {
  propName: string,
  type?: SchemaType,
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const stixSchemaToUITypeConverter = {
    "String": "string",
    "EmbeddedList": "array",
    "Boolean": "boolean",
    "Integer": "integer",
    "DateTime": "",
    "Binary": "",
    "EmbeddedMap": "object",
    "Float": "number"
  };

  return (
    <div className='flex gap-2 mb-2 items-center'>
      <p>{propName}</p>
      {showTypeSelector && type && onTypeChange ?
        <FormElementSelect
          options={["array", "string", "integer", "boolean", "number", "object"]}
          value={stixSchemaToUITypeConverter[type]}
          onChange={onTypeChange}
          additionalClasses='select-xs dark:bg-gray-900'
        />
        : null
      }
    </div>
  );
}