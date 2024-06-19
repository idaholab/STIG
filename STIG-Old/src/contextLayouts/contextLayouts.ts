import cytoscape from 'cytoscape';
import { schema_map } from '../stix/stix_schemas';
import { alignCompoundNodes, organizeOrphans, stackCompoundNodes } from './graphLayoutFunctions';

import defense from './defenseInDepthSchema.json';
import defenseExtension from './defenseInDepthExtension.json';
import killChainSchema from './killChainSchema.json';
const killChainList = killChainSchema['kill-chain'];

const DRAG_DIST = 150;

export function removeCompoundNodes () {
  const cy = window.cycore;
  const comps = cy.$(':parent');

  // Remove child nodes from their parents
  for (let i = 0; i < comps.length; i++) {
    const children = comps[i].children();
    for (let j = 0; j < children.length; j++) {
      const child = children[j];
      child.move({ parent: null });
    }
  }

  // Remove parent nodes from the graph
  cy.remove(comps);

  // Remove any ghost nodes from the graph
  cy.remove('.ghost');
}

export function initDefenseGraph () {
  const cy = window.cycore;
  if (cy.$('.defense').length === 0) {
    const defId = defense.name.replaceAll(' ', '_');

    const elements: cytoscape.ElementDefinition[] = [
      {
        group: 'nodes',
        data: {
          id: defId,
          name: defense.name
        },
        selectable: false,
        classes: 'defense',
        style: {
          content: defense.name,
          'text-valign': 'top',
          'text-halign': 'center'
        }
      }
    ];

    const y = 100;
    for (const layer of defense.layers) {
      const layerId = layer.name.replaceAll(' ', '_');
      // console.log("layerId: ", layerId)
      const ele: cytoscape.ElementDefinition = {
        group: 'nodes',
        data: {
          id: layerId,
          name: layer.name,
          number: layer.num,
          parent: defId
        },
        position: {
          x: 150,
          y: y * layer.num
        },
        selectable: false,
        classes: 'layer',
        style: {
          content: layer.name,
          'text-valign': 'top',
          'text-halign': 'center'
        }
      };
      const ghost: cytoscape.ElementDefinition = {
        group: 'nodes',
        data: {
          id: 'ghost_' + layerId,
          parent: layerId
        },
        position: {
          x: 100,
          y: y * layer.num
        },
        classes: 'ghost',
        style: {
          display: 'none',
          width: 200
        }
      };

      elements.push(ele);
      elements.push(ghost);
    }

    cy.add(elements);

    // Event listeners
    cy.on('dragfree', handleDropNode);
    cy.on('drag', handleDrag);
    cy.on('dblclick', handleDblClickNode);

    // Add existing nodes with the defense in depth extension defined
    const nodes = cy.nodes('.stix_node');
    for (let i = 0; i < nodes.length; i++) {
      const ele = nodes[i];
      const data = ele.data('raw_data');
      if (data.extensions) {
        if (data.extensions[defenseExtension.node.id]) {
          const ext = data.extensions[defenseExtension.node.id];
          // The layer id is just the name with whitespace replaced with _
          const id = ext.layer_name.replaceAll(' ', '_');
          const layer = cy.$id(id);
          if (layer) {
            // Move the node to its parent
            ele.move({ parent: id });
          }
        }
      }
    }

    stackCompoundNodes('.layer');
  }
}

