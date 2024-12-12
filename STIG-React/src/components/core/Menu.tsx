import React from 'react';
import Graph from '../dropdowns/Graph';
import Edit from '../dropdowns/Edit';
import GraphLayouts from '../dropdowns/GraphLayouts';
import Import from '../dropdowns/Import';
import Export from '../dropdowns/Export';
import { useStigContext } from '@/contexts/StigContext';

const Menu: React.FC = () => {
  const { isPropertyPanelOpen, panelWidth, isDrawerOpen, drawerWidth } = useStigContext();
  return (
    <div className='m-4 flex flex-wrap relative z-[1]' style={{ left: `${isDrawerOpen ? drawerWidth : 80}px`, transform: "scale(1)" }}>
      <div className="flex join dark:bg-neutralc-950 bg-neutralc-200 border-transparent relative overflow-hidden"
        style={{ maxWidth: `calc(100% - ${isDrawerOpen ? drawerWidth : 80}px` }}>
        <main>
          <Graph />
          <Edit />
          <GraphLayouts />
          <Import />
          <Export />
        </main>
      </div>
    </div >
  )
}

export default Menu;
