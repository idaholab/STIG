import React, { useEffect } from 'react';
import ButtonBasic from '@/components/elements/ButtonBasic';
import { StixObject } from '@/types/stixTypes/StixObject';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
import FormElementSTIXHash from './FormElementSTIXHash';
import { useStixPropsContext } from '@/contexts/StixPropsContext';

type Props = {
  property: SchemaSTIXProperty;
  // The following are only needed when a property
  // of type hashes is within a list
  parentPropertyName?: string;
  parentPropertyIndex?: number;
  parentSTIXObject?: StixObject | undefined;
  setParentSTIXObject?: React.Dispatch<React.SetStateAction<StixObject | undefined>>;
};

const FormElementSTIXHashes: React.FC<Props> = ({
  property,
  parentPropertyName,
  parentPropertyIndex,
  parentSTIXObject,
  setParentSTIXObject
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  // Update the child STIX object (the one containing the hashes
  // property) when its parent changes
  useEffect(() => {
    if (parentSTIXObject && parentPropertyName && parentPropertyIndex !== undefined) {
      setSelectedSTIXObject(parentSTIXObject[parentPropertyName][parentPropertyIndex]);
      setSelectionExists(true);
    }
  }, [parentSTIXObject]);

  // Update the parent STIX object when its child 
  // (the one containing the hashes property) changes
  useEffect(() => {
    if (parentPropertyName && parentPropertyIndex !== undefined &&
      parentSTIXObject && setParentSTIXObject && selectedSTIXObject) {
      const tempParentSTIXObject = { ...parentSTIXObject } as StixObject;
      tempParentSTIXObject[parentPropertyName][parentPropertyIndex] = selectedSTIXObject;
      setParentSTIXObject(tempParentSTIXObject);
    }
  }, [selectedSTIXObject]);

  return (
    <div className="flex flex-col">
      <STIXPropertyLabel
        propName={property.name}
        propertyType={property.type || undefined}
        additionalLabelClasses="mr-2"
        includeInfo
        infoText={property.propertyDescription}
      />
      <div className={`flex flex-col items-center w-full ml-2 pr-2`} >
        {selectedSTIXObject && selectedSTIXObject[property.name] ?
          Object.keys(selectedSTIXObject[property.name]).map(
            (hashAlgName: string, i: number) =>
              <FormElementSTIXHash
                key={i}
                hashAlgName={hashAlgName}
                property={property}
              />
          )
          : null
        }
        <ButtonBasic
          label="+ Hash"
          type="btn-primary"
          onClick={() => {
            let tempSTIXObj = { ...selectedSTIXObject } as StixObject;
            if (!tempSTIXObj[property.name]) {
              // Initialize the property array
              tempSTIXObj[property.name] = { "": "" };
            } else {
              tempSTIXObj[property.name] = {
                ...tempSTIXObj[property.name],
                "": ""
              };
            }
            setSelectedSTIXObject(tempSTIXObj);
            setSelectionExists(true);
          }}
          additionalClasses="btn-sm ml-6"
        />
      </div>
    </div>
  );
};

export default FormElementSTIXHashes;