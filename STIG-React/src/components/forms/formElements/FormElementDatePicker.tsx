import React, { useRef, useState } from 'react';
import "flatpickr/dist/flatpickr.min.css";
import Flatpickr from "react-flatpickr";
import flatpickr from "flatpickr";
import InfoButton from '@/components/elements/InfoButton';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import AlertComponent from '@/components/elements/AlertComponent';

type Props = {
  value?: string | number;
  onChange: flatpickr.Options.Hook | undefined;
  className?: string;
  includeInfo?: boolean;
  infoText?: string;
  infoIcon?: string;
  additionalInfoClasses?: string;
  additionalInputClasses?: string;
  property?: SchemaSTIXProperty;
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
      <div ref={parentRef} className={`relative group flex items-center w-full border border-neutralc-500 rounded`}>
        <Flatpickr
          className={`input dark:bg-neutralc-900 bg-neutralc-100 ${additionalInputClasses}`}
          data-enable-time
          options={{
            time_24hr: true,
            dateFormat: "Z"
          }}
          value={value}
          onChange={onChange}
        />
        <InfoButton
          visible={includeInfo}
          toggleInfo={toggleInfo}
          additionalInfoClasses={`absolute top-0 right-0 ${additionalInfoClasses}`}
          additionalStyle={{ transform: 'translate(50%, -50%)' }}
          parentRef={parentRef}
          infoIcon={infoIcon}
        />
      </div>
      {
        showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <AlertComponent alertText={infoText || ''} alertType={'info'} userClosable={false} className={'!mx-0 !my-1 !py-1 !px-2 text-xs'}></AlertComponent>
      }
    </div>
  );
}

export default FormElementDatePicker;
