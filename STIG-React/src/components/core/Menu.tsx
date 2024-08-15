import React from 'react';
import Graph from '../dropdowns/Graph';
import Edit from '../dropdowns/Edit';
import GraphLayouts from '../dropdowns/GraphLayouts';
import ContextLayouts from '../dropdowns/ContextLayouts';
import Import from '../dropdowns/Import';
import Export from '../dropdowns/Export';
import DatabaseProfile from '../dropdowns/DatabaseProfile';

const Menu: React.FC = () => {
  return (
    <div className="join dark:bg-gray-950 border border-black dark:border-transparent">
      <main>
        <Graph />
        <Edit />
        <GraphLayouts />
        <ContextLayouts />
        <Import />
        <Export />
        <DatabaseProfile />
      </main>
    </div>
  );
};

export default Menu;
