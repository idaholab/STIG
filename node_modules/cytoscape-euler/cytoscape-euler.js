(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeEuler"] = factory();
	else
		root["cytoscapeEuler"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(0);

var defaults = Object.freeze({
  source: null,
  target: null,
  length: 80,
  coeff: 0.0002,
  weight: 1
});

function makeSpring(spring) {
  return assign({}, defaults, spring);
}

function applySpring(spring) {
  var body1 = spring.source,
      body2 = spring.target,
      length = spring.length < 0 ? defaults.length : spring.length,
      dx = body2.pos.x - body1.pos.x,
      dy = body2.pos.y - body1.pos.y,
      r = Math.sqrt(dx * dx + dy * dy);

  if (r === 0) {
    dx = (Math.random() - 0.5) / 50;
    dy = (Math.random() - 0.5) / 50;
    r = Math.sqrt(dx * dx + dy * dy);
  }

  var d = r - length;
  var coeff = (!spring.coeff || spring.coeff < 0 ? defaults.springCoeff : spring.coeff) * d / r * spring.weight;

  body1.force.x += coeff * dx;
  body1.force.y += coeff * dy;

  body2.force.x -= coeff * dx;
  body2.force.y -= coeff * dy;
}

module.exports = { makeSpring: makeSpring, applySpring: applySpring };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
The implementation of the Euler layout algorithm
*/

var Layout = __webpack_require__(13);
var assign = __webpack_require__(0);
var defaults = __webpack_require__(4);

var _require = __webpack_require__(10),
    _tick = _require.tick;

var _require2 = __webpack_require__(7),
    makeQuadtree = _require2.makeQuadtree;

var _require3 = __webpack_require__(3),
    makeBody = _require3.makeBody;

var _require4 = __webpack_require__(1),
    makeSpring = _require4.makeSpring;

var isFn = function isFn(fn) {
  return typeof fn === 'function';
};
var isParent = function isParent(n) {
  return n.isParent();
};
var notIsParent = function notIsParent(n) {
  return !isParent(n);
};
var isLocked = function isLocked(n) {
  return n.locked();
};
var notIsLocked = function notIsLocked(n) {
  return !isLocked(n);
};
var isParentEdge = function isParentEdge(e) {
  return isParent(e.source()) || isParent(e.target());
};
var notIsParentEdge = function notIsParentEdge(e) {
  return !isParentEdge(e);
};
var getBody = function getBody(n) {
  return n.scratch('euler').body;
};
var getNonParentDescendants = function getNonParentDescendants(n) {
  return isParent(n) ? n.descendants().filter(notIsParent) : n;
};

var getScratch = function getScratch(el) {
  var scratch = el.scratch('euler');

  if (!scratch) {
    scratch = {};

    el.scratch('euler', scratch);
  }

  return scratch;
};

var optFn = function optFn(opt, ele) {
  if (isFn(opt)) {
    return opt(ele);
  } else {
    return opt;
  }
};

var Euler = function (_Layout) {
  _inherits(Euler, _Layout);

  function Euler(options) {
    _classCallCheck(this, Euler);

    return _possibleConstructorReturn(this, (Euler.__proto__ || Object.getPrototypeOf(Euler)).call(this, assign({}, defaults, options)));
  }

  _createClass(Euler, [{
    key: 'prerun',
    value: function prerun(state) {
      var s = state;

      s.quadtree = makeQuadtree();

      var bodies = s.bodies = [];

      // regular nodes
      s.nodes.filter(function (n) {
        return notIsParent(n);
      }).forEach(function (n) {
        var scratch = getScratch(n);

        var body = makeBody({
          pos: { x: scratch.x, y: scratch.y },
          mass: optFn(s.mass, n),
          locked: scratch.locked
        });

        body._cyNode = n;

        scratch.body = body;

        body._scratch = scratch;

        bodies.push(body);
      });

      var springs = s.springs = [];

      // regular edge springs
      s.edges.filter(notIsParentEdge).forEach(function (e) {
        var spring = makeSpring({
          source: getBody(e.source()),
          target: getBody(e.target()),
          length: optFn(s.springLength, e),
          coeff: optFn(s.springCoeff, e)
        });

        spring._cyEdge = e;

        var scratch = getScratch(e);

        spring._scratch = scratch;

        scratch.spring = spring;

        springs.push(spring);
      });

      // compound edge springs
      s.edges.filter(isParentEdge).forEach(function (e) {
        var sources = getNonParentDescendants(e.source());
        var targets = getNonParentDescendants(e.target());

        // just add one spring for perf
        sources = [sources[0]];
        targets = [targets[0]];

        sources.forEach(function (src) {
          targets.forEach(function (tgt) {
            springs.push(makeSpring({
              source: getBody(src),
              target: getBody(tgt),
              length: optFn(s.springLength, e),
              coeff: optFn(s.springCoeff, e)
            }));
          });
        });
      });
    }
  }, {
    key: 'tick',
    value: function tick(state) {
      var movement = _tick(state);

      var isDone = movement <= state.movementThreshold;

      return isDone;
    }
  }]);

  return Euler;
}(Layout);

module.exports = Euler;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = Object.freeze({
  pos: { x: 0, y: 0 },
  prevPos: { x: 0, y: 0 },
  force: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  mass: 1
});

var copyVec = function copyVec(v) {
  return { x: v.x, y: v.y };
};
var getValue = function getValue(val, def) {
  return val != null ? val : def;
};
var getVec = function getVec(vec, def) {
  return copyVec(getValue(vec, def));
};

function makeBody(opts) {
  var b = {};

  b.pos = getVec(opts.pos, defaults.pos);
  b.prevPos = getVec(opts.prevPos, b.pos);
  b.force = getVec(opts.force, defaults.force);
  b.velocity = getVec(opts.velocity, defaults.velocity);
  b.mass = opts.mass != null ? opts.mass : defaults.mass;
  b.locked = opts.locked;

  return b;
}

module.exports = { makeBody: makeBody };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = Object.freeze({
  // The ideal legth of a spring
  // - This acts as a hint for the edge length
  // - The edge length can be longer or shorter if the forces are set to extreme values
  springLength: function springLength(edge) {
    return 80;
  },

  // Hooke's law coefficient
  // - The value ranges on [0, 1]
  // - Lower values give looser springs
  // - Higher values give tighter springs
  springCoeff: function springCoeff(edge) {
    return 0.0008;
  },

  // The mass of the node in the physics simulation
  // - The mass affects the gravity node repulsion/attraction
  mass: function mass(node) {
    return 4;
  },

  // Coulomb's law coefficient
  // - Makes the nodes repel each other for negative values
  // - Makes the nodes attract each other for positive values
  gravity: -1.2,

  // A force that pulls nodes towards the origin (0, 0)
  // Higher values keep the components less spread out
  pull: 0.001,

  // Theta coefficient from Barnes-Hut simulation
  // - Value ranges on [0, 1]
  // - Performance is better with smaller values
  // - Very small values may not create enough force to give a good result
  theta: 0.666,

  // Friction / drag coefficient to make the system stabilise over time
  dragCoeff: 0.02,

  // When the total of the squared position deltas is less than this value, the simulation ends
  movementThreshold: 1,

  // The amount of time passed per tick
  // - Larger values result in faster runtimes but might spread things out too far
  // - Smaller values produce more accurate results
  timeStep: 20
});

module.exports = defaults;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaultCoeff = 0.02;

function applyDrag(body, manualDragCoeff) {
  var dragCoeff = void 0;

  if (manualDragCoeff != null) {
    dragCoeff = manualDragCoeff;
  } else if (body.dragCoeff != null) {
    dragCoeff = body.dragCoeff;
  } else {
    dragCoeff = defaultCoeff;
  }

  body.force.x -= dragCoeff * body.velocity.x;
  body.force.y -= dragCoeff * body.velocity.y;
}

module.exports = { applyDrag: applyDrag };

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// use euler method for force integration http://en.wikipedia.org/wiki/Euler_method
// return sum of squared position deltas
function integrate(bodies, timeStep) {
  var dx = 0,
      tx = 0,
      dy = 0,
      ty = 0,
      i,
      max = bodies.length;

  if (max === 0) {
    return 0;
  }

  for (i = 0; i < max; ++i) {
    var body = bodies[i],
        coeff = timeStep / body.mass;

    if (body.grabbed) {
      continue;
    }

    if (body.locked) {
      body.velocity.x = 0;
      body.velocity.y = 0;
    } else {
      body.velocity.x += coeff * body.force.x;
      body.velocity.y += coeff * body.force.y;
    }

    var vx = body.velocity.x,
        vy = body.velocity.y,
        v = Math.sqrt(vx * vx + vy * vy);

    if (v > 1) {
      body.velocity.x = vx / v;
      body.velocity.y = vy / v;
    }

    dx = timeStep * body.velocity.x;
    dy = timeStep * body.velocity.y;

    body.pos.x += dx;
    body.pos.y += dy;

    tx += Math.abs(dx);ty += Math.abs(dy);
  }

  return (tx * tx + ty * ty) / max;
}

module.exports = { integrate: integrate };

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// impl of barnes hut
// http://www.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
// http://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation

var Node = __webpack_require__(9);
var InsertStack = __webpack_require__(8);

var resetVec = function resetVec(v) {
  v.x = 0;v.y = 0;
};

var isSamePosition = function isSamePosition(p1, p2) {
  var threshold = 1e-8;
  var dx = Math.abs(p1.x - p2.x);
  var dy = Math.abs(p1.y - p2.y);

  return dx < threshold && dy < threshold;
};

function makeQuadtree() {
  var updateQueue = [],
      insertStack = new InsertStack(),
      nodesCache = [],
      currentInCache = 0,
      root = newNode();

  function newNode() {
    // To avoid pressure on GC we reuse nodes.
    var node = nodesCache[currentInCache];
    if (node) {
      node.quad0 = null;
      node.quad1 = null;
      node.quad2 = null;
      node.quad3 = null;
      node.body = null;
      node.mass = node.massX = node.massY = 0;
      node.left = node.right = node.top = node.bottom = 0;
    } else {
      node = new Node();
      nodesCache[currentInCache] = node;
    }

    ++currentInCache;
    return node;
  }

  function update(sourceBody, gravity, theta, pull) {
    var queue = updateQueue,
        v = void 0,
        dx = void 0,
        dy = void 0,
        r = void 0,
        fx = 0,
        fy = 0,
        queueLength = 1,
        shiftIdx = 0,
        pushIdx = 1;

    queue[0] = root;

    resetVec(sourceBody.force);

    var px = -sourceBody.pos.x;
    var py = -sourceBody.pos.y;
    var pr = Math.sqrt(px * px + py * py);
    var pv = sourceBody.mass * pull / pr;

    fx += pv * px;
    fy += pv * py;

    while (queueLength) {
      var node = queue[shiftIdx],
          body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = body !== sourceBody;
      if (body && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        dx = body.pos.x - sourceBody.pos.x;
        dy = body.pos.y - sourceBody.pos.y;
        r = Math.sqrt(dx * dx + dy * dy);

        if (r === 0) {
          // Poor man's protection against zero distance.
          dx = (Math.random() - 0.5) / 50;
          dy = (Math.random() - 0.5) / 50;
          r = Math.sqrt(dx * dx + dy * dy);
        }

        // This is standard gravition force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        v = gravity * body.mass * sourceBody.mass / (r * r * r);
        fx += v * dx;
        fy += v * dy;
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        dx = node.massX / node.mass - sourceBody.pos.x;
        dy = node.massY / node.mass - sourceBody.pos.y;
        r = Math.sqrt(dx * dx + dy * dy);

        if (r === 0) {
          // Sorry about code duplucation. I don't want to create many functions
          // right away. Just want to see performance first.
          dx = (Math.random() - 0.5) / 50;
          dy = (Math.random() - 0.5) / 50;
          r = Math.sqrt(dx * dx + dy * dy);
        }
        // If s / r < θ, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.right - node.left) / r < theta) {
          // in the if statement above we consider node's width only
          // because the region was squarified during tree creation.
          // Thus there is no difference between using width or height.
          v = gravity * node.mass * sourceBody.mass / (r * r * r);
          fx += v * dx;
          fy += v * dy;
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
          if (node.quad0) {
            queue[pushIdx] = node.quad0;
            queueLength += 1;
            pushIdx += 1;
          }
          if (node.quad1) {
            queue[pushIdx] = node.quad1;
            queueLength += 1;
            pushIdx += 1;
          }
          if (node.quad2) {
            queue[pushIdx] = node.quad2;
            queueLength += 1;
            pushIdx += 1;
          }
          if (node.quad3) {
            queue[pushIdx] = node.quad3;
            queueLength += 1;
            pushIdx += 1;
          }
        }
      }
    }

    sourceBody.force.x += fx;
    sourceBody.force.y += fy;
  }

  function insertBodies(bodies) {
    if (bodies.length === 0) {
      return;
    }

    var x1 = Number.MAX_VALUE,
        y1 = Number.MAX_VALUE,
        x2 = Number.MIN_VALUE,
        y2 = Number.MIN_VALUE,
        i = void 0,
        max = bodies.length;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    i = max;
    while (i--) {
      var x = bodies[i].pos.x;
      var y = bodies[i].pos.y;
      if (x < x1) {
        x1 = x;
      }
      if (x > x2) {
        x2 = x;
      }
      if (y < y1) {
        y1 = y;
      }
      if (y > y2) {
        y2 = y;
      }
    }

    // Squarify the bounds.
    var dx = x2 - x1,
        dy = y2 - y1;
    if (dx > dy) {
      y2 = y1 + dx;
    } else {
      x2 = x1 + dy;
    }

    currentInCache = 0;
    root = newNode();
    root.left = x1;
    root.right = x2;
    root.top = y1;
    root.bottom = y2;

    i = max - 1;
    if (i >= 0) {
      root.body = bodies[i];
    }
    while (i--) {
      insert(bodies[i], root);
    }
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop(),
          node = stackItem.node,
          body = stackItem.body;

      if (!node.body) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        var x = body.pos.x;
        var y = body.pos.y;
        node.mass = node.mass + body.mass;
        node.massX = node.massX + body.mass * x;
        node.massY = node.massY + body.mass * y;

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0,
            // Assume we are in the 0's quad.
        left = node.left,
            right = (node.right + left) / 2,
            top = node.top,
            bottom = (node.bottom + top) / 2;

        if (x > right) {
          // somewhere in the eastern part.
          quadIdx = quadIdx + 1;
          left = right;
          right = node.right;
        }
        if (y > bottom) {
          // and in south.
          quadIdx = quadIdx + 2;
          top = bottom;
          bottom = node.bottom;
        }

        var child = getChild(node, quadIdx);
        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          child.left = left;
          child.top = top;
          child.right = right;
          child.bottom = bottom;
          child.body = body;

          setChild(node, quadIdx, child);
        } else {
          // continue searching in this quadrant.
          insertStack.push(child, body);
        }
      } else {
        // We are trying to add to the leaf node.
        // We have to convert current leaf into internal node
        // and continue adding two nodes.
        var oldBody = node.body;
        node.body = null; // internal nodes do not cary bodies

        if (isSamePosition(oldBody.pos, body.pos)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = Math.random();
            var dx = (node.right - node.left) * offset;
            var dy = (node.bottom - node.top) * offset;

            oldBody.pos.x = node.left + dx;
            oldBody.pos.y = node.top + dy;
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));

          if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
            // This is very bad, we ran out of precision.
            // if we do not return from the method we'll get into
            // infinite loop here. So we sacrifice correctness of layout, and keep the app running
            // Next layout iteration should get larger bounding box in the first step and fix this
            return;
          }
        }
        // Next iteration should subdivide node further.
        insertStack.push(node, oldBody);
        insertStack.push(node, body);
      }
    }
  }

  return {
    insertBodies: insertBodies,
    updateBodyForce: update
  };
}

