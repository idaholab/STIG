import React, { useRef, useState } from 'react';
import ButtonBasic from '../../elements/ButtonBasic.tsx';

type Props = {
  placeholder?: string;
  /**
  * Button label
  */
  buttonLabel: string;
  /**
  * Optional click handler
  */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
  * File change handler to communicate the file to the parent component
  */
  onFileChange?: (fileVal: string | ArrayBuffer | null | undefined) => void;
  additionalInputClasses?: string;
  additionalBtnClasses?: string;
};

const FormElementFileInput: React.FC<Props> = ({
  placeholder,
  buttonLabel = 'Save',
  onClick,
  onFileChange,
  additionalInputClasses,
  additionalBtnClasses
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

  return (
    <div className={`flex gap-2`}>
      {placeholder ?
        <span>{placeholder}</span>
        : null
      }
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
    </div>
  );
};

export default FormElementFileInput;
