import React, { useState } from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import FormElementSelectOther from './FormElementSelectOther';
import { open_vocab_options } from '@/stix/openVocabOptions';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { stixHashKeyValidator } from '@/util/stixHashKeyValidator';

type Props = {
  hashAlgName: string;
  property: SchemaSTIXProperty;
};

const FormElementSTIXHash: React.FC<Props> = ({
  hashAlgName,
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  const [customValueSelected, setCustomValueSelected] = useState(
    selectedSTIXObject && hashAlgName !== "" ? 
      !open_vocab_options["hash-algorithm-ov"].includes(hashAlgName) ?
        true : false
      : false
  );

  const handleHashNameUpdate = (newHashName: string) => {
    // Hash Algorithm Name Update is done as follows
    // to preserve the order of hashes
    if(selectedSTIXObject) {
      let tempSTIXObj = { ...selectedSTIXObject };
      if (tempSTIXObj) {
        // Remove the hashes property
        delete tempSTIXObj[property.name];
        // Reset the hashes property to an empty object
        tempSTIXObj[property.name] = {};
        // Re-create the hashes property in order, replacing
        // the changed hash name with the selected value
        Object.keys(selectedSTIXObject[property.name]).map(tempHashAlgName => {
          if(tempHashAlgName !== hashAlgName) {
            tempSTIXObj[property.name][tempHashAlgName] = selectedSTIXObject[property.name][tempHashAlgName];
          } else {
            tempSTIXObj[property.name][newHashName] = selectedSTIXObject[property.name][tempHashAlgName];
          }
        });
      }
      setSelectedSTIXObject(tempSTIXObj);
    }
  }

  return ( selectedSTIXObject &&
    <div className='w-full'>
      <FormElementSelectOther
        placeholder='Select Hash Algorithm'
        value={ hashAlgName !== "" || customValueSelected ? hashAlgName : 'Select Hash Algorithm' }
        options={open_vocab_options["hash-algorithm-ov"]}
        onSelect={(event) => {
          handleHashNameUpdate(event.target.value);
        }}
        onInputChange={(event) => {
          handleHashNameUpdate(event.target.value);
        }}
        onSwitchToSuggested={() => {
          handleHashNameUpdate("");
        }}
        inputClassName="pl-2 mb-2"
        includeInfo={false}
        additionalClasses="bg-transparent dark:bg-gray-700 border-none"
        additionalInputClasses="select-sm bg-transparent dark:bg-transparent"
        customValueSelected={customValueSelected}
        setCustomValueSelected={setCustomValueSelected}
        isOtherAnOption={true}
        otherOptionText="Other"
        otherOptionLabel={`Custom Hash Algorithm Name`}
      />
      <FormElementTextInput
        type="text"
        value={selectedSTIXObject[property.name][hashAlgName]}
        onChange={(event) => {
          let tempSTIXObj = { ...selectedSTIXObject };
          if (tempSTIXObj) {
            tempSTIXObj[property.name][hashAlgName] = event.target.value;
          }
          setSelectedSTIXObject(tempSTIXObj);
        }}
        className="pl-2 mb-2"
        disabled={!hashAlgName && !selectedSTIXObject[property.name][hashAlgName]}
        includeInfo={false}
        additionalInputClasses="select-sm dark:bg-gray-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
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