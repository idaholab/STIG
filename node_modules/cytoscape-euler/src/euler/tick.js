const { integrate } = require('./integrate');
const { applyDrag } = require('./drag');
const { applySpring } = require('./spring');

function tick({ bodies, springs, quadtree, timeStep, gravity, theta, dragCoeff, pull }){
  // update body from scratch in case of any changes
  bodies.forEach( body => {
    let p = body._scratch;

    if( !p ){ return; }

    body.locked = p.locked;
    body.grabbed = p.grabbed;
    body.pos.x = p.x;
    body.pos.y = p.y;
  } );

  quadtree.insertBodies( bodies );

  for( let i = 0; i < bodies.length; i++ ){
    let body = bodies[i];

    quadtree.updateBodyForce( body, gravity, theta, pull );
    applyDrag( body, dragCoeff );
  }

  for( let i = 0; i < springs.length; i++ ){
    let spring = springs[i];

    applySpring( spring );
  }

  let movement = integrate( bodies, timeStep );

  // update scratch positions from body positions
  bodies.forEach( body => {
    let p = body._scratch;

    if( !p ){ return; }

    p.x = body.pos.x;
    p.y = body.pos.y;
  } );

  return movement;
}

module.exports = { tick };
