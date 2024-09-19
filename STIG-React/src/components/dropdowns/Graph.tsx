import React from 'react';
import Dropdown from '../core/Dropdown';

const Graph: React.FC = () => {
  return (
    <Dropdown
      title="Graph"
      includeDropdownArrow
      additionalOptionClasses={'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >
      {/* <li className='hover:bg-primary hover:text-white'><a>Copy Selected Elements</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Cut Selected Elements</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Paste Elements</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Commit All Elements</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Delete Selected from Database</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Select All Elements</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Invert Selection</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Toggle Embedded Relationships</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Toggle STIX Relationships</a></li> */}
    
    </Dropdown>
  );
};

export default Graph;
