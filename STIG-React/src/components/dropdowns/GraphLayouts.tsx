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
    { name: "attack_timeline", display: 'Cyber Attack Timeline' },
  ];

  return (
    <Dropdown
      title="Graph Layouts"
      includeDropdownArrow
      additionalOptionClasses={'w-[180px] hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary'}>
      {layouts.map((layout) => (
        <li key={layout.name}>
          <a onClick={() => handleLayoutChange(layout.name)}>
            {layout.display}
          </a>
        </li>
      ))}
    </Dropdown>
  );
};

export default GraphLayouts;
