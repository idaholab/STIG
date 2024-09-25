// React
import InfoButton from '@/components/elements/InfoButton';
import { STIXPropertyLabel } from '@/components/elements/STIXPropertyLabel';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import React, { useRef, useState } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  includeInfo?: boolean;
  infoText?: string;
  infoIcon?: string,
  additionalClasses?: string;
  additionalInfoClasses?: string;
  property?: SchemaSTIXProperty,
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
};

const FormElementSelect: React.FC<Props> = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  className,
  disabled,
  includeInfo,
  infoText,
  infoIcon,
  additionalClasses,
  additionalInfoClasses,
  property,
  onTypeChange,
  showTypeSelector = false,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo);
  };
  const parentRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={parentRef} className={`flex flex-col items-start w-full ${className}`}>
      {/* {label && <span className="mr-5 w-[195px]">{label}</span>} */}
      <STIXPropertyLabel
        propName={property ? property.name : label || ''}
        propertyType={property ? property.type : undefined}
        showTypeSelector={showTypeSelector}
        onTypeChange={onTypeChange}
        additionalLabelClasses={'mr-2'}
      />
      <div className={`relative group flex items-center w-full`}>
        <select
          value={value}
          onChange={onChange}
          className={`
          flex
          select
          select-bordered
          select-sm
          bg-gray-100
          placeholder-gray-500
          dark:placeholder-gray-300 
          border
          border-gray-500
          bg-gray-100
          dark:bg-gray-900 
          ${disabled ? 'cursor-not-allowed opacity-30' : undefined}
          ${additionalClasses}
        `}
          disabled={disabled}
        >
          {placeholder !== undefined ?
            <option disabled>{placeholder}</option>
            : null
          }

          {options.map((option, i) => {
            return (
              <option key={i}>{option}</option>
            )
          })}
        </select>
        <InfoButton
          visible={includeInfo}
          toggleInfo={toggleInfo}
          additionalInfoClasses={`${additionalInfoClasses}`}
          parentRef={parentRef}
        />
      </div>
      {showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <span className="text-xs p-1 dark:text-orange-300 text-orange-800">{infoText}</span>
      }
    </div>
  );
}

export default FormElementSelect;
