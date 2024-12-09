import React, { useContext } from 'react';
import Dropdown from '../core/Dropdown';
import { useStigContext } from '@/contexts/StigContext';
import { EventContext } from '@/contexts/EventContext';
import { v5 as uuidv5 } from 'uuid';
import { ElementDefinition } from 'cytoscape';
import { view_utils_options } from '@/graph/graphOptions';
import { CytoscapeEmbedRelationship } from '@/types/cytoscapeTypes/CytoscapeEmbedRelationship';

const visualEdge_isVisible = React.createContext(false);
const relationship_isVisible = React.createContext(true);
const NAMESPACE = '00abedb4-aa42-466c-9c01-fed23315a9b7';

const Graph: React.FC = () => {
  const { cyInstance } = useStigContext();
  const { dispatchEvent } = useContext(EventContext);
  let v_isVisible = React.useContext(visualEdge_isVisible);
  let r_isVisible = React.useContext(relationship_isVisible);
  return <Dropdown
    title="Graph"
    includeDropdownArrow
    additionalOptionClasses={'w-[220px] hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary'}
    fixed
  >
    {/* <li className='hover:bg-primary hover:text-white'><a>Copy Selected Elements</a></li>
    <li className='hover:bg-primary hover:text-white'><a>Cut Selected Elements</a></li>
    <li className='hover:bg-primary hover:text-white'><a>Paste Elements</a></li>
    <li className='hover:bg-primary hover:text-white'><a>Commit All Elements</a></li>
    <li className='hover:bg-primary hover:text-white'><a>Delete Selected from Database</a></li>
    <li className='hover:bg-primary hover:text-white'><a>Select All Elements</a></li>
    <li className='hover:bg-primary hover:text-white'><a>Invert Selection</a></li>*/}
    <li><a onClick={() => {
      r_isVisible = !r_isVisible;
      toggleRelationships(cyInstance, r_isVisible);
    }}>Toggle STIX Relationships</a></li>
    <li><a onClick={() => {
      v_isVisible = !v_isVisible;
      toggleEmbeddedRelationships(cyInstance, v_isVisible);
    }}>Toggle Embedded Relationships</a></li>
    <li><a onClick={() => {
      const clearGraphEvent = new CustomEvent('clearGraph');
      dispatchEvent('clearGraphClickEvent', { data: clearGraphEvent });
    }}>Clear Graph</a></li>

  </Dropdown>;
};

function toggleRelationships(cy: cytoscape.Core | undefined, makeVisible: boolean) {
  if (cy == undefined) { return; }
  let rels = cy.edges().filter((ele) => { return ele?.data('raw_data') != 'visual_edge'; });
  makeVisible ? cy.viewUtilities(view_utils_options).show(rels) : cy.viewUtilities(view_utils_options).hide(rels)
}
function toggleEmbeddedRelationships(cy: cytoscape.Core | undefined, makeVisible: boolean) {
  if (cy == undefined) { return; }
  //find all visual edges (embedded relationships)
  let embed_rels = cy.edges().filter((ele) => { return ele?.data('raw_data') == 'visual_edge'; });
  //toggle the embedded relationships, making them if necessary
  if (makeVisible) {
    cy.viewUtilities(view_utils_options).show(embed_rels);
    makeEmbeddedRelationships(cy);
  } else {
    cy.viewUtilities(view_utils_options).hide(embed_rels);
  }
}

