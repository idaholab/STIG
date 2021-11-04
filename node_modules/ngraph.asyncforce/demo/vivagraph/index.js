var asyncLayout = require('../../index.js');
var Viva = require('vivagraphjs');

var graph = makeGraphFromQueryString();

// we will run compute graph layout offline, and after 100 iterations will
// use constant layout from vivagraph.
// we want to have 150 iterations total
var iterationsToCompute = 150;
// and get notification after each 10th iterations:
var stepsPerCycle = 10;

var layout = asyncLayout(graph, {
  async: {
    maxIterations: iterationsToCompute,
    stepsPerCycle: stepsPerCycle,

    // Run it till the end:
    waitForStep: false
  }
});

layout.on('cycle', onCycle);

function onCycle(completedIterations, isStable) {
  if (completedIterations >= iterationsToCompute || isStable) {
    renderGraph();
  } else {
    document.getElementById('progress').innerHTML = 'Completed ' + completedIterations + '/' + iterationsToCompute ;
  }
}

function renderGraph() {
  var constantLayout = Viva.Graph.Layout.constant(graph);
  constantLayout.placeNode(function(node) {
    return layout.getNodePosition(node.id);
  });
  var graphics = Viva.Graph.View.webglGraphics();
  var renderer = Viva.Graph.View.renderer(graph, {
    layout: constantLayout, // use our custom 'constant' layout
    graphics: graphics
  });
  renderer.run();
}

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
