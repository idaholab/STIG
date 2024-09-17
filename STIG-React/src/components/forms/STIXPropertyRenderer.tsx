import { useStigContext } from "@/contexts/StigContext";
import { StixPropsContextProvider, useStixPropsContext } from "@/contexts/StixPropsContext";
import { PropertyConfig } from "@/types/schema";
import React from "react";
import FormElementSelect from "./formElements/FormElementSelect";
import FormElementTextInput from "./formElements/FormElementTextInput";
import FormElementSTIXEmbeddedList from "./formElements/FormElementSTIXEmbeddedList";
import FormElementDatePicker from "./formElements/FormElementDatePicker";
import FormElementFileInput from "./formElements/FormElementFileInput";
import FormElementSTIXEmbeddedMap from "./formElements/FormElementSTIXEmbeddedMap";
import { STIXPropertyLabel } from "../elements/STIXPropertyLabel";

export function STIXPropertyRenderer({ property, handlePropertyUpdate, showTypeSelector, onTypeChange,
    parentEmbeddedMapProps, setParentEmbeddedMapProps,
    parentSelectedProperties, setParentSelectedProperties
}: {
    property: PropertyConfig,
    handlePropertyUpdate: (newVal: string | boolean | number | Date | ArrayBuffer | null | undefined,
        propName: string) => void,
    // The remaining properties are only passed in when the STIXPropertyRenderer
    // is used from within an EmbeddedMap component
    showTypeSelector?: boolean,
    onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    // Needed so that an EmbeddedMap within an EmbeddedMap can have its type changed
    parentEmbeddedMapProps?: PropertyConfig[];
    setParentEmbeddedMapProps?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
    parentSelectedProperties?: PropertyConfig[];
    setParentSelectedProperties?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
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
                        additionalClasses='dark:bg-gray-900'
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
                            const ele = cyInstance?.getElementById(selectedSTIXObject.id.replace("relationship--", ""));
                            // Update style for the element
                            ele?.style('label', event.target.value);
                        }}
                        additionalClasses='dark:bg-gray-900'
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
                case "String":
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
                case "List":
                    // TODO: Develop way to delete items (and reorganize list, 
                    // clear list, and remove last item?)
                    switch (property.listType) {
                        case "external_reference":
                            return (
                                <>
                                    <FormElementSTIXEmbeddedList
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
                        case "kill_chain_phase":
                            return (
                                <>
                                    <FormElementSTIXEmbeddedList
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
                        case "String":
                        default:
                            return (
                                <>
                                    <FormElementSTIXEmbeddedList
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
                case "Boolean":
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
                                additionalClasses='dark:bg-gray-900'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                property={property}
                                showTypeSelector={showTypeSelector}
                                onTypeChange={onTypeChange}
                                className='mb-2'
                            />
                        </>
                    );
                case "Integer":
                case "Float":
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
                case "Timestamp":
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
                                additionalInputClasses='select-sm w-full dark:bg-gray-900'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                property={property}
                                showTypeSelector={showTypeSelector}
                                onTypeChange={onTypeChange}
                            />
                        </>
                    );
                case "Binary":
                    return (
                        <>
                            <FormElementFileInput
                                buttonLabel='Upload'
                                onFileChange={async (fileVal: string | ArrayBuffer | null | undefined) => {
                                    handlePropertyUpdate(fileVal, property.name);
                                }}
                                additionalInputClasses='input-sm'
                                additionalBtnClasses='btn-sm'
                                includeInfo={!!property?.propertyDescription && property?.propertyDescription?.length > 0}
                                infoText={property?.propertyDescription}
                                className='mb-2'
                            />
                        </>
                    );
                case "Dictionary":
                    return (
                        <StixPropsContextProvider>
                            <FormElementSTIXEmbeddedMap
                                embeddedMap={selectedSTIXObject ? selectedSTIXObject[property.name] : undefined}
                                showTypeSelector={showTypeSelector}
                                parentSTIXObject={selectedSTIXObject}
                                setParentSTIXObject={setSelectedSTIXObject}
                                parentEmbeddedMapProps={parentEmbeddedMapProps}
                                setParentEmbeddedMapProps={setParentEmbeddedMapProps}
                                parentSelectedProperties={parentSelectedProperties}
                                setParentSelectedProperties={setParentSelectedProperties}
                                className='mb-2'
                                property={property}
                            />
                        </StixPropsContextProvider>
                    );
                default:
                    return (
                        <>
                            <STIXPropertyLabel
                                propName={property.name}
                                propertyType={property.type}
                                showTypeSelector={showTypeSelector}
                                onTypeChange={onTypeChange}
                                additionalLabelClasses={''}
                            />
                        </>
                    );
            }
    }
}