function getChild(node, idx) {
  if (idx === 0) return node.quad0;
  if (idx === 1) return node.quad1;
  if (idx === 2) return node.quad2;
  if (idx === 3) return node.quad3;
  return null;
}

function setChild(node, idx, child) {
  if (idx === 0) node.quad0 = child;else if (idx === 1) node.quad1 = child;else if (idx === 2) node.quad2 = child;else if (idx === 3) node.quad3 = child;
}

module.exports = { makeQuadtree: makeQuadtree };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = InsertStack;

/**
 * Our implmentation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
function InsertStack() {
    this.stack = [];
    this.popIdx = 0;
}

InsertStack.prototype = {
    isEmpty: function isEmpty() {
        return this.popIdx === 0;
    },
    push: function push(node, body) {
        var item = this.stack[this.popIdx];
        if (!item) {
            // we are trying to avoid memory pressue: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop: function pop() {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset: function reset() {
        this.popIdx = 0;
    }
};

function InsertStackElement(node, body) {
    this.node = node; // QuadTree node
    this.body = body; // physical body which needs to be inserted to node
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Internal data structure to represent 2D QuadTree node
 */
module.exports = function Node() {
  // body stored inside this node. In quad tree only leaf nodes (by construction)
  // contain boides:
  this.body = null;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
  this.quad0 = null;
  this.quad1 = null;
  this.quad2 = null;
  this.quad3 = null;

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  this.massX = 0;
  this.massY = 0;

  // bounding box coordinates
  this.left = 0;
  this.top = 0;
  this.bottom = 0;
  this.right = 0;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(6),
    integrate = _require.integrate;

var _require2 = __webpack_require__(5),
    applyDrag = _require2.applyDrag;

var _require3 = __webpack_require__(1),
    applySpring = _require3.applySpring;

function tick(_ref) {
  var bodies = _ref.bodies,
      springs = _ref.springs,
      quadtree = _ref.quadtree,
      timeStep = _ref.timeStep,
      gravity = _ref.gravity,
      theta = _ref.theta,
      dragCoeff = _ref.dragCoeff,
      pull = _ref.pull;

  // update body from scratch in case of any changes
  bodies.forEach(function (body) {
    var p = body._scratch;

    if (!p) {
      return;
    }

    body.locked = p.locked;
    body.grabbed = p.grabbed;
    body.pos.x = p.x;
    body.pos.y = p.y;
  });

  quadtree.insertBodies(bodies);

  for (var i = 0; i < bodies.length; i++) {
    var body = bodies[i];

    quadtree.updateBodyForce(body, gravity, theta, pull);
    applyDrag(body, dragCoeff);
  }

  for (var _i = 0; _i < springs.length; _i++) {
    var spring = springs[_i];

    applySpring(spring);
  }

  var movement = integrate(bodies, timeStep);

  // update scratch positions from body positions
  bodies.forEach(function (body) {
    var p = body._scratch;

    if (!p) {
      return;
    }

    p.x = body.pos.x;
    p.y = body.pos.y;
  });

  return movement;
}

module.exports = { tick: tick };

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Euler = __webpack_require__(2);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'euler', Euler); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// general default options for force-directed layout

