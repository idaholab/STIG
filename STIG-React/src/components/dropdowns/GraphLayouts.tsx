import React, { useContext } from 'react';
import Dropdown from '../core/Dropdown';
import { EventContext } from '@/contexts/EventContext';
import { useStigContext } from '@/contexts/StigContext';

export const graphLayoutList = [
  { name: "default", display: '- Freeform / Manual-' },
  { name: "breadthfirst", display: 'Breadth First' },
  { name: "circle", display: 'Circle' },
  { name: "concentric", display: 'Concentric' },
  { name: "cose", display: 'Cose' },
  { name: "cose_bilkent", display: 'Cose Bilkent' },
  { name: "attack_timeline", display: 'Cyber Attack Timeline' },
  { name: "dagre", display: 'Dagre' },
  { name: "grid", display: 'Grid' },
  { name: "klay", display: 'Klay' },
  { name: "random", display: 'Random' },
  { name: "spread", display: 'Spread' },
];

const GraphLayouts: React.FC = () => {
  const { dispatchEvent } = useContext(EventContext);
  const { storedLayout } = useStigContext();
  const layout = graphLayoutList.find(layout => layout.name === storedLayout);
  const displayLayout = layout ? layout.display : 'Not Found';

  const handleLayoutChange = (layoutName: string) => {
    const layoutChangeEvent = new CustomEvent('changeLayout', {
      detail: {
        layout: layoutName
      }
    });
    dispatchEvent('layoutSelect', { data: layoutChangeEvent });
  };

  return (
    <Dropdown
      title={`Graph Layouts: ${displayLayout} `}
      includeDropdownArrow={true}
      additionalButtonClasses={`min-w-[291px] flex justify-between`}
      additionalOptionClasses={' hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary'}>
      {graphLayoutList.map((layout) => (
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
