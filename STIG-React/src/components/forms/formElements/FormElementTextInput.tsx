import AlertComponent from '@/components/elements/AlertComponent';
import InfoButton from '@/components/elements/InfoButton';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { mdiCloseCircle } from '@mdi/js';
import Icon from '@mdi/react';
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
  suffix?: string;
  badgeText?: string

  property?: SchemaSTIXProperty;
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,

  showValidationError?: boolean;
  validationErrorText?: string;
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
  suffix,
  badgeText,
  showTypeSelector = false,
  onTypeChange,
  property,
  showValidationError,
  validationErrorText
}, ref) => {
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo);
  };
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`formTextInputContainer flex flex-col w-full ${className}`}>
      <STIXPropertyLabel
        propName={property ? property?.name : label || ''}
        propertyType={property ? property.type : undefined}
        showTypeSelector={showTypeSelector}
        onTypeChange={onTypeChange}
        additionalLabelClasses='mr-2'
      />
      <div ref={parentRef} className={`relative group flex items-center w-full `}>
        {prefix && (
          <span className="absolute inset-y-0 left-1 flex items-center text-neutralc-400 dark:text-neutralc-400">
            <Icon path={prefix} size={1} />
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
          items-center
          w-full
          rounded-md
          border
          border-neutralc-500
          bg-neutralc-100
          dark:bg-neutralc-900
          placeholder-neutralc-500
          dark:placeholder-neutralc-300
          ${disabled ? 'cursor-not-allowed opacity-30' : undefined}
          ${additionalInputClasses}
        `}
          disabled={disabled}
        />
        {includeX && value && (
          <button
            type="button"
            className={`flex items-center absolute right-2 dark:text-neutralc-300 text-neutralc-500 hover:text-black ${additionalXClasses}`}
            onClick={onX}
            title='Clear'>
            <Icon path={mdiCloseCircle} size={.9} />
          </button>
        )}

        {suffix && (
          <div className={"ml-4"}>
            {suffix}
          </div>
        )}
        <InfoButton
          visible={includeInfo}
          toggleInfo={toggleInfo}
          additionalInfoClasses={`absolute top-0 right-0 ${additionalInfoClasses}`}
          additionalStyle={{ transform: 'translate(50%, -50%)' }}
          parentRef={parentRef}
          iconSize={.7}
        />
      </div>

      {badgeText && badgeText?.length > 0 &&
        <AlertComponent alertText={badgeText || ''} alertType={'warning'} userClosable={false} className={'!mx-0 !my-1 !py-1 !px-2 text-xs dark:text-white'}></AlertComponent>
      }

      {showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <AlertComponent alertText={infoText || ''} alertType={'info'} userClosable={false} className={'!mx-0 !my-1 !py-1 !px-2 text-xs'}></AlertComponent>
      }

      {showValidationError && validationErrorText &&
        <AlertComponent alertText={validationErrorText || ''} alertType={'error'} userClosable={false} className={'!mx-0 !my-1 !py-1 !px-2 text-xs'}></AlertComponent>
      }
    </div>
  );
});

FormElementTextInput.displayName = 'FormElementTextInput'; //relates to ref somehow

export default FormElementTextInput;
