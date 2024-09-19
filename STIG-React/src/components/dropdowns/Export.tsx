import React from 'react';
import Dropdown from '../core/Dropdown';
import { DialogBasic } from '../elements/DialogBasic';
import ExportAllModal from '@/layouts/ExportAllModal';

const Export: React.FC = () => {
  return (
    <Dropdown
      title="Export"
      includeDropdownArrow
      additionalOptionClasses={'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover-text-white'}
    >
      <li className='hover:bg-primary hover:text-white w-28'>
        <DialogBasic
          dialogId="ExportAllModal"
          title="Export All Elements to File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="All"
          additionalButtonClasses={"btn-sm justify-start"}
        >
          <ExportAllModal />
        </DialogBasic>
      </li>
    </Dropdown>
  );
};

export default Export;
