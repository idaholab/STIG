;
(function () {
  'use strict';

  // registers the extension on a cytoscape lib ref
  var register = function (cytoscape) {

    if (!cytoscape) {
      return;
    } // can't register if cytoscape unspecified

    var options = {
      highlightStyles: [],
      selectStyles: {},
      setVisibilityOnHide: false, // whether to set visibility on hide/show
      setDisplayOnHide: true, // whether to set display on hide/show
      zoomAnimationDuration: 1500, //default duration for zoom animation speed
      neighbor: function (ele) { // return desired neighbors of tapheld node
        return false;
      },
      neighborSelectTime: 500, //ms, time to taphold to select desired neighbors
      lassoStyle: { lineColor: "#d67614", lineWidth: 3 },
      htmlElem4marqueeZoom: '', // should be string like `#cy` or `.cy`. `#cy` means get element with the ID 'cy'. `.cy` means the element with class 'cy' 
      marqueeZoomCursor: 'se-resize', // the cursor that should be used when marquee zoom is enabled. It can also be an image if a URL to an image is given 
      isShowEdgesBetweenVisibleNodes: true // When showing elements, show edges if both source and target nodes become visible
    };

    var undoRedo = require("./undo-redo");
    var viewUtilities = require("./view-utilities");

    cytoscape('core', 'viewUtilities', function (opts) {
      var cy = this;

      function getScratch(eleOrCy) {
        if (!eleOrCy.scratch("_viewUtilities")) {
          eleOrCy.scratch("_viewUtilities", {});
        }

        return eleOrCy.scratch("_viewUtilities");
      }

      // If 'get' is given as the param then return the extension instance
      if (opts === 'get') {
        return getScratch(cy).instance;
      }

      /**
      * Deep copy or merge objects - replacement for jQuery deep extend
      * Taken from http://youmightnotneedjquery.com/#deep_extend
      * and bug related to deep copy of Arrays is fixed.
      * Usage:Object.extend({}, objA, objB)
      */
      function extendOptions(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
          var obj = arguments[i];

          if (!obj)
            continue;

          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (Array.isArray(obj[key])) {
                out[key] = obj[key].slice();
              } else if (typeof obj[key] === 'object') {
                out[key] = extendOptions(out[key], obj[key]);
              } else {
                out[key] = obj[key];
              }
            }
          }
        }

        return out;
      };

      options = extendOptions({}, options, opts);

      // create a view utilities instance
      var instance = viewUtilities(cy, options);

      if (cy.undoRedo) {
        var ur = cy.undoRedo(null, true);
        undoRedo(cy, ur, instance);
      }

      // set the instance on the scratch pad
      getScratch(cy).instance = instance;

      if (!getScratch(cy).initialized) {
        getScratch(cy).initialized = true;

        var shiftKeyDown = false;
        document.addEventListener('keydown', function (event) {
          if (event.key == "Shift") {
            shiftKeyDown = true;
          }
        });
        document.addEventListener('keyup', function (event) {
          if (event.key == "Shift") {
            shiftKeyDown = false;
          }
        });
        //Select the desired neighbors after taphold-and-free
        cy.on('taphold', 'node, edge', function (event) {
          var target = event.target || event.cyTarget;
          var tapheld = false;
          var neighborhood;
          var timeout = setTimeout(function () {
            if (shiftKeyDown) {
              cy.elements().unselect();
              neighborhood = options.neighbor(target);
              if (neighborhood)
                neighborhood.select();
              target.lock();

              // this call is necessary to make sure
              // the tapheld node or edge stays selected
              // after releasing taphold
              target.unselectify();

              // tracks whether the taphold event happened
              // necessary if we want to keep 'neighborSelectTime'
              // property, otherwise unnecessary 
              tapheld = true;
            }
          }, options.neighborSelectTime - 500);

          // this listener prevents the original tapheld node or edge
          // from being unselected after releasing from taphold
          // together with the 'unselectify' call above
          // called as one time event since it's defined inside another event,
          // shouldn't be defined over and over with 'on'
          cy.one('tapend', function () {
            if (tapheld) {
              setTimeout(function () {
                target.selectify();
                target.unlock();
                tapheld = false;
              }, 100);
            }
            else {
              clearTimeout(timeout);
            }
          });

          cy.one('drag', 'node', function (e) {
            var targetDragged = e.target || e.cyTarget;
            if (target == targetDragged && tapheld === false) {
              clearTimeout(timeout);
            }
          })
        });
      }

      // return the instance of extension
      return getScratch(cy).instance;
    });

  };

  if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
    module.exports = register;
  }

  if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
    define('cytoscape-view-utilities', function () {
      return register;
    });
  }

  if (typeof cytoscape !== 'undefined') { // expose to global cytoscape (i.e. window.cytoscape)
    register(cytoscape);
  }

})();
