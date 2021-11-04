const assign = require('../assign');

let setInitialPositionState = function( node, state ){
  let p = node.position();
  let bb = state.currentBoundingBox;
  let scratch = node.scratch( state.name );

  if( scratch == null ){
    scratch = {};

    node.scratch( state.name, scratch );
  }

  assign( scratch, state.randomize ? {
    x: bb.x1 + Math.random() * bb.w,
    y: bb.y1 + Math.random() * bb.h
  } : {
    x: p.x,
    y: p.y
  } );

  scratch.locked = node.locked();
};

let getNodePositionData = function( node, state ){
  return node.scratch( state.name );
};

let refreshPositions = function( nodes, state ){
  nodes.positions(function( node ){
    let scratch = node.scratch( state.name );

    return {
      x: scratch.x,
      y: scratch.y
    };
  });
};

module.exports = { setInitialPositionState, getNodePositionData, refreshPositions };
