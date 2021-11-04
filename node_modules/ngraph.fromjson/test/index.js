var test = require('tap').test,
  createGraph = require('ngraph.graph'),
  fromJSON = require('../');
toJSON = require('ngraph.tojson');

test('Can save and load graph', function(t) {
  var g = createGraph();
  g.addLink(1, 2);

  var loadedGraph = fromJSON(toJSON(g));

  t.ok(loadedGraph.getNode(1) && loadedGraph.getNode(2) && loadedGraph.getNodesCount() === 2, 'Should have all nodes');
  t.ok(loadedGraph.hasLink(1, 2) && loadedGraph.getLinksCount() === 1, 'Should have all links');

  t.end();
});

test('Can save and load graph with transform', function(t) {
  var g = createGraph();
  var nodeTransformCalledTimes = 0;
  var linkTransformCalledTimes = 0;

  g.addNode(1, 'Custom data');
  g.addLink(1, 2, 'Custom link data');

  var json = toJSON(g, nodeSaveTransform, linkSaveTransform);

  var loadedGraph = fromJSON(json, nodeLoadTransform, linkLoadTransform);

  t.ok(loadedGraph.getNode(1) && loadedGraph.getNode(2) && loadedGraph.getNodesCount() === 2, 'Should have all nodes');
  t.equals(loadedGraph.getNode(1).data, 'Custom data', 'Node data is loaded');
  t.ok(loadedGraph.hasLink(1, 2) && loadedGraph.getLinksCount() === 1, 'Should have all links');
  t.equals(loadedGraph.hasLink(1, 2).data, 'Custom link data', 'link data is loaded');
  t.ok(nodeTransformCalledTimes && linkTransformCalledTimes, 'Transform is called');
  t.end();

  function nodeLoadTransform(node) {
    nodeTransformCalledTimes += 1;

    return {
      id: node[0],
      data: node[1]
    };
  }

  function linkLoadTransform(link) {
    linkTransformCalledTimes += 1;

    return {
      fromId: link[0],
      toId: link[1],
      data: link[2]
    };
  }

  function nodeSaveTransform(node) {
    return [node.id, node.data];
  }

  function linkSaveTransform(link) {
    return [link.fromId, link.toId, link.data];
  }
});
