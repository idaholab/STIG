/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

export interface IColaLayoutOptions {
  name: 'cola';
  animate?: boolean; // whether to show the layout as it's running
  refresh?: number; // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime?: number; // max length in ms to run the layout
  ungrabifyWhileSimulating?: boolean; // so you can't drag nodes during layout
  fit?: boolean; // on every layout reposition of nodes, fit the viewport
  padding?: number; // padding around the simulation
  // eslint-disable-next-line
  boundingBox?: any; // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }

  // layout event callbacks
  ready?(): void; // on layoutreadycytoscape_vie
  stop?(): void; // on layoutstop

  // positioning options
  randomize?: boolean; // use random node positions at beginning of layout
  avoidOverlap?: boolean; // if true, prevents overlap of node bounding boxes
  handleDisconnected?: boolean; // if true, avoids disconnected components from overlapping
  // eslint-disable-next-line
  nodeSpacing?(x: any): number; // extra spacing around nodes
  flow?: { axis: string; minSeparation: number }; // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment?(): { x: number; y: number }; // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  // eslint-disable-next-line
  edgeLength?(edge: any): number; // sets edge length directly in simulation
  // eslint-disable-next-line
  edgeSymDiffLength?: any; // symmetric diff edge length in simulation
  // eslint-disable-next-line
  edgeJaccardLength?: any; // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  // eslint-disable-next-line
  unconstrIter?: any; // unconstrained initial layout iterations
  // eslint-disable-next-line
  userConstIter?: any; // initial layout iterations with user-specified constraints
  // eslint-disable-next-line
  allConstIter?: any; // initial layout iterations with all constraints including non-overlap

  // infinite layout options
  infinite?: boolean; // overrides all other options for a forces-all-the-time mode
}
