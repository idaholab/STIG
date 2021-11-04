var test = require('tap').test,
    createSimulator = require('..'),
    physics = require('ngraph.physics.primitives');

test('Can step without bodies', function (t) {
  var simulator = createSimulator();
  t.equals(simulator.bodies.length, 0, 'There should be no bodies');
  t.equals(simulator.springs.length, 0, 'There should be no springs');
  simulator.step(1);
  t.end();
});

test('it has settings exposed', function(t) {
  var mySettings = { };
  var simulator = createSimulator(mySettings);
  t.ok(mySettings === simulator.settings, 'settings are exposed');
  t.end();
});

test('Does not update position of one body', function (t) {
  var simulator = createSimulator();
  var body = new physics.Body(0, 0);
  simulator.addBody(body);

  simulator.step(1);
  t.equals(simulator.bodies.length, 1, 'Number of bodies is 1');
  t.equals(simulator.springs.length, 0, 'Number of springs is 0');
  t.equals(simulator.bodies[0], body, 'Body points to actual object');
  t.equals(body.pos.x, 0, 'X is not changed');
  t.equals(body.pos.y, 0, 'Y is not changed');
  t.end();
});

test('Can configure foorces', function (t) {
  t.test('Gravity', function (t) {
    var simulator = createSimulator();
    var body1 = new physics.Body(0, 0);
    var body2 = new physics.Body(1, 0);

    simulator.addBody(body1);
    simulator.addBody(body2);

    simulator.step();
    // by default gravity is negative, bodies should repel each other:
    var x1 = body1.pos.x;
    var x2 = body2.pos.x;
    t.ok(x1 < 0, 'Body 1 moves away from body 2');
    t.ok(x2 > 1, 'Body 2 moves away from body 1');

    // now reverse gravity, and bodies should attract each other:
    simulator.gravity(100);
    simulator.step();
    t.ok(body1.pos.x > x1, 'Body 1 moved towards body 2');
    t.ok(body2.pos.x < x2, 'Body 2 moved towards body 1');

    t.end();
  });

  t.test('Drag', function (t) {
    var simulator = createSimulator();
    var body1 = new physics.Body(0, 0);
    body1.velocity.x = -1; // give it small impulse
    simulator.addBody(body1);

    simulator.step();

    var x1 = body1.velocity.x;
    // by defauld drag force will slow down entire system:
    t.ok(x1 > -1, 'Body 1 moves at reduced speed');

    // Restore original velocity, but now set drag force to 0
    body1.velocity.x = -1;
    simulator.dragCoeff(0);
    simulator.step();
    t.ok(body1.velocity.x === -1, 'Velocity should remain unchanged');
    t.end();
  });
  t.end();
});

test('Can remove bodies', function (t) {
  var simulator = createSimulator();
  var body = new physics.Body(0, 0);
  simulator.addBody(body);
  t.equals(simulator.bodies.length, 1, 'Number of bodies is 1');
  var result = simulator.removeBody(body);
  t.equals(result, true, 'body succesfully removed');
  t.equals(simulator.bodies.length, 0, 'Number of bodies is 0');
  t.end();
});

test('Updates position for two bodies', function (t) {
  var simulator = createSimulator();
  var body1 = new physics.Body(-1, 0);
  var body2 = new physics.Body(1, 0);
  simulator.addBody(body1);
  simulator.addBody(body2);

  simulator.step(1);
  t.equals(simulator.bodies.length, 2, 'Number of bodies is 2');
  t.ok(body1.pos.x !== 0, 'Body1.X has changed');
  t.ok(body2.pos.x !== 0, 'Body2.X has changed');

  t.equals(body1.pos.y, 0, 'Body1.Y has not changed');
  t.equals(body2.pos.y, 0, 'Body2.Y has not changed');
  t.end();
});

test('add spring should not add bodies', function (t) {
  var simulator = createSimulator();
  var body1 = new physics.Body(-1, 0);
  var body2 = new physics.Body(1, 0);

  simulator.addSpring(body1, body2, 10);

  t.equals(simulator.bodies.length, 0, 'Should not add two bodies');
  t.equals(simulator.bodies.length, 0, 'Should not add two bodies');
  t.equals(simulator.springs.length, 1, 'Should have a spring');
  t.end();
});

test('Spring affects bodies positions', function (t) {
  var simulator = createSimulator();
  var body1 = new physics.Body(-10, 0);
  var body2 = new physics.Body(10, 0);
  simulator.addBody(body1);
  simulator.addBody(body2);
  // If you take this out, bodies will repel each other:
  simulator.addSpring(body1, body2, 1);

  simulator.step(1);

  t.ok(body1.pos.x > -10, 'Body 1 should move towards body 2');
  t.ok(body2.pos.x < 10, 'Body 2 should move towards body 1');

  t.end();
});

test('Can remove springs', function (t) {
  var simulator = createSimulator();
  var body1 = new physics.Body(-10, 0);
  var body2 = new physics.Body(10, 0);
  simulator.addBody(body1);
  simulator.addBody(body2);
  var spring = simulator.addSpring(body1, body2, 1);
  simulator.removeSpring(spring);

  simulator.step(1);

  t.ok(body1.pos.x < -10, 'Body 1 should move away from body 2');
  t.ok(body2.pos.x > 10, 'Body 2 should move away from body 1');

  t.end();
});

test('Get bounding box', function (t) {
  var simulator = createSimulator();
  var body1 = new physics.Body(0, 0);
  var body2 = new physics.Body(10, 10);
  simulator.addBody(body1);
  simulator.addBody(body2);
  simulator.step(); // this will move bodies farther away
  var bbox = simulator.getBBox();
  t.ok(bbox.x1 <= 0, 'Left is 0');
  t.ok(bbox.y1 <= 0, 'Top is 0');
  t.ok(bbox.x2 >= 10, 'right is 10');
  t.ok(bbox.y2 >= 10, 'bottom is 10');
  t.end();
});

test('Get best position', function (t) {
  t.test('can get with empty simulator', function (t) {
    var simulator = createSimulator();
    var empty = simulator.getBestNewBodyPosition([]);
    t.ok(typeof empty.x === 'number', 'Has X');
    t.ok(typeof empty.y === 'number', 'Has Y');

    t.end();
  });

  t.end();
});
