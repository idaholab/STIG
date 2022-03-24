import { layouts } from "../graph/graphOptions"

export function stackCompoundNodes(clss : string) {
    var layers = window.cycore.$(clss)
    
    var prevPosition = {x: 0, y: 0}

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i]
        var layerNum = layer.data("number")
        const children = layer.children()
        console.log(`${layer.data("name")} (${layerNum}): ${children.length}`)
        console.log(layer.position())
        
        if (children.length == 1) {
            if (i > 0) {
                var x = 150
                var y = prevPosition.y + 100
                console.log(x, y)
                layer.animate({position: {x: x, y: y}, duration: 1000})
                prevPosition = {x: x, y: y}
            } else {
                prevPosition = layer.position()
            }
        } else {
            for (var j = 0; j < children.length; j++) {
                const child = children[j]
                var y = 150 * layerNum
                var x = 150 * j
                child.animate({position: {x: x, y: y}, duration: 1000})
                prevPosition = {x: x, y: y}
            }
        }

        console.log(layer.position())
    }
}

export async function alignCompoundNodes(clss : string) {
    var layers = window.cycore.$(clss)
    
    var prevPosition = {x: 0, y: 0}

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i]
        var layerNum = layer.data("number")
        const children = layer.children()
        console.log(`${layer.data("name")}: ${children.length}`)
        
        if (children.length == 1) {
            if (i > 0) {
                var prevPhase = layers[i - 1]
                var x = prevPosition.x
                const y = 150 + ((layerNum % 2) * 50)
                if (prevPhase.children().length > 1) {
                    x += 150
                } else {
                    x += 100
                }
                layer.animate({position: {x: x, y: y}, duration: 1000})
                prevPosition = {x: x, y: y}
            } else {
                prevPosition = layer.position()
            }
        } else {
            for (var j = 0; j < children.length; j++) {
                const child = children[j]
                var x = 150 * layerNum
                console.log(x)
                const y = (150 * j) + ((layerNum % 2) * 50)
                child.animate({position: {x: x, y: y}, duration: 1000})
                prevPosition = {x: x, y: y}
            }
        }
    }
}

/* Move any parentless nodes
 * Without this, nodes that aren't part of a kill chain or defense in depth layout
 * will stay where they are and get in the way of the layout
 */
export function organizeOrphans() {
    var nodes = window.cycore.$(":orphan")
    var parent = nodes.filter(":parent")
    // We only want to move the childless orphans
    var movers = nodes.filter(":childless")

    if (movers.length > 0) {
        var boundingBox = parent[0].boundingBox({})
        console.log(boundingBox)
        // Figure out where to start (bottom left corner or top right)
        var prevPosition = {x: 0, y: 0}
        if (boundingBox.h < boundingBox.w) {
            prevPosition.x = boundingBox.x2
            prevPosition.y = boundingBox.y2
        } else {
            prevPosition.x = boundingBox.x1
            prevPosition.y = boundingBox.y1
        }

        let grid_options: cytoscape.GridLayoutOptions = {
            name: 'grid',
        
            fit: false, // whether to fit the viewport to the graph
            padding: 20, // padding used on fit
            boundingBox: {x1: boundingBox.x1, y1: boundingBox.y2, w: 100, h: 100}, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
            avoidOverlapPadding: 100, // extra spacing around nodes when avoidOverlap: true
            nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
            spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
            condense: false, // uses all available space on false, uses minimal space on true
            rows: undefined, // force num of rows in the grid
            cols: undefined, // force num of columns in the grid
            position: (_node) => undefined, // returns { row, col } for element
            // sort: (a: cytoscape.SortableNode, b: cytoscape.SortableNode) {
            //     return (a as cytoscape.SingularElement).degree(false) - (b as cytoscape.SingularElement).degree(false);
            // }, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
            animate: true, // whether to transition the node positions
            animationDuration: 1500, // duration of animation in ms if enabled
            ready: undefined, // callback on layoutready
            stop: undefined, // callback on layoutstop
        };

        const layout = movers.layout(grid_options)
        layout.run()
        
        window.cycore.animate({
            fit: {
                eles: window.cycore.$(":parents"),
                padding: 50
            }
        })
    
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