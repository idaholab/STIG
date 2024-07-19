// React
import React from 'react';

type Props = {
  placeholder: string;
  value?: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  includeInfo?: boolean;
  infoText?: string;
  additionalInfoClasses?: string;
};

const FormElementSelect: React.FC<Props> = ({
  placeholder,
  value,
  options,
  onChange,
  className,
  disabled,
  includeInfo,
  infoText,
  additionalInfoClasses
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-5 w-56">{placeholder}</span>
      <select
        // placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          select
          select-bordered
          select-sm
          w-full
          bg-gray-300
          dark:bg-gray-600
        "
        disabled={disabled}
      >
        {options.map((option, i) => {
          return (
            <option key={i}>{option}</option>
          )
        })}
      </select>
      {includeInfo ?
        <div className={`tooltip ${additionalInfoClasses}`} data-tip={infoText}>
          <span className="ml-1 material-icons">
            info_outline
          </span>
        </div>
        : null
      }
    </div>
  );
}

export default FormElementSelect;
