var test = require('tap').test,
  Body = require('ngraph.physics.primitives').Body,
  createQuadTree = require('../');

test('it does not stuck', function(t) {

  var count = 60000;
  var bodies = [];

  for (var i = 0; i < count; ++i) {
    bodies.push(new Body(Math.random(), Math.random()));
  }

  var quadTree = createQuadTree();
  quadTree.insertBodies(bodies);

  bodies.forEach(function(body) {
    quadTree.updateBodyForce(body);
  });
  t.ok(1);
  t.end();
});
