import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ButtonBasic from '@/components/elements/ButtonBasic';
import FormElementTextInput from '@/components/forms/formElements/FormElementTextInput';
import { STIGBundle } from '@/types/STIGBundle';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';
import { exportGraph } from '@/graph/exportGraph';

const ExportAllModal: React.FC = () => {
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
                    if(cyInstance) {
                        // Get raw data from all cy elements
                        // Create bundle object
                        const bundle_id = 'bundle--' + uuidv4();
                        let bundle: STIGBundle = { type: 'bundle', id: bundle_id, objects: [] } as any;
                        let nodes = cyInstance.$(':visible');
                        nodes = nodes.union(nodes.connectedEdges());
                        
                        // ATTN: the following logic may actually do nothing at all. If that is the case, this 
                        // problem can be solved by doing the filter like on the visual edges
                        // logic to remove null on json export
                        nodes.each((ele) => {
                            if (ele.length === 0) {
                                return;
                            }
                            if (ele.data('raw_data') !== undefined) {
                                bundle.objects.push(ele.data('raw_data'));
                            }
                        });

                        // filter out embedded relationship visual edges
                        bundle.objects = bundle.objects.filter((bundleObj: any) => {
                            return bundleObj !== "visual_edge";
                        })

                        exportGraph(fileName, bundle);
                        
                        if(bundle.objects.length === 0) {
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

export default ExportAllModal;