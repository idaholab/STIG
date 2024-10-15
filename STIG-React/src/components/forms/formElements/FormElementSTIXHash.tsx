import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import FormElementSelectOther from './FormElementSelectOther';
import { open_vocab_options } from '@/stix/openVocabOptions';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { stixHashKeyValidator } from '@/util/stixHashKeyValidator';
import { handlePropertyUpdate } from '@/stix/handlePropertyUpdate';
import { handleHashNameUpdate } from '@/stix/handleHashNameUpdate';

type Props = {
  hashAlgName: string;
  property: SchemaSTIXProperty;
};

const FormElementSTIXHash: React.FC<Props> = ({
  hashAlgName,
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  return ( selectedSTIXObject &&
    <div className='w-full'>
      <FormElementSelectOther
        placeholder='Select Hash Algorithm'
        value={hashAlgName}
        options={open_vocab_options["hash-algorithm-ov"]}
        onSelect={(event) => {
          handleHashNameUpdate(event.target.value, hashAlgName, property.name,
            selectedSTIXObject, setSelectedSTIXObject);
        }}
        onInputChange={(event) => {
          handleHashNameUpdate(event.target.value, hashAlgName, property.name,
            selectedSTIXObject, setSelectedSTIXObject);
        }}
        onSwitchToSuggested={() => {
          handleHashNameUpdate("", hashAlgName, property.name,
            selectedSTIXObject, setSelectedSTIXObject);
        }}
        inputClassName="pl-2 mb-2"
        includeInfo={false}
        additionalClasses="bg-transparent dark:bg-gray-700 border-none"
        additionalInputClasses="select-sm bg-transparent dark:bg-transparent"
        isOtherAnOption={true}
        otherOptionText="Other"
        otherOptionLabel={`Custom Hash Algorithm Name`}
      />
      <FormElementTextInput
        type="text"
        value={selectedSTIXObject[property.name][hashAlgName]}
        onChange={(event) => {
          handlePropertyUpdate(event.target.value, property.name, 
            selectedSTIXObject, setSelectedSTIXObject, hashAlgName);
        }}
        className="pl-2 mb-2"
        includeInfo={false}
        additionalInputClasses="select-sm dark:bg-gray-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
        disabled={!hashAlgName && !selectedSTIXObject[property.name][hashAlgName]}
        showValidationError={!stixHashKeyValidator(hashAlgName)}
        validationErrorText={
          `The hash key is not valid. 
          Double check that its length is 3-250 characters and that it is only made 
          up of the characters a-z, A-Z, 0-9, -, and _.`
        }
      />
    </div >
  )
};

export default FormElementSTIXHash;