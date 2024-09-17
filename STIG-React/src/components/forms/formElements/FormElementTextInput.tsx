import ButtonIcon from '@/components/elements/ButtonIcon';
import InfoButton from '@/components/elements/InfoButton';
import { STIXPropertyLabel } from '@/components/elements/STIXPropertyLabel';
import { PropertyConfig } from '@/types/schema';
import React, { forwardRef, useRef, useState } from 'react';

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

  property?: PropertyConfig;
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
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
  badgeText,
  showTypeSelector = false,
  onTypeChange,
  property,
}, ref) => {
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo);
  };

  const [isHovered, setIsHovered] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <STIXPropertyLabel
        propName={property ? property?.name : label || ''}
        propertyType={property ? property.type : undefined}
        showTypeSelector={showTypeSelector}
        onTypeChange={onTypeChange}
        additionalLabelClasses='mr-2'
      />
      <div ref={parentRef} className={`relative group flex items-center w-full`}>
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
          rounded-md
          border
          border-gray-500
          bg-gray-100
          dark:bg-gray-600
          placeholder-gray-500
          dark:placeholder-gray-300
          ${disabled ? 'cursor-not-allowed opacity-30' : undefined}
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

        <InfoButton
          visible={includeInfo}
          toggleInfo={toggleInfo}
          additionalInfoClasses={`${additionalInfoClasses}`}
          parentRef={parentRef}
        />
      </div>

      {badgeText && badgeText?.length > 0 &&
        <div className="mt-2 badge dark:bg-orange-600 dark:text-orange-50 bg-orange-200 text-orange-900">{badgeText}</div>
      }

      {showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <span className={`text-xs p-1 dark:text-orange-300 text-orange-800`}>{infoText}</span>
      }
    </div>
  );
});

FormElementTextInput.displayName = 'FormElementTextInput'; //relates to ref somehow

export default FormElementTextInput;
