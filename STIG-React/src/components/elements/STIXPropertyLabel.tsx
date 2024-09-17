import { s_SchemaType } from "@/types/SchemaType";
import FormElementSelect from "../forms/formElements/FormElementSelect";
import React from "react";

export function STIXPropertyLabel({ propName, propertyType, showTypeSelector, onTypeChange, additionalLabelClasses }: {
    propName: string,
    propertyType?: s_SchemaType,
    showTypeSelector?: boolean,
    onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    additionalLabelClasses: string
}) {
    //TODO: see about getting rid of this and just using the options down below
    const stixSchemaToUITypeConverter: any = {
        "String": "string",
        "List": "array",
        "Boolean": "boolean",
        "Integer": "integer",
        "Timestamp": "string",
        "Binary": "string",
        "Dictionary": "object",
        "Float": "number",
        "kill_chain_phase": "object",
        "external_reference": "object",
        "granular_marking": "object",
        "email_mime_part_type": "object",
        "windows_registry_value_type": "object",
        "Hashes": "array",
        "Hex": "string",
        "Identifier": "string",
        "open_vocab": "string",
        "Enum": "string",
        "x509_v3_extensions_type": "object"
    };
    return (
        <div className='flex mb-1 items-center'>
            <p className={`${additionalLabelClasses}`}>{propName.charAt(0).toUpperCase() + propName.slice(1)}</p>
            {showTypeSelector && propertyType && onTypeChange ?
                <FormElementSelect
                    options={["array", "string", "integer", "boolean", "number", "object"]}
                    value={stixSchemaToUITypeConverter[propertyType]}
                    onChange={onTypeChange}
                    additionalClasses='select-xs dark:bg-gray-900'
                    className='w-fit'
                    includeInfo={false}
                />
                : null
            }
        </div>
    );
}