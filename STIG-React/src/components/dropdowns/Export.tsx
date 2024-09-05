import React from 'react';
import Dropdown from '../core/Dropdown';

const Export: React.FC = () => {
  return (
    <Dropdown
      title="Export"
      includeDropdownArrow
      additionalOptionClasses={'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >

    </Dropdown>
  );
};

export default Export;
