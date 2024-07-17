// React
import React from 'react';

type Props = {
  placeholder: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
};

const FormElementTextInput: React.FC<Props> = ({
  placeholder,
  value,
  onChange,
  className,
  disabled
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-5 w-56">{placeholder}</span>
      <input
        type="text"
        // placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          input
          input-bordered
          input-sm
          w-full
          bg-gray-300
          dark:bg-gray-600
        "
        disabled={disabled}
      />
    </div>
  );
}

export default FormElementTextInput;
