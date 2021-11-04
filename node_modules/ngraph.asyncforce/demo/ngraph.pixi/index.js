/**
 * This demo shows how to compute layout in webworker in combination with
 * ngraph.pixi library
 */
var asyncLayout = require('../../index.js');
var createRenderer = require('ngraph.pixi');

var graph = makeGraphFromQueryString();

// create instance of async layout
var layout = asyncLayout(graph);

// And pass it to the pixi renderer:
var renderer = createRenderer(graph, {
  layout: layout,
});

// gp pixi, go
renderer.run();
return;

function makeGraphFromQueryString() {
  var query = require('query-string').parse(window.location.search.substring(1));
  var graphGenerators = require('ngraph.generators');
  var createGraph = graphGenerators[query.graph] || graphGenerators.grid3;

  return createGraph(getNumber(query.n), getNumber(query.m), getNumber(query.k));

  function getNumber(string, defaultValue) {
    var number = parseFloat(string);
    return (typeof number === 'number') && !isNaN(number) ? number : (defaultValue || 10);
  }
}
