ngraph.physics.primitives
=========================

Module with basic 2d and 3d physics primitives for ngraph. It defines interface for physical bodies, used in [n-body](https://github.com/anvaka/ngraph.quadtreebh) simulation.

[![build status](https://secure.travis-ci.org/anvaka/ngraph.physics.primitives.png)](http://travis-ci.org/anvaka/ngraph.physics.primitives)
Examples
========

``` js
var physics = requrie('ngraph.physics.primitives');

var body = new physics.Body(); // create a new 2d body
console.dir(body.force); //  prints force value acting on this body
console.dir(body.pos);   // prints body's position in 2d space
console.log(body.mass);  // prints 1. Bodies should have a mass

var direction = new physics.Vector2d(); // create a 2d vector
console.log(direction.x, direction.y); // prints 0, 0

var spaceDirection = new physics.Vector3d(); // create a 3d vector
console.log(spaceDirection.x, spaceDirection.y, spaceDirection.z); // prints 0, 0, 0
```

Install
=======
```
npm install ngraph.physics.primitives
```

Why?
====
I created this module to declare clear interface for expected bodies in N-Body force simulation. You don't have to use it, as long as your `body` object have the same properties as described here.
