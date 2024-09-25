import React, { useRef, useState } from 'react';
import FormElementTextInput from './FormElementTextInput';
import ButtonBasic from '@/components/elements/ButtonBasic';
import { StixObject } from '@/types/stixTypes/StixObject';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import InfoButton from '@/components/elements/InfoButton';
import { STIXPropertyLabel } from '@/components/elements/STIXPropertyLabel';

type Props = {
  label?: string;
  placeholder?: string;
  stixObj: StixObject | undefined;
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
  property?: SchemaSTIXProperty;
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
};

const FormElementSTIXList: React.FC<Props> = ({
  label,
  placeholder,
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
  btnAdditionalClasses,
  property,
  showTypeSelector,
  onTypeChange,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo);
  };
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`flex flex-col ${className}`}>
      <STIXPropertyLabel
        propName={property ? property?.name : ''}
        propertyType={property?.type || undefined}
        showTypeSelector={showTypeSelector}
        onTypeChange={onTypeChange}
        additionalLabelClasses={'mr-2'}
      />
      <div className={`flex flex-col items-center w-full ml-2`} ref={parentRef} >
        {stixObj && stixObj[property?.name || ''] ?
          stixObj[property?.name || ''].map((listItem: string, i: number) =>
            <FormElementTextInput
              key={i}
              label={label ? label + (i + 1) : undefined}
              placeholder={placeholder ? placeholder + (i + 1) : undefined}
              type="text"
              value={listItem}
              onChange={(event) => {
                let tempSTIXObj = { ...stixObj };
                if (tempSTIXObj) {
                  tempSTIXObj[property?.name || ''][i] = event.target.value;
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
            let tempSTIXObj = { ...stixObj } as StixObject;
            if (!tempSTIXObj[property?.name || '']) {
              // Initialize the property array
              tempSTIXObj[property?.name || ''] = [""];
            } else {
              tempSTIXObj[property?.name || ''].push("");
            }
            setSTIXObj(tempSTIXObj);
          }}
          additionalClasses={btnAdditionalClasses}
        />
      </div>
      <InfoButton
        visible={includeInfo}
        toggleInfo={toggleInfo}
        additionalInfoClasses={`${additionalInfoClasses}`}
        parentRef={parentRef}
      />
      {
        showInfo && includeInfo && infoText && infoText?.length > 0 &&
        <span className="text-xs p-1 dark:text-orange-300 text-orange-800">{infoText}</span>
      }
    </div>
  );
};

export default FormElementSTIXList;