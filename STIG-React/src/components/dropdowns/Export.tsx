import React from 'react';
import Dropdown from '../core/Dropdown';
import { DialogBasic } from '../elements/DialogBasic';
import ExportModal from '@/layouts/ExportModals';
import { exportAll, exportSelected } from '@/util/GraphUtils';
import { useStigContext } from '@/contexts/StigContext';

const Export: React.FC = () => {
  const { cyInstance } = useStigContext();
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
          <ExportModal exporter={exportAll}/>
        </DialogBasic>
      </li>

     <li className='hover:bg-primary hover:text-white w-28'>
        <DialogBasic
          dialogId="ExportSelectedModal"
          title="Export Selected Elements to File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="Selected"
          additionalButtonClasses={"btn-sm justify-start"}
        >
          <ExportModal exporter={exportSelected}/>
        </DialogBasic>
      </li>
    </Dropdown>
  );
};

export default Export;
