import React, { useRef, useState } from 'react';
import ButtonBasic from '../../elements/ButtonBasic.tsx';
import InfoButton from '@/components/elements/InfoButton.tsx';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty.ts';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel.tsx';
import { useStixPropsContext } from '@/contexts/StixPropsContext.tsx';
import AlertComponent from '@/components/elements/AlertComponent.tsx';

type Props = {
  placeholder?: string;
  label?: string;
  buttonLabel: string;
  acceptedFileTypes?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onFileChange?: (files: FileList) => void;
  additionalInputClasses?: string;
  additionalBtnClasses?: string;
  className?: string;
  includeInfo?: boolean;
  additionalInfoClasses?: string;
  infoIcon?: string;
  infoText?: string;
  multiple?: boolean;
  property?: SchemaSTIXProperty
};

const FormElementFileInput: React.FC<Props> = ({
  placeholder,
  label,
  buttonLabel = 'Save',
  acceptedFileTypes,
  onClick,
  onFileChange,
  additionalInputClasses,
  additionalBtnClasses,
  className,
  includeInfo = false,
  additionalInfoClasses,
  infoIcon,
  infoText,
  multiple,
  property
}) => {

  // Get the file's size as done in STIG Old
  // (as done in the json-editor npm package)
  const { selectedSTIXObject } = useStixPropsContext();
  let fileSize = undefined;
  if (selectedSTIXObject && property && selectedSTIXObject[property?.name]) {
    fileSize = Math.floor(selectedSTIXObject[property?.name].length / 1.33333);
  }
  const [filename, setFilename] = useState(fileSize !== undefined ? 
    `File Uploaded. Size: ${fileSize} bytes`
    : ''
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (onClick) {
      onClick(event);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = event.target.files;
    if (!onFileChange || !fileData || fileData.length === 0) return;
    onFileChange(fileData);
    if (fileData.length == 1) {
      setFilename(fileData[0].name);
    } else {
      setFilename(Array.from(fileData).map(({ name }) => `"${name}"`).join(' '));
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
        propName={property ? property?.name : label || ''}
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
          input-neutralc
          w-full
          bg-neutralc-100
          dark:bg-neutralc-900
          ${additionalInputClasses}
          mr-1
        `}
        />
        <input
          type="file"
          multiple={multiple}
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          placeholder={placeholder}
          accept={acceptedFileTypes}
        />
        <ButtonBasic
          label={buttonLabel}
          type={'btn-neutralc'}
          additionalClasses={`${additionalBtnClasses}`}
          onClick={handleButtonClick}
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
      {showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <AlertComponent alertText={infoText || ''} alertType={'info'} userClosable={false} className={'!mx-0 !my-1 !py-1 !px-2 text-xs'}></AlertComponent>
      }
    </div>
  );
};

export default FormElementFileInput;
