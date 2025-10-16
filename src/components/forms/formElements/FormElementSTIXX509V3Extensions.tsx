import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { propertyDescriptions } from '@/stix/propertyDescriptions';
import { getSTIXPropDescriptions } from '@/stix/getSTIXPropDescriptions';
import STIXPropertyLabel from '@/components/elements/STIXPropertyLabel';
import { handlePropertyUpdate } from '@/stix/handlePropertyUpdate';
import FormElementDatePicker from './FormElementDatePicker';

type Props = {
  property: SchemaSTIXProperty;
};

const FormElementSTIXX509V3Extensions: React.FC<Props> = ({
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const x509V3ExtensionsDescription = propertyDescriptions.find((group) => group.name === property.type);
  let x509V3ExtensionsPropDescriptions:{[propName: string]: string} = {};
  if(x509V3ExtensionsDescription) {
    x509V3ExtensionsPropDescriptions = getSTIXPropDescriptions(x509V3ExtensionsDescription);
  }

  const x509V3ExtensionsStringProperties = [
    "basic_constraints", "name_constraints", "policy_constraints",
    "key_usage", "extended_key_usage", "subject_key_identifier",
    "authority_key_identifier", "subject_alternative_name",
    "issuer_alternative_name", "subject_directory_attributes",
    "crl_distribution_points", "inhibit_any_policy",
    "certificate_policies", "policy_mappings"
  ];
  const x509V3ExtensionsTimestampProperties = [
    "private_key_usage_period_not_before",
    "private_key_usage_period_not_after"
  ];

  return ( selectedSTIXObject &&
    <div className='w-full mb-2'>
      <STIXPropertyLabel
        propName={property.name}
        propertyType={property.type}
        additionalLabelClasses={'mr-2'}
        includeInfo={!!property.propertyDescription && property.propertyDescription?.length > 0}
        infoText={property.propertyDescription}
      />
      {
        x509V3ExtensionsStringProperties.map( (x509V3ExtensionsProperty, i) => 
          <FormElementTextInput
            key={i}
            label={x509V3ExtensionsProperty}
            type="text"
            value={selectedSTIXObject[property.name] ? 
              selectedSTIXObject[property.name][x509V3ExtensionsProperty] ?? ""
              : ""
            }
            onChange={(event) => {
              handlePropertyUpdate(event.target.value, property.name, 
                selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, undefined, x509V3ExtensionsProperty
              );
            }}
            className='ml-4 pr-4'
            includeInfo={x509V3ExtensionsPropDescriptions[x509V3ExtensionsProperty] ? true : false}
            infoText={x509V3ExtensionsPropDescriptions[x509V3ExtensionsProperty]}
            additionalInputClasses="select-sm dark:bg-gray-900"
            additionalLabelClasses="ml-6 mr-5 w-20"
          />
        )
      }
      {
        x509V3ExtensionsTimestampProperties.map( (x509V3ExtensionsProperty, i) =>
          <FormElementDatePicker
            key={i}
            label={x509V3ExtensionsProperty}
            value={selectedSTIXObject[property.name] ? 
              selectedSTIXObject[property.name][x509V3ExtensionsProperty] ?? ""
              : ""
            }
            onChange={(_, date) => {
              handlePropertyUpdate(date, property.name, selectedSTIXObject,
                setSelectedSTIXObject, setSelectionExists, undefined, x509V3ExtensionsProperty);
            }}
            className='ml-4'
            additionalInputClasses='select-sm w-full'
            includeInfo={x509V3ExtensionsPropDescriptions[x509V3ExtensionsProperty] ? true : false}
            infoText={x509V3ExtensionsPropDescriptions[x509V3ExtensionsProperty]}
          />
        )
      }
    </div>
  )
};

export default FormElementSTIXX509V3Extensions;