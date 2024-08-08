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
    <div className={`relative flex items-center ${className}`}>
      {prefix && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
          <span className="material-icons">{prefix}</span>
        </span>
      )}
      <input
        type={type}
        placeholder={placeholderInInput ? placeholder : undefined}
        value={value}
        onChange={onChange}
        className={`
          w-full
          pl-${prefix ? 12 : 4} pr-${includeX ? 12 : 4}
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
        ref={ref}  // Attach ref for focus here
      />
      {includeX && value && (
        <button
          type="button"
          className={`text-gray-800 dark:text-gray-200 ${additionalXClasses}`}
          onClick={onX}>
          ✕
        </button>
      )}
      {includeInfo && (
        <div className={`tooltip ${additionalInfoClasses}`} data-tip={infoText}>
          <span className="ml-1 material-icons">
            filter_list
          </span>
        </div>
      )}
    </div>
  );
});

FormElementTextInput.displayName = 'FormElementTextInput'; //relates to ref somehow

export default FormElementTextInput;
