import ButtonBasic from '@/components/elements/ButtonBasic';
import FormElementFileInput from '@/components/forms/formElements/FormElementFileInput';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';
import { addToGraph } from '@/util/GraphUtils';
import React, { useState } from 'react';

const ImportJSONBundleModal: React.FC = () => {
    const { cyInstance, getStigLayoutSettingsFromStore, runLayout } = useStigContext();
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
                            let parsedFile = JSON.parse(selectedFile as string);
                            const [numVerticiesAdded, numEdgesAdded] = addToGraph(parsedFile, cyInstance);

                            if (parsedFile.metadata) { // Position the nodes
                                for (const node of parsedFile.metadata) {
                                    // Find the element on the graph
                                    cyInstance.$id(node.id).animate({
                                        position: node.position,
                                        duration: 1000,
                                        complete: () => cyInstance.fit()
                                    });
                                }
                            } else {
                                runLayout(getStigLayoutSettingsFromStore(), cyInstance); // Perform layout if no metadata
                            }


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