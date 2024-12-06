import React from 'react';
import Dropdown from '../core/Dropdown';
import { useStigContext } from '@/contexts/StigContext';
import { getLayoutSettingsFromStore, GraphUtils, runGraphLayout } from '@/util/GraphUtils';
const killChainSchema = {
  "kill-chain": [
    {
      "type": "lockheed-martin-cyber-kill-chain",
      "id": 1,
      "phases": [
        {
          "name": "reconnaissance",
          "aliases": [
            "Reconnaissance",
            "Recon"
          ]
        },
        {
          "name": "weaponization",
          "aliases": [
            "Weaponization",
            "Weaponize"
          ]
        },
        {
          "name": "delivery",
          "aliases": [
            "Delivery",
            "Deliver"
          ]
        },
        {
          "name": "exploitation",
          "aliases": [
            "Exploitation",
            "Exploit"
          ]
        },
        {
          "name": "installation",
          "aliases": [
            "Installation",
            "Install"
          ]
        },
        {
          "name": "command-and-control",
          "aliases": [
            "Command and Control",
            "Command & Control",
            "C2",
            "Callback"
          ]
        },
        {
          "name": "actions-on-objectives",
          "aliases": [
            "Actions on Objectives",
            "Exfiltration",
            "Actions",
            "Act on Objectives",
            "Persistence",
            "Persist"
          ]
        }
      ]
    },
    {
      "type": "mitre-ics-attack",
      "id": 2,
      "phases": [
        {
          "name": "initial-access",
          "aliases": ["Initial Access"]
        },
        {
          "name": "execution",
          "aliases": ["Execution"]
        },
        {
          "name": "persistence",
          "aliases": ["Persistence"]
        },
        {
          "name": "privilege-escalation",
          "aliases": ["Privilege Escalation"]
        },
        {
          "name":"evasion",
          "aliases": ["Evasion"]
        },
        {
          "name":"discovery",
          "aliases": ["Discovery"]
        },
        {
          "name":"lateral-movement",
          "aliases": ["Lateral Movement"]
        },
        {
          "name":"collection",
          "aliases": ["Collection"]
        },
        {
          "name": "command-and-control",
          "aliases": ["Command and Control","Command & Control",]
        },
        {
          "name":"inhibit-response-function",
          "aliases": ["Inhibit Response Function"]
        },
        {
          "name":"impair-process-control",
          "aliases": ["Impair Process Control"]
        },
        {
          "name":"impact",
          "aliases": ["Impact"]
        }
      ]
    },
    {
      "type": "other",
      "id": 3,
      "phases": [
        {
          "name": "Reconnaissance",
          "aliases": "Recon"
        },
        {
          "name": "Intrusion"
        },
        {
          "name": "Exploitation",
          "aliases": "Exploit"
        },
        {
          "name": "Privilege Escalation"
        },
        {
          "name": "Lateral Movement"
        },
        {
          "name": "Obfuscation/Anti-forensics",
          "aliases": [
            "Obfuscation",
            "Anti-forensics",
            "Obfuscation(anti-forensics)"
          ]
        },
        {
          "name": "Denial of Service",
          "aliases": "DoS"
        },
        {
          "name": "Exfiltration"
        }
      ]
    }
  ]
}
const killChainList = killChainSchema["kill-chain"]
const DRAG_DIST = 150
const defense = {
  "name": "Defense in Depth",
  "layers": [
    {
      "name": "Risk management Program",
      "num": 1
    },
    {
      "name": "Cybersecurity Architecture",
      "num": 2
    },
    {
      "name": "Physical Security",
      "num": 3
    },
    {
      "name": "ICS Network Architecture",
      "num": 4
    },
    {
      "name": "ICS Network Perimeter Security",
      "num": 5
    },
    {
      "name": "Host Security",
      "num": 6
    },
    {
      "name": "Security Monitoring",
      "num": 7
    },
    {
      "name": "Vendor Management",
      "num": 8
    },
    {
      "name": "The Human Element",
      "num": 9
    }
  ]
}
const defenseExtension = {
  "node": {
    "id": "extension-definition--d83fce45-ef58-4c6c-a3f4-1fbc32e98c6e",
    "type": "extension-definition",
    "spec_version": "2.1",
    "name": "Defense in Depth",
    "description": "This schema adds property for Defense in Depth",
    "created": "2022-02-02T09:16:08.989000Z",
    "modified": "2022-02-02T09:16:08.989000Z",
    "schema": "https://github.com/idaholab/STIG",
    "version": "1.0.0",
    "extension_types": ["property-extension"]
  },
  "property": {
    "extension-definition--d83fce45-ef58-4c6c-a3f4-1fbc32e98c6e": {
      "extension_type": "property-extension",
      "layer_name": "network",
      "layer_number": 2
    }

  }
}

