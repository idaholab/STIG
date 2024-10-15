import { SchemaSTIXProperty } from "@/types/stixSchemaTypes/SchemaSTIXProperty";
import React, { useEffect, useState } from "react";
import FormElementSelect from "./FormElementSelect";
import ButtonBasic from "@/components/elements/ButtonBasic";
import FormElementTextInput from "./FormElementTextInput";

type Props = {
  placeholder?: string;
  label?: string;
  value?: string;
  options: string[];
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchToSuggested: () => void;
  className?: string;
  inputClassName?: string;
  includeInfo?: boolean;
  infoText?: string;
  additionalClasses?: string;
  additionalInputClasses?: string;
  property?: SchemaSTIXProperty,
  isOtherAnOption: boolean,
  otherOptionText: string,
  otherOptionLabel: string
};

const FormElementSelectOther: React.FC<Props> = ({
  placeholder,
  label,
  value,
  options,
  onSelect,
  onInputChange,
  onSwitchToSuggested,
  className,
  inputClassName,
  includeInfo,
  infoText,
  additionalClasses,
  additionalInputClasses,
  property,
  isOtherAnOption,
  otherOptionText,
  otherOptionLabel
}) => {
  const [customValueSelected, setCustomValueSelected] = useState(
    isOtherAnOption && value ?
      !options.includes(value)
      : false
  );

  useEffect(() => {
    // Reset customValueSelected if isOtherAnOption or value changes.
    // Needed so that customValueSelected changes when switching
    // between objects.
    setCustomValueSelected(isOtherAnOption && value ?
      !options.includes(value)
      : false
    );
  }, [isOtherAnOption, value]);

  return (
    <>
      {!customValueSelected &&
        <FormElementSelect
          placeholder={placeholder}
          label={label}
          value={value !== "" || customValueSelected ? value : placeholder}
          options={isOtherAnOption ? [...options, otherOptionText] : options}
          onChange={(event) => {
            if (event.target.value === otherOptionText) {
              setCustomValueSelected(true);
            } else {
              setCustomValueSelected(false);
              onSelect(event);
            }
          }}
          additionalClasses={additionalClasses}
          includeInfo={includeInfo}
          infoText={infoText}
          property={property}
          className={className}
        />
      }
      {customValueSelected &&
        <>
          <p>{property?.name}</p>
          <div className="flex justify-between">
            <p className="ml-2 pr-4 mb-2">{otherOptionLabel}</p>
            <ButtonBasic
              label="Switch to suggested value"
              color="btn-secondary"
              onClick={() => {
                setCustomValueSelected(false);
                onSwitchToSuggested();
              }}
              additionalClasses="btn-xs"
            />
          </div>
          <FormElementTextInput
            type="text"
            value={value}
            onChange={onInputChange}
            additionalInputClasses={additionalInputClasses}
            includeInfo={includeInfo}
            infoText={infoText}
            className={inputClassName}
          />
        </>
      }
    </>
  );
}

export default FormElementSelectOther;