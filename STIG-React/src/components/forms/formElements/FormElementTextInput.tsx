import ButtonIcon from '@/components/elements/ButtonIcon';
import React, { forwardRef } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  type: "text" | "password" | "number";
  min?: number;
  max?: number
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  includeInfo?: boolean;
  infoText?: string;
  infoIcon?: string,
  includeX?: boolean;
  onX?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  additionalInputClasses?: string;
  additionalInfoClasses?: string;
  additionalXClasses?: string;
  additionalLabelClasses?: string;
  prefix?: string;
  badgeText?: string
};

const FormElementTextInput = forwardRef<HTMLInputElement, Props>(({
  placeholder,
  label,
  type,
  min,
  max,
  value,
  onChange,
  className,
  disabled,
  includeInfo,
  infoText,
  infoIcon,
  includeX,
  onX,
  additionalInputClasses,
  additionalInfoClasses,
  additionalXClasses,
  additionalLabelClasses,
  prefix,
  badgeText
}, ref) => {

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className={`relative flex items-center w-full`}>
        {label && <span className={`${additionalLabelClasses}`}>{label}</span>}
        {prefix && (
          <span className="absolute inset-y-0 left-1 flex items-center text-gray-400 dark:text-gray-400">
            <span className="material-icons">{prefix}</span>
          </span>
        )}
        <input
          ref={ref}
          type={type}
          min={min}
          max={max}
          placeholder={placeholder ? placeholder : undefined}
          value={value}
          onChange={onChange}
          className={`
          flex
          ${prefix && 'pl-8'}
          w-full
          rounded-lg
          border
          border-gray-500
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
            title='Clear'>
            close
          </button>
        )}

        {includeInfo && (
          <div className={`flex cursor-pointer tooltip ${additionalInfoClasses}`} data-tip={infoText}>
            <ButtonIcon
              color={'btn-ghost'}
              buttonIcon={infoIcon ? infoIcon : ''}
              buttonSize={'btn-sm'}
            />
          </div>
        )}
      </div>

      {badgeText && badgeText?.length > 0 &&
        <div className="mt-2 badge dark:bg-orange-600 dark:text-orange-50 bg-orange-200 text-orange-900">{badgeText}</div>
      }
    </div>
  );
});

FormElementTextInput.displayName = 'FormElementTextInput'; //relates to ref somehow

export default FormElementTextInput;
