import React from 'react';

type Props = {
  placeholder: string;
  placeholderInInput?: boolean;
  type: "text" | "password";
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  includeInfo?: boolean;
  infoText?: string;
  includeX?: boolean;
  onX?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  additionalInputClasses?: string;
  additionalInfoClasses?: string;
  additionalXClasses?: string;
};

const FormElementTextInput: React.FC<Props> = ({
  placeholder,
  placeholderInInput,
  type,
  value,
  onChange,
  className,
  disabled,
  includeInfo,
  infoText,
  includeX,
  onX,
  additionalInputClasses,
  additionalInfoClasses,
  additionalXClasses
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {!placeholderInInput ?
        <span className="mr-5 w-56">{placeholder}</span>
        : null
      }
      <input
        type={type}
        placeholder={placeholderInInput ? placeholder : undefined}
        value={value}
        onChange={onChange}
        className={`
          input
          input-bordered
          w-full
          bg-gray-100
          dark:bg-gray-600
          placeholder-gray-500
          dark:placeholder-gray-300 
          ${additionalInputClasses}
        `}
        disabled={disabled}
      />
      {includeX && value && (
        <button
          type="button"
          className={`text-gray-800 dark:text-gray-200 ${additionalXClasses}`}
          onClick={onX}
        >
          ✕
        </button>
      )}
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
