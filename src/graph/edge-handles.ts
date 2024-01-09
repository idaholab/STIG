/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import cytoscape from 'cytoscape';

const defaults = {
  preview: true, // whether to show added edges preview before releasing selection
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
  handlePosition (_node: cytoscape.SingularElementArgument) {
    return 'middle bottom'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
  },
  handleInDrawMode: false, // whether to show the handle in draw mode
  edgeType (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument) {
    // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
    // returning null/undefined means an edge can't be added between the two nodes

    // Disable edges for compound nodes
    const src = window.cycore.$(`#${_sourceNode.id()}`);
    const tgt = window.cycore.$(`#${_targetNode.id()}`);
    if (src.isParent() || tgt.isParent()) {
      return null;
    }
    return 'flat';
  },
  loopAllowed (_node: cytoscape.SingularElementArgument) {
    // for the specified node, return whether edges from itself to itself are allowed
    return false;
  },
  nodeLoopOffset: -50, // offset for edgeType: 'node' loops
  nodeParams (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for intermediary node
    return {};
  },
  edgeParams (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument, _i: number) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    // NB: i indicates edge index in case of edgeType: 'node'
    return {};
  },
  show (_sourceNode: cytoscape.SingularElementArgument) {
    // fired when handle is shown
  },
  hide (_sourceNode: cytoscape.SingularElementArgument) {
    // fired when the handle is hidden
  },
  start (_sourceNode: cytoscape.SingularElementArgument) {
    // fired when edgehandles interaction starts (drag on handle)
  },
  complete (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument, _addedEles: any) {
    // fired when edgehandles is done and elements are added
  },
  stop (_sourceNode: cytoscape.SingularElementArgument) {
    // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
  },
  cancel (_sourceNode: cytoscape.SingularElementArgument, _cancelledTargets: cytoscape.Collection) {
    // fired when edgehandles are cancelled (incomplete gesture)
  },
  hoverover (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument) {
    // fired when a target is hovered
  },
  hoverout (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument) {
    // fired when a target isn't hovered anymore
  },
  previewon (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument, _previewEles: cytoscape.Collection) {
    // fired when preview is shown
  },
  previewoff (_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument, _previewEles: cytoscape.Collection) {
    // fired when preview is hidden
  },
  drawon () {
    // fired when draw mode enabled
  },
  drawoff () {
    // fired when draw mode disabled
  }
};

export const edgehandles_style = [{
  selector: '.eh-handle',
  style: {
    'background-color': 'red',
    width: 12,
    height: 12,
    shape: 'roundrectangle',
    'overlay-opacity': 0,
    'border-width': 12, // makes the handle easier to hit
    'border-opacity': 0
  }
},
{
  selector: '.eh-hover',
  style: {
    'background-color': 'green'
  }
},
{
  selector: '.eh-source',
  style: {
    'border-width': 5,
    'border-color': 'blue'
  }
},
{
  selector: '.eh-target',
  style: {
    'border-width': 5,
    'border-color': 'purple'
  }
},
{
  selector: '.eh-preview, .eh-ghost-edge',
  style: {
    'background-color': 'black',
    'line-color': 'black',
    'target-arrow-color': 'black',
    'source-arrow-color': 'black'
  }
}
];

export function setup_edge_handles (cy: cytoscape.Core) {
  const eh = cy.edgehandles(defaults);
  return eh;
}

// export function setup_edge_handles(cy: cytoscape.Core) {
//     //initialize edge editor
//     let handles = new CytoscapeEdgeEditation;
//     handles.init(cy);
//     handles.registerHandle({
//     positionX: "center",
//     positionY: "top",
//     color: "green",
//     type: "default",
//     single: false,
//     nodeTypeNames: ['all', '*']
// });
//     handles.registerHandle({
//     positionX: "center",
//     positionY: "bottom",
//     color: "green",
//     type: "default",
//     single: false,
//     nodeTypeNames: ['all', '*']
// });
//     handles.registerHandle({
//     positionX: "left",
//     positionY: "center",
//     color: "green",
//     type: "default",
//     single: false,
//     nodeTypeNames: ['all', '*']
// });
//     handles.registerHandle({
//     positionX: "right",
//     positionY: "center",
//     color: "green",
//     type: "default",
//     single: false,
//     nodeTypeNames: ['all', '*']
// });
// }
