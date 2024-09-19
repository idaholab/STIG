import React from 'react';
import Dropdown from '../core/Dropdown';

const Edit: React.FC = () => {
  return (
    <Dropdown
      title="Edit"
      includeDropdownArrow
      additionalOptionClasses={'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >
      {/* <li className='hover:bg-primary hover:text-white'><a>Undo</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Redo</a></li>

      <div className="divider dark:divider-neutral my-0"></div>

      <li className='hover:bg-primary hover:text-white'><a>Cut</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Copy</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Paste</a></li>

      <div className="divider dark:divider-neutral my-0"></div>

      <li className='hover:bg-primary hover:text-white'><a>Select All</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Invert Selection</a></li>

      <div className="divider dark:divider-neutral my-0"></div>

      <li className='hover:bg-primary hover:text-white'><a>Find</a></li> */}


    </Dropdown>
  );
};

export default Edit;
