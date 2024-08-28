import React from 'react';
import Dropdown from '../core/Dropdown';

const Import: React.FC = () => {
  return (
    <Dropdown
      title="Import"
      includeDropdownArrow
    >
      {/* <li className='hover:bg-primary hover:text-white'><a>Option 1</a></li>
      <li className='hover:bg-primary hover:text-white'><a>Option 2</a></li> */}
    </Dropdown>
  );
};

export default Import;
