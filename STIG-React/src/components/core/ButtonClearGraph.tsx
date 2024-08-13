import React, { useContext } from 'react';
import ButtonBasic from '../elements/ButtonBasic';
import { EventContext } from '@/contexts/EventContext';

const ButtonClearGraph: React.FC = () => {
  const { dispatchEvent } = useContext(EventContext);

  return (
    // xs: top-[200px] sm: top - [200px] md: top - [200px] lg: top - [120px] xl: top - 4
    <span className='absolute button-clear-graph z-[100]'>
      <ButtonBasic
        label="Clear Graph"
        onClick={() => {
          const clearGraphEvent = new CustomEvent('clearGraph');
          dispatchEvent('clearGraphClickEvent', { data: clearGraphEvent });
        }}
        additionalClasses='text-primary dark:text-gray-300'
      />
    </span>
  );
};

export default ButtonClearGraph;
