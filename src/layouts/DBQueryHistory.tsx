import React, { useContext, useState } from 'react';
import { queryToGraph } from '@/util/GraphUtils';
import { useStigContext } from '@/contexts/StigContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { readDBQueryStorage, removeDBQuery } from '@/data/db-query-storage';
import ButtonIcon from '@/components/elements/ButtonIcon';
import AlertComponent from '@/components/elements/AlertComponent';
import { mdiDeleteForever, mdiPlay } from '@mdi/js';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import { DeleteCancelAlert } from '@/components/elements/DeleteCancelAlert';

export default function DBQueryHistory({ inQueryDeleteProcess, setInQueryDeleteProcess,
}: {
  inQueryDeleteProcess: boolean,
  setInQueryDeleteProcess: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const { cyInstance } = useStigContext();
  const { addNotification } = useNotificationContext();
  const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;
  const savedQueries = readDBQueryStorage();
  const [queryToDeleteId, setQueryToDeleteId] = useState("");


  const deleteQuery = () => {
    removeDBQuery(queryToDeleteId);
    setQueryToDeleteId("");
    setInQueryDeleteProcess(false);
  }
  const cancelDeleteQuery = () => {
    setInQueryDeleteProcess(false);
  }

  return (
    <div className='flex flex-col mt-2 h-fit'>
      <p className='mb-1'>Query History</p>
      <div className='flex flex-col h-fit'>
        {savedQueries.length ?
          savedQueries.toReversed().map(savedQuery => {
            return (
              // min-h-[50px] h-fit
              <div key={savedQuery.id}
                className='flex flex-nowrap items-center justify-between rounded-md border border-neutralc-500 bg-neutralc-100 dark:bg-neutralc-900 mb-1 group overflow-hidden relative'>
                <p className='flex ml-2 break-all text-wrap'>{savedQuery.query}</p>
                <div className='min-h-[50px] min-w-[55px] flex items-center w-fit'>
                  <ButtonIcon
                    buttonIcon={mdiPlay}
                    type="btn-primary"
                    iconText='Run Query'
                    disabled={inQueryDeleteProcess || !connectedDBProfile}
                    onClick={async () => {
                      const [numVerticiesAdded, numEdgesAdded] = await queryToGraph(savedQuery.query, cyInstance);
                      if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
                        addNotification("Import failed", "error");
                      } else if (numVerticiesAdded === 0 && numEdgesAdded === 0) {
                        addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "warning");
                      } else {
                        addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "success");
                      }
                    }}
                    additionalClasses="hidden group-hover:inline btn-xs hover:!text-white hover:!bg-black hover:dark:!text-black hover:dark:!bg-white "
                  />
                  <ButtonIcon
                    buttonIcon={mdiDeleteForever}
                    type="btn-ghost"
                    disabled={inQueryDeleteProcess}
                    onClick={() => {
                      setInQueryDeleteProcess(true);
                      setQueryToDeleteId(savedQuery.id);
                    }}
                    additionalClasses="hidden group-hover:inline hover:!text-error-dark hover:dark:!text-white !text-error h-fit w-fit"
                  />
                </div>

                {savedQuery.id === queryToDeleteId && inQueryDeleteProcess &&
                  <DeleteCancelAlert
                    displayMessage={
                      <span>Delete this query?</span>
                    }
                    onDeleteClick={deleteQuery}
                    onCancelClick={cancelDeleteQuery}
                    className='w-full py-0 px-2 absolute inset-0 flex items-center justify-center'
                  />
                }
              </div>

            );
          })
          : <AlertComponent alertText={`No Query History. No queries have been executed yet.`} alertType="info" />
        }
      </div>
    </div>
  );
}
