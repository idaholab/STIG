import { useStigContext } from "@/contexts/StigContext";
import { StixPropsContextProvider, useStixPropsContext } from "@/contexts/StixPropsContext";
import { SchemaSTIXProperty } from "@/types/stixSchemaTypes/SchemaSTIXProperty";
import React from "react";
import FormElementSelect from "./formElements/FormElementSelect";
import FormElementTextInput from "./formElements/FormElementTextInput";
import FormElementSTIXList from "./formElements/FormElementSTIXList";
import FormElementDatePicker from "./formElements/FormElementDatePicker";
import FormElementFileInput from "./formElements/FormElementFileInput";
import FormElementSTIXDictionary from "./formElements/FormElementSTIXDictionary";

export function STIXPropertyRenderer({ property, handlePropertyUpdate, showTypeSelector, onTypeChange,
    parentDictionaryProps, setParentDictionaryProps,
    parentSelectedProperties, setParentSelectedProperties
}: {
    property: SchemaSTIXProperty,
    handlePropertyUpdate: (newVal: string | boolean | number | Date | ArrayBuffer | null | undefined,
        propName: string) => void,
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

    const renderDescription = () => {
        if (property?.propertyDescription) {
            return <small className="text-gray-600 dark:text-gray-300">{property?.propertyDescription}</small>;
        }
        return null;
    };

    switch (property.name) {
        case "created":
        case "modified":
            return (
                null
            );
        case "spec_version":
            return (
                <>
                    <FormElementSelect
                        value={selectedSTIXObject && "spec_version" in selectedSTIXObject ?
                            selectedSTIXObject.spec_version : ""
                        }
                        options={["2.0", "2.1"]}
                        onChange={(event) => {
                            handlePropertyUpdate(event.target.value, property.name);
                        }}
                        className='mb-2'
                        additionalClasses='dark:bg-gray-900 w-full'
                        // STIG does not currently support STIX 2.0
                        disabled
                        includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                        infoText={property?.propertyDescription}
                        property={property}
                        showTypeSelector={showTypeSelector}
                        onTypeChange={onTypeChange}
                    />
                </>
            );
        case "relationship_type":
            return (
                <>
                    <FormElementSelect
                        value={selectedSTIXObject && "relationship_type" in selectedSTIXObject ?
                            selectedSTIXObject.relationship_type : ""
                        }
                        // TODO: Figure out what determines which of these options are choices
                        // and implement as part of schema.ts or here
                        options={["uses", "targets", "delivers", "related-to", "created-by", "derived-from", "duplicate-of"]}
                        onChange={(event) => {
                            handlePropertyUpdate(event.target.value, property.name);
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
                </>
            );
        default:
            // TODO: Make it possible to clear each type of form input
            switch (property.type) {
                case "string":
                    return (
                        <>
                            <FormElementTextInput
                                type="text"
                                value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                                    selectedSTIXObject[property.name]
                                    : ""
                                }
                                onChange={(event) => {
                                    handlePropertyUpdate(event.target.value, property.name);
                                }}
                                disabled={property.name === "id" || property.name === "type" || property.name === "source_ref" || property.name === "target_ref"}
                                additionalInputClasses='select-sm dark:bg-gray-900'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                className="mb-2"
                                property={property}
                                showTypeSelector={showTypeSelector}
                                onTypeChange={onTypeChange}
                            />
                        </>
                    );
                //=======LIST================================================================================
                case "list":
                    // TODO: Develop way to delete items (and reorganize list, 
                    // clear list, and remove last item?)
                    switch (property.listType) {
                        case "external-reference":
                            return (
                                <>
                                    <FormElementSTIXList
                                        label="item"
                                        stixObj={selectedSTIXObject}       //NOTE: what does this provide?
                                        setSTIXObj={setSelectedSTIXObject} //NOTE: what does this provide?
                                        className='mb-2'
                                        additionalInputClasses='select-sm dark:bg-gray-900'
                                        additionalLabelClasses='ml-6 mr-5 w-20'
                                        btnLabel="+ Item"
                                        btnColor="btn-primary"
                                        btnAdditionalClasses='btn-sm ml-6'
                                        includeInfo={false}
                                        infoText={property?.propertyDescription}
                                        property={property}
                                        showTypeSelector={showTypeSelector}
                                        onTypeChange={onTypeChange}
                                    />
                                </>
                            )
                        case "kill-chain-phase":
                            return (
                                <>
                                    <FormElementSTIXList
                                        label="kill-chain-phase "
                                        stixObj={selectedSTIXObject}
                                        setSTIXObj={setSelectedSTIXObject}
                                        className='mb-2'
                                        additionalInputClasses='select-sm dark:bg-gray-900'
                                        additionalLabelClasses='ml-6 mr-5 w-20'
                                        btnLabel="+ Item"
                                        btnColor="btn-primary"
                                        btnAdditionalClasses='btn-sm ml-6'
                                        property={property}
                                        showTypeSelector={showTypeSelector}
                                        onTypeChange={onTypeChange}
                                    />
                                </>
                            )
                        case "string":
                        default:
                            return (
                                <>
                                    <FormElementSTIXList
                                        label="item "
                                        stixObj={selectedSTIXObject}
                                        setSTIXObj={setSelectedSTIXObject}
                                        className='mb-2'
                                        additionalInputClasses='select-sm dark:bg-gray-900'
                                        additionalLabelClasses='ml-6 mr-5 w-20'
                                        btnLabel="+ Item"
                                        btnColor="btn-primary"
                                        btnAdditionalClasses='btn-sm ml-6'
                                        includeInfo={false}
                                        infoText={property?.propertyDescription}
                                        property={property}
                                        showTypeSelector={showTypeSelector}
                                        onTypeChange={onTypeChange}
                                    />
                                </>
                            );
                    }
                //=======END LIST============================================================================
                case "boolean":
                    return (
                        <>
                            <FormElementSelect
                                placeholder=''
                                value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                                    selectedSTIXObject[property.name]
                                    : ""
                                }
                                options={["true", "false"]}
                                onChange={(event) => {
                                    handlePropertyUpdate(event.target.value === "true" ? true : false, property.name);
                                }}
                                additionalClasses='dark:bg-gray-900 w-full'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                property={property}
                                showTypeSelector={showTypeSelector}
                                onTypeChange={onTypeChange}
                                className='mb-2'
                            />
                        </>
                    );
                case "integer":
                case "float":
                    return (
                        <>
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
                                    handlePropertyUpdate(number, property.name);
                                }}
                                additionalInputClasses='select-sm dark:bg-gray-900'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                property={property}
                                showTypeSelector={showTypeSelector}
                                onTypeChange={onTypeChange}
                                className='mb-2'
                            />
                        </>
                    );
                case "timestamp":
                    return (
                        <>
                            <FormElementDatePicker
                                value={selectedSTIXObject && selectedSTIXObject[property.name] !== undefined ?
                                    selectedSTIXObject[property.name]
                                    : ""
                                }
                                onChange={([date]) => {
                                    handlePropertyUpdate(date, property.name);
                                }}
                                className='w-full mb-2'
                                additionalInputClasses='select-sm w-full'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                property={property}
                                showTypeSelector={showTypeSelector}
                                onTypeChange={onTypeChange}
                            />
                        </>
                    );
                case "binary":
                    return (
                        <>
                            <FormElementFileInput
                                buttonLabel='Upload'
                                onFileChange={async (fileVal: string | ArrayBuffer | null | undefined) => {
                                    handlePropertyUpdate(fileVal, property.name);
                                }}
                                parsedFileType='url'
                                additionalInputClasses='input-sm'
                                additionalBtnClasses='btn-sm'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                className='mb-2'
                            />
                        </>
                    );
                case "dictionary":
                    return (
                        <StixPropsContextProvider>
                            <FormElementSTIXDictionary
                                dictionary={selectedSTIXObject ? selectedSTIXObject[property.name] : undefined}
                                showTypeSelector={showTypeSelector}
                                parentSTIXObject={selectedSTIXObject}
                                setParentSTIXObject={setSelectedSTIXObject}
                                parentDictionaryProps={parentDictionaryProps}
                                setParentDictionaryProps={setParentDictionaryProps}
                                parentSelectedProperties={parentSelectedProperties}
                                setParentSelectedProperties={setParentSelectedProperties}
                                className='mb-2'
                                property={property}
                            />
                        </StixPropsContextProvider>
                    );
            }
    }
}