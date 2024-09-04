import React from 'react';
import Dropdown from '@/components/core/Dropdown';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
// import FormElementTextInput from '@/components/forms/formElements/FormElementTextInput.tsx';

const FormSTIXJSON = () => {
  const { selectedSTIXObject } = useStixPropsContext();
  return (
    <Dropdown
      title="JSON"
      additionalClasses="bg-primary rounded-md"
      additionalButtonClasses="btn-sm text-white"
    >
      {/* TODO: Make this a text input (or area?) and styled*/}
      <pre className='w-max'>
        {JSON.stringify(selectedSTIXObject, null, 2)}
      </pre>
      {/* <FormElementTextInput
        type="text"
        value={JSON.stringify(jsonContents, null, 2)}
        onChange={() => {}}
        className='w-max h-96'
      /> */}
    </Dropdown>
  );
};

export default FormSTIXJSON;