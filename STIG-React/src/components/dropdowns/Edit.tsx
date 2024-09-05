import React from 'react';
import Dropdown from '../core/Dropdown';

const Edit: React.FC = () => {
  return (
    <Dropdown
      title="Edit"
      includeDropdownArrow
      additionalOptionClasses={'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >
      {/* <li className='hover:bg-primary hover:text-white'><a>Option 1</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Option 2</a></li> */}
    </Dropdown>
  );
};

export default Edit;
