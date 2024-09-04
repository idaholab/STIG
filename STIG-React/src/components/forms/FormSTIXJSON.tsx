import React, { useState } from 'react';
import Dropdown from '@/components/core/Dropdown';
// import FormElementTextInput from '@/components/forms/formElements/FormElementTextInput.tsx';

type Props = {
  input: Object;
  disabled?: boolean;
};

const FormSTIXJSON: React.FC<Props> = ({
  input,
  disabled,

}) => {

  const [jsonText, setJsonText] = useState<string>(JSON.stringify(input, null, 2));
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsedJson = JSON.parse(value);
      // TODO: Return the JSON string to the parent or convert it back to a stix object to return to the parent.
      // Not part of task 106
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  return (
    <Dropdown
      title="JSON"
      additionalClasses="bg-primary rounded-md"
      additionalButtonClasses="btn-sm text-white"
    >
      <div className='form-stix-json flex'>
        <textarea
          style={{ whiteSpace: 'pre', overflow: 'auto' }}
          className="flex flex-grow p-2 font-mono border-none rounded bg-transparent outline-none focus:outline-none focus:border-none scrollbar h-full w-full"
          onChange={handleJsonChange}
          value={jsonText}
          disabled={disabled}
        />
      </div>
    </Dropdown>
  );
};

export default FormSTIXJSON;