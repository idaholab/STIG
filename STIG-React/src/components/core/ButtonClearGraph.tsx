import React, { useContext } from 'react';
import ButtonBasic from '../elements/ButtonBasic';
import { EventContext } from '@/contexts/EventContext';

const ButtonClearGraph: React.FC = () => {
  const { dispatchEvent } = useContext(EventContext);

  return (
    <span className='flow-root float-right mt-4 mr-4'>
      <ButtonBasic
        label="Clear Graph"
        onClick={() => {
          const clearGraphEvent = new CustomEvent('clearGraph');
          dispatchEvent('clearGraphClickEvent', {data: clearGraphEvent});
        }}
        additionalClasses='text-primary dark:text-gray-300'
      />
    </span>
  );
};

export default ButtonClearGraph;