export function initKillChainGraph (type: string) {
  const cy = window.cycore;
  if (cy.$('.killchain').length === 0) {
    const killChain = killChainList.find(kc => { return kc.type === type; })!;

    const killChainId = killChain.type.replaceAll(' ', '_');

    const elements: cytoscape.ElementDefinition[] = [
      {
        group: 'nodes',
        data: {
          id: killChainId,
          name: killChain.type
        },
        selectable: false,
        classes: 'killchain',
        style: {
          content: killChain.type,
          'text-valign': 'top',
          'text-halign': 'center'
        }
      }
    ];

    let iPhase = 1;
    for (const phase of killChain.phases) {
      const phaseId = phase.name.replaceAll(' ', '_');
      const ele: cytoscape.ElementDefinition = {
        group: 'nodes',
        data: {
          id: phaseId,
          name: phase.name,
          aliases: phase.aliases,
          number: iPhase,
          parent: killChainId
        },
        position: {
          x: 100 * iPhase,
          y: 150 + ((iPhase % 2) * 50)
        },
        selectable: false,
        classes: 'phase',
        style: {
          content: phase.name,
          'text-valign': 'top',
          'text-halign': 'center'
        }
      };
      const ghost: cytoscape.ElementDefinition = {
        group: 'nodes',
        data: {
          id: 'ghost_' + phaseId,
          parent: phaseId
        },
        position: {
          x: 100 * iPhase,
          y: 150 + ((iPhase % 2) * 25)
        },
        classes: 'ghost',
        style: {
          display: 'none',
          width: 200
        }
      };

      elements.push(ele);
      elements.push(ghost);

      iPhase++;
    }

    cy.add(elements);

    // Event listeners
    cy.on('dragfree', handleDropNode);
    cy.on('drag', handleDrag);
    cy.on('dblclick', handleDblClickNode);

    // Add existing nodes with a kill chain phase
    const nodes = cy.nodes('.stix_node');
    nodes.forEach(node => {
      const data = node.data('raw_data');
      if (data.kill_chain_phases) {
        for (let i = 0; i < data.kill_chain_phases.length; i++) {
          const killChainName = data.kill_chain_phases[i].kill_chain_name;

          if (compareNames(killChainName, killChain.type, null)) {
            const killChainNode = cy.$(`#${killChainId}`);
            killChainNode.children().forEach(phase => {
              if (compareNames(data.kill_chain_phases[i].phase_name, phase.data('name'), phase.data('aliases'))) {
                node.move({ parent: phase.id() });
              } else {
                // eslint-disable-next-line no-console
                console.log("Kill chain didn't match");
              }
            });
          }
        }
      }
    });

    alignCompoundNodes('.phase');
    organizeOrphans();
  }
}

function compareNames (name: string, parent: string, aliases: string[] | null): boolean {
  let match = false;

  const convert = function (value: string): string {
    let newString = '';
    for (const c of value) {
      if (c.toLowerCase() !== c.toUpperCase()) {
        // Only letters will return true
        newString += c.toLowerCase();
      }
    }

    return newString;
  };

  if (convert(name) === convert(parent)) {
    // eslint-disable-next-line no-console
    console.log("It's a match!", name, parent);
    match = true;
  } else if (aliases) {
    aliases.forEach(alias => {
      if (convert(name) === convert(alias)) {
        // eslint-disable-next-line no-console
        console.log("It's a match!", name, alias);
        match = true;
      }
    });
  }

  return match;
}

function handleDropNode (e: cytoscape.EventObject) {
  const ele = e.target;

  const hasClass = ele.hasClass('stix_node');
  const isChild = ele.isChild();

  if (hasClass && !isChild) {
    // Check to see if the node can be added to a layer
    const layers = e.cy.$('.layer');
    layers.forEach(layer => {
      if (Math.abs(ele.position().x - layer.position().x) < layer.width() &&
                Math.abs(ele.position().y - layer.position().y) < layer.height()) {
        ele.move({ parent: layer.id() });
        // if (layer.children().length > 0) {
        //     const dX = ele.width() * layer.children().length + 20
        //     ele.shift({x: dX})
        // }
        const data = ele.data('raw_data');
        const property = {};
        const extId = Object.getOwnPropertyNames(defenseExtension.property)[0];
        property[extId] = {
          extension_type: defenseExtension.property[defenseExtension.node.id].extension_type,
          layer_name: '',
          layer_number: ''
        };
        // eslint-disable-next-line no-console
        console.log('extId: ', extId);
        property[extId].layer_name = layer.data('name');
        property[extId].layer_number = layer.data('number');
        if (data.extensions) {
          data.extensions[extId] = property[extId];
        } else {
          data.extensions = {};
          data.extensions[extId] = property[extId];
        }

        ele.data('raw_data', data);
      }
    });

    const phases = e.cy.$('.phase');
    phases.forEach(phase => {
      if (Math.abs(ele.position().x - phase.position().x) < phase.width() &&
                Math.abs(ele.position().y - phase.position().y) < phase.height()) {
        // if (layer.children().length > 0) {
        //     const dX = ele.width() * layer.children().length + 20
        //     ele.shift({x: dX})
        // }

        const type = ele.data('raw_data').type;
        // Find the schema in schema_map
        const schema = schema_map[Object.keys(schema_map).find(s => s.includes(type + '.json'))!];

        if (Object.keys(schema.properties).includes('kill_chain_phases')) {
          ele.move({ parent: phase.id() });
          const data = ele.data('raw_data');
          const killChain = {
            kill_chain_name: phase.parent()[0].data('name'),
            phase_name: phase.data('name')
          };
          if (data.kill_chain_phases) {
            data.kill_chain_phases.push(killChain);
          } else {
            data.kill_chain_phases = [];
            data.kill_chain_phases.push(killChain);
          }

          ele.data('raw_data', data);
        } else {
          //     // Show a toast when the user attempts to place an invalid node in the kill chain
          //     $("body").append(`<div class="toast">
          //     <div class="toast-header">
          //       <strong class="me-auto">STIG</strong>
          //       <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          //         <span aria-hidden="true">&times;</span>
          //       </button>
          //     </div>
          //     <div class="toast-body">
          //         Node of type "${type}" cannot be added to a kill chain.
          //     </div>
          //   </div>`)
          $('.message-status').html(`Node of type "${type}" cannot be added to a kill chain.`);
        }
      }
    });
  }

  // console.log("Reset prevPosition")
  ele.data('prevPosition', null);
  ele.parent().data('prevBounds', null);
}

