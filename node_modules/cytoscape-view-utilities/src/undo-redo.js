// Registers ur actions related to highlight
function highlightUR(cy, ur, viewUtilities) {
  function getStatus(eles) {
    eles = eles ? eles : cy.elements();
    var classes = viewUtilities.getAllHighlightClasses();
    var r = [];
    for (var i = 0; i < classes.length; i++) {
      r.push(eles.filter(`.${classes[i]}:visible`))
    }
    var selector = classes.map(x => '.' + x).join(',');
    // last element of array is elements which are not highlighted by any style
    r.push(eles.filter(":visible").not(selector));
    
    return r;
  }

  function generalUndo(args) {
    var current = args.current;
    var r = [];
    for (var i = 0; i < args.length - 1; i++) {
      r.push(viewUtilities.highlight(args[i], i));
    }
    // last element is for not highlighted by any style
    r.push(viewUtilities.removeHighlights(args[args.length - 1]));

    r['current'] = current;
    return r;
  }

  function generalRedo(args) {
    var current = args.current;
    var r = [];
    for (var i = 0; i < current.length - 1; i++) {
      r.push(viewUtilities.highlight(current[i], i));
    }
    // last element is for not highlighted by any style
    r.push(viewUtilities.removeHighlights(current[current.length - 1]));

    r['current'] = current;
    return r;
  }

  function generateDoFunc(func) {
    return function (args) {
      var res = getStatus();
      if (args.firstTime)
        viewUtilities[func](args.eles, args.idx);
      else
        generalRedo(args);

      res.current = getStatus();

      return res;
    };
  }

  ur.action("highlightNeighbors", generateDoFunc("highlightNeighbors"), generalUndo);
  ur.action("highlight", generateDoFunc("highlight"), generalUndo);
  ur.action("removeHighlights", generateDoFunc("removeHighlights"), generalUndo);
}

// Registers ur actions related to hide/show
function hideShowUR(cy, ur, viewUtilities) {
  function urShow(eles) {
    return viewUtilities.show(eles);
  }

  function urHide(eles) {
    return viewUtilities.hide(eles);
  }

  function urShowHiddenNeighbors(eles) {
    return viewUtilities.showHiddenNeighbors(eles);
  }

  ur.action("show", urShow, urHide);
  ur.action("hide", urHide, urShow);
  ur.action("showHiddenNeighbors",urShowHiddenNeighbors, urHide);
}

module.exports = function (cy, ur, viewUtilities) {
  highlightUR(cy, ur, viewUtilities);
  hideShowUR(cy, ur, viewUtilities);
};
