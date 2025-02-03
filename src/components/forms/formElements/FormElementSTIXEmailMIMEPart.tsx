import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXListProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { propertyDescriptions } from '@/stix/propertyDescriptions';
import { getSTIXPropDescriptions } from '@/stix/getSTIXPropDescriptions';
import { EmailMIMEPartType } from '@/types/stixTypes/EmailMIMEPartType';
import { stixIdentifierValidator } from '@/util/stixIdentifierValidator';

type Props = {
  emailMIMEPart: EmailMIMEPartType;
  emailMIMEPartIndex: number;
  property: SchemaSTIXListProperty;
};

const FormElementEmailMIMEPart: React.FC<Props> = ({
  emailMIMEPart,
  emailMIMEPartIndex,
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const emailMIMEPartDescription = propertyDescriptions.find((group) => group.name === property.listType);
  let emailMIMEPartPropDescriptions: { [propName: string]: string } = {};
  if (emailMIMEPartDescription) {
    emailMIMEPartPropDescriptions = getSTIXPropDescriptions(emailMIMEPartDescription);
  }

  return (selectedSTIXObject &&
    <div className='w-full'>
      <FormElementTextInput
        label="body"
        type="text"
        value={emailMIMEPart.body ?? ""}
        onChange={(event) => {
          const tempSTIXObj = { ...selectedSTIXObject }
          if (tempSTIXObj) {
            delete emailMIMEPart.body;
            tempSTIXObj[property.name][emailMIMEPartIndex] = {
              "body": event.target.value,
              ...emailMIMEPart
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={emailMIMEPartPropDescriptions.body ? true : false}
        infoText={emailMIMEPartPropDescriptions.body}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <FormElementTextInput
        label="body_raw_ref"
        type="text"
        value={emailMIMEPart.body_raw_ref ?? ""}
        onChange={(event) => {
          const tempSTIXObj = { ...selectedSTIXObject }
          if (tempSTIXObj) {
            delete emailMIMEPart.body_raw_ref;
            tempSTIXObj[property.name][emailMIMEPartIndex] = {
              "body_raw_ref": event.target.value,
              ...emailMIMEPart
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={emailMIMEPartPropDescriptions.body_raw_ref ? true : false}
        infoText={emailMIMEPartPropDescriptions.body_raw_ref}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
        showValidationError={emailMIMEPart.body_raw_ref ?
          !stixIdentifierValidator(emailMIMEPart.body_raw_ref)
          : false
        }
        validationErrorText={
          `The identifier is not valid.
          Double check that it matches the format \"object-type--UUID\".`
        }
      />
      <FormElementTextInput
        label="content_type"
        type="text"
        value={emailMIMEPart.content_type ?? ""}
        onChange={(event) => {
          const tempSTIXObj = { ...selectedSTIXObject }
          if (tempSTIXObj) {
            delete emailMIMEPart.content_type;
            tempSTIXObj[property.name][emailMIMEPartIndex] = {
              "content_type": event.target.value,
              ...emailMIMEPart
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={emailMIMEPartPropDescriptions.content_type ? true : false}
        infoText={emailMIMEPartPropDescriptions.content_type}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <FormElementTextInput
        label="content_disposition"
        type="text"
        value={emailMIMEPart.content_disposition ?? ""}
        onChange={(event) => {
          const tempSTIXObj = { ...selectedSTIXObject }
          if (tempSTIXObj) {
            delete emailMIMEPart.content_disposition;
            tempSTIXObj[property.name][emailMIMEPartIndex] = {
              "content_disposition": event.target.value,
              ...emailMIMEPart
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={emailMIMEPartPropDescriptions.content_disposition ? true : false}
        infoText={emailMIMEPartPropDescriptions.content_disposition}
        className='mb-2'
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
    </div>
  )
};

export default FormElementEmailMIMEPart;