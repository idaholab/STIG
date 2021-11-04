var harness = require('tap'),
    createQuadTree = require('../'),
    Body = require('ngraph.physics.primitives').Body3d;

harness.test('insert and update update forces', function (t) {
  var tree = createQuadTree();
  var body = new Body();
  var clone = JSON.parse(JSON.stringify(body));

  tree.insertBodies([body]);
  tree.updateBodyForce(body);
  t.equivalent(body, clone, "The body should not be changed - there are no forces acting on it");
  t.end();
});

harness.test('Two bodies repel each other', function (t) {
  var tree = createQuadTree();
  var bodyA = new Body(); bodyA.pos.x = 0; bodyA.pos.y = 0; bodyA.pos.z = 1;
  var bodyB = new Body(); bodyB.pos.x = 0; bodyB.pos.y = 0; bodyB.pos.z = 2;
  debugger;

  tree.insertBodies([bodyA, bodyB]);
  tree.updateBodyForce(bodyA);
  tree.updateBodyForce(bodyB);
  // based on our physical model construction forces should be equivalent, with
  // opposite sign:
  t.ok(bodyA.force.z + bodyB.force.z === 0, "Forces should be equivalent, with opposite sign");
  t.ok(bodyA.force.z !== 0, 'Z-force for body A should not be zero');
  t.ok(bodyB.force.z !== 0, 'Z-force for body B should not be zero');
  // On the other hand, our bodies should not move by Y axis:
  t.ok(bodyA.force.y === 0, 'Y-force for body A should be zero');
  t.ok(bodyB.force.y === 0, 'Y-force for body B should be zero');
  t.ok(bodyA.force.x === 0, 'X-force for body A should be zero');
  t.ok(bodyB.force.x === 0, 'X-force for body B should be zero');

  t.end();
});

harness.test('Can handle two bodies at the same location', function (t) {
  var tree = createQuadTree();
  var bodyA = new Body();
  var bodyB = new Body();

  tree.insertBodies([bodyA, bodyB]);
  tree.updateBodyForce(bodyA);
  tree.updateBodyForce(bodyB);

  t.end();
});
