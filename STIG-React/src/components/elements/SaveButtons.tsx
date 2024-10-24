import { useNotificationContext } from "@/contexts/NotificationContext";
import { useStixPropsContext } from "@/contexts/StixPropsContext";
import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";
import { commit } from "@/util/DbFunctions";
import { AlertType } from "./AlertComponent";
import React from "react";
import ButtonBasic from "./ButtonBasic";
import { DialogBasic } from "./DialogBasic";
import ExportModal from "@/layouts/ExportModals";
import { exportObject, exportSelected } from "@/util/GraphUtils";

const SaveButtons: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const { selectedSTIXObject } = useStixPropsContext();
  //-------------------------------------
  const saverNeo4j = () => {
    try {
      if (selectedSTIXObject !== undefined) {
        (async () => {
          try {
            let set = [];
            if (selectedSTIXObject.type !== "relationship") {
              set = (await commit([selectedSTIXObject], []));
            } else {
              set = (await commit([], [selectedSTIXObject as StixRelationshipObject]));
            }
            let objs = set[0].size; let rels = set[1].size;
            let toastType: AlertType = (objs + rels > 0) ? "success" : "warning";
            addNotification(`Submitted ${objs} node(s) and ${rels} edge(s)`, toastType);
          } catch (err) {
            addNotification((err as Error).message, "warning");
          }
        })();
      } else {
        addNotification("object undefined", "error");
      }
    } catch (err) {
      console.error(err);
    }

  };
  //-------------------------------------
  return (
    <>
      <div className='place-self-end mt-8 flex gap-2 mb-4'>
        <ButtonBasic
          label="Save to NEO4J"
          // color='btn-sm'
          additionalClasses='h-[48px] btn-sm '
          onClick={saverNeo4j}
        ></ButtonBasic>
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