const ContextLayouts: React.FC = () => {
  const { cyInstance } = useStigContext();

  return (
    <Dropdown
      title="Context Layouts"
      includeDropdownArrow
      additionalButtonClasses={'text-neutral-600 dark:text-neutral-300'}
      fixed
    >
      <li className='hover:bg-primary hover:text-white'><a onClick={() => fLay_none(cyInstance)}>None</a></li>
      <li className='hover:bg-primary hover:text-white'><a onClick={() => fLay_defenseInDepth(cyInstance)}>Defense in Depth</a></li>

      <p className="menu-title text-neutralc-500 dark:text-neutralc-300 font-normal py-2 ">Kill Chains:</p>


      <li className='hover:bg-primary hover:text-white'><a onClick={() => { fLay_lockheedKC(cyInstance) }}>Lockheed Martin Cyber Kill Chain</a></li>
      <li className='hover:bg-primary hover:text-white'><a onClick={() => fLay_MitreKC(cyInstance)}>MITRE-ICS</a></li>
      <li className='hover:bg-primary hover:text-white'><a onClick={() => fLay_otherKC(cyInstance)}>Other</a></li>

    </Dropdown>
  );
};

function fLay_none(cy: cytoscape.Core | undefined) {
  if (cy === undefined) { return console.error("cytoscape.Core is undefined"); }
  removeCompoundNodes(cy);
  runGraphLayout(getLayoutSettingsFromStore(), cy);
}
function fLay_defenseInDepth(cy: cytoscape.Core | undefined) {
  if (cy === undefined) { return console.error("cytoscape.Core is undefined"); }
  removeCompoundNodes(cy);
  initDefenseGraph(cy);
  organizeOrphans(cy);
}
function fLay_lockheedKC(cy: cytoscape.Core | undefined) {
  if (cy === undefined) { return console.error("cytoscape.Core is undefined"); }
  removeCompoundNodes(cy);
  initKillChainGraph(cy, "lockheed-martin-cyber-kill-chain");
}
function fLay_MitreKC(cy: cytoscape.Core | undefined) {
  if (cy === undefined) { return console.error("cytoscape.Core is undefined"); }
  removeCompoundNodes(cy);
  initKillChainGraph(cy, "mitre-ics-attack");
}
function fLay_otherKC(cy: cytoscape.Core | undefined) {
  if (cy === undefined) { return console.error("cytoscape.Core is undefined"); }
  removeCompoundNodes(cy);
  initKillChainGraph(cy, "other");
}

export function removeCompoundNodes(cy: cytoscape.Core) {
  console.log("removeCompoundNodes")
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

function initDefenseGraph(cy: cytoscape.Core) {
  console.log("initDefenseGraph")
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
          'text-halign': 'center',
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
          'text-halign': 'center',
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
          width: 200,
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

    stackCompoundNodes(cy, '.layer');
  }
}

