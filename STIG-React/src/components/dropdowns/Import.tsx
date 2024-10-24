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
      additionalOptionClasses={''}
      additionalClasses={''}
    >
      <div className="hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary">
        <DialogBasic
          dialogId="ImportJSONBundleModal"
          title="Import JSON Bundle from File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="JSON Bundle"
          additionalButtonClasses={"btn-sm justify-start w-[120px]"}
        >
          <ImportJSONBundleModal />
        </DialogBasic>
      </div>
    </Dropdown>
  );
};

export default Import;
