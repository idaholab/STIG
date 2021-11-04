/**
The implementation of the Euler layout algorithm
*/

const Layout = require('../layout');
const assign = require('../assign');
const defaults = require('./defaults');
const { tick } = require('./tick');
const { makeQuadtree } = require('./quadtree');
const { makeBody } = require('./body');
const { makeSpring } = require('./spring');
const isFn = fn => typeof fn === 'function';
const isParent = n => n.isParent();
const notIsParent = n => !isParent(n);
const isLocked = n => n.locked();
const notIsLocked = n => !isLocked(n);
const isParentEdge = e => isParent( e.source() ) || isParent( e.target() );
const notIsParentEdge = e => !isParentEdge(e);
const getBody = n => n.scratch('euler').body;
const getNonParentDescendants = n => isParent(n) ? n.descendants().filter( notIsParent ) : n;

const getScratch = el => {
  let scratch = el.scratch('euler');

  if( !scratch ){
    scratch = {};

    el.scratch('euler', scratch);
  }

  return scratch;
};

const optFn = ( opt, ele ) => {
  if( isFn( opt ) ){
    return opt( ele );
  } else {
    return opt;
  }
};

class Euler extends Layout {
  constructor( options ){
    super( assign( {}, defaults, options ) );
  }

  prerun( state ){
    let s = state;

    s.quadtree = makeQuadtree();

    let bodies = s.bodies = [];

    // regular nodes
    s.nodes.filter( n => notIsParent(n) ).forEach( n => {
      let scratch = getScratch( n );

      let body = makeBody({
        pos: { x: scratch.x, y: scratch.y },
        mass: optFn( s.mass, n ),
        locked: scratch.locked
      });

      body._cyNode = n;

      scratch.body = body;

      body._scratch = scratch;

      bodies.push( body );
    } );

    let springs = s.springs = [];

    // regular edge springs
    s.edges.filter( notIsParentEdge ).forEach( e => {
      let spring = makeSpring({
        source: getBody( e.source() ),
        target: getBody( e.target() ),
        length: optFn( s.springLength, e ),
        coeff: optFn( s.springCoeff, e )
      });

      spring._cyEdge = e;

      let scratch = getScratch( e );

      spring._scratch = scratch;

      scratch.spring = spring;

      springs.push( spring );
    } );

    // compound edge springs
    s.edges.filter( isParentEdge ).forEach( e => {
      let sources = getNonParentDescendants( e.source() );
      let targets = getNonParentDescendants( e.target() );

      // just add one spring for perf
      sources = [ sources[0] ];
      targets = [ targets[0] ];

      sources.forEach( src => {
        targets.forEach( tgt => {
          springs.push( makeSpring({
            source: getBody( src ),
            target: getBody( tgt ),
            length: optFn( s.springLength, e ),
            coeff: optFn( s.springCoeff, e )
          }) );
        } );
      } );
    } );
  }

  tick( state ){
    let movement = tick( state );

    let isDone = movement <= state.movementThreshold;

    return isDone;
  }
}

module.exports = Euler;