function handleDrag (e: cytoscape.EventObject) {
  const ele = e.target;

  if (ele.hasClass('stix_node') && ele.isChild()) {
    const parent = e.cy.$(`#${ele.data('parent')}`);

    let prevPosition = { x: 0, y: 0 };

    if (!ele.data('prevPosition')) {
      prevPosition.x = ele.position().x;
      prevPosition.y = ele.position().y;
      // console.log(prevPosition)
      ele.data('prevPosition', prevPosition);
    } else {
      prevPosition = ele.data('prevPosition');
    }

    // Check if the node can be removed from a layer
    const dX = ele.position().x - prevPosition.x;
    const dY = ele.position().y - prevPosition.y;

    if (canRemove(parent, dX, dY)) {
      const lPos = parent.position();
      lPos.x -= dX;
      lPos.y -= dY;
      parent.position(lPos);
      ele.move({ parent: null });
      const data = ele.data('raw_data');
      if (parent.hasClass('layer')) {
        if (Object.getOwnPropertyNames(data.extensions).length === 1) {
          // There is only one extension. Delete the extensions property.
          delete data.extensions;
        } else {
          // There are multiple extensions defined. Find the right one and delete it.
          const extId = Object.getOwnPropertyNames(defenseExtension.property)[0];
          // console.log("removing:", extId)
          delete data.extensions[extId];
        }
      } else if (parent.hasClass('phase')) {
        if (data.kill_chain_phases.length === 1) {
          // There is only one kill chain phase. Delete the kill_chain_phases property.
          delete data.kill_chain_phases;
          // console.log("check: ", data["kill_chain_phases"])
        } else {
          // There are multiple kill chain phases defined. Find the right one and delete it.

          // console.log("Multiple kill chains")

          const kill_chain_name = parent.parent()[0].data('name');
          const phase_name = parent.data('name');

          // console.log(kill_chain_name, phase_name)

          const phaseList = data.kill_chain_phases as any[];
          const newPhaseList = [] as any[];

          for (const phase of phaseList) {
            if (compareNames(phase.kill_chain_name, kill_chain_name, null) || !compareNames(phase.phase_name, phase_name, parent.data('aliases'))) {
              newPhaseList.push(phase);
            }
          }

          data.kill_chain_phases = newPhaseList;
        }
      }
      ele.data('raw_data', data);
    }
  }
}

function canRemove (parent, dX, dY): boolean {
  let prevBounds = parent.data('prevBounds');

  if (prevBounds === null || prevBounds === undefined) {
    prevBounds = parent.boundingBox({});
    parent.data('prevBounds', prevBounds);
  }

  const numChildren = parent.children().length;

  // If there are two children (ghost + dragged), check the DRAG_DIST constant
  if (numChildren === 2) {
    if (Math.abs(dX) > DRAG_DIST || Math.abs(dY) > DRAG_DIST) {
      return true;
    }

    // If there are more than two children, check the width of the bounding box and compare that to DRAG_DIST
  } else if (numChildren > 2) {
    const curBounds = parent.boundingBox({});
    // console.log(`dx:${dX}|dy:${dY}|prevBounds:${JSON.stringify(prevBounds)}|curBounds:${JSON.stringify(curBounds)}`)
    if ((dX < 0 && Math.abs(curBounds.x1 - prevBounds.x1) > DRAG_DIST) ||
                (dX > 0 && Math.abs(curBounds.x2 - prevBounds.x2) > DRAG_DIST) ||
                (dY < 0 && Math.abs(curBounds.y1 - prevBounds.y1) > DRAG_DIST) ||
                (dY > 0 && Math.abs(curBounds.y2 - prevBounds.y2) > DRAG_DIST)) {
      return true;
    }
  }
  return false;
}

function handleDblClickNode (e: cytoscape.EventObject) {
  const ele = e.target;

  if (ele.hasClass('stix_node') && ele.isChild()) {
    ele.move({ parent: null });
  }
}
