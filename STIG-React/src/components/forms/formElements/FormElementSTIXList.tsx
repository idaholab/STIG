import React, { useEffect } from 'react';

import FormElementEmailMIMEPart from './FormElementSTIXEmailMIMEPart';
import FormElementSTIXExternalReference from './FormElementSTIXExternalReference';
import FormElementSelectOther from './FormElementSelectOther';
import FormElementSTIXGranularMarking from './FormElementSTIXGranularMarking';
import FormElementSTIXKillChainPhase from './FormElementSTIXKillChainPhase';
import FormElementSTIXWindowsRegistryValue from './FormElementSTIXWindowsRegistryValue';
import FormElementTextInput from './FormElementTextInput';

import ButtonBasic from '@/components/elements/ButtonBasic';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';

import { useStixPropsContext } from '@/contexts/StixPropsContext';

import { open_vocab_options } from '@/stix/openVocabOptions';
import { enum_options } from '@/stix/enumOptions';
import { handlePropertyUpdate } from '@/stix/handlePropertyUpdate';

import { EmailMIMEPartType } from '@/types/stixTypes/EmailMIMEPartType';
import { ExternalReference } from '@/types/stixTypes/ExternalReference';
import { GranularMarking } from '@/types/stixTypes/GranularMarking';
import { KillChainPhase } from '@/types/stixTypes/KillChainPhase';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { StixObject } from '@/types/stixTypes/StixObject';
import { WindowsRegistryValueType } from '@/types/stixTypes/WindowsRegistryValueType';

import { stixIdentifierValidator } from '@/util/stixIdentifierValidator';

type Props = {
  btnLabel: string | React.JSX.Element;
  property: SchemaSTIXProperty;
  showTypeSelector?: boolean;
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // The following are only needed when a list is 
  // within a list
  parentPropertyName?: string;
  parentPropertyIndex?: number;
  parentSTIXObject?: StixObject | undefined;
  setParentSTIXObject?: React.Dispatch<React.SetStateAction<StixObject | undefined>>;
};

