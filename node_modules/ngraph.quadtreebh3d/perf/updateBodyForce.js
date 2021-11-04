var Body = require('ngraph.physics.primitives').Body3d;
var Benchmark = require('benchmark');

var createQuadTree = require('../'),
    numberOfBodies = 10000;

console.log('Bodies #' + numberOfBodies);
var suite = new Benchmark.Suite;

// add tests
suite.add('Theta 1.2', function() {
  var bodies = createBodies(numberOfBodies);
  var quadTree = createQuadTree({theta: 1.2});
  quadTree.insertBodies(bodies);

  for (var j = 0; j < bodies.length; ++j) {
    quadTree.updateBodyForce(bodies[j]);
  }
})
.add('Theta 0.8', function() {
  var bodies = createBodies(numberOfBodies);
  var quadTree = createQuadTree({theta: 0.8});
  quadTree.insertBodies(bodies);

  for (var j = 0; j < bodies.length; ++j) {
    quadTree.updateBodyForce(bodies[j]);
  }
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

function createBodies(count) {
  var bodies = [];
  var random = require('ngraph.random').random(42);
  for(var i = 0; i < count; ++i) {
    bodies.push(createNewBody(random, count * 2));
  }
  return bodies;
}

function createNewBody(random, max){
  var body = new Body();
  body.force.x = random.nextDouble();
  body.force.y = random.nextDouble();
  body.force.z = random.nextDouble();
  body.pos.x = (max - random.next(max)) * 0.5;
  body.pos.y = (max - random.next(max)) * 0.5;
  body.pos.z = (max - random.next(max)) * 0.5;
  return body;
}
