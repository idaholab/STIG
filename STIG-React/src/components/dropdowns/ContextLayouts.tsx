import React from 'react';
import Dropdown from '../core/Dropdown';

const ContextLayouts: React.FC = () => {
  return (
    <Dropdown
      title="Context Layouts"
      includeDropdownArrow
      additionalOptionClasses={'hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary'}
    >
    </Dropdown>
  );
};

export default ContextLayouts;
