import React, { forwardRef } from 'react';

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
  prefix?: string;
};

const FormElementTextInput = forwardRef<HTMLInputElement, Props>(({
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
  additionalXClasses,
  prefix,
}, ref) => {

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className={`relative flex items-center w-full `}
        title={includeInfo ? infoText : ''}>
        {prefix && (
          <span className="absolute inset-y-0 left-1 flex items-center text-gray-400 dark:text-gray-400">
            <span className="material-icons">{prefix}</span>
          </span>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholderInInput ? placeholder : undefined}
          value={value}
          onChange={onChange}
          className={`
          flex
          pl-8
          w-full
          py-2
          rounded-lg
          border
          border-gray-300
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
            className={`material-icons absolute right-2 dark:text-gray-300 text-gray-500 hover:text-black ${additionalXClasses}`}
            onClick={onX}
            title='Clear filter text'>
            close
          </button>
        )}
      </div>
      {value && value?.length > 0 &&
        <div className="mt-2 badge dark:bg-orange-600 dark:text-orange-50 bg-orange-200 text-orange-900">Stencils are Filtered!</div>
      }

    </div>
  );
});

FormElementTextInput.displayName = 'FormElementTextInput'; //relates to ref somehow

export default FormElementTextInput;
