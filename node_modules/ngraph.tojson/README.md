# ngraph.tojson

Library to store graph into simple json format

[![Build Status](https://travis-ci.org/anvaka/ngraph.tojson.svg)](https://travis-ci.org/anvaka/ngraph.tojson)
# usage

``` javascript
var graph = require('ngraph.graph')();
graph.addLink('hello', 'world');

var toJSON = require('ngraph.tojson');
console.log(toJSON(graph));

// Produces output:
// {"nodes":[{"id":"hello"},{"id":"world"}],"links":[{"fromId":"hello","toId":"world"}]}
```

You can also provide a custom transform function to transform nodes/edges before
they are pushed to the output:


``` javascript
var g = require('ngraph.graph')();
g.addNode(1, { name: 'John' });
g.addNode(2, { name: 'Jim' });

graph.addLink(1, 2, 'Father');

var json = toJSON(g,
  function nodeTransform(node) {
    return [node.id, node.data];
  },
  function linkTransform(link) {
    return [link.fromId, link.toId, link.data];
  });

console.log(json);
// This will produce array of arrays for nodes:
// {
//   "nodes": [
//             [1, {"name": "John"}],
//             [2, {"name": "Jim"}]
//            ],
//   "links": [[1, 2, "Father"]]
// }
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.tojson
```

# license

MIT
