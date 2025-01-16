import { DialogBasic } from '@/components/elements/DialogBasic';
import FormElementFileInput from '@/components/forms/formElements/FormElementFileInput';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStigContext } from '@/contexts/StigContext';
import { importGraphToDB, importGraphToView, ImportResult } from '@/graph/importGraph';
import React, { useContext, useState } from 'react';

const ImportJSONBundleModal: React.FC = () => {
    const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;
    const { addNotification } = useNotificationContext();
    const { cyInstance, getStigLayoutSettingsFromStore, runLayout } = useStigContext();
    const [selectedFiles, setSelectedFiles] = useState<ArrayLike<File>>([]);
    const [target, setTarget] = useState<"view" | "db">("view");

    const importFile = async () => {
        let gen: AsyncGenerator<ImportResult>;
        if (target === "view") {
            if (!cyInstance) return;
            gen = importGraphToView(cyInstance, selectedFiles);
        } else {
            if (!connectedDBProfile) return;
            gen = importGraphToDB(selectedFiles);
        }

        let need_layout = false;
        let sym = Symbol();
        for await (const { alert, layout } of gen) {
            sym = addNotification(alert.message, alert.type, sym);
            need_layout = need_layout || layout;
        }
        if (need_layout && cyInstance) {
            // Perform layout if some bundle had no metadata
            runLayout(getStigLayoutSettingsFromStore(), cyInstance);
        }
        // Make sure selections don't persist across closing and re-opening the dialog
        setSelectedFiles([]);
    };

    return (
        <DialogBasic
            dialogId="ImportJSONBundleModal"
            title="Import a JSON Bundle File to the Graph"
            buttonColor='btn-ghost'
            showFormButtons={true}
            buttonLabel="JSON Bundle"
            additionalButtonClasses={"btn-sm justify-start w-[120px]"}
            saveLabel='Import'
            saveEnabled={selectedFiles.length > 0}
            onSave={importFile}
        >
            <div className='h-full grid'>
                {/* <select className='dark:bg-neutralc-700' onChange={e => setTarget(e.target.value as any)} defaultValue={"view"}>
                    <option value="view">To View</option>
                    { connectedDBProfile && <option value="db">To DB</option> }
                </select> */}
                <FormElementFileInput
                    placeholder='Choose a JSON Bundle File'
                    buttonLabel='Choose File'
                    acceptedFileTypes='.json'
                    multiple={true}
                    onFileChange={setSelectedFiles}
                />
            </div>
        </DialogBasic>
    );
}

export default ImportJSONBundleModal;