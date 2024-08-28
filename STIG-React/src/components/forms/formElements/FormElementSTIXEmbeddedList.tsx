import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import ButtonBasic from '@/components/elements/ButtonBasic';
import { StixObject } from '@/types/Core';

type Props = {
  // Text input props
  label?: string;
  placeholder?: string;
  propName: string;
  // Had to add the "any" to this typing because VS Code was
  // not happy with any way I was attempting to check if a property
  // existed in the StixObject before attempting to use said property.
  stixObj: StixObject | undefined | any;
  setSTIXObj: React.Dispatch<React.SetStateAction<StixObject | undefined>>;
  className?: string;
  disabled?: boolean;
  includeInfo?: boolean;
  infoText?: string;
  includeX?: boolean;
  onX?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  additionalInputClasses?: string;
  additionalInfoClasses?: string;
  additionalXClasses?: string;
  additionalLabelClasses?: string;

  // Add new element button props
  btnLabel: string | React.JSX.Element;
  btnColor?: 'btn-primary' | 'btn-secondary' | 'btn-neutral' | 'btn-ghost';
  btnLink?: string;
  btnOnClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  btnAdditionalClasses?: string;
};

const FormElementSTIXEmbeddedList: React.FC<Props> = ({
  label,
  placeholder,
  propName,
  stixObj,
  setSTIXObj,
  className,
  disabled,
  includeInfo,
  infoText,
  includeX,
  onX,
  additionalInputClasses,
  additionalInfoClasses,
  additionalXClasses,
  additionalLabelClasses,
  btnLabel,
  btnColor,
  btnLink,
  btnAdditionalClasses
}) => {
  return (
    <>
      {stixObj && stixObj[propName] ? 
        stixObj[propName].map((listItem: string, i: number) =>
          <FormElementTextInput
            key={i}
            label={label ? label + (i+1) : undefined}
            placeholder={placeholder ? placeholder + (i+1) : undefined}
            type="text"
            value={listItem}
            onChange={(event) => {
              let tempSTIXObj = { ...stixObj };
              if (tempSTIXObj) {
                tempSTIXObj[propName][i] = event.target.value;
              }
              setSTIXObj(tempSTIXObj);
            }}
            className={`mb-2 ${className}`}
            disabled={disabled}
            includeInfo={includeInfo}
            infoText={infoText}
            includeX={includeX}
            onX={onX}
            additionalInputClasses={`${additionalInputClasses}`}
            additionalInfoClasses={`${additionalInfoClasses}`}
            additionalXClasses={`${additionalXClasses}`}
            additionalLabelClasses={`${additionalLabelClasses}`}
          />
        )
        : null
      }
      <ButtonBasic
        label={btnLabel}
        color={btnColor}
        link={btnLink}
        onClick={() => {
          let tempSTIXObj = { ...stixObj };
          if (!tempSTIXObj[propName]) {
            // Initialize the property array
            tempSTIXObj[propName] = [""];
          } else {
            tempSTIXObj[propName].push("");
          }
          setSTIXObj(tempSTIXObj);
        }}
        additionalClasses={btnAdditionalClasses}
      />
    </>
  );
};

export default FormElementSTIXEmbeddedList;