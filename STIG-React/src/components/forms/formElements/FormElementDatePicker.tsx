import React, { useRef, useState } from 'react';
import "flatpickr/dist/flatpickr.min.css";
import Flatpickr from "react-flatpickr";
import flatpickr from "flatpickr";
import InfoButton from '@/components/elements/InfoButton';
import { STIXPropertyLabel } from '@/components/elements/STIXPropertyLabel';
import { PropertyConfig } from '@/types/schema';

type Props = {
  value?: string | number;
  onChange: flatpickr.Options.Hook | undefined;
  className?: string;
  includeInfo?: boolean;
  infoText?: string;
  infoIcon?: string;
  additionalInfoClasses?: string;
  additionalInputClasses?: string;
  property?: PropertyConfig;
  showTypeSelector?: boolean;
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  label?: string;
};

const FormElementDatePicker: React.FC<Props> = ({
  value,
  onChange,
  className,
  includeInfo,
  infoText,
  infoIcon,
  additionalInfoClasses,
  additionalInputClasses,
  property,
  showTypeSelector,
  onTypeChange,
  label
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo);
  };
  const parentRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <STIXPropertyLabel
        propName={property ? property?.name : label || ''}
        propertyType={property ? property.type : undefined}
        showTypeSelector={showTypeSelector}
        onTypeChange={onTypeChange}
        additionalLabelClasses='mr-2'
      />
      <div ref={parentRef} className={`relative group flex items-center w-full`}>
        <Flatpickr
          className={`input ${additionalInputClasses}`}
          data-enable-time
          options={{
            time_24hr: true,
            allowInput: true,
            dateFormat: "Z"
          }}
          value={value}
          onChange={onChange}
        />
        <InfoButton
          visible={includeInfo}
          toggleInfo={toggleInfo}
          additionalInfoClasses={`${additionalInfoClasses}`}
          parentRef={parentRef}
        />
      </div>
      {
        showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <span className="text-xs p-1 dark:text-orange-300 text-orange-800">{infoText}</span>
      }
    </div>
  );
}

export default FormElementDatePicker;
