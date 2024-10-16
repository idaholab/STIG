import React, { useEffect, useState } from "react";

import { useStigContext } from "@/contexts/StigContext";
import { StixPropsContextProvider, useStixPropsContext } from "@/contexts/StixPropsContext";

import FormElementSelect from "./formElements/FormElementSelect";
import FormElementTextInput from "./formElements/FormElementTextInput";
import FormElementSTIXList from "./formElements/FormElementSTIXList";
import FormElementDatePicker from "./formElements/FormElementDatePicker";
import FormElementFileInput from "./formElements/FormElementFileInput";
import FormElementSTIXDictionary from "./formElements/FormElementSTIXDictionary";
import FormElementSelectOther from "./formElements/FormElementSelectOther";
import FormElementSTIXHashes from "./formElements/FormElementSTIXHashes";

import { SchemaSTIXProperty } from "@/types/stixSchemaTypes/SchemaSTIXProperty";
import { StixObject } from "@/types/stixTypes/StixObject";

import { enum_options } from "@/stix/enumOptions";
import { open_vocab_options } from "@/stix/openVocabOptions";

import { stixIdentifierValidator } from "@/util/stixIdentifierValidator";

export function STIXPropertyRenderer({ property, handlePropertyUpdate, showTypeSelector, onTypeChange,
  parentDictionaryProps, setParentDictionaryProps,
  parentSelectedProperties, setParentSelectedProperties
}: {
  property: SchemaSTIXProperty,
  handlePropertyUpdate: (
    newVal: string | boolean | number | Date | ArrayBuffer | null | undefined,
    propName: string,
    selectedSTIXObject: StixObject | undefined,
    setSelectedSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>,
    cy?: cytoscape.Core
  ) => void,
  // The remaining properties are only passed in when the STIXPropertyRenderer
  // is used from within an dictionary component
  showTypeSelector?: boolean,
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  // Needed so that an dictionary within an dictionary can have its type changed
  parentDictionaryProps?: SchemaSTIXProperty[];
  setParentDictionaryProps?: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
  parentSelectedProperties?: SchemaSTIXProperty[];
  setParentSelectedProperties?: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
}) {
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();
  const { cyInstance } = useStigContext();

  // Used for open-vocab properties
  const [customValueSelected, setCustomValueSelected] = useState(
    property.openVocabType && selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
      !open_vocab_options[property.openVocabType].includes(selectedSTIXObject[property.name]) ?
        true : false
      : false
  );
  useEffect(() => {
    // Reset customValueSelected if the selectedSTIXObject changes
    setCustomValueSelected(
      property.openVocabType && selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
        !open_vocab_options[property.openVocabType].includes(selectedSTIXObject[property.name]) ?
          true : false
        : false
    );
  }, [selectedSTIXObject, property]);

  switch (property.name) {
    case "created":
    case "modified":
      return (
        null
      );
    case "relationship_type":
      return (
        <FormElementSelect
          value={selectedSTIXObject && "relationship_type" in selectedSTIXObject ?
            selectedSTIXObject.relationship_type : ""
          }
          // TODO: Figure out what determines which of these options are choices
          // and implement as part of schema.ts or here
          options={["uses", "targets", "delivers", "related-to", "created-by", "derived-from", "duplicate-of"]}
          onChange={(event) => {
            handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject);
            // Get cytoscape element (by id)
            if (selectedSTIXObject) {
              let ele = cyInstance?.getElementById(selectedSTIXObject.id.replace("relationship--", ""));
              if (ele?.length === 0) {
                ele = cyInstance?.getElementById(selectedSTIXObject.id);
              }
              // Update style for the element
              ele?.style('label', event.target.value);
            }
          }}
          additionalClasses='dark:bg-gray-900 w-full'
          includeInfo={true}
          infoText={property?.propertyDescription}
          property={property}
          showTypeSelector={showTypeSelector}
          onTypeChange={onTypeChange}
          className='mb-2'
        />
      );
    default:
      // TODO: Make it possible to clear each type of form input
      switch (property.type) {
        case "binary":
          return (
            <FormElementFileInput
              buttonLabel='Upload'
              onFileChange={async (fileVal: string | ArrayBuffer | null | undefined) => {
                handlePropertyUpdate(fileVal, property.name, selectedSTIXObject, setSelectedSTIXObject);
              }}
              parsedFileType='url'
              additionalInputClasses='input-sm'
              additionalBtnClasses='btn-sm'
              includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
              infoText={property?.propertyDescription}
              className='mb-2'
            />
          );
        case "boolean":
          return (
            <FormElementSelect
              placeholder=''
              value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                selectedSTIXObject[property.name]
                : ""
              }
              options={["true", "false"]}
              onChange={(event) => {
                handlePropertyUpdate(event.target.value === "true" ? true : false,
                  property.name, selectedSTIXObject, setSelectedSTIXObject);
              }}
              additionalClasses='dark:bg-gray-900 w-full'
              includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
              infoText={property?.propertyDescription}
              property={property}
              showTypeSelector={showTypeSelector}
              onTypeChange={onTypeChange}
              className='mb-2'
            />
          );
        case "dictionary":
          return (
            <StixPropsContextProvider>
              <FormElementSTIXDictionary
                dictionary={selectedSTIXObject ? selectedSTIXObject[property.name] : undefined}
                parentSTIXObject={selectedSTIXObject}
                setParentSTIXObject={setSelectedSTIXObject}
                parentDictionaryProps={parentDictionaryProps}
                setParentDictionaryProps={setParentDictionaryProps}
                parentSelectedProperties={parentSelectedProperties}
                setParentSelectedProperties={setParentSelectedProperties}
                property={property}
                showTypeSelector={showTypeSelector}
              />
            </StixPropsContextProvider>
          );
        case "enum":
        case "open-vocab":
          return (
            <FormElementSelectOther
              placeholder=''
              value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                selectedSTIXObject[property.name]
                : ""
              }
              options={property.openVocabType ? open_vocab_options[property.openVocabType] :
                property.enumType ? enum_options[property.enumType] : []}
              onSelect={(event) => {
                handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject);
              }}
              onInputChange={(event) => {
                handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject);
              }}
              onSwitchToSuggested={() => {
                handlePropertyUpdate(undefined, property.name, selectedSTIXObject, setSelectedSTIXObject);
              }}
              className="mb-2"
              inputClassName="pl-2 mb-2"
              includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
              infoText={property?.propertyDescription}
              additionalClasses="dark:bg-gray-900 w-full"
              additionalInputClasses="select-sm dark:bg-gray-900"
              property={property}
              customValueSelected={customValueSelected}
              setCustomValueSelected={setCustomValueSelected}
              isOtherAnOption={property.openVocabType ? true : false}
              otherOptionText="Custom Value"
              otherOptionLabel={`Custom ${property?.name} Value`}
            />
          );
        case "float":
        case "integer":
          return (
            <FormElementTextInput
              type="number"
              min={property.min}
              max={property.max}
              value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                selectedSTIXObject[property.name]
                : ""
              }
              onChange={(event) => {
                let number: string | number = event.target.value;
                if (number !== "") {
                  number = Number(event.target.value);
                  if (property.max !== undefined && number > property.max) {
                    number = property.max;
                  } else if (property.min !== undefined && number < property.min) {
                    number = property.min;
                  }
                }
                handlePropertyUpdate(number, property.name, selectedSTIXObject, setSelectedSTIXObject);
              }}
              additionalInputClasses='select-sm dark:bg-gray-900'
              includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
              infoText={property?.propertyDescription}
              property={property}
              showTypeSelector={showTypeSelector}
              onTypeChange={onTypeChange}
              className='mb-2'
            />
          );
        case "hashes":
          return (
            <FormElementSTIXHashes
              property={property}
            />
          );
        case "identifier":
        case "string":
          return (
            <FormElementTextInput
              type="text"
              value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                selectedSTIXObject[property.name]
                : ""
              }
              onChange={(event) => {
                handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject, cyInstance);
              }}
              disabled={property.name === "id" || property.name === "type" ||
                property.name === "source_ref" || property.name === "target_ref" ||
                property.name === "spec_version"
              }
              additionalInputClasses='select-sm dark:bg-gray-900'
              includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
              infoText={property?.propertyDescription}
              className="mb-2"
              property={property}
              showTypeSelector={showTypeSelector}
              onTypeChange={onTypeChange}
              showValidationError={property.type === "identifier" && selectedSTIXObject ?
                !stixIdentifierValidator(selectedSTIXObject[property.name])
                : false
              }
              validationErrorText={
                `${property.name} is not a valid STIX identifier. 
                Double check that it matches the format \"object-type--UUID\".`
              }
            />
          );
        case "list":
          // TODO: Develop way to delete items (and reorganize list, 
          // clear list, and remove last item?)
          const addNewItemLabel =
            property.listType === "external-reference" ? "+ External Reference"
              : property.listType === "granular-marking" ? "+ Granular Marking"
                : property.listType === "identifier" ? "+ Identifier"
                  : property.listType === "kill-chain-phase" ? "+ Kill Chain Phase"
                    : "+ Item";
          return (
            <FormElementSTIXList
              btnLabel={addNewItemLabel}
              property={property}
              showTypeSelector={showTypeSelector}
              onTypeChange={onTypeChange}
            />
          );
        case "timestamp":
          return (
            <FormElementDatePicker
              value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                selectedSTIXObject[property.name]
                : ""
              }
              onChange={([date]) => {
                handlePropertyUpdate(date, property.name, selectedSTIXObject, setSelectedSTIXObject);
              }}
              className='w-full mb-2'
              additionalInputClasses='select-sm w-full'
              includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
              infoText={property?.propertyDescription}
              property={property}
              showTypeSelector={showTypeSelector}
              onTypeChange={onTypeChange}
            />
          );
      }
  }
}