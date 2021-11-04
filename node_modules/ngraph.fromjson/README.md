# ngraph.fromjson

Library to load graph from simple json format

[![Build Status](https://travis-ci.org/anvaka/ngraph.fromjson.svg)](https://travis-ci.org/anvaka/ngraph.fromjson)

# usage

``` javascript
// JSON string can be produced by `ngraph.tojson` library
// https://github.com/anvaka/ngraph.tojson
var jsonString = ' {"nodes":[{"id":"hello"},{"id":"world"}],"links":[{"fromId":"hello","toId":"world"}]}'

var fromJSON = require('ngraph.fromjson');
var graph = fromJSON(jsonString)

graph.getNode('hello'); // returns a node;
graph.getLinksCount(); // 1
```

You can also provide custom transform functions for deserializer:

```
var jsonString = {
  "nodes":[[1,"Custom data"],[2,null]],"links":[[1,2,"Custom link data"]]
  };

var fromJSON = require('ngraph.fromjson');
// each element in the input json array is an array. Provide custom transformers
// to parse arrays:
var graph = fromJSON(jsonString,
  function nodeLoadTransform(node) {
    return { id: node[0], data: node[1] };
  },
  function linkLoadTransform(link) {
    return { fromId: link[0], toId: link[1], data: link[2] };
  });

graph.getNode(1); // returns a node, and its data is set to "Custom Data";
graph.hasLink(1, 2); // Returns link, and its data is set to "Custom link data"
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.fromjson
```

# license

MIT
