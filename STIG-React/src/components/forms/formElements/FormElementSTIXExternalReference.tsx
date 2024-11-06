import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { StixPropsContextProvider, useStixPropsContext } from '@/contexts/StixPropsContext';
import { propertyDescriptions } from '@/stix/propertyDescriptions';
import { getSTIXPropDescriptions } from '@/stix/getSTIXPropDescriptions';
import { ExternalReference } from '@/types/stixTypes/ExternalReference';
import FormElementSTIXHashes from './FormElementSTIXHashes';

type Props = {
  externalReference: ExternalReference;
  externalReferenceIndex: number;
  property: SchemaSTIXProperty;
};

const FormElementSTIXExternalReference: React.FC<Props> = ({
  externalReference,
  externalReferenceIndex,
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const externalReferenceDescription = propertyDescriptions.find((group) => group.name === property.listType);
  let externalReferencePropDescriptions: { [propName: string]: string } = {};
  if (externalReferenceDescription) {
    externalReferencePropDescriptions = getSTIXPropDescriptions(externalReferenceDescription);
  }

  return (selectedSTIXObject &&
    <div className='w-full'>
      <FormElementTextInput
        label="source_name"
        type="text"
        value={externalReference.source_name}
        onChange={(event) => {
          let tempSTIXObj = { ...selectedSTIXObject };
          if (tempSTIXObj) {
            // Use a temp variable here so that
            // the required source_name property can
            // temporarily be deleted
            const tempExternalReference: Partial<ExternalReference> = externalReference;
            delete tempExternalReference.source_name;
            tempSTIXObj[property.name][externalReferenceIndex] = {
              "source_name": event.target.value,
              ...tempExternalReference
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={externalReferencePropDescriptions.source_name ? true : false}
        infoText={externalReferencePropDescriptions.source_name}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <FormElementTextInput
        label="description"
        type="text"
        value={externalReference.description ?? ""}
        onChange={(event) => {
          let tempSTIXObj = { ...selectedSTIXObject };
          if (tempSTIXObj) {
            delete externalReference.description;
            tempSTIXObj[property.name][externalReferenceIndex] = {
              "description": event.target.value,
              ...externalReference
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={externalReferencePropDescriptions.description ? true : false}
        infoText={externalReferencePropDescriptions.description}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <FormElementTextInput
        label="url"
        type="text"
        value={externalReference.url ?? ""}
        onChange={(event) => {
          let tempSTIXObj = { ...selectedSTIXObject };
          if (tempSTIXObj) {
            delete externalReference.url;
            tempSTIXObj[property.name][externalReferenceIndex] = {
              "url": event.target.value,
              ...externalReference
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={externalReferencePropDescriptions.url ? true : false}
        infoText={externalReferencePropDescriptions.url}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <StixPropsContextProvider>
        <FormElementSTIXHashes
          property={{
            name: "hashes",
            propertyDescription: externalReferencePropDescriptions.hashes,
            type: "hashes"
          }}
          parentPropertyName={property.name}
          parentPropertyIndex={externalReferenceIndex}
          parentSTIXObject={selectedSTIXObject}
          setParentSTIXObject={obj => {
            setSelectedSTIXObject(obj);
            setSelectionExists(true);
          }}
        />
      </StixPropsContextProvider>
      <FormElementTextInput
        label="external_id"
        type="text"
        value={externalReference.external_id ?? ""}
        onChange={(event) => {
          let tempSTIXObj = { ...selectedSTIXObject };
          if (tempSTIXObj) {
            delete externalReference.external_id;
            tempSTIXObj[property.name][externalReferenceIndex] = {
              "external_id": event.target.value,
              ...externalReference
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        className="mb-2"
        includeInfo={externalReferencePropDescriptions.external_id ? true : false}
        infoText={externalReferencePropDescriptions.external_id}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
    </div>
  )
}

export default FormElementSTIXExternalReference;