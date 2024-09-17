import { AlertType } from '@/components/elements/AlertComponent';
import ButtonBasic from '@/components/elements/ButtonBasic';
import FormElementFileInput from '@/components/forms/formElements/FormElementFileInput';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';
import { StigSettings } from '@/storage';
import { BundleType } from '@/types/BundleType';
import { GraphUtils } from '@/util/GraphUtils';
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
            <ButtonBasic
                label="Import"
                color='btn-primary'
                additionalClasses={'place-self-end mt-8' + (!selectedFile ? " btn-disabled" : "")}
                onClick={() => {
                    if(cyInstance) {
                        const [numVertificesAdded, numEdgesAdded] = addToGraph(JSON.parse(selectedFile as string), cyInstance);
                        if(numVertificesAdded < 0 && numEdgesAdded < 0) {
                            addNotification("Import failed", "error");
                        } else if (numVertificesAdded === 0 && numEdgesAdded === 0) {
                            addNotification("Imported " + numVertificesAdded + " nodes and " + numEdgesAdded + " edges", "warning");
                        } else {
                            addNotification("Imported " + numVertificesAdded + " nodes and " + numEdgesAdded + " edges", "success");
                        }
                    }
                    // Close the dialog
                    const dialogElement = document.getElementById("ImportJSONBundleModal") as HTMLDialogElement;
                    dialogElement.close();
                }}
            />
        </div>
    );
}

function addToGraph(pkg: BundleType, cyInstance: cytoscape.Core) {
    const graph_utils = new GraphUtils(cyInstance);
    let numVerticiesAdded, numEdgesAdded = 0;
    try{
        [numVerticiesAdded, numEdgesAdded] = graph_utils.buildNodes(pkg.objects, "GUI");
    }catch (err){
        console.warn("[Nodes could not be built. JSON may be invalid] :", err);
        //TODO: make some sort of meaningful message appear to the user informing them why the nodes couldn't be added
        return [-1, -1];
    }

    if (pkg.metadata) {
        // Position the nodes
        for (const node of pkg.metadata) {
            // Find the element on the graph
            cyInstance.$id(node.id).animate({ 
                position: node.position, 
                duration: 1000, 
                complete: () => cyInstance.fit() 
            });
        }
    } else {
        let canLayout = true;

        // TODO: Add this logic back in for when
        // defense in depth gets added as a feature?
        // Check if defense in depth is on
        // if (cyInstance.nodes(`#${defense.name.replaceAll(' ', '_')}`).length > 0) {
        //     canLayout = false;
        //     $('#dd-ctxLayoutDefInDepth').trigger('click');
        // }

        // TODO: Add this logic back in for when
        // kill chain gets added as a feature?
        // // Check if a kill chain is on
        // killChain['kill-chain'].forEach(kc => {
        //     // `#ctxLayout${kc.type}`
        //     if (cy.nodes(`#${kc.type}`).length > 0) {
        //         canLayout = false;
        //         $(`#ctxLayout${kc.type}`).trigger('click');
        //     }
        // });

        // Only do this if there aren't any defense in depth or kill chain layouts open
        if (canLayout) {
            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
        }
    }

    return [numVerticiesAdded, numEdgesAdded];
}

export default ImportJSONBundleModal;