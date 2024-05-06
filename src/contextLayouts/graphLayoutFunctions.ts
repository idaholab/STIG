export function stackCompoundNodes (clss: string) {
  const layers = window.cycore.$(clss);

  let prevPosition = { x: 0, y: 0 };

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerNum = layer.data('number');
    const children = layer.children();
    // console.log(`${layer.data('name')} (${layerNum}): ${children.length}`);
    // console.log(layer.position());

    if (children.length === 1) {
      if (i > 0) {
        const x = 150;
        const y = prevPosition.y + 100;
        layer.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      } else {
        prevPosition = layer.position();
      }
    } else {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        const y = 150 * layerNum;
        const x = 150 * j;
        child.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      }
    }

    // console.log(layer.position());
  }
}

export function alignCompoundNodes (clss: string) {
  const layers = window.cycore.$(clss);

  let prevPosition = { x: 0, y: 0 };

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerNum = layer.data('number');
    const children = layer.children();
    // console.log(`${layer.data('name')}: ${children.length}`);

    if (children.length === 1) {
      if (i > 0) {
        const prevPhase = layers[i - 1];
        let x = prevPosition.x;
        const y = 150 + ((layerNum % 2) * 50);
        if (prevPhase.children().length > 1) {
          x += 150;
        } else {
          x += 100;
        }
        layer.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      } else {
        prevPosition = layer.position();
      }
    } else {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        const x = 150 * layerNum;
        const y = (150 * j) + ((layerNum % 2) * 50);
        child.animate({ position: { x, y }, duration: 1000 });
        prevPosition = { x, y };
      }
    }
  }
}

/* Move any parentless nodes
 * Without this, nodes that aren't part of a kill chain or defense in depth layout
 * will stay where they are and get in the way of the layout
 */
export function organizeOrphans () {
  const nodes = window.cycore.$(':orphan');
  const parent = nodes.filter(':parent');
  // We only want to move the childless orphans
  const movers = nodes.filter(':childless');

  if (movers.length > 0) {
    const boundingBox = parent[0].boundingBox({});
    // Figure out where to start (bottom left corner or top right)
    const prevPosition = { x: 0, y: 0 };
    if (boundingBox.h < boundingBox.w) {
      prevPosition.x = boundingBox.x2;
      prevPosition.y = boundingBox.y2;
    } else {
      prevPosition.x = boundingBox.x1;
      prevPosition.y = boundingBox.y1;
    }

    const grid_options: cytoscape.GridLayoutOptions = {
      name: 'grid',

      fit: false, // whether to fit the viewport to the graph
      padding: 20, // padding used on fit
      boundingBox: { x1: boundingBox.x1, y1: boundingBox.y2, w: 100, h: 100 }, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      avoidOverlapPadding: 100, // extra spacing around nodes when avoidOverlap: true
      nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      condense: false, // uses all available space on false, uses minimal space on true
      rows: undefined, // force num of rows in the grid
      cols: undefined, // force num of columns in the grid
      position: (_node) => undefined as any, // returns { row, col } for element
      // sort: (a: cytoscape.SortableNode, b: cytoscape.SortableNode) {
      //     return (a as cytoscape.SingularElement).degree(false) - (b as cytoscape.SingularElement).degree(false);
      // }, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
      animate: true, // whether to transition the node positions
      animationDuration: 1500, // duration of animation in ms if enabled
      ready: undefined, // callback on layoutready
      stop: undefined // callback on layoutstop
    };

    const layout = movers.layout(grid_options);
    layout.run();

    window.cycore.animate({
      fit: {
        eles: window.cycore.$(':parents'),
        padding: 50
      }
    });

    // // Based on the length, figure out how many nodes go in a row/column
    // var numNodes = 0
    // if (vertical) {
    //     numNodes = Math.ceil(boundingBox.h / (movers[0].width()))
    // } else {
    //     numNodes = Math.ceil(boundingBox.w / (movers[0].width() + 50))
    // }

    //
    // console.log(vertical, numNodes)

    // for (var i = 0; i < movers.length; i++) {
    //     // We only want to move the childless orphans
    //     if (!nodes[i].isParent()) {
    //         var floor = Math.floor(numNodes / (i + 1))
    //         var mod = numNodes % (i + 1)
    //         console.log("floor: ", floor)
    //         console.log("mod: ", mod)
    //         var newPosition = {
    //             x: vertical ? floor + boundingBox.x2 + 50 : mod + 50,
    //             y: vertical ? mod + 50 : floor + boundingBox.y2 + 50
    //         }
    //         console.log(newPosition)
    //         movers[i].animate({position: newPosition, duration: 1000})
    //     }
    // }
  }
}
