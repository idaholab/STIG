# cytoscape-euler

[![Join the chat at https://gitter.im/cytoscape-js-euler/Lobby](https://badges.gitter.im/cytoscape-js-euler/Lobby.svg)](https://gitter.im/cytoscape-js-euler/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![DOI](https://zenodo.org/badge/91359702.svg)](https://zenodo.org/badge/latestdoi/91359702)



## Description

Euler is a fast, high-quality force-directed (physics simulation) layout for Cytoscape.js ([demo](https://cytoscape.github.io/cytoscape.js-euler))

It is based on cytoscape-ngraph.forcelayout, with several parts reworked and several general improvements.


## Dependencies

 * cytoscape@^3.0.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-euler`,
 * via bower: `bower install cytoscape-euler`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import euler from 'cytoscape-euler';

cytoscape.use( euler );
```

CommonJS:

```js
let cytoscape = require('cytoscape');
let euler = require('cytoscape-euler');

cytoscape.use( euler );
```

AMD:

```js
require(['cytoscape', 'cytoscape-euler'], function( cytoscape, euler ){
  euler( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

Specify an options object with `name: 'euler'` to run the layout.  All other fields are optional.  An example with the default options follows:

```js
let defaults = {
  name: 'euler',

  // The ideal length of a spring
  // - This acts as a hint for the edge length
  // - The edge length can be longer or shorter if the forces are set to extreme values
  springLength: edge => 80,

  // Hooke's law coefficient
  // - The value ranges on [0, 1]
  // - Lower values give looser springs
  // - Higher values give tighter springs
  springCoeff: edge => 0.0008,

  // The mass of the node in the physics simulation
  // - The mass affects the gravity node repulsion/attraction
  mass: node => 4,

  // Coulomb's law coefficient
  // - Makes the nodes repel each other for negative values
  // - Makes the nodes attract each other for positive values
  gravity: -1.2,

  // A force that pulls nodes towards the origin (0, 0)
  // Higher values keep the components less spread out
  pull: 0.001,

  // Theta coefficient from Barnes-Hut simulation
  // - Value ranges on [0, 1]
  // - Performance is better with smaller values
  // - Very small values may not create enough force to give a good result
  theta: 0.666,

  // Friction / drag coefficient to make the system stabilise over time
  dragCoeff: 0.02,

  // When the total of the squared position deltas is less than this value, the simulation ends
  movementThreshold: 1,

  // The amount of time passed per tick
  // - Larger values result in faster runtimes but might spread things out too far
  // - Smaller values produce more accurate results
  timeStep: 20,

  // The number of ticks per frame for animate:true
  // - A larger value reduces rendering cost but can be jerky
  // - A smaller value increases rendering cost but is smoother
  refresh: 10,

  // Whether to animate the layout
  // - true : Animate while the layout is running
  // - false : Just show the end result
  // - 'end' : Animate directly to the end result
  animate: true,

  // Animation duration used for animate:'end'
  animationDuration: undefined,

  // Easing for animate:'end'
  animationEasing: undefined,

  // Maximum iterations and time (in ms) before the layout will bail out
  // - A large value may allow for a better result
  // - A small value may make the layout end prematurely
  // - The layout may stop before this if it has settled
  maxIterations: 1000,
  maxSimulationTime: 4000,

  // Prevent the user grabbing nodes during the layout (usually with animate:true)
  ungrabifyWhileSimulating: false,

  // Whether to fit the viewport to the repositioned graph
  // true : Fits at end of layout for animate:false or animate:'end'; fits on each frame for animate:true
  fit: true,

  // Padding in rendered co-ordinates around the layout
  padding: 30,

  // Constrain layout bounds with one of
  // - { x1, y1, x2, y2 }
  // - { x1, y1, w, h }
  // - undefined / null : Unconstrained
  boundingBox: undefined,

  // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
  ready: function(){}, // on layoutready
  stop: function(){}, // on layoutstop

  // Whether to randomize the initial positions of the nodes
  // true : Use random positions within the bounding box
  // false : Use the current node positions as the initial positions
  randomize: false
};

cy.layout( defaults ).run();
```


## Build instructions

* `npm run build` : Build `./src/**` into `cytoscape-euler.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run dev` : Automatically build on changes with live reloading with webpack dev server
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build:release`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-euler https://github.com/cytoscape/cytoscape.js-euler.git`
1. [Make a release on GitHub](https://github.com/cytoscape/cytoscape.js-euler/releases/new) to automatically register a new Zenodo DOI
