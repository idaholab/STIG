import { SchemaSTIXType } from "@/types/stixSchemaTypes/SchemaSTIXType";
import FormElementSelect from "../forms/formElements/FormElementSelect";
import React from "react";

export function STIXPropertyLabel({ propName, propertyType, showTypeSelector, onTypeChange, additionalLabelClasses }: {
    propName: string,
    propertyType?: SchemaSTIXType,
    showTypeSelector?: boolean,
    onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    additionalLabelClasses: string
}) {
    //TODO: see about getting rid of this and just using the options down below
    const stixSchemaToUITypeConverter: any = {
        "string": "string",
        "list": "array",
        "boolean": "boolean",
        "integer": "integer",
        "timestamp": "string",
        "binary": "string",
        "dictionary": "object",
        "float": "number",
        "kill-chain-phase": "object",
        "external-reference": "object",
        "granular-marking": "object",
        "email-mime-part-type": "object",
        "windows-registry-value-type": "object",
        "hashes": "array",
        "hex": "string",
        "identifier": "string",
        "open-vocab": "string",
        "enum": "string",
        "x509-v3-extensions-type": "object"
    };
    return (
        <>
            {propName &&
                <div className='flex items-center mb-1'>
                    <p className={`${additionalLabelClasses}`}>{propName}</p>
                    {showTypeSelector && propertyType && onTypeChange ?
                        <FormElementSelect
                            options={["array", "string", "integer", "boolean", "number", "object"]}
                            value={stixSchemaToUITypeConverter[propertyType]}
                            onChange={onTypeChange}
                            additionalClasses='select-xs dark:bg-gray-900 w-fit'
                            includeInfo={false}
                        />
                        : null
                    }
                </div>
            }
        </>
    );
}