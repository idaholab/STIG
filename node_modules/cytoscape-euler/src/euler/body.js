const defaults = Object.freeze({
  pos: { x: 0, y: 0 },
  prevPos: { x: 0, y: 0 },
  force: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  mass: 1
});

const copyVec = v => ({ x: v.x, y: v.y });
const getValue = ( val, def ) => val != null ? val : def;
const getVec = ( vec, def ) => copyVec( getValue( vec, def ) );

function makeBody( opts ){
  let b = {};

  b.pos = getVec( opts.pos, defaults.pos );
  b.prevPos = getVec( opts.prevPos, b.pos );
  b.force = getVec( opts.force, defaults.force );
  b.velocity = getVec( opts.velocity, defaults.velocity );
  b.mass = opts.mass != null ? opts.mass : defaults.mass;
  b.locked = opts.locked;

  return b;
}

module.exports = { makeBody };
