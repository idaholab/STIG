import React from "react";

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
import FormElementSTIXX509V3Extensions from "./formElements/FormElementSTIXX509V3Extensions";

import { SchemaSTIXProperty } from "@/types/stixSchemaTypes/SchemaSTIXProperty";

import { enum_options } from "@/stix/enumOptions";
import { handlePropertyUpdate } from "@/stix/handlePropertyUpdate";
import { open_vocab_options } from "@/stix/openVocabOptions";

import { stixHexValidator } from "@/util/stixHexValidator";
import { stixIdentifierValidator } from "@/util/stixIdentifierValidator";
import { readFiles } from "@/util/fileReader";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { calcRelTypes } from "@/util/calcSTIXRelTypes";

export function STIXPropertyRenderer({ property, showTypeSelector, onTypeChange,
  parentDictionaryProps, setParentDictionaryProps,
  parentSelectedProperties, setParentSelectedProperties
}: {
  property: SchemaSTIXProperty,
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
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();
  const { addNotification } = useNotificationContext();
  const { cyInstance } = useStigContext();

  switch (property.name) {
    case "id":
    case "type":
    case "spec_version":
    case "source_ref":
    case "target_ref":
    case "created":
    case "modified":
      return null;
    case "relationship_type":
      return (
        <FormElementSelect
          value={selectedSTIXObject && "relationship_type" in selectedSTIXObject ?
            selectedSTIXObject.relationship_type : ""
          }
          options={calcRelTypes(selectedSTIXObject)}
          onChange={(event) => {
            handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
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
          additionalClasses='dark:bg-neutralc-900 w-full'
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
          return <FormElementFileInput
            buttonLabel='Upload'
            onFileChange={async (files) => {
              const fileData = (await readFiles(files, "url"))[0];
              if (fileData.data) {
                handlePropertyUpdate(fileData.data, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
              } else {
                addNotification(`Error loading ${fileData.name}`, "error");
              }
            }}
            additionalInputClasses='input-sm'
            additionalBtnClasses='btn-sm'
            includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
            infoText={property?.propertyDescription}
            className='mb-2'
            property={property}
          />;
        case "boolean":
          return <FormElementSelect
            placeholder=''
            value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
              selectedSTIXObject[property.name]
              : ""
            }
            options={["true", "false"]}
            onChange={(event) => {
              handlePropertyUpdate(event.target.value === "true" ? true : false,
                property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
            }}
            additionalClasses='dark:bg-neutralc-900 w-full'
            includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
            infoText={property?.propertyDescription}
            property={property}
            showTypeSelector={showTypeSelector}
            onTypeChange={onTypeChange}
            className='mb-2'
          />;
        case "dictionary":
          return <StixPropsContextProvider>
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
          </StixPropsContextProvider>;
        case "enum":
        case "open-vocab":
          return <FormElementSelectOther
            placeholder=''
            value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
              selectedSTIXObject[property.name]
              : ""
            }
            options={property.openVocabType ? open_vocab_options[property.openVocabType] :
              property.enumType ? enum_options[property.enumType] : []}
            onSelect={(event) => {
              handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
            }}
            onInputChange={(event) => {
              handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
            }}
            onSwitchToSuggested={() => {
              handlePropertyUpdate(undefined, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists);
            }}
            className="mb-2"
            inputClassName="pl-2 mb-2"
            includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
            infoText={property?.propertyDescription}
            additionalClasses="dark:bg-neutralc-900 w-full"
            additionalInputClasses="select-sm dark:bg-neutralc-900"
            property={property}
            isOtherAnOption={property.openVocabType ? true : false}
            otherOptionText="Other"
            otherOptionLabel={`Custom ${property?.name} Value`}
          />;
        case "float":
        case "integer":
          return <FormElementTextInput
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
              handlePropertyUpdate(number, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, cyInstance);
            }}
            additionalInputClasses='select-sm dark:bg-neutralc-900'
            includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
            infoText={property?.propertyDescription}
            property={property}
            showTypeSelector={showTypeSelector}
            onTypeChange={onTypeChange}
            className='mb-2'
          />;
        case "hashes":
          return <FormElementSTIXHashes property={property} />;
        case "hex":
        case "identifier":
        case "string":
          return <FormElementTextInput
            type="text"
            value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
              selectedSTIXObject[property.name]
              : ""
            }
            onChange={(event) => {
              handlePropertyUpdate(event.target.value, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, cyInstance);
            }}
            disabled={property.name === "id" || property.name === "type" ||
              property.name === "source_ref" || property.name === "target_ref" ||
              property.name === "spec_version"
            }
            additionalInputClasses='select-sm dark:bg-neutralc-900'
            includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
            infoText={property?.propertyDescription}
            className="mb-2"
            property={property}
            showTypeSelector={showTypeSelector}
            onTypeChange={onTypeChange}
            showValidationError={
              selectedSTIXObject ?
                property.type === "hex" ?
                  !stixHexValidator(selectedSTIXObject[property.name])
                  : property.type === "identifier" ?
                    !stixIdentifierValidator(selectedSTIXObject[property.name])
                    : false
                : false
            }
            validationErrorText={
              property.type === "hex" ?
                `${property.name} is not a valid STIX hex value. 
                Double check that it contains an even number of hexadecimal characters
                (0-9 and lowercase a-f).`
                : `${property.name} is not a valid STIX identifier. 
                Double check that it matches the format \"object-type--UUID\".`
            }
          />;
        case "list":
          // TODO: Develop way to delete items (and reorganize list, 
          // clear list, and remove last item?)
          const addNewItemLabel =
            property.listType === "email-mime-part-type" ? "+ Email MIME Component"
              : property.listType === "external-reference" ? "+ External Reference"
                : property.listType === "granular-marking" ? "+ Granular Marking"
                  : property.listType === "identifier" ? "+ Identifier"
                    : property.listType === "kill-chain-phase" ? "+ Kill Chain Phase"
                      : property.listType === "windows-registry-value-type" ? "+ Windows Registry Key Value"
                        : "+ Item";
          return <FormElementSTIXList
            btnLabel={addNewItemLabel}
            property={property}
            showTypeSelector={showTypeSelector}
            onTypeChange={onTypeChange}
          />;
        case "timestamp":
          return <FormElementDatePicker
            value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
              selectedSTIXObject[property.name]
              : ""
            }
            onChange={([date]) => {
              handlePropertyUpdate(date, property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, cyInstance);
            }}
            className='w-full mb-2'
            additionalInputClasses='select-sm w-full'
            includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
            infoText={property?.propertyDescription}
            property={property}
            showTypeSelector={showTypeSelector}
            onTypeChange={onTypeChange}
          />;
        case "x509-v3-extensions-type":
          return <FormElementSTIXX509V3Extensions property={property} />;
      }
  }
}