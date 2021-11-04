# Physics for ngraph

This is a physics module for [ngraph](https://github.com/anvaka/ngraph). Its primary focus is to serve force based graph layout, thus it manages a naïve system of bodies and springs. 

Simulator calculates forces acting on each body and then deduces their position via Newton's law. There are three major forces in the system:

1. Spring force keeps connected nodes together via [Hooke's law](http://en.wikipedia.org/wiki/Hooke's_law)
2. Each body repels each other via [Coulomb's law](http://en.wikipedia.org/wiki/Coulomb's_law)
3. To guarantee we get to "stable" layout system has kind of a drag force which slows entire simulation down.

Body forces are calculated in `n*lg(n)` time with help of Barnes-Hut algorithm implemented in [quadtree module](https://github.com/anvaka/ngraph.quadtreebh). [Euler method](http://en.wikipedia.org/wiki/Euler_method) is then used to solve ordinary differential equation of Newton's law and get position of bodies.

[![build status](https://secure.travis-ci.org/anvaka/ngraph.physics.simulator.png)](http://travis-ci.org/anvaka/ngraph.physics.simulator)

# quickstart

``` js
var physics = require('ngraph.physics.primitives');
var body1 = new physics.Body(0, 0);
var body2 = new physics.Body(1, 0);

var simulator = require('ngraph.physics.simulator');
simulator.addBody(body1);
simulator.addBody(body2);

simulator.step();
```

This will move apart two bodies.

For more advanced use cases, please look inside `index.js`, which includes documentation for public API and describes engine configuration properties.

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.physics.simulator
```

# todo

I spent countless hours trying to optimize performance of this module but it's not perfect. Ideally I'd love to use native arrays to simulate physics. Eventually this will allow to calculate forces on video card or via webworkers.

# license

MIT
