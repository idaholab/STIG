import React from 'react';
import Graph from '../dropdowns/Graph';
import Edit from '../dropdowns/Edit';
import GraphLayouts from '../dropdowns/GraphLayouts';
import Import from '../dropdowns/Import';
import Export from '../dropdowns/Export';

const Menu: React.FC = () => {
  return (
    <div className="flex join dark:bg-neutralc-950 bg-neutralc-200 border-transparent relative overflow-hidden w-max">
      <main>
        <Graph />
        <Edit />
        <GraphLayouts />
        <Import />
        <Export />
      </main>
    </div>
  )
}

export default Menu;
