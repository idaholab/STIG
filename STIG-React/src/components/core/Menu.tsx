import React from 'react';
import Graph from '../dropdowns/Graph';
import Edit from '../dropdowns/Edit';
import GraphLayouts from '../dropdowns/GraphLayouts';
import ContextLayouts from '../dropdowns/ContextLayouts';
import Import from '../dropdowns/Import';
import Export from '../dropdowns/Export';
import Database from '../dropdowns/Database';
import { useStigContext } from '@/contexts/StigContext';

const Menu: React.FC = () => {
  const { isPropertyPanelOpen, panelWidth, isDrawerOpen } = useStigContext();
  return <div
      className='m-4 flex flex-wrap relative'
      style={{
        zIndex: 1,
        transform: "scale(1)",
        left: `${ isDrawerOpen ? 283 : 83 }px`,
      }}
    >
      <div
      className="flex join dark:bg-neutralc-950 bg-neutralc-200 border-transparent relative"
      style={{
        overflow: 'hidden',
        maxWidth: `calc(100% - ${(isPropertyPanelOpen ? panelWidth : 0) + (isDrawerOpen ? 280 : 80) + 6}px)`,
      }}
    >
      <main>
        <Graph />
        <Edit />
        <GraphLayouts />
        <ContextLayouts />
        <Import />
        <Export />
        <Database />
      </main>
    </div>
  </div>;
}

export default Menu;
