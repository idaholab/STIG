import ButtonBasic from '@/components/elements/ButtonBasic';
import FormElementFileInput from '@/components/forms/formElements/FormElementFileInput';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';
import { importGraph } from '@/graph/importGraph';
import React, { useState } from 'react';

const ImportJSONBundleModal: React.FC = () => {
    const { addNotification } = useNotificationContext();
    const { cyInstance, getStigLayoutSettingsFromStore, runLayout } = useStigContext();
    const [selectedFiles, setSelectedFiles] = useState<ArrayLike<File>>([]);

    return <div className='h-full grid'>
        <FormElementFileInput
            placeholder='No file chosen'
            buttonLabel='Choose File'
            acceptedFileTypes='.json'
            onFileChange={setSelectedFiles}
        />
        {/* !!! This shouldn't be necessary and needs removed once we figure out why ButtonBasic won't display cursor-not-allowed' !! */}
        <div className={`mt-8 flex flex-auto justify-end items-center ${!selectedFiles.length ? 'cursor-not-allowed' : ''}`}>
            <ButtonBasic
                label="Import"
                type='btn-primary'
                disabled={!selectedFiles.length}
                additionalClasses={''}
                onClick={async () => {
                    if (cyInstance) {
                        const { alerts, layout } = await importGraph(cyInstance, selectedFiles);
                        for (const {message, type} of alerts) {
                            addNotification(message, type);
                        }
                        if (layout) {
                            // Perform layout if some bundle had no metadata
                            runLayout(getStigLayoutSettingsFromStore(), cyInstance);
                        }
                    }
                    // Close the dialog
                    const dialogElement = document.getElementById("ImportJSONBundleModal") as HTMLDialogElement;
                    dialogElement.close();
                }}
            />
        </div>
    </div>;
}

export default ImportJSONBundleModal;