import React, { useContext } from 'react';
import ButtonBasic from '../elements/ButtonBasic';
import { EventContext } from '@/contexts/EventContext';

const ButtonClearGraph: React.FC = () => {
  const { dispatchEvent } = useContext(EventContext);

  return (
    <ButtonBasic
      label="Clear Graph"
      onClick={() => {
        const clearGraphEvent = new CustomEvent('clearGraph');
        dispatchEvent('clearGraphClickEvent', { data: clearGraphEvent });
      }}
      type='btn-neutralc'
    />
  );
};

export default ButtonClearGraph;
