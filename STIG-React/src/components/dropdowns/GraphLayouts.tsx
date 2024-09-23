import React, { useContext } from 'react';
import Dropdown from '../core/Dropdown';
import { EventContext } from '@/contexts/EventContext';

const GraphLayouts: React.FC = () => {
  const { dispatchEvent } = useContext(EventContext);

  const handleLayoutChange = (layoutName: string) => {
    const layoutChangeEvent = new CustomEvent('changeLayout', {
      detail: {
        layout: layoutName
      }
    });
    dispatchEvent('layoutSelect', { data: layoutChangeEvent });
  };

  const layouts = [
    "breadthfirst",
    "circle",
    "concentric",
    "cose",
    "cose_bilkent",
    "dagre",
    "grid",
    "klay",
    "random",
    "spread"
  ];

  return (
    <Dropdown
      title="Graph Layouts"
      includeDropdownArrow
      additionalOptionClasses={'w-[150px] hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >
      {layouts.map((layout) => (
        <li key={layout} className='hover:text-black dark:hover:text-white'>
          <a onClick={() => handleLayoutChange(layout)}>
            {layout}
          </a>
        </li>
      ))}
    </Dropdown>
  );
};

export default GraphLayouts;
