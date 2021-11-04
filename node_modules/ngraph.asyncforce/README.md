# ngraph.asyncforce

Force based graph layout with web workers. This module provides async layout
only. You will need to use it in combination with a renderer to get something
on the screen.

# usage

Layout can be computer in interactive and offline model.

In *interactive mode* you request the layout to perform `n` iterations per cycle.
This is most suitable for the use cases when you ask layout to compute positions
from `requestAnimationFrame()` callback. This will allow you to save CPU
cycles when users are not watching at the page and make a device battery life
longer.


``` js
// assume graph is an instance of ngraph.graph
// e.g.  var graph = require('ngraph.generators').grid(10, 10);
var createLayout = require('ngraph.asyncforce');

var layout = createLayout(graph);

function render() {
  requestAnimationFrame(render);
  // ... other stuff
  layout.step();
}
```

You can access positions of each node by calling a synchronous method:

``` js
var pos = layout.getNodePosition(nodeId);
assert(typeof pos.x === 'number' && typeof pos.y === 'number');
```

The `getNodePosition()` method will return last known position for the given
node id. You can use this value to provide interactive graph rendering.

In *offline mode* you don't care as much about battery life. All you need is
compute `N` iterations of the layout without blocking the main thread.

``` js
var iterationsToCompute = 150;
var layout = createLayout(graph, {
  async: {
    // tell layout that we want to compute all at once:
    maxIterations: iterationsToCompute,
    stepsPerCycle: iterationsToCompute,

    // Run it till the end:
    waitForStep: false
  }
});

layout.on('cycle', function() {
  graph.forEachNode(printPosition);
});

function printPosition(node) {
  console.log(node.id, layout.getNodePosition(node.id));
}
```

# demo

See [demo folder](https://github.com/anvaka/ngraph.asyncforce/tree/master/demo)
for examples in combination with various renderers.

I'm not using this module very often, and your suggestions for the API design
are very welcome!

# license

MIT
