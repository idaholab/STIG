import React, { useState } from 'react';
import FormCustomDBQuery from '@/components/forms/FormCustomDBQuery';
import { removeDBQuery } from '@/data/db-query-storage';
import DBQueryHistory from './DBQueryHistory';
import { DeleteCancelAlert } from '@/components/elements/DeleteCancelAlert';

const DBQueryModal: React.FC = () => {
  const [queryWriterSelected, setQueryWriterSelected] = useState(true);
  const [inQueryDeleteProcess, setInQueryDeleteProcess] = useState(false);
  const [queryToDeleteId, setQueryToDeleteId] = useState("");

  const deleteProfile = () => {
    removeDBQuery(queryToDeleteId);
    setQueryToDeleteId("");
    setInQueryDeleteProcess(false);
  }
  const cancelDeleteProfile = () => {
    setInQueryDeleteProcess(false);
  }

  return (
    <div className='h-full relative'>
      {/* Query Delete Confirmation Dialog: */}
      {inQueryDeleteProcess ?
        <DeleteCancelAlert
          displayMessage={
            <span>Are you sure you wish to delete the saved query?</span>
          }
          onDeleteClick={deleteProfile}
          onCancelClick={cancelDeleteProfile}
        />
        : undefined
      }
      <div className='flex flex-nowrap justify-between h-full'>
        {/* Query Writer/History Selector: */}
        <QueryWriterHistorySelector
          inQueryDeleteProcess={inQueryDeleteProcess}
          queryWriterSelected={queryWriterSelected}
          setQueryWriterSelected={setQueryWriterSelected}
        />
        {queryWriterSelected ?
          // Custom Query Form:
          <FormCustomDBQuery />
          :
          // Query History Selector:
          <DBQueryHistory
            inQueryDeleteProcess={inQueryDeleteProcess}
            setInQueryDeleteProcess={setInQueryDeleteProcess}
            setQueryToDelteId={setQueryToDeleteId}
          />
        }
      </div>
    </div>
  );
};

function QueryWriterHistorySelector({ inQueryDeleteProcess, queryWriterSelected, setQueryWriterSelected }:
  {
    inQueryDeleteProcess: boolean,
    queryWriterSelected: boolean,
    setQueryWriterSelected: React.Dispatch<React.SetStateAction<boolean>>
  }
) {

  const querySelectedClass = "bg-primary-700 hover:bg-primary text-neutralc-200 hover:text-white";
  const defaultListClass = "bg-transparent hover:bg-primary hover:text-white";

  const getSelectedItemClassNames = (isCustom: boolean) => {
    return (queryWriterSelected === isCustom)
      ? querySelectedClass
      : defaultListClass;
  };

  return (
    <div className='rounded-box flex h-[452px] bg-neutralc-300 dark:bg-neutralc-800 p-2 basis-1/5'>
      <ul
        className="h-full flex flex-col flex-auto"
      >
        <li className={inQueryDeleteProcess ? "disabled" : ""}>
          <a
            className={getSelectedItemClassNames(true)}
            onClick={() => {
              if (!inQueryDeleteProcess) {
                setQueryWriterSelected(true);
              }
            }}
          >
            Custom Query
          </a>
        </li>
        <li className={inQueryDeleteProcess ? "disabled" : ""}>
          <a
            className={getSelectedItemClassNames(false)}
            onClick={() => {
              if (!inQueryDeleteProcess) {
                setQueryWriterSelected(false);
              }
            }}
          >
            Query History
          </a>
        </li>
      </ul>
    </div>
  );
}
export default DBQueryModal;
