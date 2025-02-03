import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXListProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { propertyDescriptions } from '@/stix/propertyDescriptions';
import { getSTIXPropDescriptions } from '@/stix/getSTIXPropDescriptions';
import { WindowsRegistryValueType } from '@/types/stixTypes/WindowsRegistryValueType';
import FormElementSelect from './FormElementSelect';
import { enum_options } from '@/stix/enumOptions';

type Props = {
  windowsRegistryValue: WindowsRegistryValueType;
  windowsRegistryValueIndex: number;
  property: SchemaSTIXListProperty;
};

const FormElementSTIXWindowsRegistryValue: React.FC<Props> = ({ windowsRegistryValue, windowsRegistryValueIndex, property }) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const windowsRegistryValueDescription = propertyDescriptions.find((group) => group.name === property.listType);
  let windowsRegistryValuePropDescriptions: { [propName: string]: string } = {};
  if (windowsRegistryValueDescription) {
    windowsRegistryValuePropDescriptions = getSTIXPropDescriptions(windowsRegistryValueDescription);
  }

  return (
    selectedSTIXObject && (
      <div className="w-full">
        <FormElementTextInput
          label="name"
          type="text"
          value={windowsRegistryValue.name ?? ''}
          onChange={(event) => {
            const tempSTIXObj = { ...selectedSTIXObject };
            if (tempSTIXObj) {
              delete windowsRegistryValue.name;
              tempSTIXObj[property.name][windowsRegistryValueIndex] = {
                name: event.target.value,
                ...windowsRegistryValue,
              };
            }
            setSelectedSTIXObject(tempSTIXObj);
            setSelectionExists(true);
          }}
          includeInfo={windowsRegistryValuePropDescriptions.name ? true : false}
          infoText={windowsRegistryValuePropDescriptions.name}
          additionalInputClasses="select-sm dark:bg-gray-900"
          additionalLabelClasses="ml-6 mr-5 w-20"
        />
        <FormElementTextInput
          label="data"
          type="text"
          value={windowsRegistryValue.data ?? ''}
          onChange={(event) => {
            const tempSTIXObj = { ...selectedSTIXObject };
            if (tempSTIXObj) {
              delete windowsRegistryValue.data;
              tempSTIXObj[property.name][windowsRegistryValueIndex] = {
                data: event.target.value,
                ...windowsRegistryValue,
              };
            }
            setSelectedSTIXObject(tempSTIXObj);
            setSelectionExists(true);
          }}
          includeInfo={windowsRegistryValuePropDescriptions.data ? true : false}
          infoText={windowsRegistryValuePropDescriptions.data}
          additionalInputClasses="select-sm dark:bg-gray-900"
          additionalLabelClasses="ml-6 mr-5 w-20"
        />
        <FormElementSelect
          label="data_type"
          placeholder=""
          value={windowsRegistryValue.data_type ?? ''}
          options={enum_options['windows-registry-datatype-enum']}
          onChange={(event) => {
            const tempSTIXObj = { ...selectedSTIXObject };
            if (tempSTIXObj) {
              delete windowsRegistryValue.data_type;
              tempSTIXObj[property.name][windowsRegistryValueIndex] = {
                data_type: event.target.value,
                ...windowsRegistryValue,
              };
            }
            setSelectedSTIXObject(tempSTIXObj);
            setSelectionExists(true);
          }}
          className="mb-2"
          includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
          infoText={property?.propertyDescription}
          additionalClasses="dark:bg-gray-900 w-full"
        />
      </div>
    )
  );
};

export default FormElementSTIXWindowsRegistryValue;
