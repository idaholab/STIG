const assign = require('../assign');

const defaults = Object.freeze({
  source: null,
  target: null,
  length: 80,
  coeff: 0.0002,
  weight: 1
});

function makeSpring( spring ){
  return assign( {}, defaults, spring );
}

function applySpring( spring ){
  let body1 = spring.source,
      body2 = spring.target,
      length = spring.length < 0 ? defaults.length : spring.length,
      dx = body2.pos.x - body1.pos.x,
      dy = body2.pos.y - body1.pos.y,
      r = Math.sqrt(dx * dx + dy * dy);

  if (r === 0) {
      dx = (Math.random() - 0.5) / 50;
      dy = (Math.random() - 0.5) / 50;
      r = Math.sqrt(dx * dx + dy * dy);
  }

  let d = r - length;
  let coeff = ((!spring.coeff || spring.coeff < 0) ? defaults.springCoeff : spring.coeff) * d / r * spring.weight;

  body1.force.x += coeff * dx;
  body1.force.y += coeff * dy;

  body2.force.x -= coeff * dx;
  body2.force.y -= coeff * dy;
}

module.exports = { makeSpring, applySpring };
