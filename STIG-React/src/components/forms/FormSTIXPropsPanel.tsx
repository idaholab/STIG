import React, { useEffect, useState } from 'react';
import { PropertyConfig } from '@/types/schema';
import FormElementDatePicker from './formElements/FormElementDatePicker';
import { STIXPropertyRenderer } from './STIXPropertyRenderer';
import { useStixPropsContext } from '@/contexts/StixPropsContext';

export default function FormSTIXPropsPanel({ selectedProperties, showJson }: {
  selectedProperties: PropertyConfig[],
  showJson: boolean
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

  const [jsonText, setJsonText] = useState<string>('');
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

  // When stixTypeProps gets set for the object or changes
  // when clicking on a different object, update the selectedProperties
  useEffect(() => {
    const selectedSTIXObjectJSONString = { ...selectedSTIXObject };
    delete selectedSTIXObjectJSONString.raw_data;
    delete selectedSTIXObjectJSONString.label;
    setJsonText(JSON.stringify(selectedSTIXObjectJSONString, null, 2));
  }, [selectedSTIXObject]);

  return (
    <>
      {showJson ?
        <div className='form-stix-json flex flex-auto h-full w-full'>
          <textarea
            style={{ whiteSpace: 'pre', overflow: 'auto' }}
            className="flex flex-grow p-2 font-mono scrollbar h-full w-full rounded bg-gray-100 dark:bg-gray-900"
            onChange={handleJsonChange}
            value={jsonText}
          />
        </div>
        :
        <>
          <div className='flex gap-4 mb-2'>
            <FormElementDatePicker
              value={selectedSTIXObject && selectedSTIXObject["created"] !== undefined ?
                selectedSTIXObject["created"]
                : ""
              }
              onChange={([date]) => {
                handlePropertyUpdate(date, "created");
              }}
              className='flex flex-auto'
              additionalInputClasses='select-sm px-2 dark:bg-gray-900 w-full'
              includeInfo={true}
              infoText={'The date this object was created'}
              label={'Created'}
            />

            <FormElementDatePicker
              value={selectedSTIXObject && selectedSTIXObject["modified"] !== undefined ?
                selectedSTIXObject["modified"]
                : ""
              }
              onChange={([date]) => {
                handlePropertyUpdate(date, "modified");
              }}
              className='flex flex-auto'
              additionalInputClasses='select-sm px-2 w-full dark:bg-gray-900'
              includeInfo={true}
              infoText={'The date this object was modified'}
              label={'Modified'}
            />
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



