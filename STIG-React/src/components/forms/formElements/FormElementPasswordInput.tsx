// React
import React from 'react';

type Props = {
  placeholder: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const FormElementPasswordInput: React.FC<Props> = ({
  placeholder,
  value,
  onChange,
  className
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-5 w-56">{placeholder}</span>
      <input
        type="password"
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
      />
    </div>
  );
}

export default FormElementPasswordInput;
