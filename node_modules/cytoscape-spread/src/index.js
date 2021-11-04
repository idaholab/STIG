'use strict';

// registers the extension on a cytoscape lib ref
var Layout = require('./layout');

var register = function( cytoscape ){
  cytoscape('layout', 'spread', Layout);
};

if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( cytoscape );
}

module.exports = register;
