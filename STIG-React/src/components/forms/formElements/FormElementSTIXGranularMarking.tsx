import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { StixPropsContextProvider, useStixPropsContext } from '@/contexts/StixPropsContext';
import { propertyDescriptions } from '@/stix/propertyDescriptions';
import { getSTIXPropDescriptions } from '@/stix/getSTIXPropDescriptions';
import { GranularMarking } from '@/types/stixTypes/GranularMarking';
import FormElementSTIXList from './FormElementSTIXList';

type Props = {
  granularMarking: GranularMarking;
  granularMarkingIndex: number;
  property: SchemaSTIXProperty;
};

const FormElementSTIXGranularMarking: React.FC<Props> = ({
  granularMarking,
  granularMarkingIndex,
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const granularMarkingDescription = propertyDescriptions.find((group) => group.name === property.listType);
  let granularMarkingPropDescriptions: { [propName: string]: string } = {};
  if (granularMarkingDescription) {
    granularMarkingPropDescriptions = getSTIXPropDescriptions(granularMarkingDescription);
  }

  return (selectedSTIXObject &&
    <div className='w-full'>
      <FormElementTextInput
        label="lang"
        type="text"
        value={granularMarking.lang ?? ""}
        onChange={(event) => {
          let tempSTIXObj = { ...selectedSTIXObject };
          if (tempSTIXObj) {
            delete granularMarking.lang;
            tempSTIXObj[property.name][granularMarkingIndex] = {
              "lang": event.target.value,
              ...granularMarking
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        includeInfo={granularMarkingPropDescriptions.lang ? true : false}
        infoText={granularMarkingPropDescriptions.lang}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <FormElementTextInput
        label="marking_ref"
        type="text"
        value={granularMarking.marking_ref ?? ""}
        onChange={(event) => {
          let tempSTIXObj = { ...selectedSTIXObject };
          if (tempSTIXObj) {
            delete granularMarking.marking_ref;
            tempSTIXObj[property.name][granularMarkingIndex] = {
              "marking_ref": event.target.value,
              ...granularMarking
            };
          }
          setSelectedSTIXObject(tempSTIXObj);
          setSelectionExists(true);
        }}
        className="mb-2"
        includeInfo={granularMarkingPropDescriptions.marking_ref ? true : false}
        infoText={granularMarkingPropDescriptions.marking_ref}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <StixPropsContextProvider>
        <FormElementSTIXList
          btnLabel="+ Selector"
          property={{
            name: "selectors",
            propertyDescription: granularMarkingPropDescriptions.selectors,
            type: "list",
            listType: "string",
            mandatory: true
          }}
          parentPropertyName={property.name}
          parentPropertyIndex={granularMarkingIndex}
          parentSTIXObject={selectedSTIXObject}
          setParentSTIXObject={obj => {
            setSelectedSTIXObject(obj);
            setSelectionExists(true);
          }}
        />
      </StixPropsContextProvider>
    </div>
  )
};

export default FormElementSTIXGranularMarking;