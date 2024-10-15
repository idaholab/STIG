import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ButtonBasic from '@/components/elements/ButtonBasic';
import FormElementTextInput from '@/components/forms/formElements/FormElementTextInput';
import { STIGBundle } from '@/types/STIGBundle';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';
import { StixObject } from '@/types/stixTypes/StixObject';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';

type Exporter = { 
    exporter: (f: string, cy: cytoscape.Core, object: StixObject | StixRelationshipObject | undefined) => STIGBundle, 
    object?: StixObject | StixRelationshipObject | undefined
};

const ExportModal: React.FC<Exporter> = ({ exporter, object }) => {
    const { cyInstance } = useStigContext();
    const { addNotification } = useNotificationContext();
    let [fileName, setFileName] = useState("bundle");
    if (object !== undefined){
        fileName = object.id;
    }
    
    return (
        <div className='h-full grid'>
            <FormElementTextInput
                label="File Name"
                value={fileName}
                type="text"
                onChange={(event) => setFileName(event.target.value)}
                additionalInputClasses='input-md'
                additionalLabelClasses='w-48'
                suffix='.json'
            />
            <ButtonBasic
                label="Export"
                color='btn-primary'
                additionalClasses={'place-self-end mt-8'}
                onClick={() => {
                    if (cyInstance) {
                        let bundle = exporter(fileName, cyInstance, object);
                        if (bundle.objects.length === 0) {
                            addNotification(`Exported 0 objects`, "warning");
                        } else {
                            addNotification(`Exported ${bundle.objects.length} objects`, "success");
                        }
                    } else {
                        addNotification("Failed to export elements", "error");
                    }

                    // Close the dialog
                    const dialogElement = document.getElementById("ExportAllModal") as HTMLDialogElement;
                    dialogElement.close();
                }}
            />
        </div>
    );
}
export default ExportModal
