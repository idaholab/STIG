/*
Copyright 2018 Southern California Edison Company
ALL RIGHTS RESERVED
 */
import { getCssRGBVarColor } from '@/util/GetCssVarColor';
import cytoscape, { Css, ElementDefinition, StylesheetStyle } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';

cytoscape.use(edgehandles);

const defaults = {
  //preview: true, // whether to show added edges preview before releasing selection
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  //handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
  handlePosition(_node: cytoscape.SingularElementArgument) {
    return 'middle bottom'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
  },
  edgeType(_sourceNode: cytoscape.SingularElementArgument, _targetNode: cytoscape.SingularElementArgument) {
    // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
    // returning null/undefined means an edge can't be added between the two nodes

    // Disable edges for compound nodes
    // const src = _sourceNode.cy().$(`#${_sourceNode.id()}`);
    // const tgt = _targetNode.cy().$(`#${_targetNode.id()}`);
    const src = _sourceNode as cytoscape.NodeSingular;
    const tgt = _targetNode as cytoscape.NodeSingular;

    if (src.isNode() && src.isParent()) {
      return null;
    }

    if (tgt.isNode() && tgt.isParent()) {
      return null;
    }
    return 'flat';
  },

  loopAllowed(_node: cytoscape.SingularElementArgument) {
    // for the specified node, return whether edges from itself to itself are allowed
    return false;
  },
  nodeLoopOffset: -50, // offset for edgeType: 'node' loops
};

export function setup_edge_handles(cy: cytoscape.Core) {
  return cy.edgehandles(defaults);
}

export const generateEdgeHandlesStyle = (): StylesheetStyle[] => {
  const handleBackgroundColor = getCssRGBVarColor('--node-handle-color');
  const nodeEdgeHandleStyles: Css.Node = {
    'background-color': handleBackgroundColor,
    width: 12,
    height: 12,
    shape: 'roundrectangle',
    'overlay-opacity': 0,
    'border-width': 0,
    'border-opacity': 0,
  };
  return [{
    selector: '.eh-handle',
    style: nodeEdgeHandleStyles
  }];
};

export const updateEdgeHandlesStyle = (cy: cytoscape.Core) => {
  const handleStyle: StylesheetStyle | undefined = generateEdgeHandlesStyle().find(style => style.selector === '.eh-handle');
  if (handleStyle && handleStyle.style) {
    cy.style()
      .selector('.eh-handle')
      .style(handleStyle.style as Css.Node)
      .update();
  }
};