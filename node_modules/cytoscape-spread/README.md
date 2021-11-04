cytoscape-spread
================================================================================
[![DOI](https://zenodo.org/badge/42206822.svg)](https://zenodo.org/badge/latestdoi/42206822)

## Description

The Spread physics simulation layout for Cytoscape.js ([demo](https://cytoscape.github.io/cytoscape.js-spread/))

The spread layout uses a force-directed physics simulation with several external libraries.  The layout tries to keep elements spread out evenly, making good use of constrained space.

The layout makes use of [CoSE](http://js.cytoscape.org/#layouts/cose) (MIT) and [`rhill-voronoi-core.js`](https://github.com/gorhill/Javascript-Voronoi) (MIT).  CoSE is already bundled in Cytoscape.js, and `rhill-voronoi-core.js` is bundled in `cytoscape-spread`.

There are two phases to this layout:

(1) A force-directed layout provides initial positions for the nodes.  By default, the embedded version of CoSE is used, because it is fast and because it does not increase your app's bundle size any more than using Cytoscape.js itself.  You can use an alternative layout by specifying `options.prelayout` with the layout options you want to use for the first phase (e.g. `{ name: 'grid' }`).  Alternatively, you can specify `options.prelayout: false` (falsey) to just use the node's existing positions for the first phase.

(2) Voronoi is used to spread out the nodes in the remaining space.

Note that since you are composing layouts with phase (1), where `options.prelayout` is non-falsey, you will have more layout events.  For example, you will have more than one `layoutstop` event -- one for the Spread layout overall and one for the prelayout within phase (1) of Spread.

If you skip phase (1) with `options.prelayout` falsey, you will not get extra events within Spread.  You can use promise chaining with two layouts to get the same effect as running a layout in phase (1), i.e.:

```js
var layout1 = cy.makeLayout({ name: 'cose' });
var layout2 = cy.makeLayout({ name: 'spread', prelayout: false });

var run = function(l){
  var p = l.promiseOn('layoutstop');

  l.run();

  return p;
};

(
  Promise.resolve()
  .then(function(){ return run(layout1); })
  .then(function(){ return run(layout2); })
  .then(function(){ console.log('done 1 and 2') })
);
```

## Dependencies

 * Cytoscape.js ^2.5.0 || ^3.0.0
 * Weaver.js ^1.2.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-spread`,
 * via bower: `bower install cytoscape-spread`, or
 * via direct download in the repository (probably from a tag).

`require()` the library as appropriate for your project:

CommonJS:
```js
var cytoscape = require('cytoscape');
var spread = require('cytoscape-spread');

spread( cytoscape ); // register extension
```

AMD:
```js
require(['cytoscape', 'cytoscape-spread', 'weaverjs'], function( cytoscape, spread, weaver ){
  spread( cytoscape, weaver ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed. However, the weaverjs library must be included as well.


## API

Call the layout, e.g. `cy.layout({ name: 'spread', ... })`, with options:

```js
var defaults = {
  animate: true, // Whether to show the layout as it's running
  ready: undefined, // Callback on layoutready
  stop: undefined, // Callback on layoutstop
  fit: true, // Reset viewport to fit default simulationBounds
  minDist: 20, // Minimum distance between nodes
  padding: 20, // Padding
  expandingFactor: -1.0, // If the network does not satisfy the minDist
  // criterium then it expands the network of this amount
  // If it is set to -1.0 the amount of expansion is automatically
  // calculated based on the minDist, the aspect ratio and the
  // number of nodes
  prelayout: { name: 'cose' }, // Layout options for the first phase
  maxExpandIterations: 4, // Maximum number of expanding iterations
  boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  randomize: false // Uses random initial node positions on true
};
```


## Build targets

* `npm run test` : Run Mocha tests in `./test`
* `npm run build` : Build `./src/**` into `cytoscape-spread.js`
* `npm run watch` : Automatically rebuild on source changes
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build:release`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-spread https://github.com/cytoscape/cytoscape.js-spread.git`
1. [Make a new release](https://github.com/cytoscape/cytoscape.js-spread/releases/new) for Zenodo.
