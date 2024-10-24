import React from 'react';
import Dropdown from '../core/Dropdown';

const ContextLayouts: React.FC = () => {
  return (
    <Dropdown
      title="Context Layouts"
      includeDropdownArrow
      additionalButtonClasses={'text-neutral-600 dark:text-neutral-300'}
      additionalOptionClasses={' hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary'}
    >
    </Dropdown>
  );
};

export default ContextLayouts;