function makeEmbeddedRelationships(cy: cytoscape.Core) {
  let nodes = cy.elements(':visible');
  let to_add: ElementDefinition[] = [];
  nodes.each((ele) => {
    const obj = ele.data('raw_data');
    if (obj === undefined) { return; }
    if (obj.object_marking_refs !== undefined) { to_add.push(...add_visual_edge(cy, 'object_marking_refs', obj.object_marking_refs, obj.id)); }
    if (obj.created_by_ref !== undefined) { to_add.push(...add_visual_edge(cy, 'created_by_ref', obj.created_by_ref, obj.id)); }
    switch (obj.type) {
      case 'language-content':
        to_add.push(...add_visual_edge(cy, 'object_ref',obj.object_ref, obj.id));
        break;
      case 'report':
      case 'opinion':
      case 'grouping':
      case 'note':
      case 'observed-data':
        to_add.push(...add_visual_edge(cy, "object_refs", obj.object_refs, obj.id));
        break;
      case 'malware':
        to_add.push(...add_visual_edge(cy, 'operating_system_refs', obj.operating_system_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'sample_refs', obj.sample_refs, obj.id));
        break;
      case 'malware-analysis':
        to_add.push(...add_visual_edge(cy, 'host_vm_ref', obj.host_vm_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'operating_system_ref', obj.operating_system_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'installed_software_refs', obj.installed_software_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'analysis_sco_refs', obj.analysis_sco_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'sample_ref', obj.sample_ref, obj.id));
        break;
      case 'directory':
        to_add.push(...add_visual_edge(cy, 'contains_refs', obj.contains_refs, obj.id));
        break;
      case 'domain-name':
        to_add.push(...add_visual_edge(cy, 'resolves_to_refs', obj.resolves_to_refs, obj.id));
        break;
      case 'email-addr':
        to_add.push(...add_visual_edge(cy, 'belongs_to_ref', obj.belongs_to_ref, obj.id));
        break;
      case 'email-message':
        to_add.push(...add_visual_edge(cy, 'from_ref', obj.from_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'sender_ref', obj.sender_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'to_refs', obj.to_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'cc_refs', obj.cc_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'bcc_refs', obj.bcc_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'raw_email_ref', obj.raw_email_ref, obj.id));
        break;
      case 'file':
        to_add.push(...add_visual_edge(cy, 'parent_directory_ref', obj.parent_directory_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'contains_refs', obj.contains_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'content_ref', obj.content_ref, obj.id));
        break;
      case 'ipv4-addr':
      case 'ipv6-addr':
        to_add.push(...add_visual_edge(cy, 'resolves_to_refs', obj.resolves_to_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'belongs_to_refs', obj.belongs_to_refs, obj.id));
        break;
      case 'network-traffic':
        to_add.push(...add_visual_edge(cy, 'src_ref', obj.src_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'dst_ref', obj.dst_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'src_payload_ref', obj.src_payload_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'dst_payload_ref', obj.dst_payload_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'encapsulates_refs', obj.encapsulates_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'encapsulated_by_ref', obj.encapsulated_by_ref, obj.id));
        break;
      case 'process':
        to_add.push(...add_visual_edge(cy, 'opened_connection_refs', obj.opened_connection_refs, obj.id));
        to_add.push(...add_visual_edge(cy, 'image_ref', obj.image_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'parent_ref', obj.parent_ref, obj.id));
        to_add.push(...add_visual_edge(cy, 'child_refs', obj.child_refs, obj.id));
      //NOTE: purposefully no break;
      case 'windows-registry-key':
        to_add.push(...add_visual_edge(cy, 'creator_user_ref', obj.creator_user_ref, obj.id));
        break;
    }
  })
  try {
    cy.add(to_add);
  } catch (err) {
    console.warn(err);
  }
}


function add_visual_edge(cy: cytoscape.Core, label: string, field: string[] | string, objID: string ) {
  let visualEdgeElemDefs: ElementDefinition[] = [];
  if (field !== undefined) {

    const f_addVisualEdge = (refID: string) => {
      //NOTE: this ensures that the UUID of the visual_edge is repeatable
      const salt: string[] = [refID, objID]
      const rel_id = uuidv5(JSON.stringify(salt), NAMESPACE);

      const opts: CytoscapeEmbedRelationship = {
        data: {
          raw_data: 'visual_edge',
          id: rel_id,
          target: refID,
          source: objID,
          label: label,
        }
      }
      visualEdgeElemDefs.push(JSON.parse(JSON.stringify(opts)) as ElementDefinition)
    };

    if (typeof field == "string") {
      //don't even try to add an edge if the target object doesn't exist
      if (cy.$id(field).length == 1){f_addVisualEdge(field);}
    } else {
      for (const ref_id of field) {
        if (cy.$id(ref_id).length == 1){f_addVisualEdge(ref_id);}
      }
    }
  }
  return visualEdgeElemDefs;
}

export default Graph;
