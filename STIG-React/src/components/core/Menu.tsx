import React from 'react';
import Graph from '../dropdowns/Graph';
import Edit from '../dropdowns/Edit';
import COREIITimeline from '../dropdowns/COREIITimeline';
import ContextLayouts from '../dropdowns/ContextLayouts';
import Import from '../dropdowns/Import';
import Export from '../dropdowns/Export';
import DatabaseProfile from '../dropdowns/DatabaseProfile';

const Menu: React.FC = () => {
  return (
    <div className="join dark:bg-gray-900 ml-4 mt-4 border border-black dark:border-transparent">
      <main>
        <Graph />
        <Edit />
        <COREIITimeline />
        <ContextLayouts />
        <Import />
        <Export />
        <DatabaseProfile/>
      </main>
    </div>
  );
};

export default Menu;