function stackCompoundNodes(cy: cytoscape.Core, clss: string) {
  console.log("stackCompoundNodes")
  const layers = cy.$(clss);

  let prevPosition = { x: 0, y: 0 };

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerNum = layer.data('number');
    const children = layer.children();
    // console.log(`${layer.data('name')} (${layerNum}): ${children.length}`);
    // console.log(layer.position());

    if (children.length === 1) {
      if (i > 0) {
        const x = 150;
        const y = prevPosition.y + 100;
        layer.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      } else {
        prevPosition = layer.position();
      }
    } else {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        const y = 150 * layerNum;
        const x = 150 * j;
        child.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      }
    }

    // console.log(layer.position());
  }
}
function handleDropNode(e: cytoscape.EventObject) {
  console.debug("handleDropNode")
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
        const property: any = {};
        const extId = Object.getOwnPropertyNames(defenseExtension.property)[0];
        const extensionIdExists = (id: string): id is keyof typeof defenseExtension.property =>
          id in defenseExtension.property;
        if (extensionIdExists(defenseExtension.node.id)) {
          property[extId] = {
            extension_type: defenseExtension.property[defenseExtension.node.id].extension_type,
            layer_name: "",
            layer_number: "",
          };
        }
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

        const objType = ele.data('raw_data').type;
        // Find the schema in schema_map
        if (['malware', 'infrastructure', "attack-pattern", 'indicator', 'tool'].includes(objType)) {
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
          console.warn(`Node of type "${objType}" cannot be added to a kill chain.`);
        }
      }
    });
  }

  // console.log("Reset prevPosition")
  ele.data('prevPosition', null);
  ele.parent().data('prevBounds', null);
}
function handleDrag(e: cytoscape.EventObject) {
  console.debug("handleDrag")
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
function canRemove(parent: any, dX: any, dY: any): boolean {
  console.log("canRemove")
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

function handleDblClickNode(e: cytoscape.EventObject) {
  console.debug("handleDblClickNode")
  const ele = e.target;

  if (ele.hasClass('stix_node') && ele.isChild()) {
    ele.move({ parent: null });
  }
}
function compareNames(name: string, parent: string, aliases: string[] | null): boolean {
  console.log("compareNames")
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

function organizeOrphans(cy: cytoscape.Core) {
  console.log("organizeOrphans")
  const nodes = cy.$(':orphan');
  const parent = nodes.filter(':parent');
  // We only want to move the childless orphans
  const movers = nodes.filter(':childless');

  if (movers.length > 0) {
    const boundingBox = parent[0].boundingBox({});
    // Figure out where to start (bottom left corner or top right)
    const prevPosition = { x: 0, y: 0 };
    if (boundingBox.h < boundingBox.w) {
      prevPosition.x = boundingBox.x2;
      prevPosition.y = boundingBox.y2;
    } else {
      prevPosition.x = boundingBox.x1;
      prevPosition.y = boundingBox.y1;
    }

    const grid_options: cytoscape.GridLayoutOptions = {
      name: 'grid',

      fit: false, // whether to fit the viewport to the graph
      padding: 20, // padding used on fit
      boundingBox: { x1: boundingBox.x1, y1: boundingBox.y2, w: 100, h: 100 }, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      avoidOverlapPadding: 100, // extra spacing around nodes when avoidOverlap: true
      nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      condense: false, // uses all available space on false, uses minimal space on true
      rows: undefined, // force num of rows in the grid
      cols: undefined, // force num of columns in the grid
      position: (_node) => undefined as any, // returns { row, col } for element
      // sort: (a: cytoscape.SortableNode, b: cytoscape.SortableNode) {
      //     return (a as cytoscape.SingularElement).degree(false) - (b as cytoscape.SingularElement).degree(false);
      // }, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
      animate: true, // whether to transition the node positions
      animationDuration: 1500, // duration of animation in ms if enabled
      ready: undefined, // callback on layoutready
      stop: undefined // callback on layoutstop
    };

    const layout = movers.layout(grid_options);
    layout.run();

    cy.animate({
      fit: {
        eles: cy.$(':parents'),
        padding: 50
      }
    });

    // // Based on the length, figure out how many nodes go in a row/column
    // var numNodes = 0
    // if (vertical) {
    //     numNodes = Math.ceil(boundingBox.h / (movers[0].width()))
    // } else {
    //     numNodes = Math.ceil(boundingBox.w / (movers[0].width() + 50))
    // }

    //
    // console.log(vertical, numNodes)

    // for (var i = 0; i < movers.length; i++) {
    //     // We only want to move the childless orphans
    //     if (!nodes[i].isParent()) {
    //         var floor = Math.floor(numNodes / (i + 1))
    //         var mod = numNodes % (i + 1)
    //         console.log("floor: ", floor)
    //         console.log("mod: ", mod)
    //         var newPosition = {
    //             x: vertical ? floor + boundingBox.x2 + 50 : mod + 50,
    //             y: vertical ? mod + 50 : floor + boundingBox.y2 + 50
    //         }
    //         console.log(newPosition)
    //         movers[i].animate({position: newPosition, duration: 1000})
    //     }
    // }
  }
}
function initKillChainGraph(cy: cytoscape.Core, type: string) {
  console.log("initKillChainGraph")
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

    alignCompoundNodes(cy, '.phase');
    organizeOrphans(cy);
  }
}
function alignCompoundNodes(cy: cytoscape.Core, clss: string) {
  console.log("alignCompoundNodes")
  const layers = cy.$(clss);

  let prevPosition = { x: 0, y: 0 };

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerNum = layer.data('number');
    const children = layer.children();
    // console.log(`${layer.data('name')}: ${children.length}`);

    if (children.length === 1) {
      if (i > 0) {
        const prevPhase = layers[i - 1];
        let x = prevPosition.x;
        const y = 150 + ((layerNum % 2) * 50);
        if (prevPhase.children().length > 1) {
          x += 150;
        } else {
          x += 100;
        }
        layer.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      } else {
        prevPosition = layer.position();
      }
    } else {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        const x = 150 * layerNum;
        const y = (150 * j) + ((layerNum % 2) * 50);
        child.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      }
    }
  }
}

export default ContextLayouts;
