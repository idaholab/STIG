import React from 'react';
import ButtonBasic from '@/components/elements/ButtonBasic';
import { StixObject } from '@/types/stixTypes/StixObject';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
import FormElementSTIXHash from './FormElementSTIXHash';
import { useStixPropsContext } from '@/contexts/StixPropsContext';

type Props = {
  property: SchemaSTIXProperty;
};

const FormElementSTIXHashes: React.FC<Props> = ({
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  return (
    <div className="flex flex-col">
      <STIXPropertyLabel
        propName={property.name}
        propertyType={property.type || undefined}
        additionalLabelClasses="mr-2"
        includeInfo
        infoText={property.propertyDescription}
      />
      <div className={`flex flex-col items-center w-full ml-2`} >
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
          color="btn-primary"
          onClick={() => {
            let tempSTIXObj = { ...selectedSTIXObject } as StixObject;
            if (!tempSTIXObj[property.name]) {
              // Initialize the property array
              tempSTIXObj[property.name] = {"" : ""};
            } else {
              tempSTIXObj[property.name] = {
                ...tempSTIXObj[property.name], 
                "":""
              };
            }
            setSelectedSTIXObject(tempSTIXObj);
          }}
          additionalClasses="btn-sm ml-6"
        />
      </div>
    </div>
  );
};

export default FormElementSTIXHashes;