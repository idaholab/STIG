/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import cytoscape, { LayoutOptions, RandomLayoutOptions } from 'cytoscape';

import { IColaLayoutOptions } from './colaLayoutOptions';

export const node_style: cytoscape.Stylesheet = {
  selector: '.stix_node',
  style: {
    content: 'data(name)',
    shape: 'roundrectangle',
    width: 77,
    height: 77,
    'background-color': 'black',
    'min-zoomed-font-size': 10,
    'text-wrap': 'wrap',
    'background-fit': 'cover',
    // "text-margin-x": 7,
    'overlay-opacity': 0,
    'text-max-width': '120'
    // "border-width":5
  } // as cytoscape.Css.Node,
};

export const compound_style: cytoscape.Stylesheet = {
  selector: ':parent',
  style: {
    shape: 'roundrectangle',
    'background-color': '#FFFFFF'
  }
};

export const edge_style: cytoscape.Stylesheet = {
  selector: 'edge',
  style: {
    events: 'yes',
    'target-arrow-shape': 'triangle',
    'arrow-scale': 2,
    'target-distance-from-node': 5,
    'curve-style': 'bezier',
    // 'curve-style': 'haystack',
    // 'control-point-step-size': 20,
    // "border-width":5,
    'control-point-distances': '-20 -20',
    'control-point-weights': '0.25 0.75',
    label: 'data(label)',
    'text-rotation': 'autorotate',
    'text-valign': 'top',
    'text-margin-x': 7,
    'min-zoomed-font-size': 10,
    'overlay-opacity': 0,
    width: 2
  } // as cytoscape.Css.Edge,
};

export const select_node_style: cytoscape.Stylesheet = {
  selector: ':selected',
  style: {
    'border-width': 4,
    'border-style': 'solid',
    'border-color': 'red',
    'target-arrow-color': 'red',
    'line-color': 'red',
    'background-color': 'red'
  }
};

export const modified_unselect_style: cytoscape.Stylesheet = {
  selector: '.stix_node[!saved]',
  style: {
    'border-width': 2,
    'text-background-color': 'yellow',
    'text-background-opacity': 1
  }
};

export const modified_select_style: cytoscape.Stylesheet = {
  selector: ':selected[?saved_]',
  style: {
    'border-width': 4
    // 'border-style': 'double',
    // 'line-color': '#FF8141',
    // 'target-arrow-color': '#FF8141',
    // 'border-color': '#FF8141',
  }
};

// export let modified_edge_style: cytoscape.Stylesheet = {
//     selector: ':unselected[!saved]',
//     style: {
//         // "border-width": 5,
//         // 'border-style': 'solid',
//         // 'line-style': 'dashed',
//     },
// };

// export let modified_select_edge_style: cytoscape.Stylesheet = {
//     selector: ':selected[!saved]',
//     style: {
//         // "border-width": 5,
//         // 'border-style': 'solid',
//         // 'width': 4,
//     },
// };

