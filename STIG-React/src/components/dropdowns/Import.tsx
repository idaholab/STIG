import React from 'react';
import Dropdown from '../core/Dropdown';
import { DialogBasic } from '../elements/DialogBasic';
import ImportJSONBundleModal from '@/layouts/ImportJSONBundleModal';

const Import: React.FC = () => {
  return (
    <Dropdown
      title="Import"
      includeDropdownArrow
      // hover:bg-neutralc-200 dark:hover:bg-neutralc-700 hover:text-black dark:hover-text-white
      additionalOptionClasses={'w-[120px]  '}
      additionalClasses={''}
    >
      <div className=' '>
        <DialogBasic
          dialogId="ImportJSONBundleModal"
          title="Import JSON Bundle from File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="JSON Bundle"
          additionalButtonClasses={"btn-sm justify-start w-full rounded-[4px] hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary"}
        >
          <ImportJSONBundleModal />
        </DialogBasic>
      </div>
    </Dropdown>
  );
};

export default Import;
