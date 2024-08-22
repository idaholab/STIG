import React from 'react';

import { useStigPropsContext } from '../../contexts/StigPropsContext.tsx';

const StixPropsPanel: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useStigPropsContext();

  return (
    <div className={`drawer flex flex-col w-full h-full p-4 }`}>
      <div className='flex justify-between items-center'>
        <h1 className="text-lg">Sidebar Title 1</h1>

        <button
          className="btn border-none text-gray-900 dark:text-gray-100 shadow-none"
          onClick={toggleDrawer}>
          <span className='material-icons'>close</span>
        </button>
      </div>

      <p>Sidebar Item 2</p>

    </div>
  );
};

export default StixPropsPanel;