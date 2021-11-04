# ngraph.quadtreebh3d

Quad Tree data structure for Barnes-Hut simulation in 3d space. Technically it should be named OctTree, since it's not a quad tree. But for parity with 2d interface it's currently called quadtree. Let me know if you think it should be changed :). 

This project is part of [ngraph family](https://github.com/anvaka/ngraph). If you need 2d quad tree follow to [ngraph.quadtreebh](https://github.com/anvaka/ngraph.quadtreebh).

[![Build Status](https://travis-ci.org/anvaka/ngraph.quadtreebh3d.png?branch=master)](https://travis-ci.org/anvaka/ngraph.quadtreebh3d). 

Reference
---------
1. [Fast Hierarchical Methods for the N-body Problem](http://www.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html) - one of the best explanations of Barnes-Hut method by James Demmel.
2. [Wikipedia article](http://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) - general introduction into the problem

Usage
=====
``` js
var Body = require('ngraph.physics.primitives').Body3d;
// Create new bodies at (1, 1, 1) and (0, 0, 0):
var bodies = [];
bodies.push(new Body(1, 1, 1));
bodies.push(new Body(0, 0, 0));
/* ... create more as you need ... */

// build quad tree:
var createQuadTree = require('ngraph.quadtreebh3d');
var quadTree = createQuadTree();

// insert bodies into the quad tree 
quadTree.insertBodies(bodies); // performance: O(n * log n)

// calculate forces acting on each body in the tree O(n * log n):
bodies.forEach(function(body) {
  quadTree.updateBodyForce(body);
});
// At this point every body object has valid 3d force vecor
console.dir(bodies[0].force);
```

_Note:_ You don't necessary have to use [ngraph.physics.primitives](https://github.com/anvaka/ngraph.physics.primitives). That package merely defines an interface for a physical Body, which is expected by quad tree. As long as your Body object implements this interface (`mass`, `pos` and `force`) - you can use current quad tree structure to calculate forces.

Configuring quad tree
=====================
Quad tree allows to change two global options:

* `gravity` - [Gravitational constant](http://en.wikipedia.org/wiki/Gravitational_constant), used in force value calculation. Defaults to `-1`;
* `theta` - a threshold which determines when group of bodies is considered distant enough to be approximated as a single body. The value should be `> 0`, and usually little less than `1`. It defaults to `0.8` if not suplied. This argument affects accuracy and speed of simulation. Please refer to [\[1\]](http://www.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html) for more details.

You can pass these setting to quad tree as follows:
``` js
var createQuadTree = require('ngraph.quadtreebh3d');
var quadTree = createQuadTree({
  theta: 1.2,
  gravity: -10
});
```

To query current options of the tree use:
``` js
var createQuadTree = require('ngraph.quadtreebh3d');
var quadTree = createQuadTree();
console.dir(quadTree.options()); // prints { theta: 0.8, gravity: -1};
```

To change options at run time:
``` js
var createQuadTree = require('ngraph.quadtreebh3d');
var quadTree = createQuadTree();
quadTree.options({
  theta: 0.5,
  gravity: -42
});
```

Mass of each body affects overall result of computation. You can tweak it when creating new bodies:

``` js
var Body = require('ngraph.physics.primitives').Body;
var earth = new Body(); earth.mass = 5.972;
var sun   = new Body(); sun.mass = 1989000;
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.quadtreebh3d
```

# license

MIT
