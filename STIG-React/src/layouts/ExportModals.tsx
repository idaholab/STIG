import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ButtonBasic from '@/components/elements/ButtonBasic';
import FormElementTextInput from '@/components/forms/formElements/FormElementTextInput';
import { STIGBundle } from '@/types/STIGBundle';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';

type Exporter = {exporter: (f: string, cy: cytoscape.Core)=>STIGBundle};

const ExportModal: React.FC<Exporter> = ({exporter}) => {
    const { cyInstance } = useStigContext();
    const { addNotification } = useNotificationContext();
    const [fileName, setFileName] = useState("bundle");

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
                        let bundle = exporter(fileName, cyInstance);
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

export default ExportModal;
