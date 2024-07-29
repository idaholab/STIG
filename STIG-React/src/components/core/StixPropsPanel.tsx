import React from 'react';

import { useStixPropsContext } from '../../contexts/StixPropsContext.tsx';

const StixPropsPanel: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useStixPropsContext();

  return (
    <div
      className={`drawer fixed right-0 w-[40rem] h-full dark:bg-gray-700 bg-gray-200 z-50 shadow-2xl transition-transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      style={{
        transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <div className="w-[40rem] h-full">
        <div className='grid grid-cols-2'>
          <p className="p-4">Sidebar Title 1</p>

          <button
            className="col-start-2 justify-self-end text-4xl font-bold text-gray-900 dark:text-gray-100"
            onClick={toggleDrawer}
          >
            &times;
          </button>
        </div>
        <p className="p-4">Sidebar Item 2</p>
      </div>
    </div>
  );
};

export default StixPropsPanel;