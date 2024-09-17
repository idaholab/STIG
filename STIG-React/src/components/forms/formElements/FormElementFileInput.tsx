import React, { useRef, useState } from 'react';
import ButtonBasic from '../../elements/ButtonBasic.tsx';
import InfoButton from '@/components/elements/InfoButton.tsx';
import { PropertyConfig } from '@/types/schema.ts';
import { STIXPropertyLabel } from '@/components/elements/STIXPropertyLabel.tsx';

type Props = {
  placeholder?: string;
  buttonLabel: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onFileChange?: (fileVal: string | ArrayBuffer | null | undefined) => void;
  additionalInputClasses?: string;
  additionalBtnClasses?: string;
  className?: string;
  includeInfo?: boolean;
  additionalInfoClasses?: string;
  infoIcon?: string;
  infoText?: string;
  property?: PropertyConfig
};

const FormElementFileInput: React.FC<Props> = ({
  placeholder,
  buttonLabel = 'Save',
  onClick,
  onFileChange,
  additionalInputClasses,
  additionalBtnClasses,
  className,
  includeInfo,
  additionalInfoClasses,
  infoIcon,
  infoText,
  property
}) => {
  const [filename, setFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (onClick) {
      onClick(event);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFilename(file.name); // Update the filename state

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (event) => {
        const fileValue = event.target?.result;
        if (onFileChange) {
          onFileChange(fileValue); // Notify parent component about the selected file
        }
      }
    }
  };

  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo);
  };
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <STIXPropertyLabel
        propName={property ? property?.name : placeholder || ''}
        propertyType={property ? property.type : undefined}
        showTypeSelector={false}
        additionalLabelClasses=''
      />
      <div ref={parentRef} className={`relative group flex items-center w-full`}>
        <input
          type="text"
          value={filename}
          readOnly
          className={`
          input
          input-bordered
          input-secondary
          w-full
          bg-gray-300
          dark:bg-gray-900
          ${additionalInputClasses}
          mr-1
        `}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <ButtonBasic
          label={buttonLabel}
          color={'btn-secondary'}
          additionalClasses={`${additionalBtnClasses}`}
          onClick={handleButtonClick}
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
};

export default FormElementFileInput;
