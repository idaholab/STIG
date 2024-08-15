// React
import ButtonIcon from '@/components/elements/ButtonIcon';
import React from 'react';

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
  additionalInfoClasses?: string;
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
  additionalInfoClasses
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {label && <span className="mr-5 w-[195px]">{label}</span>}
      <select
        // placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
        flex
          select
          select-bordered
          select-sm
          w-full
          bg-gray-100
          dark:bg-gray-600
          placeholder-gray-500
          dark:placeholder-gray-300 
          border
          border-gray-500
          bg-gray-100
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
        <div className={`flex cursor-pointer tooltip ${additionalInfoClasses}`} data-tip={infoText}>
          <ButtonIcon
            color={'btn-ghost'}
            buttonIcon={'info_outline'}
            buttonSize={'btn-sm'}
          />
        </div>
        : null
      }
    </div>
  );
}

export default FormElementSelect;
