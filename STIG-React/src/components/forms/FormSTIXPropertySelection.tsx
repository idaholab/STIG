import React, { useEffect, useState } from 'react';
import Dropdown from '@/components/core/Dropdown';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import FormElementTextInput from './formElements/FormElementTextInput';
import ButtonBasic from '../elements/ButtonBasic';

type Props = {
  propertyOptions: SchemaSTIXProperty[];
  setPropertyOptions?: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
  selectedProperties: SchemaSTIXProperty[];
  setSelectedProperties: React.Dispatch<React.SetStateAction<SchemaSTIXProperty[]>>;
  includeAddNew?: boolean;
  size: 'standard' | 'small';
};

const FormSTIXPropertySelection: React.FC<Props> = ({
  propertyOptions,
  setPropertyOptions,
  selectedProperties,
  setSelectedProperties,
  includeAddNew,
  size
}) => {
  const [newPropertyName, setNewPropertyName] = useState("");
  const [buttonSize, setButtonSize] = useState<string>('');
  const [buttonContainerSize, setButtonContainerSize] = useState<string>('');

  useEffect(() => {
    setButtonSize((size === 'standard') ? 'btn-sm' : 'btn-xs');
    setButtonContainerSize((size === 'standard') ? 'w-[125px]' : 'w-[105px] h-[24px]');
  }, [size]);

  return <Dropdown
    title="Properties"
    includeDropdownArrow
    additionalClasses={`flex items-center bg-white dark:bg-neutralc-900 border border-black dark:border-transparent rounded-md ${buttonContainerSize}`}
    additionalButtonClasses={`${buttonSize}`}
  >
    <div className="relative">
      <div className={`max-h-60 overflow-y-scroll scrollbar w-60 ${includeAddNew ? 'mb-8' : ''} `}>
        {propertyOptions?.toSorted((a, b) => a.name.localeCompare(b.name)).map((prop, i) =>
          <label key={i} className="label cursor-pointer dark:text-neutralc-300 dark:hover:text-white dark:hover:bg-neutralc-800 text-neutralc-700 hover:text-black hover:bg-neutralc-200">
            <span className="mr-2">{prop.name}</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary hover:checkbox-neutralc"
              checked={selectedProperties.find(selectedProperty => selectedProperty.name === prop.name) ? true : false}
              disabled={prop.mandatory}
              onChange={(event) => {
                if (event.target.checked) {
                  selectedProperties.push(prop);
                  // Need this so that React recognizes the variable change and updates the checkbox
                  setSelectedProperties([...selectedProperties]);
                } else {
                  setSelectedProperties(
                    selectedProperties.filter(selectedProperty => selectedProperty.name !== prop.name)
                  );
                }
              }}
            />
          </label>
        )}

      </div>
      <div className="absolute bottom-0 left-0 w-full px-2">
        {includeAddNew && setPropertyOptions ?
          <div className='flex items-center gap-2'>
            <FormElementTextInput
              type="text"
              placeholder="Property name..."
              value={newPropertyName}
              onChange={(event) => { setNewPropertyName(event.target.value) }}
              additionalInputClasses='bg-neutralc dark:bg-neutralc p-2 dark:placeholder:text-neutralc-100 placeholder:text-neutralc-900 dark:text-white text-black btn-xs'
              includeInfo={false}
            />
            <ButtonBasic
              label={
                <div className='flex items-center justify-between'>
                  <span className="material-icons !text-sm">add</span>
                  <span>Add</span>
                </div>
              }
              type={'btn-primary'}
              additionalClasses='btn-xs'
              disabled={newPropertyName === undefined || newPropertyName === ''}
              onClick={() => {
                // Can't add a property with no name
                if (newPropertyName) {
                  const tempPropertyOptions = [...propertyOptions];
                  tempPropertyOptions.push({ name: newPropertyName, type: "string" });
                  setPropertyOptions(tempPropertyOptions);
                  const tempSelectedProperties = [...selectedProperties];
                  tempSelectedProperties.push({ name: newPropertyName, type: "string" });
                  setSelectedProperties(tempSelectedProperties);
                  setNewPropertyName("");
                }
              }}
            />
          </div>
          : null
        }
      </div>

    </div>
  </Dropdown>;
};

export default FormSTIXPropertySelection;