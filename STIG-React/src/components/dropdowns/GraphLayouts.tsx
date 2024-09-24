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
    { name: "breadthfirst", display: 'Breadth First' },
    { name: "circle", display: 'Circle' },
    { name: "concentric", display: 'Concentric' },
    { name: "cose", display: 'Cose' },
    { name: "cose_bilkent", display: 'Cose Bilkent' },
    { name: "dagre", display: 'Dagre' },
    { name: "grid", display: 'Grid' },
    { name: "klay", display: 'Klay' },
    { name: "random", display: 'Random' },
    { name: "spread", display: 'Spread' },
    { name: "mitre_timeline", display: 'MITRE Timeline' },
  ];

  return (
    <Dropdown
      title="Graph Layouts"
      includeDropdownArrow
      additionalOptionClasses={'w-[150px] hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >
      {layouts.map((layout) => (
        <li key={layout.name} className='hover:text-black dark:hover:text-white'>
          <a onClick={() => handleLayoutChange(layout.name)}>
            {layout.display}
          </a>
        </li>
      ))}
    </Dropdown>
  );
};

export default GraphLayouts;
