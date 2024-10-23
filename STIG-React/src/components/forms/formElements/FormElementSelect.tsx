// React
import AlertComponent from '@/components/elements/AlertComponent';
import InfoButton from '@/components/elements/InfoButton';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
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
          bg-neutralc-100
          placeholder-neutralc-500
          dark:placeholder-neutralc-300 
          border
          border-neutralc-500
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
          additionalInfoClasses={`absolute top-0 right-0 ${additionalInfoClasses}`}
          additionalStyle={{ transform: 'translate(50%, -50%)' }}
          parentRef={parentRef}
        />
      </div>
      {showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <AlertComponent alertText={infoText || ''} alertType={'info'} userClosable={false} className={'!mx-0 !my-1 !py-1 !px-2 text-xs'}></AlertComponent>
      }
    </div>
  );
}

export default FormElementSelect;
