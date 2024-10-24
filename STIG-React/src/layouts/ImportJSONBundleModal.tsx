import ButtonBasic from '@/components/elements/ButtonBasic';
import FormElementFileInput from '@/components/forms/formElements/FormElementFileInput';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';
import { addToGraph } from '@/util/GraphUtils';
import React, { useState } from 'react';

const ImportJSONBundleModal: React.FC = () => {
    const { cyInstance } = useStigContext();
    const { addNotification } = useNotificationContext();
    const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null | undefined>();

    return (
        <div className='h-full grid'>
            <FormElementFileInput
                placeholder='No file chosen'
                buttonLabel='Choose File'
                acceptedFileTypes='.json'
                onFileChange={async (fileVal: string | ArrayBuffer | null | undefined) => {
                    setSelectedFile(fileVal);
                }}
            />
            {/* !!! This shouldn't be necessary and needs removed once we figure out why ButtonBasic won't display cursor-not-allowed' !! */}
            <div className={`mt-8 flex flex-auto justify-end items-center ${!selectedFile ? 'cursor-not-allowed' : ''}`}>
                <ButtonBasic
                    label="Import"
                    type='btn-primary'
                    disabled={!selectedFile}
                    additionalClasses={''}
                    onClick={() => {
                        if (cyInstance) {
                            const [numVerticiesAdded, numEdgesAdded] = addToGraph(JSON.parse(selectedFile as string), cyInstance);
                            if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
                                addNotification("Import failed", "error");
                            } else if (numVerticiesAdded === 0 && numEdgesAdded === 0) {
                                addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "warning");
                            } else {
                                addNotification("Imported " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "success");
                            }
                        }
                        // Close the dialog
                        const dialogElement = document.getElementById("ImportJSONBundleModal") as HTMLDialogElement;
                        dialogElement.close();
                    }
                    }
                />
            </div>
        </div>
    );
}

export default ImportJSONBundleModal;