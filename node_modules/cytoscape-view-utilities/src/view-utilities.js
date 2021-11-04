var viewUtilities = function (cy, options) {

  var classNames4Styles = [];
  // give a unique name for each unique style EVER added
  var totStyleCnt = 0;
  var marqueeZoomEnabled = false;
  var shiftKeyDown = false;
  var ctrlKeyDown = false;
  var timer4KeyUp = false;
  var isDownedKeyUp = false;
  var prevCursor = null;
  init();
  function init() {
    // add provided styles
    for (var i = 0; i < options.highlightStyles.length; i++) {
      var s = '__highligtighted__' + totStyleCnt;
      classNames4Styles.push(s);
      totStyleCnt++;
      updateCyStyle(i);
    }

    // add styles for selected
    addSelectionStyles();

    document.addEventListener("keydown", function (event) {
      if (event.key != "Control" && event.key != "Shift" && event.key != "Meta") {
        return;
      }

      if (event.key == "Control" || event.key == "Meta") {
        ctrlKeyDown = true;
      }
      else if (event.key == "Shift") {
        shiftKeyDown = true;
      }
      isDownedKeyUp = false;
      clearTimeout(timer4KeyUp);
      timer4KeyUp = setTimeout(callKeyUpManually, 750);
      if (ctrlKeyDown && shiftKeyDown && !marqueeZoomEnabled) {
        instance.enableMarqueeZoom();
        marqueeZoomEnabled = true;
      }
    });

    document.addEventListener("keyup", function (event) {
      if (event.key != "Control" && event.key != "Shift" && event.key != "Meta") {
        return;
      }
      isDownedKeyUp = true;
      if (event.key == "Shift") {
        shiftKeyDown = false;
      }
      else if (event.key == "Control" || event.key == "Meta") {
        ctrlKeyDown = false;
      }
      if (marqueeZoomEnabled && (!shiftKeyDown || !ctrlKeyDown)) {
        instance.disableMarqueeZoom();
        marqueeZoomEnabled = false;
      }
    });

  }

  // ctrl + shift + tab does not call keyup after keydown
  function callKeyUpManually() {
    timer4KeyUp = null;
    if (isDownedKeyUp) {
      return;
    }
    setCursor(true);
    isDownedKeyUp = true;
    shiftKeyDown = false;
    ctrlKeyDown = false;
    if (marqueeZoomEnabled) {
      instance.disableMarqueeZoom();
      marqueeZoomEnabled = false;
    }
  }

  function setCursor(isReturnBack = false) {
    if (!options.htmlElem4marqueeZoom) {
      return;
    }
    let el = null;
    if (options.htmlElem4marqueeZoom.startsWith('.')) {
      el = document.getElementsByClassName(options.htmlElem4marqueeZoom.substr(1))[0];
    }
    if (options.htmlElem4marqueeZoom.startsWith('#')) {
      el = document.getElementById(options.htmlElem4marqueeZoom.substr(1));
    }
    if (!el) {
      console.log('element not found!');
      return;
    }
    if (isReturnBack) {
      el.style.cursor = prevCursor;
    } else {
      prevCursor = el.style.cursor;
      if (options.marqueeZoomCursor.includes('.')) {
        el.style.cursor = `url('${options.marqueeZoomCursor}'), pointer`;
      } else {
        el.style.cursor = options.marqueeZoomCursor;
      }
    }
  }

  function addSelectionStyles() {
    if (options.selectStyles.node) {
      cy.style().selector('node:selected').css(options.selectStyles.node).update();
    }
    if (options.selectStyles.edge) {
      cy.style().selector('edge:selected').css(options.selectStyles.edge).update();
    }
  }

  function updateCyStyle(classIdx) {
    var className = classNames4Styles[classIdx];
    var cssNode = options.highlightStyles[classIdx].node;
    var cssEdge = options.highlightStyles[classIdx].edge;
    cy.style().selector('node.' + className).css(cssNode).update();
    cy.style().selector('edge.' + className).css(cssEdge).update();
  }

  // Helper functions for internal usage (not to be exposed)
  function highlight(eles, idx) {
    cy.startBatch();
    for (var i = 0; i < options.highlightStyles.length; i++) {
      eles.removeClass(classNames4Styles[i]);
    }
    eles.addClass(classNames4Styles[idx]);
    cy.endBatch();
  }

  function getWithNeighbors(eles) {
    return eles.add(eles.descendants()).closedNeighborhood();
  }
  // the instance to be returned
  var instance = {};

  // Section hide-show
  // hide given eles
  instance.hide = function (eles) {
    //eles = eles.filter("node")
    eles = eles.filter(":visible");
    eles = eles.union(eles.connectedEdges());

    eles.unselect();

    if (options.setVisibilityOnHide) {
      eles.css('visibility', 'hidden');
    }

    if (options.setDisplayOnHide) {
      eles.css('display', 'none');
    }

    return eles;
  };

  // unhide given eles
  instance.show = function (eles) {
    eles = eles.not(":visible");

    if (options.isShowEdgesBetweenVisibleNodes) {
      var connectedEdges = eles.connectedEdges(function (edge) {
        if ((edge.source().visible() || eles.contains(edge.source())) && (edge.target().visible() || eles.contains(edge.target()))) {
          return true;
        }
        return false;
      });
      eles = eles.union(connectedEdges);
    }

    eles.unselect();

    if (options.setVisibilityOnHide) {
      eles.css('visibility', 'visible');
    }

    if (options.setDisplayOnHide) {
      eles.css('display', 'element');
    }

    return eles;
  };

  // Section highlight
  instance.showHiddenNeighbors = function (eles) {
    return this.show(getWithNeighbors(eles));
  };

  // Highlights eles
  instance.highlight = function (eles, idx = 0) {
    highlight(eles, idx); // Use the helper here
    return eles;
  };

  instance.getHighlightStyles = function () {
    return options.highlightStyles;
  };

  // Highlights eles' neighborhood
  instance.highlightNeighbors = function (eles, idx = 0) {
    return this.highlight(getWithNeighbors(eles), idx);
  };

  // Remove highlights from eles.
  // If eles is not defined considers cy.elements()
  instance.removeHighlights = function (eles) {
    cy.startBatch();
    if (eles == null || eles.length == null) {
      eles = cy.elements();
    }
    for (var i = 0; i < options.highlightStyles.length; i++) {
      eles.removeClass(classNames4Styles[i]);
    }
    cy.endBatch();
    return eles;
  };

  // Indicates if the ele is highlighted
  instance.isHighlighted = function (ele) {
    var isHigh = false;
    for (var i = 0; i < options.highlightStyles.length; i++) {
      if (ele.is('.' + classNames4Styles[i] + ':visible')) {
        isHigh = true;
      }
    }
    return isHigh;
  };

  instance.changeHighlightStyle = function (idx, nodeStyle, edgeStyle) {
    options.highlightStyles[idx].node = nodeStyle;
    options.highlightStyles[idx].edge = edgeStyle;
    updateCyStyle(idx);
    addSelectionStyles();
  };

  instance.addHighlightStyle = function (nodeStyle, edgeStyle) {
    var o = { node: nodeStyle, edge: edgeStyle };
    options.highlightStyles.push(o);
    var s = '__highligtighted__' + totStyleCnt;
    classNames4Styles.push(s);
    totStyleCnt++;
    updateCyStyle(options.highlightStyles.length - 1);
    addSelectionStyles();
  };

  instance.removeHighlightStyle = function (styleIdx) {
    if (styleIdx < 0 || styleIdx > options.highlightStyles.length - 1) {
      return;
    }
    cy.elements().removeClass(classNames4Styles[styleIdx]);
    options.highlightStyles.splice(styleIdx, 1);
    classNames4Styles.splice(styleIdx, 1);
  };

  instance.getAllHighlightClasses = function () {
    var a = [];
    for (var i = 0; i < options.highlightStyles.length; i++) {
      a.push(classNames4Styles[i]);
    }
    return classNames4Styles;
  };

  //Zoom selected Nodes
  instance.zoomToSelected = function (eles) {
    var boundingBox = eles.boundingBox();
    var diff_x = Math.abs(boundingBox.x1 - boundingBox.x2);
    var diff_y = Math.abs(boundingBox.y1 - boundingBox.y2);
    var padding;
    if (diff_x >= 200 || diff_y >= 200) {
      padding = 50;
    }
    else {
      padding = (cy.width() < cy.height()) ?
        ((200 - diff_x) / 2 * cy.width() / 200) : ((200 - diff_y) / 2 * cy.height() / 200);
    }

    cy.animate({
      fit: {
        eles: eles,
        padding: padding
      }
    }, {
      duration: options.zoomAnimationDuration
    });
    return eles;
  };

  //Marquee Zoom
  var tabStartHandler;
  var tabEndHandler;

  instance.enableMarqueeZoom = function (callback) {
    setCursor(false);
    marqueeZoomEnabled = true;
    var rect_start_pos_x, rect_start_pos_y, rect_end_pos_x, rect_end_pos_y;
    //Make the cy unselectable
    cy.autounselectify(true);

    cy.one('tapstart', tabStartHandler = function (event) {
      if (shiftKeyDown == true) {
        rect_start_pos_x = event.position.x;
        rect_start_pos_y = event.position.y;
        rect_end_pos_x = undefined;
      }
    });
    cy.one('tapend', tabEndHandler = function (event) {
      rect_end_pos_x = event.position.x;
      rect_end_pos_y = event.position.y;
      //check whether corners of rectangle is undefined
      //abort marquee zoom if one corner is undefined
      if (rect_start_pos_x == undefined || rect_end_pos_x == undefined) {
        cy.autounselectify(false);
        if (callback) {
          callback();
        }
        return;
      }
      //Reoder rectangle positions
      //Top left of the rectangle (rect_start_pos_x, rect_start_pos_y)
      //right bottom of the rectangle (rect_end_pos_x, rect_end_pos_y)
      if (rect_start_pos_x > rect_end_pos_x) {
        var temp = rect_start_pos_x;
        rect_start_pos_x = rect_end_pos_x;
        rect_end_pos_x = temp;
      }
      if (rect_start_pos_y > rect_end_pos_y) {
        var temp = rect_start_pos_y;
        rect_start_pos_y = rect_end_pos_y;
        rect_end_pos_y = temp;
      }

      //Extend sides of selected rectangle to 200px if less than 100px
      if (rect_end_pos_x - rect_start_pos_x < 200) {
        var extendPx = (200 - (rect_end_pos_x - rect_start_pos_x)) / 2;
        rect_start_pos_x -= extendPx;
        rect_end_pos_x += extendPx;
      }
      if (rect_end_pos_y - rect_start_pos_y < 200) {
        var extendPx = (200 - (rect_end_pos_y - rect_start_pos_y)) / 2;
        rect_start_pos_y -= extendPx;
        rect_end_pos_y += extendPx;
      }

      //Check whether rectangle intersects with bounding box of the graph
      //if not abort marquee zoom
      if ((rect_start_pos_x > cy.elements().boundingBox().x2)
        || (rect_end_pos_x < cy.elements().boundingBox().x1)
        || (rect_start_pos_y > cy.elements().boundingBox().y2)
        || (rect_end_pos_y < cy.elements().boundingBox().y1)) {
        cy.autounselectify(false);
        if (callback) {
          callback();
        }
        return;
      }

      //Calculate zoom level
      var zoomLevel = Math.min(cy.width() / (Math.abs(rect_end_pos_x - rect_start_pos_x)),
        cy.height() / Math.abs(rect_end_pos_y - rect_start_pos_y));

      var diff_x = cy.width() / 2 - (cy.pan().x + zoomLevel * (rect_start_pos_x + rect_end_pos_x) / 2);
      var diff_y = cy.height() / 2 - (cy.pan().y + zoomLevel * (rect_start_pos_y + rect_end_pos_y) / 2);

      cy.animate({
        panBy: { x: diff_x, y: diff_y },
        zoom: zoomLevel,
        duration: options.zoomAnimationDuration,
        complete: function () {
          if (callback) {
            callback();
          }
          cy.autounselectify(false);
        }
      });
    });
  };

  instance.disableMarqueeZoom = function () {
    setCursor(true);
    cy.off('tapstart', tabStartHandler);
    cy.off('tapend', tabEndHandler);
    cy.autounselectify(false);
    marqueeZoomEnabled = false;
  };
  //Lasso Mode
  var geometric = require('geometric');

  instance.changeLassoStyle = function (styleObj) {
    if (styleObj.lineWidth)
      options.lassoStyle.lineWidth = styleObj.lineWidth;
    if (styleObj.lineColor)
      options.lassoStyle.lineColor = styleObj.lineColor;
  };

  instance.enableLassoMode = function (callback) {

    var isClicked = false;
    var tempCanv = document.createElement('canvas');
    tempCanv.id = 'lasso-canvas';
    const container = cy.container();
    container.appendChild(tempCanv);

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    tempCanv.width = width;
    tempCanv.height = height;
    tempCanv.setAttribute("style", `z-index: 1000; position: absolute; top: 0; left: 0;`,);

    cy.panningEnabled(false);
    cy.zoomingEnabled(false);
    cy.autounselectify(true);
    var points = [];

    tempCanv.onclick = function (event) {

      if (isClicked == false) {
        isClicked = true;
        var context = tempCanv.getContext("2d");
        context.strokeStyle = options.lassoStyle.lineColor;
        context.lineWidth = options.lassoStyle.lineWidth;
        context.lineJoin = "round";
        cy.panningEnabled(false);
        cy.zoomingEnabled(false);
        cy.autounselectify(true);
        var formerX = event.offsetX;
        var formerY = event.offsetY;

        points.push([formerX, formerY]);
        tempCanv.onmouseleave = function (e) {
          isClicked = false;
          container.removeChild(tempCanv);
          tempCanv = null;
          cy.panningEnabled(true);
          cy.zoomingEnabled(true);
          cy.autounselectify(false);
          if (callback) {
            callback();
          }
        };
        tempCanv.onmousemove = function (e) {
          context.beginPath();
          points.push([e.offsetX, e.offsetY]);
          context.moveTo(formerX, formerY);
          context.lineTo(e.offsetX, e.offsetY);
          formerX = e.offsetX;
          formerY = e.offsetY;
          context.stroke();
          context.closePath();
        };
      }
      else {
        var eles = cy.elements();
        points.push(points[0]);
        for (var i = 0; i < eles.length; i++) {
          if (eles[i].isEdge()) {

            var p1 = [(eles[i].sourceEndpoint().x) * cy.zoom() + cy.pan().x, (eles[i].sourceEndpoint().y) * cy.zoom() + cy.pan().y];
            var p2 = [(eles[i].targetEndpoint().x) * cy.zoom() + cy.pan().x, (eles[i].targetEndpoint().y) * cy.zoom() + cy.pan().y];

            if (geometric.pointInPolygon(p1, points) && geometric.pointInPolygon(p2, points)) {
              eles[i].select();
            }

          }
          else {
            cy.autounselectify(false);
            var bb = [[eles[i].renderedBoundingBox().x1, eles[i].renderedBoundingBox().y1],
            [eles[i].renderedBoundingBox().x1, eles[i].renderedBoundingBox().y2],
            [eles[i].renderedBoundingBox().x2, eles[i].renderedBoundingBox().y2],
            [eles[i].renderedBoundingBox().x2, eles[i].renderedBoundingBox().y1]];

            if (geometric.polygonIntersectsPolygon(bb, points) || geometric.polygonInPolygon(bb, points)
              || geometric.polygonInPolygon(points, bb)) {
              eles[i].select();
            }
          }
        }
        isClicked = false;
        container.removeChild(tempCanv);
        tempCanv = null;

        cy.panningEnabled(true);
        cy.zoomingEnabled(true);
        if (callback) {
          callback();
        }
      }
    };
  };

  instance.disableLassoMode = function () {
    var c = document.getElementById('lasso-canvas');
    if (c) {
      c.parentElement.removeChild(c);
      c = null;
    }
    cy.panningEnabled(true);
    cy.zoomingEnabled(true);
    cy.autounselectify(false);
  }
  // return the instance
  return instance;
};

module.exports = viewUtilities;
