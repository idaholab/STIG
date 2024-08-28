import React, { useContext } from 'react';
import Dropdown from '../core/Dropdown';
import { EventContext } from '@/contexts/EventContext';

const GraphLayouts: React.FC = () => {
  const { dispatchEvent } = useContext(EventContext);

  const handleLayoutChange = (layoutName:string) => {
    const layoutChangeEvent = new CustomEvent('changeLayout', {
      detail: {
        layout: layoutName
      }
    });
    dispatchEvent('layoutSelect', { data: layoutChangeEvent});
  }
  
  return (
    <Dropdown
      title="Graph Layouts"
      includeDropdownArrow
    >
      <div className='w-[140px]'>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("breadthfirst")}>
          Breadthfirst
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("circle")}>
          Circle
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("concentric")}>
          Concentric
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("cose")}>
          Cose
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("cose_bilkent")}>
          Cose_Bilkent
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("dagre")}>
          Dagre
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("grid")}>
          Grid
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("klay")}>
          Klay
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("random")}>
          Random
        </a></li>
        <li className='hover:bg-primary hover:text-white'><a onClick={() => handleLayoutChange("spread")}>
          Spread
        </a></li>
      </div>
    </Dropdown>
  );
};

export default GraphLayouts;