export const view_utils_options: ViewUtilitiesOptions = {
  node: {
    highlighted: {
      'border-color': '#1E90FF',
      'border-style': 'solid'
      // 'background-image-opacity': 0
    }, // styles for when nodes are highlighted.
    unhighlighted: { // styles for when nodes are unhighlighted.
      opacity: 1,
      'text-opacity': 1,
      'background-opacity': 1,
      'background-image-opacity': 1
    }
  },
  edge: {
    highlighted: {
      'target-arrow-shape': 'triangle',
      'border-color': '#1E90FF',
      'border-style': 'solid',
      'curve-style': 'bezier'
    }, // styles for when edges are highlighted.
    unhighlighted: { // styles for when edges are unhighlighted.
      'border-opacity': 1,
      'text-opacity': 1,
      'background-opacity': 1,
      'target-arrow-shape': 'triangle',
      'source-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  searchBy: ['name']
};

export const cola_layout_options: IColaLayoutOptions = {
  name: 'cola',
  animate: true, // whether to show the layout as it's running
  refresh: 1, // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: 3000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 20, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }

  // layout event callbacks
  ready: () => { }, // on layoutreadycytoscape_vie
  stop: () => { }, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout
  avoidOverlap: true, // if true, prevents overlap of node bounding boxes
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  nodeSpacing: (_node) => {
    return 105;
  }, // extra spacing around nodes
  flow: {
    axis: 'x',
    minSeparation: 30
  }, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: undefined, // sets edge length directly in simulation
  edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
  edgeJaccardLength: 150, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: undefined, // unconstrained initial layout iterations
  userConstIter: undefined, // initial layout iterations with user-specified constraints
  allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

  // infinite layout options
  infinite: false // overrides all other options for a forces-all-the-time mode
};

export const cose_options: cytoscape.LayoutOptions & { animationThreshold: number } = {
  name: 'cose',

  // Called on `layoutready`
  ready: () => { },
  // Called on `layoutstop`
  stop: () => { },
  // Whether to animate while running the layout
  animate: true,
  // The layout animates only after this many milliseconds
  // (prevents flashing on fast runs)
  animationThreshold: 50,
  // Number of iterations between consecutive screen positions update
  // (0 -> only updated on the end)
  refresh: 20,
  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 20,
  // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  boundingBox: undefined,
  // Excludes the label when calculating node bounding boxes for the layout algorithm
  nodeDimensionsIncludeLabels: true,
  // Randomize the initial positions of the nodes (true) or use existing positions (false)
  randomize: false,
  // Extra spacing between components in non-compound graphs
  componentSpacing: 200,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: (_node) => 800000,
  // Node repulsion (overlapping) multiplier
  nodeOverlap: 10,
  // Ideal edge (non nested) length
  idealEdgeLength: (_edge) => 200,
  // Divisor to compute edge forces
  edgeElasticity: (_edge) => 100,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 5,
  // Gravity force (constant)
  gravity: 80,
  // Maximum number of iterations to perform
  numIter: 300000,
  // Initial temperature (maximum node displacement)
  initialTemp: 500,
  // Cooling factor (how the temperature is reduced between consecutive iterations
  coolingFactor: 0.95,
  // Lower temperature threshold (below this point the layout will end)
  minTemp: 1.0,
  // Pass a reference to weaver to use threads for calculations
  weaver: false
};

export const cose_bilkent_options = {
  name: 'cose-bilkent',
  // Called on `layoutready`
  ready: () => { },
  // Called on `layoutstop`
  stop: () => { },
  // number of ticks per frame; higher is faster but more jerky
  refresh: 30,
  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 20,
  // Padding for compounds
  paddingCompound: 15,
  // Whether to enable incremental mode
  randomize: false,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 6500,
  // Ideal edge (non nested) length
  idealEdgeLength: 200,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.25,
  // Maximum number of iterations to perform
  numIter: 10000,
  // For enabling tiling
  tile: true,
  // Type of layout animation. The option set is {'during', 'end', false}
  animate: 'during',
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.8
};

export const klay_options: cytoscape.KlayOptions = {
  name: 'klay',
  nodeDimensionsIncludeLabels: true, // Boolean which changes whether label dimensions are included when calculating node dimensions
  fit: true, // fit viewport to graph
  padding: 20, // padding on fit
  animate: true, // whether to transition the node positions
  animationDuration: 2000, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  priority: (_edge) => null, // Edges with a non-nil value are skipped when geedy edge cycle breaking is enabled
  klay: {
    // following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
    // for more info see https://github.com/OpenKieler/klayjs
    addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
    aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
    borderSpacing: 20, // Minimal amount of space to be left to the border
    compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
    crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
    /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
        INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
    cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
    /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
        INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values. */
    direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
    /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
    edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
    edgeSpacingFactor: 0.25, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
    feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
    fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
    /* NONE Chooses the smallest layout from the four possible candidates.
        LEFTUP Chooses the left-up candidate from the four possible candidates.
        RIGHTUP Chooses the right-up candidate from the four possible candidates.
        LEFTDOWN Chooses the left-down candidate from the four possible candidates.
        RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
        BALANCED Creates a balanced layout from the four possible candidates. */
    inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
    layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
    linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
    mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
    mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
    nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering.
    /* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
        LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
        INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
    nodePlacement: 'BRANDES_KOEPF', // Strategy for Node Placement
    /* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
        LINEAR_SEGMENTS Computes a balanced placement.
        INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
        SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
    randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
    routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
    separateConnectedComponents: true, // Whether each connected component should be processed separately
    spacing: 100, // Overall setting for the minimal amount of space to be left between objects
    thoroughness: 7 // How much effort should be spent to produce a nice layout..
  }
};

export const spread_options: cytoscape.SpreadLayoutOptions = {
  name: 'spread',
  animate: true, // whether to show the layout as it's running
  ready: undefined, // Callback on layoutready
  stop: undefined, // Callback on layoutstop
  fit: true, // Reset viewport to fit default simulationBounds
  minDist: 200, // Minimum distance between nodes
  padding: 20, // Padding
  expandingFactor: -1.0, // If the network does not satisfy the minDist
  // criterium then it expands the network of this amount
  // If it is set to -1.0 the amount of expansion is automatically
  // calculated based on the minDist, the aspect ratio and the
  // number of nodes
  maxFruchtermanReingoldIterations: 5000, // Maximum number of initial force-directed iterations
  maxExpandIterations: 250, // Maximum number of expanding iterations
  boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  randomize: false // uses random initial node positions on true
};

export const random_options: RandomLayoutOptions = {
  name: 'random',

  fit: true, // whether to fit to viewport
  padding: 20, // fit padding
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  animate: true, // whether to transition the node positions
  animationDuration: 1500, // duration of animation in ms if enabled
  // animationEasing: 'linear', // easing of animation if enabled
  // animateFilter: (node, i) => { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
  // transform: (node, position)=> { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
};

export const grid_options: cytoscape.GridLayoutOptions = {
  name: 'grid',

  fit: true, // whether to fit the viewport to the graph
  padding: 20, // padding used on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
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

export const circle_options: cytoscape.CircleLayoutOptions = {
  name: 'circle',
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
  nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  radius: undefined, // the radius of the circle
  startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  // sort:  (a, _b) => {
  //     return a.data('type') <= a.data('type')
  // }, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: true, // whether to transition the node positions
  animationDuration: 1500, // duration of animation in ms if enabled
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
};

export const concentric_options: cytoscape.IConcentricLayoutOptions = {
  name: 'concentric',
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 100, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
  height: undefined, // height of layout area (overrides container height)
  width: undefined, // width of layout area (overrides container width)
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  concentric: (node) => { // returns numeric value for each node, placing higher nodes in levels towards the centre
    return node.degree();
  },
  levelWidth: (nodes) => { // the letiation of concentric values in each level
    // return nodes.maxDegree() / 6;
    return nodes.maxDegree() / 8;
  },
  animate: true, // whether to transition the node positions
  animationDuration: 2000, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
};

export const breadthfirst_options: cytoscape.BreadthFirstLayoutOptions = {
  name: 'breadthfirst',
  fit: true, // whether to fit the viewport to the graph
  directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
  padding: 50, // padding on fit
  circle: true, // put depths in concentric circles if true, put depths top down if false
  spacingFactor: 2, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
  roots: undefined, // the roots of the trees
  maximalAdjustments: 5, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
  animate: true, // whether to transition the node positions
  animationDuration: 3000, // duration of animation in ms if enabled
  // animationEasing: 'ease-in-out', // easing of animation if enabled,
  // animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
};

export const dagre_options: any = {
  name: 'dagre',
  // dagre algo options, uses default value on undefined
  nodeSep: undefined, // the separation between adjacent nodes in the same rank
  edgeSep: undefined, // the separation between adjacent edges in the same rank
  rankSep: undefined, // the separation between adjacent nodes in the same rank
  rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
  ranker: 'network-simplex', // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
  minLen: (_edge: any) => 1, // number of ranks to keep between the source and target of the edge
  edgeWeight: (_edge: any) => 1, // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: true, // whether to fit to viewport
  padding: 30, // fit padding
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node (default true)
  animate: true, // whether to transition the node positions
  animateFilter: (_node: any, _i: any) => true, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animationDuration: 1500, // duration of animation in ms if enabled
  animationEasing: 'ease-in-out', // easing of animation if enabled
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  transform: (_node: any, pos: any) => pos, // a function that applies a transform to the final node position
  ready: () => { }, // on layoutready
  stop: () => { } // on layoutstop
};

export const euler_options: any = {
  name: 'euler',

  // The ideal length of a spring
  // - This acts as a hint for the edge length
  // - The edge length can be longer or shorter if the forces are set to extreme values
  springLength: (_edge: any) => 200,

  // Hooke's law coefficient
  // - The value ranges on [0, 1]
  // - Lower values give looser springs
  // - Higher values give tighter springs
  springCoeff: (_edge: any) => 0.0008,

  // The mass of the node in the physics simulation
  // - The mass affects the gravity node repulsion/attraction
  mass: (_node: any) => 4,

  // Coulomb's law coefficient
  // - Makes the nodes repel each other for negative values
  // - Makes the nodes attract each other for positive values
  gravity: -1.2,

  // A force that pulls nodes towards the origin (0, 0)
  // Higher values keep the components less spread out
  pull: 0.001,

  // Theta coefficient from Barnes-Hut simulation
  // - Value ranges on [0, 1]
  // - Performance is better with smaller values
  // - Very small values may not create enough force to give a good result
  theta: 0.666,

  // Friction / drag coefficient to make the system stabilise over time
  dragCoeff: 0.02,

  // When the total of the squared position deltas is less than this value, the simulation ends
  movementThreshold: 1,

  // The amount of time passed per tick
  // - Larger values result in faster runtimes but might spread things out too far
  // - Smaller values produce more accurate results
  timeStep: 20,

  // The number of ticks per frame for animate:true
  // - A larger value reduces rendering cost but can be jerky
  // - A smaller value increases rendering cost but is smoother
  refresh: 10,

  // Whether to animate the layout
  // - true : Animate while the layout is running
  // - false : Just show the end result
  // - 'end' : Animate directly to the end result
  animate: true,

  // Animation duration used for animate:'end'
  animationDuration: 1500,

  // Easing for animate:'end'
  animationEasing: undefined,

  // Maximum iterations and time (in ms) before the layout will bail out
  // - A large value may allow for a better result
  // - A small value may make the layout end prematurely
  // - The layout may stop before this if it has settled
  maxIterations: 1000,
  maxSimulationTime: 4000,

  // Prevent the user grabbing nodes during the layout (usually with animate:true)
  ungrabifyWhileSimulating: true,

  // Whether to fit the viewport to the repositioned graph
  // true : Fits at end of layout for animate:false or animate:'end'; fits on each frame for animate:true
  fit: true,

  // Padding in rendered co-ordinates around the layout
  padding: 20,

  // Constrain layout bounds with one of
  // - { x1, y1, x2, y2 }
  // - { x1, y1, w, h }
  // - undefined / null : Unconstrained
  boundingBox: undefined,

  // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
  ready: () => { }, // on layoutready
  stop: () => { }, // on layoutstop

  // Whether to randomize the initial positions of the nodes
  // true : Use random positions within the bounding box
  // false : Use the current node positions as the initial positions
  randomize: false
};

export type LayoutsType = Record<string, LayoutOptions>;

export const layouts: LayoutsType = {
  spread: spread_options,
  cola: cola_layout_options,
  cose: cose_options,
  cose_bilkent: cose_bilkent_options,
  klay: klay_options,
  dagre: dagre_options,
  euler: euler_options,
  // ngraph: ngraph_options,
  random: random_options,
  grid: grid_options,
  circle: circle_options,
  concentric: concentric_options,
  breadthfirst: breadthfirst_options
};

export interface ViewUtilitiesOptions {
  node: {
    highlighted: any; // styles for when nodes are highlighted.
    unhighlighted: any; // styles for when nodes are unhighlighted.
  };
  edge: {
    highlighted: any; // styles for when edges are highlighted.
    unhighlighted: any; // styles for when edges are unhighlighted.
  };
  setVisibilityOnHide?: boolean; // whether to set visibility on hide/show
  setDisplayOnHide?: boolean; // whether to set display on hide/show
  neighbor?: any; // return desired neighbors of tapheld node

  neighborSelectTime?: number; // ms, time to taphold to select desired neighbors
  searchBy?: string[];
}
