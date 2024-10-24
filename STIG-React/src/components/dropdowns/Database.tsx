import React, { useContext, useState } from 'react';
import { DialogBasic } from '../elements/DialogBasic';
import DBProfileModal from '@/layouts/DBProfileModal';
import Dropdown from '../core/Dropdown';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import ButtonDBConnect from '../elements/ButtonDBConnect';
import DBQueryModal from '@/layouts/DBQueryModal';
import { useStigContext } from '@/contexts/StigContext';
import { commit, db_delete } from '@/util/DbFunctions';
import { StixObject } from '@/types/stixTypes/StixObject';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { CollectionReturnValue, EdgeCollection, NodeCollection, SingularElementArgument } from 'cytoscape';
import { AlertType } from '../elements/AlertComponent';
import { useNotificationContext } from '@/contexts/NotificationContext';
import ButtonBasic from '../elements/ButtonBasic';
import { useStixPropsContext } from '@/contexts/StixPropsContext';

const Database: React.FC = () => {
  const {
    savedDBProfiles, connectedDBProfile, setSelectedProfile,
  } = useContext(ConnectedDBContext) as ConnectedDBContextType;
  const [isConnectProcessing, setIsConnectProcessing] = useState(false);
  const { cyInstance, isPropertyPanelOpen, togglePropertyPanel } = useStigContext();
  const { addNotification } = useNotificationContext();
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  return (
    <Dropdown
      title="Database"
      includeDropdownArrow
    >
      <div className='w-[230px]'>
        <div className='grid'>
          <p className="menu-title text-neutralc-500 dark:text-neutralc-300 font-normal py-0">Profile:</p>
          <div className={savedDBProfiles.length ? 'col-start-2 justify-self-end' : 'grid'}>
            <DialogBasic
              dialogId="DBProfileModal"
              title="Database Settings"
              buttonColor='btn-ghost'
              buttonSize="btn-xs"
              showFormButtons={false}
              onClose={() => setSelectedProfile(undefined)}
              buttonLabel={!savedDBProfiles.length ?
                <>
                  <span className="material-icons">
                    add_circle
                  </span>
                  NEW PROFILE
                </>
                : undefined
              }
              buttonType={savedDBProfiles.length ? 'icon' : undefined}
              buttonIcon={savedDBProfiles.length ? 'add_circle' : undefined}
              additionalButtonClasses={!savedDBProfiles.length ? "justify-start" : undefined}
            >
              <DBProfileModal />
            </DialogBasic>
          </div>
        </div>
        {savedDBProfiles.length ?
          <ul>
            {savedDBProfiles.map(dbProfile => {
              return (
                <li key={dbProfile.Id} className='grid hover:bg-primary hover:text-white group h-[40px]'>
                  <a
                    className='py-1 pr-1 self-center hover:bg-transparent'
                    onClick={() => {
                      setSelectedProfile(dbProfile);
                      const dialogElement = document.getElementById("DBProfileModal") as HTMLDialogElement;
                      dialogElement.showModal();
                    }}
                  >
                    {connectedDBProfile?.Id === dbProfile.Id ?
                      <div className={`tooltip tooltip-right`} data-tip={"Connected"}>
                        <span className="material-icons">
                          star
                        </span>
                      </div>
                      : null
                    }
                    <div className={"truncate" + (connectedDBProfile?.Id !== dbProfile.Id ? " ml-8" : "")}>
                      {dbProfile.ProfileName}
                    </div>
                  </a>
                  <span className='col-start-2 justify-self-end hover:text-white pl-1'>
                    <ButtonDBConnect
                      dbProfile={dbProfile}
                      additionalButtonClasses='btn-xs hidden group-hover:flex bg-neutralc-950 hover:bg-neutralc-950 !text-neutralc-200 hover:!text-white !border-white '
                      isConnectProcessing={isConnectProcessing}
                      setIsConnectProcessing={setIsConnectProcessing}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
          : null
        }
        <div className="divider divider-neutral my-0"></div>
        <p className="menu-title text-neutralc-500 dark:text-neutralc-300 font-normal py-2 ">Actions:</p>
        {/* NOTE: Had to put cursor-not-allowed here because the DialogBasic covers it on the button */}
        <ul>
          <div className={`${!connectedDBProfile ? 'cursor-not-allowed' : ''}`} title={`${!connectedDBProfile ? 'Database not connected.' : ''}`}>

            <div className='hover:text-white hover:bg-primary'>
              <DialogBasic
                dialogId="DBQueryModal"
                title="Query Database"
                buttonColor='btn-ghost'
                showFormButtons={false}
                buttonLabel="Query"
                disabled={!connectedDBProfile}
                additionalButtonClasses={`btn-sm ml-1`}
              >
                <DBQueryModal />
              </DialogBasic>
            </div>

            <div className='hover:text-white hover:bg-primary' >
              <ButtonBasic
                label="Save All Nodes"
                type='btn-ghost'
                additionalClasses='btn-sm ml-1'
                onClick={() => { commitAllNodes(cyInstance, addNotification) }}
                disabled={!connectedDBProfile}
                isLabelUppercase={false}
              />
            </div>

            <div className='hover:text-white hover:bg-primary'>
              <ButtonBasic
                type='btn-ghost'
                label="Save Selected Nodes"
                additionalClasses='btn-sm ml-1'
                onClick={() => { commitSelectedNodes(cyInstance, addNotification) }}
                disabled={!connectedDBProfile}
                isLabelUppercase={false}
              />
            </div>
            <div className='hover:text-white hover:bg-primary'>
              <ButtonBasic
                type='btn-ghost'
                label="Remove Selected Nodes"
                additionalClasses='btn-sm ml-1'
                onClick={() => { deleteSelectedNodes(cyInstance, addNotification, selectedSTIXObject, setSelectedSTIXObject, isPropertyPanelOpen, togglePropertyPanel) }}
                disabled={!connectedDBProfile}
                isLabelUppercase={false}
              />
            </div>
          </div>
        </ul>
      </div>
    </Dropdown>
  );
};
function cycore2stix(o: SingularElementArgument) {
  // TODO: actually create STIX
  const n = o.data('raw_data');
  return n === undefined
    ? n
    : {
      // The spec_version is mandatory, but sometimes it doesn't exist on the objects.
      // This adds it if it isn't there already.
      // TODO: It might be better to just add the spec_version when an object is created.
      spec_version: '2.1',
      ...n
    };
}
function submitter(nodes: NodeCollection, edges: EdgeCollection, addNotification: any) {
  const stix_nodes: StixObject[] = nodes.map(cycore2stix).filter(s => s !== undefined);
  const stix_edges: StixRelationshipObject[] = edges.map(cycore2stix).filter(s => s !== undefined);
  (async () => {
    let set = await commit(stix_nodes, stix_edges);
    let objs = set[0].size; let rels = set[1].size;
    let toastType: AlertType = (objs + rels > 0) ? "success" : "warning";
    addNotification(`Submitted ${objs}/${stix_nodes.length} node(s) and ${rels}/${stix_edges.length} edge(s)`, toastType);
  })();
}
function commitAllNodes(cy: cytoscape.Core | undefined, addNotification: any) {
  if (cy !== undefined) {
    let nodes = cy.nodes('');
    let edges = cy.edges('');
    submitter(nodes, edges, addNotification);
  }
  return ''
};
function commitSelectedNodes(cy: cytoscape.Core | undefined, addNotification: any) {
  if (cy !== undefined) {
    let nodes = cy.nodes(':selected');
    let edges = cy.edges(':selected');
    submitter(nodes, edges, addNotification);
  }
  return ''
}
function deleteSelectedNodes(
  cy: cytoscape.Core | undefined,
  addNotification: any,
  selectedSTIXObject: StixObject | undefined,
  setSelectedSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>,
  isDrawerOpen: boolean,
  togglePropertyPanel: () => void,
) {

  if (cy !== undefined) {
    const selected: NodeCollection = cy.nodes(':selected');
    const vis: CollectionReturnValue = cy.$(':visible');
    const edges: EdgeCollection = selected.edgesWith(vis);
    // Delete incoming/outgoing edges first.
    edges.forEach((ele) => {
      const selectedSTIXObjectId = selectedSTIXObject?.id.replace("relationship--", "");
      if (selectedSTIXObjectId === ele.data("id") || selectedSTIXObject?.id === ele.data("id")) {
        setSelectedSTIXObject(undefined);
        if (isDrawerOpen) {
          togglePropertyPanel();
        }
      }
      cy.remove(ele);
    });
    selected.forEach((ele) => {
      // deleting a node deletes the edges connected to it as well
      void db_delete(ele.data('raw_data'));
      cy.remove(ele);

      const selectedSTIXObjectId = selectedSTIXObject?.id.replace("relationship--", "");
      if (selectedSTIXObjectId === ele.data("id") || selectedSTIXObject?.id === ele.data("id")) {
        setSelectedSTIXObject(undefined);
        if (isDrawerOpen) {
          togglePropertyPanel();
        }
      }
    });
    addNotification(`Deleted ${selected.length} object(s) and ${edges.length} edge(s) from database`, 'success');

  }
  return ''
}
export default Database;
