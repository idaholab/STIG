// React
import React from 'react';

type Props = {
  placeholder: string;
  type: "text" | "password";
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  includeInfo?: boolean;
  infoText?: string;
  additionalInfoClasses?: string;
};

const FormElementTextInput: React.FC<Props> = ({
  placeholder,
  type,
  value,
  onChange,
  className,
  disabled,
  includeInfo,
  infoText,
  additionalInfoClasses
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-5 w-56">{placeholder}</span>
      <input
        type={type}
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
      {includeInfo ?
        <div className={`tooltip ${additionalInfoClasses}`} data-tip={infoText}>
          <span className="ml-1 material-icons">
            info_outline
          </span>
        </div>
        : null
      }
    </div>
  );
}

export default FormElementTextInput;
