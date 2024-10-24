import React from 'react';
import { queryToGraph } from '@/util/GraphUtils';
import { useStigContext } from '@/contexts/StigContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { readDBQueryStorage } from '@/data/db-query-storage';
import ButtonIcon from '@/components/elements/ButtonIcon';
import AlertComponent from '@/components/elements/AlertComponent';

export default function DBQueryHistory({ inQueryDeleteProcess, setInQueryDeleteProcess,
  setQueryToDelteId
}: {
  inQueryDeleteProcess: boolean,
  setInQueryDeleteProcess: React.Dispatch<React.SetStateAction<boolean>>,
  setQueryToDelteId: React.Dispatch<React.SetStateAction<string>>
}) {
  const { cyInstance } = useStigContext();
  const { addNotification } = useNotificationContext();

  const savedQueries = readDBQueryStorage();

  return (
    <div className='flex basis-9/12 flex-col'>
      <p className='mb-2'>Query History</p>
      <div className='scrollbar h-[425px]'>
        {savedQueries.length ?
          savedQueries.map(savedQuery => {
            return (
              <div
                key={savedQuery.id}
                className='
                  flex 
                  items-center
                  justify-between
                  rounded-md
                  border
                  border-neutralc-500
                  bg-neutralc-100
                  dark:bg-neutralc-900
                  m-1
                  pl-2
                  h-12
                  group
                '
              >
                <p className='truncate max-w-[640px] group-hover:max-w-[550px]'>{savedQuery.query}</p>
                <div>
                  <ButtonIcon
                    buttonIcon="play_arrow"
                    type="btn-ghost"
                    disabled={inQueryDeleteProcess}
                    onClick={async () => {
                      const [numVerticiesAdded, numEdgesAdded] = await queryToGraph(savedQuery.query, cyInstance);
                      if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
                        addNotification("Import failed", "error");
                      } else if (numVerticiesAdded === 0 && numEdgesAdded === 0) {
                        addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "warning");
                      } else {
                        addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "success");
                      }
                      // Close the dialog
                      const dialogElement = document.getElementById("DBQueryModal") as HTMLDialogElement;
                      dialogElement.close();
                    }}
                    additionalClasses="hidden group-hover:inline hover:!text-success !text-success-dark"
                  />
                  <ButtonIcon
                    buttonIcon="delete"
                    type="btn-ghost"
                    disabled={inQueryDeleteProcess}
                    onClick={() => {
                      setInQueryDeleteProcess(true);
                      setQueryToDelteId(savedQuery.id);
                    }}
                    additionalClasses="hidden group-hover:inline hover:!text-error !text-error-dark"
                  />
                </div>
              </div>
            );
          })
          : <AlertComponent alertText={`No query history`} alertType="info" />
        }
      </div>
    </div>
  );
}
