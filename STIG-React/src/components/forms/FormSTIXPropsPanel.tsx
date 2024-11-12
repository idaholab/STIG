import React from 'react';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import FormElementDatePicker from './formElements/FormElementDatePicker';
import { STIXPropertyRenderer } from './STIXPropertyRenderer';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { handlePropertyUpdate } from '@/stix/handlePropertyUpdate';
import StixJSONView from '@/layouts/StixJSONView';

export default function FormSTIXPropsPanel({ selectedProperties, stixTypeProps, showJson }: {
  selectedProperties: SchemaSTIXProperty[],
  stixTypeProps: SchemaSTIXProperty[],
  showJson: boolean
}) {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const createdProperty = selectedProperties.find(selectedProperty =>
    selectedProperty.name === "created"
  );
  const modifiedProperty = selectedProperties.find(selectedProperty =>
    selectedProperty.name === "modified"
  );

  return (
    <>
      {showJson ?
        <StixJSONView 
          stixTypeProps={stixTypeProps}
        />
        :
        <>
          <div className='flex gap-4 mb-2'>
            {createdProperty ?
              <FormElementDatePicker
                value={selectedSTIXObject && selectedSTIXObject["created"] !== undefined ?
                  selectedSTIXObject["created"]
                  : ""
                }
                onChange={([date]) => {
                  handlePropertyUpdate(date, "created", selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
                }}
                className={'flex flex-auto' + (modifiedProperty ? " max-w-[50%]" : "")}
                additionalInputClasses={"select-sm px-2 w-full"}
                includeInfo={!!createdProperty.propertyDescription && createdProperty.propertyDescription?.length > 0}
                infoText={createdProperty.propertyDescription}
                label={'created'}
              />
              : null
            }

            {modifiedProperty ?
              <FormElementDatePicker
                value={selectedSTIXObject && selectedSTIXObject["modified"] !== undefined ?
                  selectedSTIXObject["modified"]
                  : ""
                }
                onChange={([date]) => {
                  handlePropertyUpdate(date, "modified", selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
                }}
                className={'flex flex-auto' + (createdProperty ? " max-w-[50%]" : "")}
                additionalInputClasses='select-sm px-2 w-full'
                includeInfo={!!modifiedProperty.propertyDescription && modifiedProperty.propertyDescription?.length > 0}
                infoText={modifiedProperty.propertyDescription}
                label={'modified'}
              />
              : null
            }
          </div>

          {selectedProperties.map((selectedProperty, i) =>
            <STIXPropertyRenderer
              key={i}
              property={selectedProperty}
            />
          )}
        </>
      }
    </>
  );
}
