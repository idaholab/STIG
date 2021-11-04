var test = require('tap').test,
    createGraph = require('ngraph.graph'),
    toJSON = require('..');

test('Can save graph', function (t) {
  var g = createGraph();
  g.addLink(1, 2);

  var storedJSON = toJSON(g);

  var loadedData = JSON.parse(storedJSON),
      links = loadedData.links,
      nodes = loadedData.nodes;

  t.equal(nodes.length, 2, "Stored data has two nodes");
  t.equal(links.length, 1, "Stored data has one link");
  t.equal(links[0].fromId, 1, "Link starts at correct node");
  t.equal(links[0].toId, 2, "Link ends at correct node");

  t.end();
});

test('Can save graph with transform', function(t) {
  var g = createGraph();

  g.addNode(1, 'Custom data');
  g.addLink(1, 2, 'Custom link data');

  var json = toJSON(g, nodeTransform, linkTransform);
  var parsedGraph = JSON.parse(json);

  t.equals(parsedGraph.nodes[0][0], 1, 'First node id should be stored in array');
  t.equals(parsedGraph.nodes[0][1], 'Custom data', 'First node id should be stored in array');
  t.equals(parsedGraph.links[0][1], 2, 'To link id should be stored in array');
  t.end();

  function nodeTransform(node) {
    return [node.id, node.data];
  }

  function linkTransform(link) {
    return [link.fromId, link.toId, link.data];
  }
});
