import React, { useRef, useState } from 'react';
import ButtonBasic from '../../elements/ButtonBasic.tsx';
import InfoButton from '@/components/elements/InfoButton.tsx';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty.ts';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel.tsx';
import { useStixPropsContext } from '@/contexts/StixPropsContext.tsx';
import AlertComponent from '@/components/elements/AlertComponent.tsx';
import { useNotificationContext } from '@/contexts/NotificationContext.tsx';

type Props = {
  placeholder?: string;
  label?: string;
  buttonLabel: string;
  acceptedFileTypes?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onFileChange?: (fileVal: string | ArrayBuffer | null | undefined) => void;
  parsedFileType?: "url" | "text";
  additionalInputClasses?: string;
  additionalBtnClasses?: string;
  className?: string;
  includeInfo?: boolean;
  additionalInfoClasses?: string;
  infoIcon?: string;
  infoText?: string;
  property?: SchemaSTIXProperty
};

const FormElementFileInput: React.FC<Props> = ({
  placeholder,
  label,
  buttonLabel = 'Save',
  acceptedFileTypes,
  onClick,
  onFileChange,
  parsedFileType = "text",
  additionalInputClasses,
  additionalBtnClasses,
  className,
  includeInfo = false,
  additionalInfoClasses,
  infoIcon,
  infoText,
  property
}) => {
  const { addNotification } = useNotificationContext();
  
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const fileReader = new FileReader();
      if (parsedFileType === "url") {
        fileReader.readAsDataURL(file);
      } else if (parsedFileType === "text") {
        fileReader.readAsText(file);
      }

      fileReader.onload = (event) => {
        const fileValue = event.target?.result;
        if (onFileChange) {
          // Notify parent component about the selected file
          if (parsedFileType === "url") {
            // Remove the metadata from what goes in the JSON
            onFileChange(String(fileValue).split(",")[1]);
            const fileSize = Math.floor(String(fileValue).split(",")[1].length / 1.33333);
            setFilename(`File Uploaded. Size: ${fileSize} bytes`);
            addNotification(`${file.name} successfully uploaded`, "success");
          } else {
            onFileChange(fileValue);
            setFilename(file.name); // Update the filename state
          }
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
