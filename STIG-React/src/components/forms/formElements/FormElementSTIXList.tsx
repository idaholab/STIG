import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import ButtonBasic from '@/components/elements/ButtonBasic';
import { StixObject } from '@/types/stixTypes/StixObject';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { stixIdentifierValidator } from '@/util/stixIdentifierValidator';

type Props = {
  btnLabel: string | React.JSX.Element;
  property: SchemaSTIXProperty;
  showTypeSelector?: boolean;
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const FormElementSTIXList: React.FC<Props> = ({
  btnLabel,
  property,
  showTypeSelector,
  onTypeChange,
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  return (
    <div className="flex flex-col mb-2">
      <STIXPropertyLabel
        propName={property ? property?.name : ''}
        propertyType={property?.type || undefined}
        showTypeSelector={showTypeSelector}
        onTypeChange={onTypeChange}
        additionalLabelClasses={'mr-2'}
        includeInfo={!!property.propertyDescription && property.propertyDescription?.length > 0}
        infoText={property.propertyDescription}
      />
      <div className={`flex flex-col items-center w-full`} >
        {selectedSTIXObject && selectedSTIXObject[property?.name || ''] ?
          selectedSTIXObject[property?.name || ''].map((listItem: string, i: number) =>
            <FormElementTextInput
              key={i}
              type="text"
              value={listItem}
              onChange={(event) => {
                let tempSTIXObj = { ...selectedSTIXObject };
                if (tempSTIXObj) {
                  tempSTIXObj[property?.name || ''][i] = event.target.value;
                }
                setSelectedSTIXObject(tempSTIXObj);
              }}
              className="mb-2"
              includeInfo={false}
              additionalInputClasses="select-sm dark:bg-gray-900"
              additionalLabelClasses="ml-6 mr-5 w-20"
              showValidationError={property.listType === "identifier" && selectedSTIXObject ?
                !stixIdentifierValidator(listItem)
                : false
              }
              validationErrorText={
                `The identifier is not valid. 
                Double check that it matches the format \"object-type--UUID\".`
              }
            />
          )
          : null
        }
        <ButtonBasic
          label={btnLabel}
          color="btn-primary"
          onClick={() => {
            let tempSTIXObj = { ...selectedSTIXObject } as StixObject;
            if (!tempSTIXObj[property?.name || '']) {
              // Initialize the property array
              tempSTIXObj[property?.name || ''] = [""];
            } else {
              tempSTIXObj[property?.name || ''].push("");
            }
            setSelectedSTIXObject(tempSTIXObj);
          }}
          additionalClasses="btn-sm ml-6"
        />
      </div>
    </div>
  );
};

export default FormElementSTIXList;