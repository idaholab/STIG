import React from "react";
import { useStixPropsContext } from "@/contexts/StixPropsContext";
import { DialogBasic } from "./DialogBasic";
import ExportModal from "@/layouts/ExportModals";
import { exportObject } from "@/util/GraphUtils";

const SaveButtons: React.FC = () => {
  const { selectedSTIXObject } = useStixPropsContext();
  return (
    <>
      <div className='place-self-end mt-8 flex gap-2 mb-4'>
        <DialogBasic
          dialogId="ExportObjectModal"
          title="Save JSON"
          buttonLabel="SAVE JSON"
          buttonColor='btn-primary'
          showFormButtons={false}
          additionalButtonClasses={'h-[48px]'}
        >
          <ExportModal exporter={exportObject} object={selectedSTIXObject} />
        </DialogBasic>
      </div>
    </>
  )
}
export default SaveButtons;
