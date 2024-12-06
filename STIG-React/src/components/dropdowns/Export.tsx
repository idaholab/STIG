import React from 'react';
import Dropdown from '../core/Dropdown';
import { DialogBasic } from '../elements/DialogBasic';
import ExportModal from '@/layouts/ExportModals';
import { exportAll, exportAllwPositions, exportSelected } from '@/util/GraphUtils';

const Export: React.FC = () => {
  return (
    <Dropdown
      title="Export"
      includeDropdownArrow
      fixed
    >
      <div className="hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary">
        <DialogBasic
          dialogId="ExportSelectedModal"
          title="Export Selected Elements to File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="Selected"
          additionalButtonClasses={"btn-sm justify-start w-[120px]"}
        >
          <ExportModal exporter={exportSelected} />
        </DialogBasic>
      </div>
{/* ----------------------------------------------------------------------------------------------- */}
      <div className="hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary">
        <DialogBasic
          dialogId="ExportAllModal"
          title="Export All Elements to File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="All"
          additionalButtonClasses={"btn-sm justify-start w-[120px]"}
        >
          <ExportModal exporter={exportAll} />
        </DialogBasic>
      </div>

      <div className="hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary">
        <DialogBasic
          dialogId="ExportAllwPositionsModal"
          title="Export All Elements with Positions to File"
          buttonColor='btn-ghost'
          showFormButtons={false}
          buttonLabel="All w/Positions"
          additionalButtonClasses={"btn-sm justify-start w-[120px]"}
        >
          <ExportModal exporter={exportAllwPositions} />
        </DialogBasic>
      </div>
    </Dropdown>

  );
};

export default Export;
