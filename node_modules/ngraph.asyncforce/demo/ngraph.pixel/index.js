/**
 * This demo shows how to compute layout in webworker in combination with
 * ngraph.pixel library
 */
var asyncLayout = require('../../index.js');
var renderGraph = require('ngraph.pixel');

var graph = makeGraphFromQueryString();
var renderer = renderGraph(graph, {
  // createLayout is ngraph.pixel's way of providing custom layout. In this
  // case we are providing instance of ngraph.asyncforce as layout function
  createLayout: asyncLayout,

  // See ../../options.js for more options
  is3d: true
});

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
