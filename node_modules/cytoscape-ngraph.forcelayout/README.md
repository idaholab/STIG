cytoscape-cytoscape-ngraph.forcelayout
================================================================================


## Description

cytoscape-ngraph.forcelayout


## Dependencies

 * Cytoscape.js >=x.y.z
 * <List your dependencies here please>


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-ngraph.forcelayout`,
 * via bower: `bower install cytoscape-ngraph.forcelayout`, or
 * via direct download in the repository (probably from a tag).

`require()` the library as appropriate for your project:

CommonJS:
```js
var cytoscape = require('cytoscape');
var cyforcelayout = require('cytoscape-ngraph.forcelayout');

cyforcelayout( cytoscape ); // register extension
```

AMD:
```js
require(['cytoscape', 'cytoscape-ngraph.forcelayout'], function( cytoscape, cyforcelayout ){
  cyforcelayout( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

Please briefly describe your API here:

```js
cy.cyforcelayout({
    async: {
                 // tell layout that we want to compute all at once:
                 maxIterations: 1000,
                 stepsPerCycle: 30,
 
                 // Run it till the end:
                 waitForStep: false
             },
             physics: {
                 /**
                  * Ideal length for links (springs in physical model).
                  */
                 springLength: 100,
 
                 /**
                  * Hook's law coefficient. 1 - solid spring.
                  */
                 springCoeff: 0.0008,
 
                 /**
                  * Coulomb's law coefficient. It's used to repel nodes thus should be negative
                  * if you make it positive nodes start attract each other :).
                  */
                 gravity: -1.2,
 
                 /**
                  * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
                  * The closer it's to 1 the more nodes algorithm will have to go through.
                  * Setting it to one makes Barnes Hut simulation no different from
                  * brute-force forces calculation (each node is considered).
                  */
                 theta: 0.8,
 
                 /**
                  * Drag force coefficient. Used to slow down system, thus should be less than 1.
                  * The closer it is to 0 the less tight system will be.
                  */
                 dragCoeff: 0.02,
 
                 /**
                  * Default time step (dt) for forces integration
                  */
                 timeStep: 20,
                 iterations: 10000,
                 fit: true,
 
                 /**
                  * Maximum movement of the system which can be considered as stabilized
                  */
                 stableThreshold: 0.000009
             },
             iterations: 10000,
             refreshInterval: 16, // in ms
             refreshIterations: 10, // iterations until thread sends an update
             stableThreshold: 2,
             animate: true,
             fit: true
});
```




## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Set the version number environment variable: `export VERSION=1.2.3`
1. Publish: `gulp publish`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-ngraph.forcelayout https://github.com/nickoasmv/cytoscape-ngraph.forcelayout.git`
