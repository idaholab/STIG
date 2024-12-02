import React from 'react';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import FormElementDatePicker from './formElements/FormElementDatePicker';
import { STIXPropertyRenderer } from './STIXPropertyRenderer';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { handlePropertyUpdate } from '@/stix/handlePropertyUpdate';
import StixJSONView from '@/layouts/StixJSONView';
import FormElementTextInput from './formElements/FormElementTextInput';

export default function FormSTIXPropsPanel({ selectedProperties, stixTypeProps, showJson }: {
  selectedProperties: SchemaSTIXProperty[],
  stixTypeProps: SchemaSTIXProperty[],
  showJson: boolean
}) {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const idProperty = selectedProperties.find(p => p.name === "id");
  const typeProperty = selectedProperties.find(p => p.name === "type");
  const specProperty = selectedProperties.find(p => p.name === "spec_version");
  const sourceProperty = selectedProperties.find(p => p.name === "source_ref");
  const targetProperty = selectedProperties.find(p => p.name === "target_ref");
  const createdProperty = selectedProperties.find(p => p.name === "created");
  const modifiedProperty = selectedProperties.find(p => p.name === "modified");

  return showJson ?
    <StixJSONView stixTypeProps={stixTypeProps} /> :
    <>
      {[idProperty, typeProperty, specProperty, sourceProperty, targetProperty].map(property =>
        property ?
          <FormElementTextInput
            type="text"
            value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
              selectedSTIXObject[property.name]
              : ""
            }
            disabled={true}
            onChange={()=>{}}
            additionalInputClasses='select-sm dark:bg-neutralc-900'
            includeInfo={true}
            infoText={property.propertyDescription}
            className="mb-2"
            property={property}
            showTypeSelector={false}
          />
          : null
      )}
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
    </>;
}
