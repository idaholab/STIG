// import React, { useContext, useState } from 'react';
// import { DialogBasic } from '../elements/DialogBasic';
// import DBProfileLayout from '@/layouts/DBProfile';
// import Dropdown from '../core/Dropdown';
// import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
// import ButtonDBConnect from '../elements/ButtonDBConnect';
// import DBQueryModal from '@/layouts/DBQueryModal';
// import DBUpdateModal from '@/layouts/DBUpdateModal';
// import DBDeleteModal from '@/layouts/DBDeleteModal';
// import { useStigContext } from '@/contexts/StigContext';
// import { commit, db_delete } from '@/util/DbFunctions';
// import { StixObject } from '@/types/stixTypes/StixObject';
// import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
// import { CollectionReturnValue, EdgeCollection, NodeCollection } from 'cytoscape';
// import { AlertType } from '../elements/AlertComponent';
// import { useNotificationContext } from '@/contexts/NotificationContext';
// import { useStixPropsContext } from '@/contexts/StixPropsContext';
// import { cycore2stix } from '@/stix/stix';

// const Database: React.FC = () => {
//   const {
//     savedDBProfiles, connectedDBProfile, setSelectedProfile,
//   } = useContext(ConnectedDBContext) as ConnectedDBContextType;
//   const [isConnectProcessing, setIsConnectProcessing] = useState(false);
//   const { cyInstance, setIsPropertyPanelOpen } = useStigContext();
//   const { addNotification } = useNotificationContext();
//   const { setSelectedSTIXObject, selectionExists, setSelectionExists, nodesExist } = useStixPropsContext();

// return (
//   <Dropdown
//     title="Database"
//     includeDropdownArrow
//   >
{/* <div className='w-[230px]'>
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
      <p className="menu-title text-neutralc-500 dark:text-neutralc-300 font-normal py-2 ">Actions:</p> */}
{/* NOTE: Had to put cursor-not-allowed here because the DialogBasic covers it on the button */ }
{/* <ul>
        <div className={`${!connectedDBProfile ? 'cursor-not-allowed' : ''}`} title={`${!connectedDBProfile ? 'Database not connected.' : ''}`}> */}

//  <div className='hover:text-white hover:bg-primary'>
//    <DialogBasic
//                 dialogId="DBQueryModal"
//                 title="Query Database"
//                 buttonColor='btn-ghost'
//                 showFormButtons={false}
//                 buttonLabel="Query"
//                 disabled={!connectedDBProfile}
//                 additionalButtonClasses={`btn-sm ml-1`}
//               >
//                 <DBQueryModal />
//               </DialogBasic>
//             </div>

//             <div className='hover:text-white hover:bg-primary' >
//               <DialogBasic
//                 dialogId="SaveAllModal"
//                 title="Update Database"
//                 buttonColor='btn-ghost'
//                 showFormButtons={true}
//                 buttonLabel="Save All"
//                 disabled={!connectedDBProfile || !nodesExist}
//                 additionalButtonClasses={`btn-sm ml-1`}
//                 onSave={() => commitNodes(cyInstance, '', addNotification)}
//               >
//                 <DBUpdateModal cy={cyInstance} selector='' />
//               </DialogBasic>
//             </div>

//             <div className='hover:text-white hover:bg-primary'>
//               <DialogBasic
//                 dialogId="SaveSelectedModal"
//                 title="Save Selected"
//                 buttonColor='btn-ghost'
//                 showFormButtons={true}
//                 buttonLabel="Save Selected"
//                 disabled={!connectedDBProfile || !selectionExists}
//                 additionalButtonClasses={`btn-sm ml-1`}
//                 onSave={() => commitNodes(cyInstance, ':selected', addNotification)}
//               >
//                 <DBUpdateModal cy={cyInstance} selector=':selected' />
//               </DialogBasic>
//             </div>
//             <div className='hover:text-white hover:bg-primary'>
//               <DialogBasic
//                 dialogId="DBDeleteModal"
//                 title="Delete Selected"
//                 buttonColor='btn-ghost'
//                 showFormButtons={true}
//                 buttonLabel="Remove Selected"
//                 disabled={!connectedDBProfile || !selectionExists}
//                 additionalButtonClasses={`btn-sm ml-1`}
//                 saveLabel='Delete'
//                 onSave={() => {
//                   deleteSelectedNodes(cyInstance, addNotification, setSelectedSTIXObject, setIsPropertyPanelOpen);
//                   setSelectionExists(false);
//                 }}
//               >
//                 <DBDeleteModal cy={cyInstance} />
//               </DialogBasic>
//             </div>
//           </div>
//         </ul>
//       </div>
//     </Dropdown>
//   );
// }

// function submitter(nodes: NodeCollection, edges: EdgeCollection, addNotification: any) {
//   const stix_nodes: StixObject[] = nodes.map(cycore2stix).filter(s => s !== undefined);
//   const stix_edges = edges.map(cycore2stix).filter(s => s !== undefined) as StixRelationshipObject[];
//   (async () => {
//     const { nodes, edges, errors } = await commit(stix_nodes, stix_edges);
//     const toastType: AlertType = errors === 0 ? "success" : "warning";
//     addNotification(`Submitted ${nodes}/${stix_nodes.length} node(s) and ${edges}/${stix_edges.length} edge(s)`, toastType);
//   })();
// }

// function commitNodes(cy: cytoscape.Core | undefined, selector: string, addNotification: any) {
//   if (cy !== undefined) {
//     const nodes = cy.nodes(selector);
//     const edges = cy.edges(selector);
//     addNotification("Saving to Database....", "info");
//     submitter(nodes, edges, addNotification);
//   }
// }

// function deleteSelectedNodes(
//   cy: cytoscape.Core | undefined,
//   addNotification: any,
//   setSelectedSTIXObject: (obj: StixObject | undefined) => void,
//   setIsPropertyPanelOpen: (b: boolean) => void,
// ) {

//   if (cy !== undefined) {
//     const selected: NodeCollection = cy.nodes(':selected');
//     const vis: CollectionReturnValue = cy.$(':visible');
//     const eW: EdgeCollection = selected.edgesWith(vis);
//     const eS: EdgeCollection = cy.edges(':selected');

//     const sel = cy.$(':selected');
//     sel.forEach(ele => void cy.remove(ele));
//     db_delete(sel.map(ele => ele.data('raw_data')));
//     setSelectedSTIXObject(undefined);
//     setIsPropertyPanelOpen(false);
//     addNotification(`Deleted ${selected.length} object(s) and ${eW.length + eS.length} edge(s) from database`, 'success');
//   }
// }
//export default Database;
