import React, { useContext } from "react";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { useStixPropsContext } from "@/contexts/StixPropsContext";
import { commit } from "@/util/DbFunctions";
import { AlertType } from "./AlertComponent";
import { DialogBasic } from "./DialogBasic";
import ExportModal from "@/layouts/ExportModals";
import { exportObject } from "@/util/GraphUtils";
import DBUpdateModal from "@/layouts/DBUpdateModal";
import ConnectedDBContext, { ConnectedDBContextType } from "@/contexts/ConnectedDBContext";
import { useStigContext } from "@/contexts/StigContext";
import { isRelationship } from "@/db/neo4j/isRelationship";

const SaveButtons: React.FC = () => {
  const { addNotification } = useNotificationContext();
  const { selectedSTIXObject } = useStixPropsContext();
  const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;
  const { cyInstance } = useStigContext();
  // //-------------------------------------
  // const saverNeo4j = () => {
  //   addNotification("Saving to Database....", "info");
  //   try {
  //     if (selectedSTIXObject !== undefined) {
  //       (async () => {
  //         try {
  //           const { nodes, edges, errors } = await (
  //             isRelationship(selectedSTIXObject) ?
  //               commit([], [selectedSTIXObject]) :
  //               commit([selectedSTIXObject], [])
  //           );
  //           const toastType: AlertType = errors === 0 ? "success" : "warning";
  //           addNotification(`Submitted ${nodes} node(s) and ${edges} edge(s) with ${errors} error(s)`, toastType);
  //         } catch (err) {
  //           addNotification((err as Error).message, "warning");
  //         }
  //       })();
  //     } else {
  //       addNotification("object undefined", "error");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  // //-------------------------------------
  return (
    <>
      <div className='place-self-end mt-8 flex gap-2 mb-4'>
        {/* <DialogBasic
          dialogId="SaveToNeo4jModal"
          title="Update Database"
          showFormButtons={true}
          buttonLabel="Save to NEO4J"
          buttonColor="btn-neutralc"
          additionalButtonClasses={`uppercase h-[48px] btn-sm`}
          disabled={!cyInstance || !selectedSTIXObject || !connectedDBProfile}
          onSave={saverNeo4j}
        >
          <DBUpdateModal cy={cyInstance} selector={`#${selectedSTIXObject?.id}`}/>
        </DialogBasic> */}
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
