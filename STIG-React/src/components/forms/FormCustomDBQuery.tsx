import React, { useState } from 'react';
import ButtonBasic from '../elements/ButtonBasic';
import FormElementTextArea from './formElements/FormElementTextArea';
import { queryToGraph } from '@/util/GraphUtils';
import { useStigContext } from '@/contexts/StigContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { addDBQuery } from '@/data/db-query-storage';

export default function FormCustomDBQuery() {
  const { cyInstance } = useStigContext();
  const { addNotification } = useNotificationContext();

  const [customQuery, setCustomQuery] = useState("");

  return (
    <div className='flex basis-9/12 flex-col'>
      <FormElementTextArea
        label="Custom Query"
        value={customQuery}
        onChange={(event) => { setCustomQuery(event.target.value) }}
        className='mb-2'
        includeInfo={true}
        infoText='Use neo4j query syntax. Ex: "match(n) return (n)" to get all nodes in the database.'
        additionalTextAreaClasses='input-sm h-[350px]'
        additionalInfoClasses='tooltip-left'
      />
      <div className='flex justify-end'>
        <ButtonBasic
          label="Query"
          type="btn-primary"
          additionalClasses={"btn-sm mt-2"}
          disabled={!customQuery}
          onClick={async () => {
            const [numVerticiesAdded, numEdgesAdded] = await queryToGraph(customQuery, cyInstance);
            if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
              addNotification("Import failed", "error");
            } else if (numVerticiesAdded === 0 && numEdgesAdded === 0) {
              addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "warning");
            } else {
              addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "success");
            }
            // Add the query to the query history
            addDBQuery(customQuery);
            // Close the dialog
            const dialogElement = document.getElementById("DBQueryModal") as HTMLDialogElement;
            dialogElement.close();
          }}
        />
      </div>
    </div>
  );
}
