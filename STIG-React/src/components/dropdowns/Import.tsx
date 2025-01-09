import React from 'react';
import Dropdown from '../core/Dropdown';
import ImportJSONBundleModal from '@/layouts/ImportJSONBundleModal';

const Import: React.FC = () => {
  return (
    <Dropdown
      title="Import"
      includeDropdownArrow
    >
      <div className="hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary">
        <ImportJSONBundleModal />
      </div>
    </Dropdown>
  );
};
export default Import;
