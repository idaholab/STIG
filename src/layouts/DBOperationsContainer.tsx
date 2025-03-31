import React, { useContext, useState } from 'react';
import ButtonBasic from '../components/elements/ButtonBasic';
import ConnectedDBContext, { ConnectedDBContextType } from '../contexts/ConnectedDBContext';
import FormCustomDBQuery from '@/components/forms/FormCustomDBQuery';
import DBQueryHistory from './DBQueryHistory';
import { useStigContext } from '@/contexts/StigContext';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { EdgeCollection, NodeCollection } from 'cytoscape';
import { commit, db_delete } from '@/util/DbFunctions';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { DialogBasic } from '@/components/elements/DialogBasic';
import DBUpdateModal from './DBUpdateModal';
import { AlertType } from '@/components/elements/AlertComponent';
import { StixObject } from '@/types/stixTypes/StixObject';
import { cycore2stix } from '@/stix/stix';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { importGraphToDB, ImportResult } from '@/graph/importGraph';
import FormElementFileInput from '@/components/forms/formElements/FormElementFileInput';
import ConnectedProfilePanelLayout from './ConnectedProfilePanelLayout';
import DBDeleteModal from './DBDeleteModal';

const DBOperationsContainer: React.FC = () => {
    const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;
    const [inQueryDeleteProcess, setInQueryDeleteProcess] = useState(false);
    const { cyInstance, getStigLayoutSettingsFromStore, runLayout } = useStigContext();
    const { selectedSTIXObject, setSelectedSTIXObject, selectionExists, setSelectionExists, nodesExist } = useStixPropsContext();
    const { addNotification } = useNotificationContext();
    const [selectedFiles, setSelectedFiles] = useState<ArrayLike<File>>([]);

    async function deleteSelectedGraphElementsFromDatabase() {
        if (cyInstance !== undefined) {
            const sel = cyInstance.$(':selected');
            const objs = sel.map(ele => ele.data('raw_data')).filter(data => !!data);
            const { nodes, rels } = await db_delete(objs);
            sel.forEach(ele => void cyInstance.remove(ele));
            setSelectedSTIXObject(undefined);
            addNotification(`Deleted ${nodes} nodes(s) and ${rels} edge(s) from database`, 'success');
        }
    }

    function commitNodes(selector: string) {
        if (cyInstance !== undefined) {
            const nodes = cyInstance.nodes(selector);
            const edges = cyInstance.edges(selector);
            addNotification("Saving to Database....", "info");
            submitter(nodes, edges);
        }
    }
    function submitter(nodes: NodeCollection, edges: EdgeCollection) {
        const stix_nodes: StixObject[] = nodes.map(cycore2stix).filter(s => s !== undefined);
        const stix_edges = edges.map(cycore2stix).filter(s => s !== undefined) as StixRelationshipObject[];
        (async () => {
            const { nodes, edges, errors, invalIds} = await commit(stix_nodes, stix_edges);
            const toastType: AlertType = errors === 0 ? "success" : "error";
            const message = errors === 0 ? `Submitted ${nodes}/${stix_nodes.length} node(s) and ${edges}/${stix_edges.length} edge(s)` : `${errors} error(s) occurred while saving to the database`;
            addNotification(message, toastType);
            if (invalIds !== undefined && invalIds.length>0){
                let mesg = "The following STIX objects were invalid: "
                invalIds.forEach(objID => {
                    mesg+="\n"+objID
                });
                addNotification(mesg, "error")
            }
        })();
    }

    const importFile = async () => {
        let gen: AsyncGenerator<ImportResult> = importGraphToDB(selectedFiles);
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
        <div className='dbOperationsContainer flex flex-col h-fit w-full px-4 py-2 mb-4 text-black dark:text-neutralc-200'>
            {/* Connected Profile */}
            <ConnectedProfilePanelLayout />

            <div className='flex flex-col basis-full h-fit mb-4 gap-1'>
                <span>Mutations</span>
                <span className='flex items-center justify-between gap-1'>
                    <DialogBasic
                        dialogId="SaveAllModal"
                        title="Update Database"
                        buttonColor='btn-neutralc'
                        showFormButtons={true}
                        buttonLabel="COMMIT ALL RECORDS"
                        disabled={!connectedDBProfile || !nodesExist}
                        additionalButtonClasses={`btn-xs flex-auto`}
                        onSave={() => commitNodes('')}
                    >
                        <DBUpdateModal cy={cyInstance} selector='' />
                    </DialogBasic>
                    <DialogBasic
                        dialogId="SaveToNeo4jModal"
                        title="Update Database"
                        showFormButtons={true}
                        buttonLabel="COMMIT SELECTED RECORDS"
                        buttonColor="btn-neutralc"
                        additionalButtonClasses={`uppercase btn-xs flex-auto`}
                        disabled={!cyInstance || !connectedDBProfile || !selectionExists}
                        onSave={() => commitNodes(':selected')}
                    >
                        <DBUpdateModal cy={cyInstance} selector={`#${selectedSTIXObject?.id}`} />
                    </DialogBasic>
                </span>
                <DialogBasic
                    dialogId="DBDeleteModal"
                    title="Delete Selected"
                    buttonColor='btn-neutralc'
                    showFormButtons={true}
                    buttonLabel="DELETE SELECTED RECORDS"
                    disabled={!cyInstance || !connectedDBProfile || !selectionExists}
                    additionalButtonClasses={`uppercase btn-xs flex-auto`}
                    saveLabel='Delete'
                    onSave={deleteSelectedGraphElementsFromDatabase}
                >
                    <DBDeleteModal cy={cyInstance} />
                </DialogBasic>
                <span className='mt-4 mb-1'>Import a File</span>
                <FormElementFileInput
                    placeholder='Choose a JSON Bundle File'
                    buttonLabel='Choose File'
                    acceptedFileTypes='.json'
                    multiple={true}
                    className={'h-fit'}
                    additionalInputClasses={'h-7'}
                    additionalBtnClasses={'!h-7 !min-h-7'}
                    onFileChange={setSelectedFiles}
                    tooltip={'Import a JSON Bundle into the databse for the connected profile'}
                />
                <ButtonBasic
                    label={'IMPORT'}
                    type={'btn-neutralc'}
                    additionalClasses={`${'btn-xs'}`}
                    disabled={selectedFiles?.length === 0 || !connectedDBProfile || !cyInstance}
                    onClick={importFile}
                />
            </div>

            <FormCustomDBQuery></FormCustomDBQuery>
            <DBQueryHistory
                inQueryDeleteProcess={inQueryDeleteProcess}
                setInQueryDeleteProcess={setInQueryDeleteProcess}
            />
        </div>
    );
};
export default DBOperationsContainer;