module.exports = Object.freeze({
  animate: true, // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
  refresh: 10, // number of ticks per frame; higher is faster but more jerky
  maxIterations: 1000, // max iterations before the layout will bail out
  maxSimulationTime: 4000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }

  // layout event callbacks
  ready: function ready() {}, // on layoutready
  stop: function stop() {}, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout

  // infinite layout options
  infinite: false // overrides all other options for a forces-all-the-time mode
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
A generic continuous layout class
*/

var assign = __webpack_require__(0);
var defaults = __webpack_require__(12);
var makeBoundingBox = __webpack_require__(14);

var _require = __webpack_require__(15),
    setInitialPositionState = _require.setInitialPositionState,
    refreshPositions = _require.refreshPositions,
    getNodePositionData = _require.getNodePositionData;

var _require2 = __webpack_require__(16),
    multitick = _require2.multitick;

var Layout = function () {
  function Layout(options) {
    _classCallCheck(this, Layout);

    var o = this.options = assign({}, defaults, options);

    var s = this.state = assign({}, o, {
      layout: this,
      nodes: o.eles.nodes(),
      edges: o.eles.edges(),
      tickIndex: 0,
      firstUpdate: true
    });

    s.animateEnd = o.animate && o.animate === 'end';
    s.animateContinuously = o.animate && !s.animateEnd;
  }

  _createClass(Layout, [{
    key: 'run',
    value: function run() {
      var l = this;
      var s = this.state;

      s.tickIndex = 0;
      s.firstUpdate = true;
      s.startTime = Date.now();
      s.running = true;

      s.currentBoundingBox = makeBoundingBox(s.boundingBox, s.cy);

      if (s.ready) {
        l.one('ready', s.ready);
      }
      if (s.stop) {
        l.one('stop', s.stop);
      }

      s.nodes.forEach(function (n) {
        return setInitialPositionState(n, s);
      });

      l.prerun(s);

      if (s.animateContinuously) {
        var ungrabify = function ungrabify(node) {
          if (!s.ungrabifyWhileSimulating) {
            return;
          }

          var grabbable = getNodePositionData(node, s).grabbable = node.grabbable();

          if (grabbable) {
            node.ungrabify();
          }
        };

        var regrabify = function regrabify(node) {
          if (!s.ungrabifyWhileSimulating) {
            return;
          }

          var grabbable = getNodePositionData(node, s).grabbable;

          if (grabbable) {
            node.grabify();
          }
        };

        var updateGrabState = function updateGrabState(node) {
          return getNodePositionData(node, s).grabbed = node.grabbed();
        };

        var onGrab = function onGrab(_ref) {
          var target = _ref.target;

          updateGrabState(target);
        };

        var onFree = onGrab;

        var onDrag = function onDrag(_ref2) {
          var target = _ref2.target;

          var p = getNodePositionData(target, s);
          var tp = target.position();

          p.x = tp.x;
          p.y = tp.y;
        };

        var listenToGrab = function listenToGrab(node) {
          node.on('grab', onGrab);
          node.on('free', onFree);
          node.on('drag', onDrag);
        };

        var unlistenToGrab = function unlistenToGrab(node) {
          node.removeListener('grab', onGrab);
          node.removeListener('free', onFree);
          node.removeListener('drag', onDrag);
        };

        var fit = function fit() {
          if (s.fit && s.animateContinuously) {
            s.cy.fit(s.padding);
          }
        };

        var onNotDone = function onNotDone() {
          refreshPositions(s.nodes, s);
          fit();

          requestAnimationFrame(_frame);
        };

        var _frame = function _frame() {
          multitick(s, onNotDone, _onDone);
        };

        var _onDone = function _onDone() {
          refreshPositions(s.nodes, s);
          fit();

          s.nodes.forEach(function (n) {
            regrabify(n);
            unlistenToGrab(n);
          });

          s.running = false;

          l.emit('layoutstop');
        };

        l.emit('layoutstart');

        s.nodes.forEach(function (n) {
          ungrabify(n);
          listenToGrab(n);
        });

        _frame(); // kick off
      } else {
        var done = false;
        var _onNotDone = function _onNotDone() {};
        var _onDone2 = function _onDone2() {
          return done = true;
        };

        while (!done) {
          multitick(s, _onNotDone, _onDone2);
        }

        s.eles.layoutPositions(this, s, function (node) {
          var pd = getNodePositionData(node, s);

          return { x: pd.x, y: pd.y };
        });
      }

      l.postrun(s);

      return this; // chaining
    }
  }, {
    key: 'prerun',
    value: function prerun() {}
  }, {
    key: 'postrun',
    value: function postrun() {}
  }, {
    key: 'tick',
    value: function tick() {}
  }, {
    key: 'stop',
    value: function stop() {
      this.state.running = false;

      return this; // chaining
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return this; // chaining
    }
  }]);

  return Layout;
}();

module.exports = Layout;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (bb, cy) {
  if (bb == null) {
    bb = { x1: 0, y1: 0, w: cy.width(), h: cy.height() };
  } else {
    // copy
    bb = { x1: bb.x1, x2: bb.x2, y1: bb.y1, y2: bb.y2, w: bb.w, h: bb.h };
  }

  if (bb.x2 == null) {
    bb.x2 = bb.x1 + bb.w;
  }
  if (bb.w == null) {
    bb.w = bb.x2 - bb.x1;
  }
  if (bb.y2 == null) {
    bb.y2 = bb.y1 + bb.h;
  }
  if (bb.h == null) {
    bb.h = bb.y2 - bb.y1;
  }

  return bb;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(0);

var setInitialPositionState = function setInitialPositionState(node, state) {
  var p = node.position();
  var bb = state.currentBoundingBox;
  var scratch = node.scratch(state.name);

  if (scratch == null) {
    scratch = {};

    node.scratch(state.name, scratch);
  }

  assign(scratch, state.randomize ? {
    x: bb.x1 + Math.random() * bb.w,
    y: bb.y1 + Math.random() * bb.h
  } : {
    x: p.x,
    y: p.y
  });

  scratch.locked = node.locked();
};

var getNodePositionData = function getNodePositionData(node, state) {
  return node.scratch(state.name);
};

var refreshPositions = function refreshPositions(nodes, state) {
  nodes.positions(function (node) {
    var scratch = node.scratch(state.name);

    return {
      x: scratch.x,
      y: scratch.y
    };
  });
};

module.exports = { setInitialPositionState: setInitialPositionState, getNodePositionData: getNodePositionData, refreshPositions: refreshPositions };

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nop = function nop() {};

var tick = function tick(state) {
  var s = state;
  var l = state.layout;

  var tickIndicatesDone = l.tick(s);

  if (s.firstUpdate) {
    if (s.animateContinuously) {
      // indicate the initial positions have been set
      s.layout.emit('layoutready');
    }
    s.firstUpdate = false;
  }

  s.tickIndex++;

  var duration = Date.now() - s.startTime;

  return !s.infinite && (tickIndicatesDone || s.tickIndex >= s.maxIterations || duration >= s.maxSimulationTime);
};

var multitick = function multitick(state) {
  var onNotDone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nop;
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nop;

  var done = false;
  var s = state;

  for (var i = 0; i < s.refresh; i++) {
    done = !s.running || tick(s);

    if (done) {
      break;
    }
  }

  if (!done) {
    onNotDone();
  } else {
    onDone();
  }
};

module.exports = { tick: tick, multitick: multitick };

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2MGFhNzhlOTI4NDc1MThmZDBmMyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzaWduLmpzIiwid2VicGFjazovLy8uL3NyYy9ldWxlci9zcHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V1bGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9ldWxlci9ib2R5LmpzIiwid2VicGFjazovLy8uL3NyYy9ldWxlci9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXVsZXIvZHJhZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXVsZXIvaW50ZWdyYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9ldWxlci9xdWFkdHJlZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXVsZXIvcXVhZHRyZWUvaW5zZXJ0U3RhY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V1bGVyL3F1YWR0cmVlL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V1bGVyL3RpY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9sYXlvdXQvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xheW91dC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGF5b3V0L21ha2UtYmIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xheW91dC9wb3NpdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGF5b3V0L3RpY2suanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIk9iamVjdCIsImFzc2lnbiIsImJpbmQiLCJ0Z3QiLCJzcmNzIiwiZm9yRWFjaCIsImtleXMiLCJzcmMiLCJrIiwicmVxdWlyZSIsImRlZmF1bHRzIiwiZnJlZXplIiwic291cmNlIiwidGFyZ2V0IiwibGVuZ3RoIiwiY29lZmYiLCJ3ZWlnaHQiLCJtYWtlU3ByaW5nIiwic3ByaW5nIiwiYXBwbHlTcHJpbmciLCJib2R5MSIsImJvZHkyIiwiZHgiLCJwb3MiLCJ4IiwiZHkiLCJ5IiwiciIsIk1hdGgiLCJzcXJ0IiwicmFuZG9tIiwiZCIsInNwcmluZ0NvZWZmIiwiZm9yY2UiLCJMYXlvdXQiLCJ0aWNrIiwibWFrZVF1YWR0cmVlIiwibWFrZUJvZHkiLCJpc0ZuIiwiZm4iLCJpc1BhcmVudCIsIm4iLCJub3RJc1BhcmVudCIsImlzTG9ja2VkIiwibG9ja2VkIiwibm90SXNMb2NrZWQiLCJpc1BhcmVudEVkZ2UiLCJlIiwibm90SXNQYXJlbnRFZGdlIiwiZ2V0Qm9keSIsInNjcmF0Y2giLCJib2R5IiwiZ2V0Tm9uUGFyZW50RGVzY2VuZGFudHMiLCJkZXNjZW5kYW50cyIsImZpbHRlciIsImdldFNjcmF0Y2giLCJlbCIsIm9wdEZuIiwib3B0IiwiZWxlIiwiRXVsZXIiLCJvcHRpb25zIiwic3RhdGUiLCJzIiwicXVhZHRyZWUiLCJib2RpZXMiLCJub2RlcyIsIm1hc3MiLCJfY3lOb2RlIiwiX3NjcmF0Y2giLCJwdXNoIiwic3ByaW5ncyIsImVkZ2VzIiwic3ByaW5nTGVuZ3RoIiwiX2N5RWRnZSIsInNvdXJjZXMiLCJ0YXJnZXRzIiwibW92ZW1lbnQiLCJpc0RvbmUiLCJtb3ZlbWVudFRocmVzaG9sZCIsInByZXZQb3MiLCJ2ZWxvY2l0eSIsImNvcHlWZWMiLCJ2IiwiZ2V0VmFsdWUiLCJ2YWwiLCJkZWYiLCJnZXRWZWMiLCJ2ZWMiLCJvcHRzIiwiYiIsImdyYXZpdHkiLCJwdWxsIiwidGhldGEiLCJkcmFnQ29lZmYiLCJ0aW1lU3RlcCIsImRlZmF1bHRDb2VmZiIsImFwcGx5RHJhZyIsIm1hbnVhbERyYWdDb2VmZiIsImludGVncmF0ZSIsInR4IiwidHkiLCJpIiwibWF4IiwiZ3JhYmJlZCIsInZ4IiwidnkiLCJhYnMiLCJOb2RlIiwiSW5zZXJ0U3RhY2siLCJyZXNldFZlYyIsImlzU2FtZVBvc2l0aW9uIiwicDEiLCJwMiIsInRocmVzaG9sZCIsInVwZGF0ZVF1ZXVlIiwiaW5zZXJ0U3RhY2siLCJub2Rlc0NhY2hlIiwiY3VycmVudEluQ2FjaGUiLCJyb290IiwibmV3Tm9kZSIsIm5vZGUiLCJxdWFkMCIsInF1YWQxIiwicXVhZDIiLCJxdWFkMyIsIm1hc3NYIiwibWFzc1kiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJ1cGRhdGUiLCJzb3VyY2VCb2R5IiwicXVldWUiLCJmeCIsImZ5IiwicXVldWVMZW5ndGgiLCJzaGlmdElkeCIsInB1c2hJZHgiLCJweCIsInB5IiwicHIiLCJwdiIsImRpZmZlcmVudEJvZHkiLCJpbnNlcnRCb2RpZXMiLCJ4MSIsIk51bWJlciIsIk1BWF9WQUxVRSIsInkxIiwieDIiLCJNSU5fVkFMVUUiLCJ5MiIsImluc2VydCIsIm5ld0JvZHkiLCJyZXNldCIsImlzRW1wdHkiLCJzdGFja0l0ZW0iLCJwb3AiLCJxdWFkSWR4IiwiY2hpbGQiLCJnZXRDaGlsZCIsInNldENoaWxkIiwib2xkQm9keSIsInJldHJpZXNDb3VudCIsIm9mZnNldCIsInVwZGF0ZUJvZHlGb3JjZSIsImlkeCIsInN0YWNrIiwicG9wSWR4IiwicHJvdG90eXBlIiwiaXRlbSIsIkluc2VydFN0YWNrRWxlbWVudCIsInAiLCJyZWdpc3RlciIsImN5dG9zY2FwZSIsImFuaW1hdGUiLCJyZWZyZXNoIiwibWF4SXRlcmF0aW9ucyIsIm1heFNpbXVsYXRpb25UaW1lIiwidW5ncmFiaWZ5V2hpbGVTaW11bGF0aW5nIiwiZml0IiwicGFkZGluZyIsImJvdW5kaW5nQm94IiwidW5kZWZpbmVkIiwicmVhZHkiLCJzdG9wIiwicmFuZG9taXplIiwiaW5maW5pdGUiLCJtYWtlQm91bmRpbmdCb3giLCJzZXRJbml0aWFsUG9zaXRpb25TdGF0ZSIsInJlZnJlc2hQb3NpdGlvbnMiLCJnZXROb2RlUG9zaXRpb25EYXRhIiwibXVsdGl0aWNrIiwibyIsImxheW91dCIsImVsZXMiLCJ0aWNrSW5kZXgiLCJmaXJzdFVwZGF0ZSIsImFuaW1hdGVFbmQiLCJhbmltYXRlQ29udGludW91c2x5IiwibCIsInN0YXJ0VGltZSIsIkRhdGUiLCJub3ciLCJydW5uaW5nIiwiY3VycmVudEJvdW5kaW5nQm94IiwiY3kiLCJvbmUiLCJwcmVydW4iLCJ1bmdyYWJpZnkiLCJncmFiYmFibGUiLCJyZWdyYWJpZnkiLCJncmFiaWZ5IiwidXBkYXRlR3JhYlN0YXRlIiwib25HcmFiIiwib25GcmVlIiwib25EcmFnIiwidHAiLCJwb3NpdGlvbiIsImxpc3RlblRvR3JhYiIsIm9uIiwidW5saXN0ZW5Ub0dyYWIiLCJyZW1vdmVMaXN0ZW5lciIsIm9uTm90RG9uZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZyYW1lIiwib25Eb25lIiwiZW1pdCIsImRvbmUiLCJsYXlvdXRQb3NpdGlvbnMiLCJwZCIsInBvc3RydW4iLCJiYiIsInciLCJ3aWR0aCIsImgiLCJoZWlnaHQiLCJuYW1lIiwicG9zaXRpb25zIiwibm9wIiwidGlja0luZGljYXRlc0RvbmUiLCJkdXJhdGlvbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ2hFQUEsT0FBT0MsT0FBUCxHQUFpQkMsT0FBT0Ms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bkJnQixHQUFtQjtBQUFBLE1BQWRiLE1BQWMsdUVBQUxhLEdBQUs7O0FBQzlELE1BQUlYLE9BQU8sS0FBWDtBQUNBLE1BQUl0SyxJQUFJRCxLQUFSOztBQUVBLE9BQUssSUFBSXdDLElBQUksQ0FBYixFQUFnQkEsSUFBSXZDLEVBQUVrSCxPQUF0QixFQUErQjNFLEdBQS9CLEVBQW9DO0FBQ2xDK0gsV0FBTyxDQUFDdEssRUFBRThJLE9BQUgsSUFBYzFLLEtBQU00QixDQUFOLENBQXJCOztBQUVBLFFBQUlzSyxJQUFKLEVBQVU7QUFBRTtBQUFRO0FBQ3JCOztBQUVELE1BQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1RMO0FBQ0QsR0FGRCxNQUVPO0FBQ0xHO0FBQ0Q7QUFDRixDQWZEOztBQWlCQXJPLE9BQU9DLE9BQVAsR0FBaUIsRUFBRW9DLFVBQUYsRUFBUThKLG9CQUFSLEVBQWpCLEMiLCJmaWxlIjoiY3l0b3NjYXBlLWV1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlRXVsZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiY3l0b3NjYXBlRXVsZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjBhYTc4ZTkyODQ3NTE4ZmQwZjMiLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gIT0gbnVsbCA/IE9iamVjdC5hc3NpZ24uYmluZCggT2JqZWN0ICkgOiBmdW5jdGlvbiggdGd0LCAuLi5zcmNzICl7XG4gIHNyY3MuZm9yRWFjaCggc3JjID0+IHtcbiAgICBPYmplY3Qua2V5cyggc3JjICkuZm9yRWFjaCggayA9PiB0Z3Rba10gPSBzcmNba10gKTtcbiAgfSApO1xuXG4gIHJldHVybiB0Z3Q7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Fzc2lnbi5qcyIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJy4uL2Fzc2lnbicpO1xuXG5jb25zdCBkZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoe1xuICBzb3VyY2U6IG51bGwsXG4gIHRhcmdldDogbnVsbCxcbiAgbGVuZ3RoOiA4MCxcbiAgY29lZmY6IDAuMDAwMixcbiAgd2VpZ2h0OiAxXG59KTtcblxuZnVuY3Rpb24gbWFrZVNwcmluZyggc3ByaW5nICl7XG4gIHJldHVybiBhc3NpZ24oIHt9LCBkZWZhdWx0cywgc3ByaW5nICk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U3ByaW5nKCBzcHJpbmcgKXtcbiAgbGV0IGJvZHkxID0gc3ByaW5nLnNvdXJjZSxcbiAgICAgIGJvZHkyID0gc3ByaW5nLnRhcmdldCxcbiAgICAgIGxlbmd0aCA9IHNwcmluZy5sZW5ndGggPCAwID8gZGVmYXVsdHMubGVuZ3RoIDogc3ByaW5nLmxlbmd0aCxcbiAgICAgIGR4ID0gYm9keTIucG9zLnggLSBib2R5MS5wb3MueCxcbiAgICAgIGR5ID0gYm9keTIucG9zLnkgLSBib2R5MS5wb3MueSxcbiAgICAgIHIgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gIGlmIChyID09PSAwKSB7XG4gICAgICBkeCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAvIDUwO1xuICAgICAgZHkgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgLyA1MDtcbiAgICAgIHIgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9XG5cbiAgbGV0IGQgPSByIC0gbGVuZ3RoO1xuICBsZXQgY29lZmYgPSAoKCFzcHJpbmcuY29lZmYgfHwgc3ByaW5nLmNvZWZmIDwgMCkgPyBkZWZhdWx0cy5zcHJpbmdDb2VmZiA6IHNwcmluZy5jb2VmZikgKiBkIC8gciAqIHNwcmluZy53ZWlnaHQ7XG5cbiAgYm9keTEuZm9yY2UueCArPSBjb2VmZiAqIGR4O1xuICBib2R5MS5mb3JjZS55ICs9IGNvZWZmICogZHk7XG5cbiAgYm9keTIuZm9yY2UueCAtPSBjb2VmZiAqIGR4O1xuICBib2R5Mi5mb3JjZS55IC09IGNvZWZmICogZHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBtYWtlU3ByaW5nLCBhcHBseVNwcmluZyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V1bGVyL3NwcmluZy5qcyIsIi8qKlxuVGhlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBFdWxlciBsYXlvdXQgYWxnb3JpdGhtXG4qL1xuXG5jb25zdCBMYXlvdXQgPSByZXF1aXJlKCcuLi9sYXlvdXQnKTtcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJy4uL2Fzc2lnbicpO1xuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5jb25zdCB7IHRpY2sgfSA9IHJlcXVpcmUoJy4vdGljaycpO1xuY29uc3QgeyBtYWtlUXVhZHRyZWUgfSA9IHJlcXVpcmUoJy4vcXVhZHRyZWUnKTtcbmNvbnN0IHsgbWFrZUJvZHkgfSA9IHJlcXVpcmUoJy4vYm9keScpO1xuY29uc3QgeyBtYWtlU3ByaW5nIH0gPSByZXF1aXJlKCcuL3NwcmluZycpO1xuY29uc3QgaXNGbiA9IGZuID0+IHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJztcbmNvbnN0IGlzUGFyZW50ID0gbiA9PiBuLmlzUGFyZW50KCk7XG5jb25zdCBub3RJc1BhcmVudCA9IG4gPT4gIWlzUGFyZW50KG4pO1xuY29uc3QgaXNMb2NrZWQgPSBuID0+IG4ubG9ja2VkKCk7XG5jb25zdCBub3RJc0xvY2tlZCA9IG4gPT4gIWlzTG9ja2VkKG4pO1xuY29uc3QgaXNQYXJlbnRFZGdlID0gZSA9PiBpc1BhcmVudCggZS5zb3VyY2UoKSApIHx8IGlzUGFyZW50KCBlLnRhcmdldCgpICk7XG5jb25zdCBub3RJc1BhcmVudEVkZ2UgPSBlID0+ICFpc1BhcmVudEVkZ2UoZSk7XG5jb25zdCBnZXRCb2R5ID0gbiA9PiBuLnNjcmF0Y2goJ2V1bGVyJykuYm9keTtcbmNvbnN0IGdldE5vblBhcmVudERlc2NlbmRhbnRzID0gbiA9PiBpc1BhcmVudChuKSA/IG4uZGVzY2VuZGFudHMoKS5maWx0ZXIoIG5vdElzUGFyZW50ICkgOiBuO1xuXG5jb25zdCBnZXRTY3JhdGNoID0gZWwgPT4ge1xuICBsZXQgc2NyYXRjaCA9IGVsLnNjcmF0Y2goJ2V1bGVyJyk7XG5cbiAgaWYoICFzY3JhdGNoICl7XG4gICAgc2NyYXRjaCA9IHt9O1xuXG4gICAgZWwuc2NyYXRjaCgnZXVsZXInLCBzY3JhdGNoKTtcbiAgfVxuXG4gIHJldHVybiBzY3JhdGNoO1xufTtcblxuY29uc3Qgb3B0Rm4gPSAoIG9wdCwgZWxlICkgPT4ge1xuICBpZiggaXNGbiggb3B0ICkgKXtcbiAgICByZXR1cm4gb3B0KCBlbGUgKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb3B0O1xuICB9XG59O1xuXG5jbGFzcyBFdWxlciBleHRlbmRzIExheW91dCB7XG4gIGNvbnN0cnVjdG9yKCBvcHRpb25zICl7XG4gICAgc3VwZXIoIGFzc2lnbigge30sIGRlZmF1bHRzLCBvcHRpb25zICkgKTtcbiAgfVxuXG4gIHByZXJ1biggc3RhdGUgKXtcbiAgICBsZXQgcyA9IHN0YXRlO1xuXG4gICAgcy5xdWFkdHJlZSA9IG1ha2VRdWFkdHJlZSgpO1xuXG4gICAgbGV0IGJvZGllcyA9IHMuYm9kaWVzID0gW107XG5cbiAgICAvLyByZWd1bGFyIG5vZGVzXG4gICAgcy5ub2Rlcy5maWx0ZXIoIG4gPT4gbm90SXNQYXJlbnQobikgKS5mb3JFYWNoKCBuID0+IHtcbiAgICAgIGxldCBzY3JhdGNoID0gZ2V0U2NyYXRjaCggbiApO1xuXG4gICAgICBsZXQgYm9keSA9IG1ha2VCb2R5KHtcbiAgICAgICAgcG9zOiB7IHg6IHNjcmF0Y2gueCwgeTogc2NyYXRjaC55IH0sXG4gICAgICAgIG1hc3M6IG9wdEZuKCBzLm1hc3MsIG4gKSxcbiAgICAgICAgbG9ja2VkOiBzY3JhdGNoLmxvY2tlZFxuICAgICAgfSk7XG5cbiAgICAgIGJvZHkuX2N5Tm9kZSA9IG47XG5cbiAgICAgIHNjcmF0Y2guYm9keSA9IGJvZHk7XG5cbiAgICAgIGJvZHkuX3NjcmF0Y2ggPSBzY3JhdGNoO1xuXG4gICAgICBib2RpZXMucHVzaCggYm9keSApO1xuICAgIH0gKTtcblxuICAgIGxldCBzcHJpbmdzID0gcy5zcHJpbmdzID0gW107XG5cbiAgICAvLyByZWd1bGFyIGVkZ2Ugc3ByaW5nc1xuICAgIHMuZWRnZXMuZmlsdGVyKCBub3RJc1BhcmVudEVkZ2UgKS5mb3JFYWNoKCBlID0+IHtcbiAgICAgIGxldCBzcHJpbmcgPSBtYWtlU3ByaW5nKHtcbiAgICAgICAgc291cmNlOiBnZXRCb2R5KCBlLnNvdXJjZSgpICksXG4gICAgICAgIHRhcmdldDogZ2V0Qm9keSggZS50YXJnZXQoKSApLFxuICAgICAgICBsZW5ndGg6IG9wdEZuKCBzLnNwcmluZ0xlbmd0aCwgZSApLFxuICAgICAgICBjb2VmZjogb3B0Rm4oIHMuc3ByaW5nQ29lZmYsIGUgKVxuICAgICAgfSk7XG5cbiAgICAgIHNwcmluZy5fY3lFZGdlID0gZTtcblxuICAgICAgbGV0IHNjcmF0Y2ggPSBnZXRTY3JhdGNoKCBlICk7XG5cbiAgICAgIHNwcmluZy5fc2NyYXRjaCA9IHNjcmF0Y2g7XG5cbiAgICAgIHNjcmF0Y2guc3ByaW5nID0gc3ByaW5nO1xuXG4gICAgICBzcHJpbmdzLnB1c2goIHNwcmluZyApO1xuICAgIH0gKTtcblxuICAgIC8vIGNvbXBvdW5kIGVkZ2Ugc3ByaW5nc1xuICAgIHMuZWRnZXMuZmlsdGVyKCBpc1BhcmVudEVkZ2UgKS5mb3JFYWNoKCBlID0+IHtcbiAgICAgIGxldCBzb3VyY2VzID0gZ2V0Tm9uUGFyZW50RGVzY2VuZGFudHMoIGUuc291cmNlKCkgKTtcbiAgICAgIGxldCB0YXJnZXRzID0gZ2V0Tm9uUGFyZW50RGVzY2VuZGFudHMoIGUudGFyZ2V0KCkgKTtcblxuICAgICAgLy8ganVzdCBhZGQgb25lIHNwcmluZyBmb3IgcGVyZlxuICAgICAgc291cmNlcyA9IFsgc291cmNlc1swXSBdO1xuICAgICAgdGFyZ2V0cyA9IFsgdGFyZ2V0c1swXSBdO1xuXG4gICAgICBzb3VyY2VzLmZvckVhY2goIHNyYyA9PiB7XG4gICAgICAgIHRhcmdldHMuZm9yRWFjaCggdGd0ID0+IHtcbiAgICAgICAgICBzcHJpbmdzLnB1c2goIG1ha2VTcHJpbmcoe1xuICAgICAgICAgICAgc291cmNlOiBnZXRCb2R5KCBzcmMgKSxcbiAgICAgICAgICAgIHRhcmdldDogZ2V0Qm9keSggdGd0ICksXG4gICAgICAgICAgICBsZW5ndGg6IG9wdEZuKCBzLnNwcmluZ0xlbmd0aCwgZSApLFxuICAgICAgICAgICAgY29lZmY6IG9wdEZuKCBzLnNwcmluZ0NvZWZmLCBlIClcbiAgICAgICAgICB9KSApO1xuICAgICAgICB9ICk7XG4gICAgICB9ICk7XG4gICAgfSApO1xuICB9XG5cbiAgdGljayggc3RhdGUgKXtcbiAgICBsZXQgbW92ZW1lbnQgPSB0aWNrKCBzdGF0ZSApO1xuXG4gICAgbGV0IGlzRG9uZSA9IG1vdmVtZW50IDw9IHN0YXRlLm1vdmVtZW50VGhyZXNob2xkO1xuXG4gICAgcmV0dXJuIGlzRG9uZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV1bGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V1bGVyL2luZGV4LmpzIiwiY29uc3QgZGVmYXVsdHMgPSBPYmplY3QuZnJlZXplKHtcbiAgcG9zOiB7IHg6IDAsIHk6IDAgfSxcbiAgcHJldlBvczogeyB4OiAwLCB5OiAwIH0sXG4gIGZvcmNlOiB7IHg6IDAsIHk6IDAgfSxcbiAgdmVsb2NpdHk6IHsgeDogMCwgeTogMCB9LFxuICBtYXNzOiAxXG59KTtcblxuY29uc3QgY29weVZlYyA9IHYgPT4gKHsgeDogdi54LCB5OiB2LnkgfSk7XG5jb25zdCBnZXRWYWx1ZSA9ICggdmFsLCBkZWYgKSA9PiB2YWwgIT0gbnVsbCA/IHZhbCA6IGRlZjtcbmNvbnN0IGdldFZlYyA9ICggdmVjLCBkZWYgKSA9PiBjb3B5VmVjKCBnZXRWYWx1ZSggdmVjLCBkZWYgKSApO1xuXG5mdW5jdGlvbiBtYWtlQm9keSggb3B0cyApe1xuICBsZXQgYiA9IHt9O1xuXG4gIGIucG9zID0gZ2V0VmVjKCBvcHRzLnBvcywgZGVmYXVsdHMucG9zICk7XG4gIGIucHJldlBvcyA9IGdldFZlYyggb3B0cy5wcmV2UG9zLCBiLnBvcyApO1xuICBiLmZvcmNlID0gZ2V0VmVjKCBvcHRzLmZvcmNlLCBkZWZhdWx0cy5mb3JjZSApO1xuICBiLnZlbG9jaXR5ID0gZ2V0VmVjKCBvcHRzLnZlbG9jaXR5LCBkZWZhdWx0cy52ZWxvY2l0eSApO1xuICBiLm1hc3MgPSBvcHRzLm1hc3MgIT0gbnVsbCA/IG9wdHMubWFzcyA6IGRlZmF1bHRzLm1hc3M7XG4gIGIubG9ja2VkID0gb3B0cy5sb2NrZWQ7XG5cbiAgcmV0dXJuIGI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBtYWtlQm9keSB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V1bGVyL2JvZHkuanMiLCJjb25zdCBkZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoe1xuICAvLyBUaGUgaWRlYWwgbGVndGggb2YgYSBzcHJpbmdcbiAgLy8gLSBUaGlzIGFjdHMgYXMgYSBoaW50IGZvciB0aGUgZWRnZSBsZW5ndGhcbiAgLy8gLSBUaGUgZWRnZSBsZW5ndGggY2FuIGJlIGxvbmdlciBvciBzaG9ydGVyIGlmIHRoZSBmb3JjZXMgYXJlIHNldCB0byBleHRyZW1lIHZhbHVlc1xuICBzcHJpbmdMZW5ndGg6IGVkZ2UgPT4gODAsXG5cbiAgLy8gSG9va2UncyBsYXcgY29lZmZpY2llbnRcbiAgLy8gLSBUaGUgdmFsdWUgcmFuZ2VzIG9uIFswLCAxXVxuICAvLyAtIExvd2VyIHZhbHVlcyBnaXZlIGxvb3NlciBzcHJpbmdzXG4gIC8vIC0gSGlnaGVyIHZhbHVlcyBnaXZlIHRpZ2h0ZXIgc3ByaW5nc1xuICBzcHJpbmdDb2VmZjogZWRnZSA9PiAwLjAwMDgsXG5cbiAgLy8gVGhlIG1hc3Mgb2YgdGhlIG5vZGUgaW4gdGhlIHBoeXNpY3Mgc2ltdWxhdGlvblxuICAvLyAtIFRoZSBtYXNzIGFmZmVjdHMgdGhlIGdyYXZpdHkgbm9kZSByZXB1bHNpb24vYXR0cmFjdGlvblxuICBtYXNzOiBub2RlID0+IDQsXG5cbiAgLy8gQ291bG9tYidzIGxhdyBjb2VmZmljaWVudFxuICAvLyAtIE1ha2VzIHRoZSBub2RlcyByZXBlbCBlYWNoIG90aGVyIGZvciBuZWdhdGl2ZSB2YWx1ZXNcbiAgLy8gLSBNYWtlcyB0aGUgbm9kZXMgYXR0cmFjdCBlYWNoIG90aGVyIGZvciBwb3NpdGl2ZSB2YWx1ZXNcbiAgZ3Jhdml0eTogLTEuMixcblxuICAvLyBBIGZvcmNlIHRoYXQgcHVsbHMgbm9kZXMgdG93YXJkcyB0aGUgb3JpZ2luICgwLCAwKVxuICAvLyBIaWdoZXIgdmFsdWVzIGtlZXAgdGhlIGNvbXBvbmVudHMgbGVzcyBzcHJlYWQgb3V0XG4gIHB1bGw6IDAuMDAxLFxuXG4gIC8vIFRoZXRhIGNvZWZmaWNpZW50IGZyb20gQmFybmVzLUh1dCBzaW11bGF0aW9uXG4gIC8vIC0gVmFsdWUgcmFuZ2VzIG9uIFswLCAxXVxuICAvLyAtIFBlcmZvcm1hbmNlIGlzIGJldHRlciB3aXRoIHNtYWxsZXIgdmFsdWVzXG4gIC8vIC0gVmVyeSBzbWFsbCB2YWx1ZXMgbWF5IG5vdCBjcmVhdGUgZW5vdWdoIGZvcmNlIHRvIGdpdmUgYSBnb29kIHJlc3VsdFxuICB0aGV0YTogMC42NjYsXG5cbiAgLy8gRnJpY3Rpb24gLyBkcmFnIGNvZWZmaWNpZW50IHRvIG1ha2UgdGhlIHN5c3RlbSBzdGFiaWxpc2Ugb3ZlciB0aW1lXG4gIGRyYWdDb2VmZjogMC4wMixcblxuICAvLyBXaGVuIHRoZSB0b3RhbCBvZiB0aGUgc3F1YXJlZCBwb3NpdGlvbiBkZWx0YXMgaXMgbGVzcyB0aGFuIHRoaXMgdmFsdWUsIHRoZSBzaW11bGF0aW9uIGVuZHNcbiAgbW92ZW1lbnRUaHJlc2hvbGQ6IDEsXG5cbiAgLy8gVGhlIGFtb3VudCBvZiB0aW1lIHBhc3NlZCBwZXIgdGlja1xuICAvLyAtIExhcmdlciB2YWx1ZXMgcmVzdWx0IGluIGZhc3RlciBydW50aW1lcyBidXQgbWlnaHQgc3ByZWFkIHRoaW5ncyBvdXQgdG9vIGZhclxuICAvLyAtIFNtYWxsZXIgdmFsdWVzIHByb2R1Y2UgbW9yZSBhY2N1cmF0ZSByZXN1bHRzXG4gIHRpbWVTdGVwOiAyMFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXVsZXIvZGVmYXVsdHMuanMiLCJjb25zdCBkZWZhdWx0Q29lZmYgPSAwLjAyO1xuXG5mdW5jdGlvbiBhcHBseURyYWcoIGJvZHksIG1hbnVhbERyYWdDb2VmZiApe1xuICBsZXQgZHJhZ0NvZWZmO1xuXG4gIGlmKCBtYW51YWxEcmFnQ29lZmYgIT0gbnVsbCApe1xuICAgIGRyYWdDb2VmZiA9IG1hbnVhbERyYWdDb2VmZjtcbiAgfSBlbHNlIGlmKCBib2R5LmRyYWdDb2VmZiAhPSBudWxsICl7XG4gICAgZHJhZ0NvZWZmID0gYm9keS5kcmFnQ29lZmY7XG4gIH0gZWxzZSB7XG4gICAgZHJhZ0NvZWZmID0gZGVmYXVsdENvZWZmO1xuICB9XG5cbiAgYm9keS5mb3JjZS54IC09IGRyYWdDb2VmZiAqIGJvZHkudmVsb2NpdHkueDtcbiAgYm9keS5mb3JjZS55IC09IGRyYWdDb2VmZiAqIGJvZHkudmVsb2NpdHkueTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGFwcGx5RHJhZyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V1bGVyL2RyYWcuanMiLCIvLyB1c2UgZXVsZXIgbWV0aG9kIGZvciBmb3JjZSBpbnRlZ3JhdGlvbiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0V1bGVyX21ldGhvZFxuLy8gcmV0dXJuIHN1bSBvZiBzcXVhcmVkIHBvc2l0aW9uIGRlbHRhc1xuZnVuY3Rpb24gaW50ZWdyYXRlKCBib2RpZXMsIHRpbWVTdGVwICl7XG4gIHZhciBkeCA9IDAsIHR4ID0gMCxcbiAgICAgIGR5ID0gMCwgdHkgPSAwLFxuICAgICAgaSxcbiAgICAgIG1heCA9IGJvZGllcy5sZW5ndGg7XG5cbiAgaWYgKG1heCA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IG1heDsgKytpKSB7XG4gICAgdmFyIGJvZHkgPSBib2RpZXNbaV0sXG4gICAgICAgIGNvZWZmID0gdGltZVN0ZXAgLyBib2R5Lm1hc3M7XG5cbiAgICBpZiggYm9keS5ncmFiYmVkICl7IGNvbnRpbnVlOyB9XG5cbiAgICBpZiggYm9keS5sb2NrZWQgKXtcbiAgICAgIGJvZHkudmVsb2NpdHkueCA9IDA7XG4gICAgICBib2R5LnZlbG9jaXR5LnkgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5LnZlbG9jaXR5LnggKz0gY29lZmYgKiBib2R5LmZvcmNlLng7XG4gICAgICBib2R5LnZlbG9jaXR5LnkgKz0gY29lZmYgKiBib2R5LmZvcmNlLnk7XG4gICAgfVxuXG4gICAgdmFyIHZ4ID0gYm9keS52ZWxvY2l0eS54LFxuICAgICAgICB2eSA9IGJvZHkudmVsb2NpdHkueSxcbiAgICAgICAgdiA9IE1hdGguc3FydCh2eCAqIHZ4ICsgdnkgKiB2eSk7XG5cbiAgICBpZiAodiA+IDEpIHtcbiAgICAgIGJvZHkudmVsb2NpdHkueCA9IHZ4IC8gdjtcbiAgICAgIGJvZHkudmVsb2NpdHkueSA9IHZ5IC8gdjtcbiAgICB9XG5cbiAgICBkeCA9IHRpbWVTdGVwICogYm9keS52ZWxvY2l0eS54O1xuICAgIGR5ID0gdGltZVN0ZXAgKiBib2R5LnZlbG9jaXR5Lnk7XG5cbiAgICBib2R5LnBvcy54ICs9IGR4O1xuICAgIGJvZHkucG9zLnkgKz0gZHk7XG5cbiAgICB0eCArPSBNYXRoLmFicyhkeCk7IHR5ICs9IE1hdGguYWJzKGR5KTtcbiAgfVxuXG4gIHJldHVybiAodHggKiB0eCArIHR5ICogdHkpL21heDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGludGVncmF0ZSB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V1bGVyL2ludGVncmF0ZS5qcyIsIi8vIGltcGwgb2YgYmFybmVzIGh1dFxuLy8gaHR0cDovL3d3dy5lZWNzLmJlcmtlbGV5LmVkdS9+ZGVtbWVsL2NzMjY3L2xlY3R1cmUyNi9sZWN0dXJlMjYuaHRtbFxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXJuZXMlRTIlODAlOTNIdXRfc2ltdWxhdGlvblxuXG5jb25zdCBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG5jb25zdCBJbnNlcnRTdGFjayA9IHJlcXVpcmUoJy4vaW5zZXJ0U3RhY2snKTtcblxuY29uc3QgcmVzZXRWZWMgPSB2ID0+IHsgdi54ID0gMDsgdi55ID0gMDsgfTtcblxuY29uc3QgaXNTYW1lUG9zaXRpb24gPSAocDEsIHAyKSA9PiB7XG4gIGxldCB0aHJlc2hvbGQgPSAxZS04O1xuICBsZXQgZHggPSBNYXRoLmFicyhwMS54IC0gcDIueCk7XG4gIGxldCBkeSA9IE1hdGguYWJzKHAxLnkgLSBwMi55KTtcblxuICByZXR1cm4gZHggPCB0aHJlc2hvbGQgJiYgZHkgPCB0aHJlc2hvbGQ7XG59O1xuXG5mdW5jdGlvbiBtYWtlUXVhZHRyZWUoKXtcbiAgbGV0IHVwZGF0ZVF1ZXVlID0gW10sXG4gICAgaW5zZXJ0U3RhY2sgPSBuZXcgSW5zZXJ0U3RhY2soKSxcbiAgICBub2Rlc0NhY2hlID0gW10sXG4gICAgY3VycmVudEluQ2FjaGUgPSAwLFxuICAgIHJvb3QgPSBuZXdOb2RlKCk7XG5cbiAgZnVuY3Rpb24gbmV3Tm9kZSgpIHtcbiAgICAvLyBUbyBhdm9pZCBwcmVzc3VyZSBvbiBHQyB3ZSByZXVzZSBub2Rlcy5cbiAgICBsZXQgbm9kZSA9IG5vZGVzQ2FjaGVbY3VycmVudEluQ2FjaGVdO1xuICAgIGlmIChub2RlKSB7XG4gICAgICBub2RlLnF1YWQwID0gbnVsbDtcbiAgICAgIG5vZGUucXVhZDEgPSBudWxsO1xuICAgICAgbm9kZS5xdWFkMiA9IG51bGw7XG4gICAgICBub2RlLnF1YWQzID0gbnVsbDtcbiAgICAgIG5vZGUuYm9keSA9IG51bGw7XG4gICAgICBub2RlLm1hc3MgPSBub2RlLm1hc3NYID0gbm9kZS5tYXNzWSA9IDA7XG4gICAgICBub2RlLmxlZnQgPSBub2RlLnJpZ2h0ID0gbm9kZS50b3AgPSBub2RlLmJvdHRvbSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBuZXcgTm9kZSgpO1xuICAgICAgbm9kZXNDYWNoZVtjdXJyZW50SW5DYWNoZV0gPSBub2RlO1xuICAgIH1cblxuICAgICsrY3VycmVudEluQ2FjaGU7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUoIHNvdXJjZUJvZHksIGdyYXZpdHksIHRoZXRhLCBwdWxsICkge1xuICAgIGxldCBxdWV1ZSA9IHVwZGF0ZVF1ZXVlLFxuICAgICAgdixcbiAgICAgIGR4LFxuICAgICAgZHksXG4gICAgICByLCBmeCA9IDAsXG4gICAgICBmeSA9IDAsXG4gICAgICBxdWV1ZUxlbmd0aCA9IDEsXG4gICAgICBzaGlmdElkeCA9IDAsXG4gICAgICBwdXNoSWR4ID0gMTtcblxuICAgIHF1ZXVlWzBdID0gcm9vdDtcblxuICAgIHJlc2V0VmVjKCBzb3VyY2VCb2R5LmZvcmNlICk7XG5cbiAgICBsZXQgcHggPSAtc291cmNlQm9keS5wb3MueDtcbiAgICBsZXQgcHkgPSAtc291cmNlQm9keS5wb3MueTtcbiAgICBsZXQgcHIgPSBNYXRoLnNxcnQocHggKiBweCArIHB5ICogcHkpO1xuICAgIGxldCBwdiA9IHNvdXJjZUJvZHkubWFzcyAqIHB1bGwgLyBwcjtcblxuICAgIGZ4ICs9IHB2ICogcHg7XG4gICAgZnkgKz0gcHYgKiBweTtcblxuICAgIHdoaWxlIChxdWV1ZUxlbmd0aCkge1xuICAgICAgbGV0IG5vZGUgPSBxdWV1ZVtzaGlmdElkeF0sXG4gICAgICAgIGJvZHkgPSBub2RlLmJvZHk7XG5cbiAgICAgIHF1ZXVlTGVuZ3RoIC09IDE7XG4gICAgICBzaGlmdElkeCArPSAxO1xuICAgICAgbGV0IGRpZmZlcmVudEJvZHkgPSAoYm9keSAhPT0gc291cmNlQm9keSk7XG4gICAgICBpZiAoYm9keSAmJiBkaWZmZXJlbnRCb2R5KSB7XG4gICAgICAgIC8vIElmIHRoZSBjdXJyZW50IG5vZGUgaXMgYSBsZWFmIG5vZGUgKGFuZCBpdCBpcyBub3Qgc291cmNlIGJvZHkpLFxuICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGZvcmNlIGV4ZXJ0ZWQgYnkgdGhlIGN1cnJlbnQgbm9kZSBvbiBib2R5LCBhbmQgYWRkIHRoaXNcbiAgICAgICAgLy8gYW1vdW50IHRvIGJvZHkncyBuZXQgZm9yY2UuXG4gICAgICAgIGR4ID0gYm9keS5wb3MueCAtIHNvdXJjZUJvZHkucG9zLng7XG4gICAgICAgIGR5ID0gYm9keS5wb3MueSAtIHNvdXJjZUJvZHkucG9zLnk7XG4gICAgICAgIHIgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gICAgICAgIGlmIChyID09PSAwKSB7XG4gICAgICAgICAgLy8gUG9vciBtYW4ncyBwcm90ZWN0aW9uIGFnYWluc3QgemVybyBkaXN0YW5jZS5cbiAgICAgICAgICBkeCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAvIDUwO1xuICAgICAgICAgIGR5ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpIC8gNTA7XG4gICAgICAgICAgciA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIHN0YW5kYXJkIGdyYXZpdGlvbiBmb3JjZSBjYWxjdWxhdGlvbiBidXQgd2UgZGl2aWRlXG4gICAgICAgIC8vIGJ5IHJeMyB0byBzYXZlIHR3byBvcGVyYXRpb25zIHdoZW4gbm9ybWFsaXppbmcgZm9yY2UgdmVjdG9yLlxuICAgICAgICB2ID0gZ3Jhdml0eSAqIGJvZHkubWFzcyAqIHNvdXJjZUJvZHkubWFzcyAvIChyICogciAqIHIpO1xuICAgICAgICBmeCArPSB2ICogZHg7XG4gICAgICAgIGZ5ICs9IHYgKiBkeTtcbiAgICAgIH0gZWxzZSBpZiAoZGlmZmVyZW50Qm9keSkge1xuICAgICAgICAvLyBPdGhlcndpc2UsIGNhbGN1bGF0ZSB0aGUgcmF0aW8gcyAvIHIsICB3aGVyZSBzIGlzIHRoZSB3aWR0aCBvZiB0aGUgcmVnaW9uXG4gICAgICAgIC8vIHJlcHJlc2VudGVkIGJ5IHRoZSBpbnRlcm5hbCBub2RlLCBhbmQgciBpcyB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgYm9keVxuICAgICAgICAvLyBhbmQgdGhlIG5vZGUncyBjZW50ZXItb2YtbWFzc1xuICAgICAgICBkeCA9IG5vZGUubWFzc1ggLyBub2RlLm1hc3MgLSBzb3VyY2VCb2R5LnBvcy54O1xuICAgICAgICBkeSA9IG5vZGUubWFzc1kgLyBub2RlLm1hc3MgLSBzb3VyY2VCb2R5LnBvcy55O1xuICAgICAgICByID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgICAgICBpZiAociA9PT0gMCkge1xuICAgICAgICAgIC8vIFNvcnJ5IGFib3V0IGNvZGUgZHVwbHVjYXRpb24uIEkgZG9uJ3Qgd2FudCB0byBjcmVhdGUgbWFueSBmdW5jdGlvbnNcbiAgICAgICAgICAvLyByaWdodCBhd2F5LiBKdXN0IHdhbnQgdG8gc2VlIHBlcmZvcm1hbmNlIGZpcnN0LlxuICAgICAgICAgIGR4ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpIC8gNTA7XG4gICAgICAgICAgZHkgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgLyA1MDtcbiAgICAgICAgICByID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBzIC8gciA8IM64LCB0cmVhdCB0aGlzIGludGVybmFsIG5vZGUgYXMgYSBzaW5nbGUgYm9keSwgYW5kIGNhbGN1bGF0ZSB0aGVcbiAgICAgICAgLy8gZm9yY2UgaXQgZXhlcnRzIG9uIHNvdXJjZUJvZHksIGFuZCBhZGQgdGhpcyBhbW91bnQgdG8gc291cmNlQm9keSdzIG5ldCBmb3JjZS5cbiAgICAgICAgaWYgKChub2RlLnJpZ2h0IC0gbm9kZS5sZWZ0KSAvIHIgPCB0aGV0YSkge1xuICAgICAgICAgIC8vIGluIHRoZSBpZiBzdGF0ZW1lbnQgYWJvdmUgd2UgY29uc2lkZXIgbm9kZSdzIHdpZHRoIG9ubHlcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZSByZWdpb24gd2FzIHNxdWFyaWZpZWQgZHVyaW5nIHRyZWUgY3JlYXRpb24uXG4gICAgICAgICAgLy8gVGh1cyB0aGVyZSBpcyBubyBkaWZmZXJlbmNlIGJldHdlZW4gdXNpbmcgd2lkdGggb3IgaGVpZ2h0LlxuICAgICAgICAgIHYgPSBncmF2aXR5ICogbm9kZS5tYXNzICogc291cmNlQm9keS5tYXNzIC8gKHIgKiByICogcik7XG4gICAgICAgICAgZnggKz0gdiAqIGR4O1xuICAgICAgICAgIGZ5ICs9IHYgKiBkeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UsIHJ1biB0aGUgcHJvY2VkdXJlIHJlY3Vyc2l2ZWx5IG9uIGVhY2ggb2YgdGhlIGN1cnJlbnQgbm9kZSdzIGNoaWxkcmVuLlxuXG4gICAgICAgICAgLy8gSSBpbnRlbnRpb25hbGx5IHVuZm9sZGVkIHRoaXMgbG9vcCwgdG8gc2F2ZSBzZXZlcmFsIENQVSBjeWNsZXMuXG4gICAgICAgICAgaWYgKG5vZGUucXVhZDApIHtcbiAgICAgICAgICAgIHF1ZXVlW3B1c2hJZHhdID0gbm9kZS5xdWFkMDtcbiAgICAgICAgICAgIHF1ZXVlTGVuZ3RoICs9IDE7XG4gICAgICAgICAgICBwdXNoSWR4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChub2RlLnF1YWQxKSB7XG4gICAgICAgICAgICBxdWV1ZVtwdXNoSWR4XSA9IG5vZGUucXVhZDE7XG4gICAgICAgICAgICBxdWV1ZUxlbmd0aCArPSAxO1xuICAgICAgICAgICAgcHVzaElkeCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobm9kZS5xdWFkMikge1xuICAgICAgICAgICAgcXVldWVbcHVzaElkeF0gPSBub2RlLnF1YWQyO1xuICAgICAgICAgICAgcXVldWVMZW5ndGggKz0gMTtcbiAgICAgICAgICAgIHB1c2hJZHggKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG5vZGUucXVhZDMpIHtcbiAgICAgICAgICAgIHF1ZXVlW3B1c2hJZHhdID0gbm9kZS5xdWFkMztcbiAgICAgICAgICAgIHF1ZXVlTGVuZ3RoICs9IDE7XG4gICAgICAgICAgICBwdXNoSWR4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc291cmNlQm9keS5mb3JjZS54ICs9IGZ4O1xuICAgIHNvdXJjZUJvZHkuZm9yY2UueSArPSBmeTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydEJvZGllcyhib2RpZXMpIHtcbiAgICBpZiggYm9kaWVzLmxlbmd0aCA9PT0gMCApeyByZXR1cm47IH1cblxuICAgIGxldCB4MSA9IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICB5MSA9IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICB4MiA9IE51bWJlci5NSU5fVkFMVUUsXG4gICAgICB5MiA9IE51bWJlci5NSU5fVkFMVUUsXG4gICAgICBpLFxuICAgICAgbWF4ID0gYm9kaWVzLmxlbmd0aDtcblxuICAgIC8vIFRvIHJlZHVjZSBxdWFkIHRyZWUgZGVwdGggd2UgYXJlIGxvb2tpbmcgZm9yIGV4YWN0IGJvdW5kaW5nIGJveCBvZiBhbGwgcGFydGljbGVzLlxuICAgIGkgPSBtYXg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgbGV0IHggPSBib2RpZXNbaV0ucG9zLng7XG4gICAgICBsZXQgeSA9IGJvZGllc1tpXS5wb3MueTtcbiAgICAgIGlmICh4IDwgeDEpIHtcbiAgICAgICAgeDEgPSB4O1xuICAgICAgfVxuICAgICAgaWYgKHggPiB4Mikge1xuICAgICAgICB4MiA9IHg7XG4gICAgICB9XG4gICAgICBpZiAoeSA8IHkxKSB7XG4gICAgICAgIHkxID0geTtcbiAgICAgIH1cbiAgICAgIGlmICh5ID4geTIpIHtcbiAgICAgICAgeTIgPSB5O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNxdWFyaWZ5IHRoZSBib3VuZHMuXG4gICAgbGV0IGR4ID0geDIgLSB4MSxcbiAgICAgIGR5ID0geTIgLSB5MTtcbiAgICBpZiAoZHggPiBkeSkge1xuICAgICAgeTIgPSB5MSArIGR4O1xuICAgIH0gZWxzZSB7XG4gICAgICB4MiA9IHgxICsgZHk7XG4gICAgfVxuXG4gICAgY3VycmVudEluQ2FjaGUgPSAwO1xuICAgIHJvb3QgPSBuZXdOb2RlKCk7XG4gICAgcm9vdC5sZWZ0ID0geDE7XG4gICAgcm9vdC5yaWdodCA9IHgyO1xuICAgIHJvb3QudG9wID0geTE7XG4gICAgcm9vdC5ib3R0b20gPSB5MjtcblxuICAgIGkgPSBtYXggLSAxO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHJvb3QuYm9keSA9IGJvZGllc1tpXTtcbiAgICB9XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaW5zZXJ0KGJvZGllc1tpXSwgcm9vdCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0KG5ld0JvZHkpIHtcbiAgICBpbnNlcnRTdGFjay5yZXNldCgpO1xuICAgIGluc2VydFN0YWNrLnB1c2gocm9vdCwgbmV3Qm9keSk7XG5cbiAgICB3aGlsZSAoIWluc2VydFN0YWNrLmlzRW1wdHkoKSkge1xuICAgICAgbGV0IHN0YWNrSXRlbSA9IGluc2VydFN0YWNrLnBvcCgpLFxuICAgICAgICBub2RlID0gc3RhY2tJdGVtLm5vZGUsXG4gICAgICAgIGJvZHkgPSBzdGFja0l0ZW0uYm9keTtcblxuICAgICAgaWYgKCFub2RlLmJvZHkpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBpbnRlcm5hbCBub2RlLiBVcGRhdGUgdGhlIHRvdGFsIG1hc3Mgb2YgdGhlIG5vZGUgYW5kIGNlbnRlci1vZi1tYXNzLlxuICAgICAgICBsZXQgeCA9IGJvZHkucG9zLng7XG4gICAgICAgIGxldCB5ID0gYm9keS5wb3MueTtcbiAgICAgICAgbm9kZS5tYXNzID0gbm9kZS5tYXNzICsgYm9keS5tYXNzO1xuICAgICAgICBub2RlLm1hc3NYID0gbm9kZS5tYXNzWCArIGJvZHkubWFzcyAqIHg7XG4gICAgICAgIG5vZGUubWFzc1kgPSBub2RlLm1hc3NZICsgYm9keS5tYXNzICogeTtcblxuICAgICAgICAvLyBSZWN1cnNpdmVseSBpbnNlcnQgdGhlIGJvZHkgaW4gdGhlIGFwcHJvcHJpYXRlIHF1YWRyYW50LlxuICAgICAgICAvLyBCdXQgZmlyc3QgZmluZCB0aGUgYXBwcm9wcmlhdGUgcXVhZHJhbnQuXG4gICAgICAgIGxldCBxdWFkSWR4ID0gMCwgLy8gQXNzdW1lIHdlIGFyZSBpbiB0aGUgMCdzIHF1YWQuXG4gICAgICAgICAgbGVmdCA9IG5vZGUubGVmdCxcbiAgICAgICAgICByaWdodCA9IChub2RlLnJpZ2h0ICsgbGVmdCkgLyAyLFxuICAgICAgICAgIHRvcCA9IG5vZGUudG9wLFxuICAgICAgICAgIGJvdHRvbSA9IChub2RlLmJvdHRvbSArIHRvcCkgLyAyO1xuXG4gICAgICAgIGlmICh4ID4gcmlnaHQpIHsgLy8gc29tZXdoZXJlIGluIHRoZSBlYXN0ZXJuIHBhcnQuXG4gICAgICAgICAgcXVhZElkeCA9IHF1YWRJZHggKyAxO1xuICAgICAgICAgIGxlZnQgPSByaWdodDtcbiAgICAgICAgICByaWdodCA9IG5vZGUucmlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkgPiBib3R0b20pIHsgLy8gYW5kIGluIHNvdXRoLlxuICAgICAgICAgIHF1YWRJZHggPSBxdWFkSWR4ICsgMjtcbiAgICAgICAgICB0b3AgPSBib3R0b207XG4gICAgICAgICAgYm90dG9tID0gbm9kZS5ib3R0b207XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hpbGQgPSBnZXRDaGlsZChub2RlLCBxdWFkSWR4KTtcbiAgICAgICAgaWYgKCFjaGlsZCkge1xuICAgICAgICAgIC8vIFRoZSBub2RlIGlzIGludGVybmFsIGJ1dCB0aGlzIHF1YWRyYW50IGlzIG5vdCB0YWtlbi4gQWRkXG4gICAgICAgICAgLy8gc3Vibm9kZSB0byBpdC5cbiAgICAgICAgICBjaGlsZCA9IG5ld05vZGUoKTtcbiAgICAgICAgICBjaGlsZC5sZWZ0ID0gbGVmdDtcbiAgICAgICAgICBjaGlsZC50b3AgPSB0b3A7XG4gICAgICAgICAgY2hpbGQucmlnaHQgPSByaWdodDtcbiAgICAgICAgICBjaGlsZC5ib3R0b20gPSBib3R0b207XG4gICAgICAgICAgY2hpbGQuYm9keSA9IGJvZHk7XG5cbiAgICAgICAgICBzZXRDaGlsZChub2RlLCBxdWFkSWR4LCBjaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY29udGludWUgc2VhcmNoaW5nIGluIHRoaXMgcXVhZHJhbnQuXG4gICAgICAgICAgaW5zZXJ0U3RhY2sucHVzaChjaGlsZCwgYm9keSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGFyZSB0cnlpbmcgdG8gYWRkIHRvIHRoZSBsZWFmIG5vZGUuXG4gICAgICAgIC8vIFdlIGhhdmUgdG8gY29udmVydCBjdXJyZW50IGxlYWYgaW50byBpbnRlcm5hbCBub2RlXG4gICAgICAgIC8vIGFuZCBjb250aW51ZSBhZGRpbmcgdHdvIG5vZGVzLlxuICAgICAgICBsZXQgb2xkQm9keSA9IG5vZGUuYm9keTtcbiAgICAgICAgbm9kZS5ib2R5ID0gbnVsbDsgLy8gaW50ZXJuYWwgbm9kZXMgZG8gbm90IGNhcnkgYm9kaWVzXG5cbiAgICAgICAgaWYgKGlzU2FtZVBvc2l0aW9uKG9sZEJvZHkucG9zLCBib2R5LnBvcykpIHtcbiAgICAgICAgICAvLyBQcmV2ZW50IGluZmluaXRlIHN1YmRpdmlzaW9uIGJ5IGJ1bXBpbmcgb25lIG5vZGVcbiAgICAgICAgICAvLyBhbnl3aGVyZSBpbiB0aGlzIHF1YWRyYW50XG4gICAgICAgICAgbGV0IHJldHJpZXNDb3VudCA9IDM7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBsZXQgZHggPSAobm9kZS5yaWdodCAtIG5vZGUubGVmdCkgKiBvZmZzZXQ7XG4gICAgICAgICAgICBsZXQgZHkgPSAobm9kZS5ib3R0b20gLSBub2RlLnRvcCkgKiBvZmZzZXQ7XG5cbiAgICAgICAgICAgIG9sZEJvZHkucG9zLnggPSBub2RlLmxlZnQgKyBkeDtcbiAgICAgICAgICAgIG9sZEJvZHkucG9zLnkgPSBub2RlLnRvcCArIGR5O1xuICAgICAgICAgICAgcmV0cmllc0NvdW50IC09IDE7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgYnVtcCBpdCBvdXQgb2YgdGhlIGJveC4gSWYgd2UgZG8sIG5leHQgaXRlcmF0aW9uIHNob3VsZCBmaXggaXRcbiAgICAgICAgICB9IHdoaWxlIChyZXRyaWVzQ291bnQgPiAwICYmIGlzU2FtZVBvc2l0aW9uKG9sZEJvZHkucG9zLCBib2R5LnBvcykpO1xuXG4gICAgICAgICAgaWYgKHJldHJpZXNDb3VudCA9PT0gMCAmJiBpc1NhbWVQb3NpdGlvbihvbGRCb2R5LnBvcywgYm9keS5wb3MpKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIHZlcnkgYmFkLCB3ZSByYW4gb3V0IG9mIHByZWNpc2lvbi5cbiAgICAgICAgICAgIC8vIGlmIHdlIGRvIG5vdCByZXR1cm4gZnJvbSB0aGUgbWV0aG9kIHdlJ2xsIGdldCBpbnRvXG4gICAgICAgICAgICAvLyBpbmZpbml0ZSBsb29wIGhlcmUuIFNvIHdlIHNhY3JpZmljZSBjb3JyZWN0bmVzcyBvZiBsYXlvdXQsIGFuZCBrZWVwIHRoZSBhcHAgcnVubmluZ1xuICAgICAgICAgICAgLy8gTmV4dCBsYXlvdXQgaXRlcmF0aW9uIHNob3VsZCBnZXQgbGFyZ2VyIGJvdW5kaW5nIGJveCBpbiB0aGUgZmlyc3Qgc3RlcCBhbmQgZml4IHRoaXNcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTmV4dCBpdGVyYXRpb24gc2hvdWxkIHN1YmRpdmlkZSBub2RlIGZ1cnRoZXIuXG4gICAgICAgIGluc2VydFN0YWNrLnB1c2gobm9kZSwgb2xkQm9keSk7XG4gICAgICAgIGluc2VydFN0YWNrLnB1c2gobm9kZSwgYm9keSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbnNlcnRCb2RpZXM6IGluc2VydEJvZGllcyxcbiAgICB1cGRhdGVCb2R5Rm9yY2U6IHVwZGF0ZVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZChub2RlLCBpZHgpIHtcbiAgaWYgKGlkeCA9PT0gMCkgcmV0dXJuIG5vZGUucXVhZDA7XG4gIGlmIChpZHggPT09IDEpIHJldHVybiBub2RlLnF1YWQxO1xuICBpZiAoaWR4ID09PSAyKSByZXR1cm4gbm9kZS5xdWFkMjtcbiAgaWYgKGlkeCA9PT0gMykgcmV0dXJuIG5vZGUucXVhZDM7XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBzZXRDaGlsZChub2RlLCBpZHgsIGNoaWxkKSB7XG4gIGlmIChpZHggPT09IDApIG5vZGUucXVhZDAgPSBjaGlsZDtcbiAgZWxzZSBpZiAoaWR4ID09PSAxKSBub2RlLnF1YWQxID0gY2hpbGQ7XG4gIGVsc2UgaWYgKGlkeCA9PT0gMikgbm9kZS5xdWFkMiA9IGNoaWxkO1xuICBlbHNlIGlmIChpZHggPT09IDMpIG5vZGUucXVhZDMgPSBjaGlsZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IG1ha2VRdWFkdHJlZSB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V1bGVyL3F1YWR0cmVlL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRTdGFjaztcblxuLyoqXG4gKiBPdXIgaW1wbG1lbnRhdGlvbiBvZiBRdWFkVHJlZSBpcyBub24tcmVjdXJzaXZlIHRvIGF2b2lkIEdDIGhpdFxuICogVGhpcyBkYXRhIHN0cnVjdHVyZSByZXByZXNlbnQgc3RhY2sgb2YgZWxlbWVudHNcbiAqIHdoaWNoIHdlIGFyZSB0cnlpbmcgdG8gaW5zZXJ0IGludG8gcXVhZCB0cmVlLlxuICovXG5mdW5jdGlvbiBJbnNlcnRTdGFjayAoKSB7XG4gICAgdGhpcy5zdGFjayA9IFtdO1xuICAgIHRoaXMucG9wSWR4ID0gMDtcbn1cblxuSW5zZXJ0U3RhY2sucHJvdG90eXBlID0ge1xuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3BJZHggPT09IDA7XG4gICAgfSxcbiAgICBwdXNoOiBmdW5jdGlvbiAobm9kZSwgYm9keSkge1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RhY2tbdGhpcy5wb3BJZHhdO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIC8vIHdlIGFyZSB0cnlpbmcgdG8gYXZvaWQgbWVtb3J5IHByZXNzdWU6IGNyZWF0ZSBuZXcgZWxlbWVudFxuICAgICAgICAgICAgLy8gb25seSB3aGVuIGFic29sdXRlbHkgbmVjZXNzYXJ5XG4gICAgICAgICAgICB0aGlzLnN0YWNrW3RoaXMucG9wSWR4XSA9IG5ldyBJbnNlcnRTdGFja0VsZW1lbnQobm9kZSwgYm9keSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLm5vZGUgPSBub2RlO1xuICAgICAgICAgICAgaXRlbS5ib2R5ID0gYm9keTtcbiAgICAgICAgfVxuICAgICAgICArK3RoaXMucG9wSWR4O1xuICAgIH0sXG4gICAgcG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBvcElkeCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YWNrWy0tdGhpcy5wb3BJZHhdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBvcElkeCA9IDA7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gSW5zZXJ0U3RhY2tFbGVtZW50KG5vZGUsIGJvZHkpIHtcbiAgICB0aGlzLm5vZGUgPSBub2RlOyAvLyBRdWFkVHJlZSBub2RlXG4gICAgdGhpcy5ib2R5ID0gYm9keTsgLy8gcGh5c2ljYWwgYm9keSB3aGljaCBuZWVkcyB0byBiZSBpbnNlcnRlZCB0byBub2RlXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXVsZXIvcXVhZHRyZWUvaW5zZXJ0U3RhY2suanMiLCIvKipcbiAqIEludGVybmFsIGRhdGEgc3RydWN0dXJlIHRvIHJlcHJlc2VudCAyRCBRdWFkVHJlZSBub2RlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gTm9kZSgpIHtcbiAgLy8gYm9keSBzdG9yZWQgaW5zaWRlIHRoaXMgbm9kZS4gSW4gcXVhZCB0cmVlIG9ubHkgbGVhZiBub2RlcyAoYnkgY29uc3RydWN0aW9uKVxuICAvLyBjb250YWluIGJvaWRlczpcbiAgdGhpcy5ib2R5ID0gbnVsbDtcblxuICAvLyBDaGlsZCBub2RlcyBhcmUgc3RvcmVkIGluIHF1YWRzLiBFYWNoIHF1YWQgaXMgcHJlc2VudGVkIGJ5IG51bWJlcjpcbiAgLy8gMCB8IDFcbiAgLy8gLS0tLS1cbiAgLy8gMiB8IDNcbiAgdGhpcy5xdWFkMCA9IG51bGw7XG4gIHRoaXMucXVhZDEgPSBudWxsO1xuICB0aGlzLnF1YWQyID0gbnVsbDtcbiAgdGhpcy5xdWFkMyA9IG51bGw7XG5cbiAgLy8gVG90YWwgbWFzcyBvZiBjdXJyZW50IG5vZGVcbiAgdGhpcy5tYXNzID0gMDtcblxuICAvLyBDZW50ZXIgb2YgbWFzcyBjb29yZGluYXRlc1xuICB0aGlzLm1hc3NYID0gMDtcbiAgdGhpcy5tYXNzWSA9IDA7XG5cbiAgLy8gYm91bmRpbmcgYm94IGNvb3JkaW5hdGVzXG4gIHRoaXMubGVmdCA9IDA7XG4gIHRoaXMudG9wID0gMDtcbiAgdGhpcy5ib3R0b20gPSAwO1xuICB0aGlzLnJpZ2h0ID0gMDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXVsZXIvcXVhZHRyZWUvbm9kZS5qcyIsImNvbnN0IHsgaW50ZWdyYXRlIH0gPSByZXF1aXJlKCcuL2ludGVncmF0ZScpO1xuY29uc3QgeyBhcHBseURyYWcgfSA9IHJlcXVpcmUoJy4vZHJhZycpO1xuY29uc3QgeyBhcHBseVNwcmluZyB9ID0gcmVxdWlyZSgnLi9zcHJpbmcnKTtcblxuZnVuY3Rpb24gdGljayh7IGJvZGllcywgc3ByaW5ncywgcXVhZHRyZWUsIHRpbWVTdGVwLCBncmF2aXR5LCB0aGV0YSwgZHJhZ0NvZWZmLCBwdWxsIH0pe1xuICAvLyB1cGRhdGUgYm9keSBmcm9tIHNjcmF0Y2ggaW4gY2FzZSBvZiBhbnkgY2hhbmdlc1xuICBib2RpZXMuZm9yRWFjaCggYm9keSA9PiB7XG4gICAgbGV0IHAgPSBib2R5Ll9zY3JhdGNoO1xuXG4gICAgaWYoICFwICl7IHJldHVybjsgfVxuXG4gICAgYm9keS5sb2NrZWQgPSBwLmxvY2tlZDtcbiAgICBib2R5LmdyYWJiZWQgPSBwLmdyYWJiZWQ7XG4gICAgYm9keS5wb3MueCA9IHAueDtcbiAgICBib2R5LnBvcy55ID0gcC55O1xuICB9ICk7XG5cbiAgcXVhZHRyZWUuaW5zZXJ0Qm9kaWVzKCBib2RpZXMgKTtcblxuICBmb3IoIGxldCBpID0gMDsgaSA8IGJvZGllcy5sZW5ndGg7IGkrKyApe1xuICAgIGxldCBib2R5ID0gYm9kaWVzW2ldO1xuXG4gICAgcXVhZHRyZWUudXBkYXRlQm9keUZvcmNlKCBib2R5LCBncmF2aXR5LCB0aGV0YSwgcHVsbCApO1xuICAgIGFwcGx5RHJhZyggYm9keSwgZHJhZ0NvZWZmICk7XG4gIH1cblxuICBmb3IoIGxldCBpID0gMDsgaSA8IHNwcmluZ3MubGVuZ3RoOyBpKysgKXtcbiAgICBsZXQgc3ByaW5nID0gc3ByaW5nc1tpXTtcblxuICAgIGFwcGx5U3ByaW5nKCBzcHJpbmcgKTtcbiAgfVxuXG4gIGxldCBtb3ZlbWVudCA9IGludGVncmF0ZSggYm9kaWVzLCB0aW1lU3RlcCApO1xuXG4gIC8vIHVwZGF0ZSBzY3JhdGNoIHBvc2l0aW9ucyBmcm9tIGJvZHkgcG9zaXRpb25zXG4gIGJvZGllcy5mb3JFYWNoKCBib2R5ID0+IHtcbiAgICBsZXQgcCA9IGJvZHkuX3NjcmF0Y2g7XG5cbiAgICBpZiggIXAgKXsgcmV0dXJuOyB9XG5cbiAgICBwLnggPSBib2R5LnBvcy54O1xuICAgIHAueSA9IGJvZHkucG9zLnk7XG4gIH0gKTtcblxuICByZXR1cm4gbW92ZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyB0aWNrIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXVsZXIvdGljay5qcyIsImNvbnN0IEV1bGVyID0gcmVxdWlyZSgnLi9ldWxlcicpO1xuXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXG5sZXQgcmVnaXN0ZXIgPSBmdW5jdGlvbiggY3l0b3NjYXBlICl7XG4gIGlmKCAhY3l0b3NjYXBlICl7IHJldHVybjsgfSAvLyBjYW4ndCByZWdpc3RlciBpZiBjeXRvc2NhcGUgdW5zcGVjaWZpZWRcblxuICBjeXRvc2NhcGUoICdsYXlvdXQnLCAnZXVsZXInLCBFdWxlciApOyAvLyByZWdpc3RlciB3aXRoIGN5dG9zY2FwZS5qc1xufTtcblxuaWYoIHR5cGVvZiBjeXRvc2NhcGUgIT09ICd1bmRlZmluZWQnICl7IC8vIGV4cG9zZSB0byBnbG9iYWwgY3l0b3NjYXBlIChpLmUuIHdpbmRvdy5jeXRvc2NhcGUpXG4gIHJlZ2lzdGVyKCBjeXRvc2NhcGUgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZWdpc3RlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8vIGdlbmVyYWwgZGVmYXVsdCBvcHRpb25zIGZvciBmb3JjZS1kaXJlY3RlZCBsYXlvdXRcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZnJlZXplKHtcbiAgYW5pbWF0ZTogdHJ1ZSwgLy8gd2hldGhlciB0byBzaG93IHRoZSBsYXlvdXQgYXMgaXQncyBydW5uaW5nOyBzcGVjaWFsICdlbmQnIHZhbHVlIG1ha2VzIHRoZSBsYXlvdXQgYW5pbWF0ZSBsaWtlIGEgZGlzY3JldGUgbGF5b3V0XG4gIHJlZnJlc2g6IDEwLCAvLyBudW1iZXIgb2YgdGlja3MgcGVyIGZyYW1lOyBoaWdoZXIgaXMgZmFzdGVyIGJ1dCBtb3JlIGplcmt5XG4gIG1heEl0ZXJhdGlvbnM6IDEwMDAsIC8vIG1heCBpdGVyYXRpb25zIGJlZm9yZSB0aGUgbGF5b3V0IHdpbGwgYmFpbCBvdXRcbiAgbWF4U2ltdWxhdGlvblRpbWU6IDQwMDAsIC8vIG1heCBsZW5ndGggaW4gbXMgdG8gcnVuIHRoZSBsYXlvdXRcbiAgdW5ncmFiaWZ5V2hpbGVTaW11bGF0aW5nOiBmYWxzZSwgLy8gc28geW91IGNhbid0IGRyYWcgbm9kZXMgZHVyaW5nIGxheW91dFxuICBmaXQ6IHRydWUsIC8vIG9uIGV2ZXJ5IGxheW91dCByZXBvc2l0aW9uIG9mIG5vZGVzLCBmaXQgdGhlIHZpZXdwb3J0XG4gIHBhZGRpbmc6IDMwLCAvLyBwYWRkaW5nIGFyb3VuZCB0aGUgc2ltdWxhdGlvblxuICBib3VuZGluZ0JveDogdW5kZWZpbmVkLCAvLyBjb25zdHJhaW4gbGF5b3V0IGJvdW5kczsgeyB4MSwgeTEsIHgyLCB5MiB9IG9yIHsgeDEsIHkxLCB3LCBoIH1cblxuICAvLyBsYXlvdXQgZXZlbnQgY2FsbGJhY2tzXG4gIHJlYWR5OiBmdW5jdGlvbigpe30sIC8vIG9uIGxheW91dHJlYWR5XG4gIHN0b3A6IGZ1bmN0aW9uKCl7fSwgLy8gb24gbGF5b3V0c3RvcFxuXG4gIC8vIHBvc2l0aW9uaW5nIG9wdGlvbnNcbiAgcmFuZG9taXplOiBmYWxzZSwgLy8gdXNlIHJhbmRvbSBub2RlIHBvc2l0aW9ucyBhdCBiZWdpbm5pbmcgb2YgbGF5b3V0XG4gIFxuICAvLyBpbmZpbml0ZSBsYXlvdXQgb3B0aW9uc1xuICBpbmZpbml0ZTogZmFsc2UgLy8gb3ZlcnJpZGVzIGFsbCBvdGhlciBvcHRpb25zIGZvciBhIGZvcmNlcy1hbGwtdGhlLXRpbWUgbW9kZVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGF5b3V0L2RlZmF1bHRzLmpzIiwiLyoqXG5BIGdlbmVyaWMgY29udGludW91cyBsYXlvdXQgY2xhc3NcbiovXG5cbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJy4uL2Fzc2lnbicpO1xuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5jb25zdCBtYWtlQm91bmRpbmdCb3ggPSByZXF1aXJlKCcuL21ha2UtYmInKTtcbmNvbnN0IHsgc2V0SW5pdGlhbFBvc2l0aW9uU3RhdGUsIHJlZnJlc2hQb3NpdGlvbnMsIGdldE5vZGVQb3NpdGlvbkRhdGEgfSA9IHJlcXVpcmUoJy4vcG9zaXRpb24nKTtcbmNvbnN0IHsgbXVsdGl0aWNrIH0gPSByZXF1aXJlKCcuL3RpY2snKTtcblxuY2xhc3MgTGF5b3V0IHtcbiAgY29uc3RydWN0b3IoIG9wdGlvbnMgKXtcbiAgICBsZXQgbyA9IHRoaXMub3B0aW9ucyA9IGFzc2lnbigge30sIGRlZmF1bHRzLCBvcHRpb25zICk7XG5cbiAgICBsZXQgcyA9IHRoaXMuc3RhdGUgPSBhc3NpZ24oIHt9LCBvLCB7XG4gICAgICBsYXlvdXQ6IHRoaXMsXG4gICAgICBub2Rlczogby5lbGVzLm5vZGVzKCksXG4gICAgICBlZGdlczogby5lbGVzLmVkZ2VzKCksXG4gICAgICB0aWNrSW5kZXg6IDAsXG4gICAgICBmaXJzdFVwZGF0ZTogdHJ1ZVxuICAgIH0gKTtcblxuICAgIHMuYW5pbWF0ZUVuZCA9IG8uYW5pbWF0ZSAmJiBvLmFuaW1hdGUgPT09ICdlbmQnO1xuICAgIHMuYW5pbWF0ZUNvbnRpbnVvdXNseSA9IG8uYW5pbWF0ZSAmJiAhcy5hbmltYXRlRW5kO1xuICB9XG5cbiAgcnVuKCl7XG4gICAgbGV0IGwgPSB0aGlzO1xuICAgIGxldCBzID0gdGhpcy5zdGF0ZTtcblxuICAgIHMudGlja0luZGV4ID0gMDtcbiAgICBzLmZpcnN0VXBkYXRlID0gdHJ1ZTtcbiAgICBzLnN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgcy5ydW5uaW5nID0gdHJ1ZTtcblxuICAgIHMuY3VycmVudEJvdW5kaW5nQm94ID0gbWFrZUJvdW5kaW5nQm94KCBzLmJvdW5kaW5nQm94LCBzLmN5ICk7XG5cbiAgICBpZiggcy5yZWFkeSApeyBsLm9uZSggJ3JlYWR5Jywgcy5yZWFkeSApOyB9XG4gICAgaWYoIHMuc3RvcCApeyBsLm9uZSggJ3N0b3AnLCBzLnN0b3AgKTsgfVxuXG4gICAgcy5ub2Rlcy5mb3JFYWNoKCBuID0+IHNldEluaXRpYWxQb3NpdGlvblN0YXRlKCBuLCBzICkgKTtcblxuICAgIGwucHJlcnVuKCBzICk7XG5cbiAgICBpZiggcy5hbmltYXRlQ29udGludW91c2x5ICl7XG4gICAgICBsZXQgdW5ncmFiaWZ5ID0gbm9kZSA9PiB7XG4gICAgICAgIGlmKCAhcy51bmdyYWJpZnlXaGlsZVNpbXVsYXRpbmcgKXsgcmV0dXJuOyB9XG5cbiAgICAgICAgbGV0IGdyYWJiYWJsZSA9IGdldE5vZGVQb3NpdGlvbkRhdGEoIG5vZGUsIHMgKS5ncmFiYmFibGUgPSBub2RlLmdyYWJiYWJsZSgpO1xuXG4gICAgICAgIGlmKCBncmFiYmFibGUgKXtcbiAgICAgICAgICBub2RlLnVuZ3JhYmlmeSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVncmFiaWZ5ID0gbm9kZSA9PiB7XG4gICAgICAgIGlmKCAhcy51bmdyYWJpZnlXaGlsZVNpbXVsYXRpbmcgKXsgcmV0dXJuOyB9XG5cbiAgICAgICAgbGV0IGdyYWJiYWJsZSA9IGdldE5vZGVQb3NpdGlvbkRhdGEoIG5vZGUsIHMgKS5ncmFiYmFibGU7XG5cbiAgICAgICAgaWYoIGdyYWJiYWJsZSApe1xuICAgICAgICAgIG5vZGUuZ3JhYmlmeSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBsZXQgdXBkYXRlR3JhYlN0YXRlID0gbm9kZSA9PiBnZXROb2RlUG9zaXRpb25EYXRhKCBub2RlLCBzICkuZ3JhYmJlZCA9IG5vZGUuZ3JhYmJlZCgpO1xuXG4gICAgICBsZXQgb25HcmFiID0gZnVuY3Rpb24oeyB0YXJnZXQgfSl7XG4gICAgICAgIHVwZGF0ZUdyYWJTdGF0ZSggdGFyZ2V0ICk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgb25GcmVlID0gb25HcmFiO1xuXG4gICAgICBsZXQgb25EcmFnID0gZnVuY3Rpb24oeyB0YXJnZXQgfSl7XG4gICAgICAgIGxldCBwID0gZ2V0Tm9kZVBvc2l0aW9uRGF0YSggdGFyZ2V0LCBzICk7XG4gICAgICAgIGxldCB0cCA9IHRhcmdldC5wb3NpdGlvbigpO1xuXG4gICAgICAgIHAueCA9IHRwLng7XG4gICAgICAgIHAueSA9IHRwLnk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgbGlzdGVuVG9HcmFiID0gbm9kZSA9PiB7XG4gICAgICAgIG5vZGUub24oJ2dyYWInLCBvbkdyYWIpO1xuICAgICAgICBub2RlLm9uKCdmcmVlJywgb25GcmVlKTtcbiAgICAgICAgbm9kZS5vbignZHJhZycsIG9uRHJhZyk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgdW5saXN0ZW5Ub0dyYWIgPSBub2RlID0+IHtcbiAgICAgICAgbm9kZS5yZW1vdmVMaXN0ZW5lcignZ3JhYicsIG9uR3JhYik7XG4gICAgICAgIG5vZGUucmVtb3ZlTGlzdGVuZXIoJ2ZyZWUnLCBvbkZyZWUpO1xuICAgICAgICBub2RlLnJlbW92ZUxpc3RlbmVyKCdkcmFnJywgb25EcmFnKTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBmaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmKCBzLmZpdCAmJiBzLmFuaW1hdGVDb250aW51b3VzbHkgKXtcbiAgICAgICAgICBzLmN5LmZpdCggcy5wYWRkaW5nICk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxldCBvbk5vdERvbmUgPSAoKSA9PiB7XG4gICAgICAgIHJlZnJlc2hQb3NpdGlvbnMoIHMubm9kZXMsIHMgKTtcbiAgICAgICAgZml0KCk7XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBmcmFtZSApO1xuICAgICAgfTtcblxuICAgICAgbGV0IGZyYW1lID0gZnVuY3Rpb24oKXtcbiAgICAgICAgbXVsdGl0aWNrKCBzLCBvbk5vdERvbmUsIG9uRG9uZSApO1xuICAgICAgfTtcblxuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IHtcbiAgICAgICAgcmVmcmVzaFBvc2l0aW9ucyggcy5ub2RlcywgcyApO1xuICAgICAgICBmaXQoKTtcblxuICAgICAgICBzLm5vZGVzLmZvckVhY2goIG4gPT4ge1xuICAgICAgICAgIHJlZ3JhYmlmeSggbiApO1xuICAgICAgICAgIHVubGlzdGVuVG9HcmFiKCBuICk7XG4gICAgICAgIH0gKTtcblxuICAgICAgICBzLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICBsLmVtaXQoJ2xheW91dHN0b3AnKTtcbiAgICAgIH07XG5cbiAgICAgIGwuZW1pdCgnbGF5b3V0c3RhcnQnKTtcblxuICAgICAgcy5ub2Rlcy5mb3JFYWNoKCBuID0+IHtcbiAgICAgICAgdW5ncmFiaWZ5KCBuICk7XG4gICAgICAgIGxpc3RlblRvR3JhYiggbiApO1xuICAgICAgfSApO1xuXG4gICAgICBmcmFtZSgpOyAvLyBraWNrIG9mZlxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgICAgbGV0IG9uTm90RG9uZSA9ICgpID0+IHt9O1xuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IGRvbmUgPSB0cnVlO1xuXG4gICAgICB3aGlsZSggIWRvbmUgKXtcbiAgICAgICAgbXVsdGl0aWNrKCBzLCBvbk5vdERvbmUsIG9uRG9uZSApO1xuICAgICAgfVxuXG4gICAgICBzLmVsZXMubGF5b3V0UG9zaXRpb25zKCB0aGlzLCBzLCBub2RlID0+IHtcbiAgICAgICAgbGV0IHBkID0gZ2V0Tm9kZVBvc2l0aW9uRGF0YSggbm9kZSwgcyApO1xuXG4gICAgICAgIHJldHVybiB7IHg6IHBkLngsIHk6IHBkLnkgfTtcbiAgICAgIH0gKTtcbiAgICB9XG5cbiAgICBsLnBvc3RydW4oIHMgKTtcblxuICAgIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xuICB9XG5cbiAgcHJlcnVuKCl7fVxuICBwb3N0cnVuKCl7fVxuICB0aWNrKCl7fVxuXG4gIHN0b3AoKXtcbiAgICB0aGlzLnN0YXRlLnJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xuICB9XG5cbiAgZGVzdHJveSgpe1xuICAgIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xheW91dC9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGJiLCBjeSApe1xuICBpZiggYmIgPT0gbnVsbCApe1xuICAgIGJiID0geyB4MTogMCwgeTE6IDAsIHc6IGN5LndpZHRoKCksIGg6IGN5LmhlaWdodCgpIH07XG4gIH0gZWxzZSB7IC8vIGNvcHlcbiAgICBiYiA9IHsgeDE6IGJiLngxLCB4MjogYmIueDIsIHkxOiBiYi55MSwgeTI6IGJiLnkyLCB3OiBiYi53LCBoOiBiYi5oIH07XG4gIH1cblxuICBpZiggYmIueDIgPT0gbnVsbCApeyBiYi54MiA9IGJiLngxICsgYmIudzsgfVxuICBpZiggYmIudyA9PSBudWxsICl7IGJiLncgPSBiYi54MiAtIGJiLngxOyB9XG4gIGlmKCBiYi55MiA9PSBudWxsICl7IGJiLnkyID0gYmIueTEgKyBiYi5oOyB9XG4gIGlmKCBiYi5oID09IG51bGwgKXsgYmIuaCA9IGJiLnkyIC0gYmIueTE7IH1cblxuICByZXR1cm4gYmI7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xheW91dC9tYWtlLWJiLmpzIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnLi4vYXNzaWduJyk7XG5cbmxldCBzZXRJbml0aWFsUG9zaXRpb25TdGF0ZSA9IGZ1bmN0aW9uKCBub2RlLCBzdGF0ZSApe1xuICBsZXQgcCA9IG5vZGUucG9zaXRpb24oKTtcbiAgbGV0IGJiID0gc3RhdGUuY3VycmVudEJvdW5kaW5nQm94O1xuICBsZXQgc2NyYXRjaCA9IG5vZGUuc2NyYXRjaCggc3RhdGUubmFtZSApO1xuXG4gIGlmKCBzY3JhdGNoID09IG51bGwgKXtcbiAgICBzY3JhdGNoID0ge307XG5cbiAgICBub2RlLnNjcmF0Y2goIHN0YXRlLm5hbWUsIHNjcmF0Y2ggKTtcbiAgfVxuXG4gIGFzc2lnbiggc2NyYXRjaCwgc3RhdGUucmFuZG9taXplID8ge1xuICAgIHg6IGJiLngxICsgTWF0aC5yYW5kb20oKSAqIGJiLncsXG4gICAgeTogYmIueTEgKyBNYXRoLnJhbmRvbSgpICogYmIuaFxuICB9IDoge1xuICAgIHg6IHAueCxcbiAgICB5OiBwLnlcbiAgfSApO1xuXG4gIHNjcmF0Y2gubG9ja2VkID0gbm9kZS5sb2NrZWQoKTtcbn07XG5cbmxldCBnZXROb2RlUG9zaXRpb25EYXRhID0gZnVuY3Rpb24oIG5vZGUsIHN0YXRlICl7XG4gIHJldHVybiBub2RlLnNjcmF0Y2goIHN0YXRlLm5hbWUgKTtcbn07XG5cbmxldCByZWZyZXNoUG9zaXRpb25zID0gZnVuY3Rpb24oIG5vZGVzLCBzdGF0ZSApe1xuICBub2Rlcy5wb3NpdGlvbnMoZnVuY3Rpb24oIG5vZGUgKXtcbiAgICBsZXQgc2NyYXRjaCA9IG5vZGUuc2NyYXRjaCggc3RhdGUubmFtZSApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHNjcmF0Y2gueCxcbiAgICAgIHk6IHNjcmF0Y2gueVxuICAgIH07XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IHNldEluaXRpYWxQb3NpdGlvblN0YXRlLCBnZXROb2RlUG9zaXRpb25EYXRhLCByZWZyZXNoUG9zaXRpb25zIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGF5b3V0L3Bvc2l0aW9uLmpzIiwiY29uc3Qgbm9wID0gZnVuY3Rpb24oKXt9O1xuXG5sZXQgdGljayA9IGZ1bmN0aW9uKCBzdGF0ZSApe1xuICBsZXQgcyA9IHN0YXRlO1xuICBsZXQgbCA9IHN0YXRlLmxheW91dDtcblxuICBsZXQgdGlja0luZGljYXRlc0RvbmUgPSBsLnRpY2soIHMgKTtcblxuICBpZiggcy5maXJzdFVwZGF0ZSApe1xuICAgIGlmKCBzLmFuaW1hdGVDb250aW51b3VzbHkgKXsgLy8gaW5kaWNhdGUgdGhlIGluaXRpYWwgcG9zaXRpb25zIGhhdmUgYmVlbiBzZXRcbiAgICAgIHMubGF5b3V0LmVtaXQoJ2xheW91dHJlYWR5Jyk7XG4gICAgfVxuICAgIHMuZmlyc3RVcGRhdGUgPSBmYWxzZTtcbiAgfVxuXG4gIHMudGlja0luZGV4Kys7XG5cbiAgbGV0IGR1cmF0aW9uID0gRGF0ZS5ub3coKSAtIHMuc3RhcnRUaW1lO1xuXG4gIHJldHVybiAhcy5pbmZpbml0ZSAmJiAoIHRpY2tJbmRpY2F0ZXNEb25lIHx8IHMudGlja0luZGV4ID49IHMubWF4SXRlcmF0aW9ucyB8fCBkdXJhdGlvbiA+PSBzLm1heFNpbXVsYXRpb25UaW1lICk7XG59O1xuXG5sZXQgbXVsdGl0aWNrID0gZnVuY3Rpb24oIHN0YXRlLCBvbk5vdERvbmUgPSBub3AsIG9uRG9uZSA9IG5vcCApe1xuICBsZXQgZG9uZSA9IGZhbHNlO1xuICBsZXQgcyA9IHN0YXRlO1xuXG4gIGZvciggbGV0IGkgPSAwOyBpIDwgcy5yZWZyZXNoOyBpKysgKXtcbiAgICBkb25lID0gIXMucnVubmluZyB8fCB0aWNrKCBzICk7XG5cbiAgICBpZiggZG9uZSApeyBicmVhazsgfVxuICB9XG5cbiAgaWYoICFkb25lICl7XG4gICAgb25Ob3REb25lKCk7XG4gIH0gZWxzZSB7XG4gICAgb25Eb25lKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyB0aWNrLCBtdWx0aXRpY2sgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXlvdXQvdGljay5qcyJdLCJzb3VyY2VSb290IjoiIn0=