import React from 'react';
import FormElementTextInput from './FormElementTextInput';
import { SchemaSTIXListProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { KillChainPhase } from '@/types/stixTypes/KillChainPhase';
import { propertyDescriptions } from '@/stix/propertyDescriptions';
import { getSTIXPropDescriptions } from '@/stix/getSTIXPropDescriptions';
import { handlePropertyUpdate } from '@/stix/handlePropertyUpdate';

type Props = {
  killChainPhase: KillChainPhase;
  killChainPhaseIndex: number;
  property: SchemaSTIXListProperty;
};

const FormElementSTIXKillChainPhase: React.FC<Props> = ({
  killChainPhase,
  killChainPhaseIndex,
  property
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();

  const killChainPhaseDescription = propertyDescriptions.find((group) => group.name === property.listType);
  let killChainPropDescriptions: { [propName: string]: string } = {};
  if (killChainPhaseDescription) {
    killChainPropDescriptions = getSTIXPropDescriptions(killChainPhaseDescription);
  }

  return (selectedSTIXObject &&
    <div className='w-full'>
      <FormElementTextInput
        label="kill_chain_name"
        type="text"
        value={killChainPhase.kill_chain_name}
        onChange={(event) => {
          handlePropertyUpdate(
            {
              "kill_chain_name": event.target.value,
              "phase_name": killChainPhase.phase_name
            },
            property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, undefined, killChainPhaseIndex
          );
        }}
        includeInfo={killChainPropDescriptions.kill_chain_name ? true : false}
        infoText={killChainPropDescriptions.kill_chain_name}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
      <FormElementTextInput
        label="phase_name"
        type="text"
        value={killChainPhase.phase_name}
        onChange={(event) => {
          handlePropertyUpdate(
            {
              "kill_chain_name": killChainPhase.kill_chain_name,
              "phase_name": event.target.value
            },
            property.name, selectedSTIXObject, setSelectedSTIXObject, setSelectionExists, undefined, killChainPhaseIndex
          );
        }}
        className="mb-2"
        includeInfo={killChainPropDescriptions.phase_name ? true : false}
        infoText={killChainPropDescriptions.phase_name}
        additionalInputClasses="select-sm dark:bg-neutralc-900"
        additionalLabelClasses="ml-6 mr-5 w-20"
      />
    </div>
  )
};

export default FormElementSTIXKillChainPhase;