import React from 'react';
import Dropdown from '../core/Dropdown';
import { DialogBasic } from '../elements/DialogBasic';
import ImportJSONBundleModal from '@/layouts/ImportJSONBundleModal';

const Import: React.FC = () => {
  return (
    <Dropdown
      title="Import"
      includeDropdownArrow
      additionalOptionClasses={'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >
      <li className='hover:bg-primary hover:text-white w-28'>
        <DialogBasic
          dialogId="ImportJSONBundleModal"
          title="Import JSON Bundle from File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="JSON Bundle"
          additionalButtonClasses={"btn-sm justify-start"}
        >
          <ImportJSONBundleModal />
        </DialogBasic>
      </li>
    </Dropdown>
  );
};

export default Import;