const FormElementSTIXList: React.FC<Props> = ({
  btnLabel,
  property,
  showTypeSelector,
  onTypeChange,
  parentPropertyName,
  parentPropertyIndex,
  parentSTIXObject,
  setParentSTIXObject
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  // Update the child STIX object (the one containing the list 
  // property) when its parent changes
  useEffect(() => {
    if (parentSTIXObject && parentPropertyName && parentPropertyIndex !== undefined) {
      setSelectedSTIXObject(parentSTIXObject[parentPropertyName][parentPropertyIndex]);
    }
  }, [parentSTIXObject]);

  // Update the parent STIX object when its child
  // (the one containing the list property) changes
  useEffect(() => {
    if (parentPropertyName && parentPropertyIndex !== undefined &&
      parentSTIXObject && setParentSTIXObject && selectedSTIXObject) {
      handlePropertyUpdate(selectedSTIXObject, parentPropertyName,
        parentSTIXObject, setParentSTIXObject, parentPropertyIndex);
    }
  }, [selectedSTIXObject]);

  return (
    <div className="flex flex-col mb-2">
      <STIXPropertyLabel
        propName={property.name}
        propertyType={property.type}
        showTypeSelector={showTypeSelector}
        onTypeChange={onTypeChange}
        additionalLabelClasses={'mr-2'}
        includeInfo={!!property.propertyDescription && property.propertyDescription?.length > 0}
        infoText={property.propertyDescription}
      />
      <div className={`flex flex-col items-center w-full ml-4 pr-4`} >
        {selectedSTIXObject && selectedSTIXObject[property.name] ?
          property.listType === "email-mime-part-type" ?
            selectedSTIXObject[property.name].map((listItem: EmailMIMEPartType, i: number) =>
              <FormElementEmailMIMEPart
                key={i}
                emailMIMEPart={listItem}
                emailMIMEPartIndex={i}
                property={property}
              />
            )
            : property.listType === "enum" || property.listType === "open-vocab" ?
              selectedSTIXObject[property.name].map((listItem: string, i: number) =>
                <FormElementSelectOther
                  key={i}
                  placeholder=''
                  value={listItem}
                  options={property.openVocabType ? open_vocab_options[property.openVocabType] :
                    property.enumType ? enum_options[property.enumType] : []}
                  onSelect={(event) => {
                    handlePropertyUpdate(event.target.value, property.name,
                      selectedSTIXObject, setSelectedSTIXObject, i);
                  }}
                  onInputChange={(event) => {
                    handlePropertyUpdate(event.target.value, property.name,
                      selectedSTIXObject, setSelectedSTIXObject, i);
                  }}
                  onSwitchToSuggested={() => {
                    handlePropertyUpdate("", property.name,
                      selectedSTIXObject, setSelectedSTIXObject, i);
                  }}
                  className="mb-2"
                  inputClassName="mb-2"
                  includeInfo={false}
                  additionalClasses="dark:bg-gray-900 w-full"
                  additionalInputClasses="select-sm dark:bg-gray-900"
                  isOtherAnOption={property.openVocabType ? true : false}
                  otherOptionText="Other"
                  otherOptionLabel={`Custom ${property?.name} Value`}
                />
              )
              : property.listType === "external-reference" ?
                selectedSTIXObject[property.name].map((listItem: ExternalReference, i: number) =>
                  <FormElementSTIXExternalReference
                    key={i}
                    externalReference={listItem}
                    externalReferenceIndex={i}
                    property={property}
                  />
                )
                : property.listType === "granular-marking" ?
                  selectedSTIXObject[property.name].map((listItem: GranularMarking, i: number) =>
                    <FormElementSTIXGranularMarking
                      key={i}
                      granularMarking={listItem}
                      granularMarkingIndex={i}
                      property={property}
                    />
                  )
                  : property.listType === "kill-chain-phase" ?
                    selectedSTIXObject[property.name].map((listItem: KillChainPhase, i: number) =>
                      <FormElementSTIXKillChainPhase
                        key={i}
                        killChainPhase={listItem}
                        killChainPhaseIndex={i}
                        property={property}
                      />
                    )
                    : property.listType === "windows-registry-value-type" ?
                      selectedSTIXObject[property.name].map((listItem: WindowsRegistryValueType, i: number) =>
                        <FormElementSTIXWindowsRegistryValue
                          key={i}
                          windowsRegistryValue={listItem}
                          windowsRegistryValueIndex={i}
                          property={property}
                        />
                      )
                      : selectedSTIXObject[property.name].map((listItem: string, i: number) =>
                        <FormElementTextInput
                          key={i}
                          type="text"
                          value={listItem}
                          onChange={(event) => {
                            handlePropertyUpdate(event.target.value, property.name,
                              selectedSTIXObject, setSelectedSTIXObject, i);
                          }}
                          className="mb-2"
                          includeInfo={false}
                          additionalInputClasses="select-sm dark:bg-gray-900"
                          additionalLabelClasses="ml-6 mr-5 w-20"
                          showValidationError={property.listType === "identifier" && selectedSTIXObject ?
                            !stixIdentifierValidator(listItem)
                            : false
                          }
                          validationErrorText={
                            `The identifier is not valid. 
                  Double check that it matches the format \"object-type--UUID\".`
                          }
                        />
                      )
          : null
        }
        <ButtonBasic
          label={btnLabel}
          type="btn-primary"
          onClick={() => {
            let tempSTIXObj = { ...selectedSTIXObject } as StixObject;
            if (!tempSTIXObj[property.name]) {
              // Initialize the property array
              switch (property.listType) {
                case "email-mime-part-type":
                case "windows-registry-value-type":
                  tempSTIXObj[property.name] = [{}];
                  break;
                case "external-reference":
                  tempSTIXObj[property.name] = [{ source_name: "" }];
                  break;
                case "granular-marking":
                  tempSTIXObj[property.name] = [{ selectors: [] }];
                  break;
                case "kill-chain-phase":
                  tempSTIXObj[property.name] = [{ kill_chain_name: "", phase_name: "" }];
                  break;
                default:
                  tempSTIXObj[property.name] = [""];
              }
            } else {
              switch (property.listType) {
                case "email-mime-part-type":
                case "windows-registry-value-type":
                  tempSTIXObj[property.name].push({});
                  break;
                case "external-reference":
                  tempSTIXObj[property.name].push({ source_name: "" });
                  break;
                case "granular-marking":
                  tempSTIXObj[property.name].push({ selectors: [] });
                  break;
                case "kill-chain-phase":
                  tempSTIXObj[property.name].push({ kill_chain_name: "", phase_name: "" });
                  break;
                default:
                  tempSTIXObj[property.name].push("");
              }
            }
            setSelectedSTIXObject(tempSTIXObj);
          }}
          additionalClasses="btn-sm ml-6"
        />
      </div>
    </div>
  );
};

export default FormElementSTIXList;