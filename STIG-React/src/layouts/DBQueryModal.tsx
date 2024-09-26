import React, { useState } from 'react';

import ButtonBasic from '../components/elements/ButtonBasic';
import FormCustomDBQuery from '@/components/forms/FormCustomDBQuery';
import { removeDBQuery } from '@/data/db-query-storage';
import DBQueryHistory from './DBQueryHistory';

const DBQueryModal: React.FC = () => {
  const [queryWriterSelected, setQueryWriterSelected] = useState(true);
  const [inQueryDeleteProcess, setInQueryDeleteProcess] = useState(false);
  const [queryToDeleteId, setQueryToDelteId] = useState("");

  return (
    <div className='h-full relative'>
      {/* Query Delete Confirmation Dialog: */}
      {inQueryDeleteProcess ?
        <QueryDeleteConfirmationDialog
          setInQueryDeleteProcess={setInQueryDeleteProcess}
          queryToDeleteId={queryToDeleteId}
          setQueryToDelteId={setQueryToDelteId}
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
              setQueryToDelteId={setQueryToDelteId}
            />
        }
      </div>
    </div>
  );
};

function QueryDeleteConfirmationDialog({ setInQueryDeleteProcess, queryToDeleteId, setQueryToDelteId }:
  {
    setInQueryDeleteProcess: React.Dispatch<React.SetStateAction<boolean>>,
    queryToDeleteId: string;
    setQueryToDelteId: React.Dispatch<React.SetStateAction<string>>
  }) {
  return (
    <div role="alert" className="alert text-base mb-8 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 text-gray-900 bg-orange-100 border-accent-900 dark:bg-orange-400 dark:border-accent-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-gray-900 dark:stroke-gray-900 h-10 w-10 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>
        Are you sure you wish to delete the saved query?
      </span>
      <ButtonBasic
        label={'Delete'}
        color={'btn-primary'}
        additionalClasses={`${'btn-sm'}`}
        onClick={() => {
          removeDBQuery(queryToDeleteId);
          setQueryToDelteId("");
          setInQueryDeleteProcess(false);
        }}
      />

      <ButtonBasic
        label={'cancel'}
        color={'btn-ghost'}
        additionalClasses={`${'btn-sm text-gray-900'}`}
        onClick={() => {
          setInQueryDeleteProcess(false);
        }}
      />
    </div>
  );
}

function QueryWriterHistorySelector({ inQueryDeleteProcess, queryWriterSelected, setQueryWriterSelected }:
  {
    inQueryDeleteProcess: boolean,
    queryWriterSelected: boolean,
    setQueryWriterSelected: React.Dispatch<React.SetStateAction<boolean>>
  }
) {
  return (
    <div className='rounded-box flex h-[452px] bg-gray-300 dark:bg-gray-800 p-2 basis-1/5'>
      <ul
        className="h-full flex flex-col flex-auto"
      >
        <li className={inQueryDeleteProcess ? "disabled" : ""}>
          <a
            className={queryWriterSelected ?
              "bg-primary text-white hover:text-black dark:hover:text-white" : ""
            }
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
            className={!queryWriterSelected ?
              "bg-primary text-white hover:text-black dark:hover:text-white" : ""
            }
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
