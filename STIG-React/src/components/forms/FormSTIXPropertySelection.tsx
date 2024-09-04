import React, { useState } from 'react';
import Dropdown from '@/components/core/Dropdown';
import { PropertyConfig } from '@/types/schema';
import FormElementTextInput from './formElements/FormElementTextInput';
import ButtonBasic from '../elements/ButtonBasic';

type Props = {
  propertyOptions: PropertyConfig[];
  setPropertyOptions?: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
  selectedProperties: PropertyConfig[];
  setSelectedProperties: React.Dispatch<React.SetStateAction<PropertyConfig[]>>;
  includeAddNew?: boolean;
};

const FormElementSTIXPropertySelection: React.FC<Props> = ({
  propertyOptions, setPropertyOptions,
  selectedProperties, setSelectedProperties, includeAddNew
}) => {
  const [newPropertyName, setNewPropertyName] = useState("");

  return (
    <Dropdown
      title="Properties"
      includeDropdownArrow
      additionalClasses="bg-white dark:bg-gray-900 border border-black dark:border-transparent rounded-md"
      additionalButtonClasses="btn-sm"
    >
      <div className='max-h-60 overflow-y-scroll scrollbar w-max'>
        {propertyOptions?.map((prop, i) =>
          <label key={i} className="label cursor-pointer dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:text-white">
            <span className="mr-2">{prop.name}</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary hover:checkbox-secondary"
              checked={selectedProperties.find(selectedProperty => selectedProperty.name === prop.name) ? true : false}
              disabled={prop.mandatory}
              onChange={(event) => {
                if (event.target.checked) {
                  selectedProperties.push(prop);
                  // Need this so that React recognizes the variable change and updates the checkbox
                  const tempPropertiesSelection = [...selectedProperties];
                  setSelectedProperties(tempPropertiesSelection);
                } else {
                  setSelectedProperties(
                    selectedProperties.filter(selectedProperty =>
                      selectedProperty.name !== prop.name
                    )
                  );
                }
              }}
            />
          </label>
        )}
        {includeAddNew && setPropertyOptions ?
          <>
            <FormElementTextInput
              type="text"
              placeholder="Property name..."
              value={newPropertyName}
              onChange={(event) => { setNewPropertyName(event.target.value) }}
              className='mb-2'
              additionalInputClasses='bg-primary dark:bg-primary p-2 placeholder-white text-white'
            />
            <ButtonBasic
              label={
                <>
                  <span className="material-icons">
                    add
                  </span>
                  <p>Add</p>
                </>
              }
              additionalClasses='btn-xs'
              onClick={() => {
                // Can't add a property with no name
                if (newPropertyName) {
                  const tempPropertyOptions = [...propertyOptions];
                  tempPropertyOptions.push({ name: newPropertyName, type: "String" });
                  setPropertyOptions(tempPropertyOptions);
                  const tempSelectedProperties = [...selectedProperties];
                  tempSelectedProperties.push({ name: newPropertyName, type: "String" });
                  setSelectedProperties(tempSelectedProperties);
                  setNewPropertyName("");
                }
              }}
            />
          </>
          : null
        }
      </div>
    </Dropdown>
  );
};

export default FormElementSTIXPropertySelection;