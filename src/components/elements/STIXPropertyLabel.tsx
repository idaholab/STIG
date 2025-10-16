import { SchemaSTIXType } from "@/types/stixSchemaTypes/SchemaSTIXType";
import FormElementSelect from "../forms/formElements/FormElementSelect";
import React, { forwardRef, useRef, useState } from "react";
import InfoButton from "./InfoButton";
import AlertComponent from "./AlertComponent";

type Props = {
    propName: string;
    propertyType?: SchemaSTIXType;
    showTypeSelector?: boolean;
    onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    additionalLabelClasses: string;
    includeInfo?: boolean;
    infoText?: string;
}

const STIXPropertyLabel = forwardRef<HTMLParagraphElement, Props>(({
    propName,
    propertyType,
    showTypeSelector,
    onTypeChange,
    additionalLabelClasses,
    includeInfo = false,
    infoText
}, ref) => {
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
    const [showInfo, setShowInfo] = useState(false);
    const toggleInfo = () => {
        setShowInfo(prevShowInfo => !prevShowInfo);
    };
    const parentRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {propName &&
                <div className='flex items-center mb-1' ref={parentRef}>
                    <p ref={ref} className={`${additionalLabelClasses ? additionalLabelClasses : 'mr-1'}`}>
                        {propName}
                    </p>
                    {showTypeSelector && propertyType && onTypeChange ?
                        <FormElementSelect
                            options={["array", "string", "integer", "boolean", "number", "object"]}
                            value={stixSchemaToUITypeConverter[propertyType]}
                            onChange={onTypeChange}
                            additionalClasses='select-xs dark:bg-neutralc-900 w-fit'
                            includeInfo={false}
                        />
                        : null
                    }
                    <InfoButton
                        visible={includeInfo}
                        toggleInfo={toggleInfo}
                        parentRef={parentRef}
                        iconSize={.7}
                    />
                </div>
            }
            {showInfo && includeInfo && infoText && infoText?.length > 0 &&
                <AlertComponent alertText={infoText || ''} alertType={'info'} userClosable={false} className={'!mx-0 !my-1 !py-1 !px-2 text-xs'}></AlertComponent>
            }
        </>
    );
});

STIXPropertyLabel.displayName = "STIXPropertyLabel"; //relates to ref somehow

export default STIXPropertyLabel;