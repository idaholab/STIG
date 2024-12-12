import React, { useContext, useState } from 'react';
import FormElementTextArea from './formElements/FormElementTextArea';
import { queryToGraph } from '@/util/GraphUtils';
import { useStigContext } from '@/contexts/StigContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { addDBQuery } from '@/data/db-query-storage';
import ButtonIcon from '../elements/ButtonIcon';
import { mdiPlay } from '@mdi/js';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';

export default function FormCustomDBQuery() {
  const { cyInstance } = useStigContext();
  const { addNotification } = useNotificationContext();
  const [customQuery, setCustomQuery] = useState("");
  const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;

  return (
    <div className='flex flex-col relative h-fit'>
      <FormElementTextArea
        label="Custom Query"
        value={customQuery}
        onChange={(event) => { setCustomQuery(event.target.value) }}
        className='mb-2'
        includeInfo={true}
        infoText='Use neo4j query syntax. Ex: "match(n) return (n)" to get all nodes in the database.'
        additionalTextAreaClasses='input-sm leading-6 h-[100px] pr-9'
        additionalInfoClasses='tooltip-left'
      />

      <ButtonIcon
        iconText={'Run Query'}
        buttonIcon={mdiPlay}
        type={'btn-primary'}
        additionalClasses={"btn-xs absolute top-0 right-2"}
        disabled={!customQuery || !connectedDBProfile}
        onClick={async () => {
          const [numVerticiesAdded, numEdgesAdded] = await queryToGraph(customQuery, cyInstance);
          if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
            addNotification("Query failed", "error");
          } else if (numVerticiesAdded === 0 && numEdgesAdded === 0) {
            addNotification("Returned " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "warning");
          } else {
            addNotification("Returned " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "success");
          }
          // Add the query to the query history
          addDBQuery(customQuery);
          // Close the dialog
          // const dialogElement = document.getElementById("DBQueryModal") as HTMLDialogElement;
          // dialogElement.close();
        }}
      ></ButtonIcon>

    </div>
  );
}
