import cytoscape, { CollectionArgument } from "cytoscape"
import { setup_ctx_menu } from "../graph/context-menu"
import { GraphUtils } from "../graph/graphFunctions"
import { node_img } from "../stix"

const defense = require("./defenseInDepthSchema.json")
const killChain = require("./killChainSchema.json")

const DRAG_DIST = 150

export function initDefenseGraph() {
    if (window.defense.nodes().length == 0) { 
        const graph_utils = new GraphUtils(window.defense)
        setup_ctx_menu(window.defense, graph_utils)

        var elements : Array<cytoscape.ElementDefinition> = [
            { 
                group: 'nodes', 
                data: { id: defense.name },
                selectable: false,
                style: {
                    'content': defense.name,
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            }
        ]

        var y = 100
        for (const layer of defense.layers) {
            var layerId = layer.name.replace(' ', '_')
            console.log("layerId: ", layerId)
            var ele : cytoscape.ElementDefinition = {
                group: 'nodes',
                data: {
                    id: layerId,
                    name: layer.name,
                    parent: defense.name
                },
                position: {
                    x: 100,
                    y: y * layer.num
                },
                selectable: false,
                classes: 'layer',
                style: {
                    'content': layer.name,
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            }
            var ghost : cytoscape.ElementDefinition = {
                group: 'nodes',
                data: {
                    id: "ghost_" + layerId,
                    parent: layerId
                },
                position: {
                    x: 100,
                    y: y * layer.num
                },
                style: {
                    'display':'none',
                    'width': 200
                }
            }

            elements.push(ele)
            elements.push(ghost)
        }

        // window.cycore.add(elements)
        window.defense.add(elements)

        // var coreElements = window.cycore.nodes()
        // window.defense.add(coreElements as unknown as CollectionArgument)

        // Event listeners
        window.defense.on('dragfree', handleDropNode)
        window.defense.on('drag', handleDrag)
        window.defense.on('dblclick', handleDblClickNode)
    }
}

export function initKillChainGraph() {

    var elements : Array<cytoscape.ElementDefinition> = [
        { group: 'nodes', data: { id: killChain.name } }
    ]

    var iPhase = 1
    var y = 100
    for (const phase of killChain.phases) {
        var phaseId = phase.name.replace(' ', '_')
        console.log("phaseId: ", phaseId)
        var ele : cytoscape.ElementDefinition = {
            group: 'nodes',
            data: {
                id: phaseId,
                name: phase.name,
                parent: killChain.name
            },
            position: {
                x: 100,
                y: y * iPhase
            }
        }
        var ghostId = "ghost_" + phaseId
        var ghost : cytoscape.ElementDefinition = {
            group: 'nodes',
            data: {
                id: ghostId,
                parent: phaseId
            },
            position: {
                x: 100,
                y: y * iPhase
            },
            style: {
                'display':'none'
            }
        }

        elements.push(ele)
        elements.push(ghost)

        iPhase += 1
    }

    // window.cycore.add(elements)
    window.cycore.add(elements)

}

function handleDropNode(e : cytoscape.EventObject) {
    var ele = e.target
    
    var hasClass = ele.hasClass("stix_node")
    var isChild = ele.isChild()

    if (hasClass && !isChild) {
        // Check to see if the node can be added to a layer
        const layers = e.cy.$('.layer')
        layers.forEach(layer => {
            if (Math.abs(ele.position().x - layer.position().x) < layer.width() 
                && Math.abs(ele.position().y - layer.position().y) < layer.height()) {
                ele.move({parent: layer.id()})
            }
        })
    } else if (hasClass && isChild) {
        console.log("Reset prevPosition")
        ele.data("prevPosition", null)
        ele.parent().data("prevBounds", null)
    }

    
}

function handleDrag(e: cytoscape.EventObject) {
    var ele = e.target
    

    if (ele.hasClass("stix_node") && ele.isChild()) {
        var layer = e.cy.$(`#${ele.data("parent")}`)

        var prevPosition = {x:0, y:0}
    
        if (!ele.data("prevPosition")) {
            
            prevPosition.x = ele.position().x
            prevPosition.y = ele.position().y
            console.log(prevPosition)
            ele.data("prevPosition", prevPosition)
        } else {
            prevPosition = ele.data("prevPosition")
        }

        var prevBounds = layer.data("prevBounds")

        if (prevBounds == null || prevBounds == undefined) {
            prevBounds = layer.boundingBox({})
            layer.data("prevBounds", prevBounds)
        }
        
        // Check if the node can be removed from a layer
        console.log(JSON.stringify(ele.position()))
        console.log(JSON.stringify(prevPosition))
        var dX = ele.position().x - prevPosition.x
        var dY = ele.position().y - prevPosition.y

        // console.log(`dX: ${dX}, dY: ${dY}`)
        // console.log(layer.width())
        // console.log(layer.height())

        var numChildren = layer.children().length
        if (numChildren == 2) {
            if (Math.abs(dX) > DRAG_DIST || Math.abs(dY) > DRAG_DIST) {
                var lPos = layer.position()
                lPos.x -= dX
                lPos.y -= dY
                layer.position(lPos)
                ele.move({parent: null})
            }
        } else if (numChildren > 2) {
            var curBounds = layer.boundingBox({})
            // console.log(`dx:${dX}|dy:${dY}|prevBounds:${JSON.stringify(prevBounds)}|curBounds:${JSON.stringify(curBounds)}`)
            if ((dX < 0 && Math.abs(curBounds.x1 - prevBounds.x1) > DRAG_DIST) ||
                (dX > 0 && Math.abs(curBounds.x2 - prevBounds.x2) > DRAG_DIST) ||
                (dY < 0 && Math.abs(curBounds.y1 - prevBounds.y1) > DRAG_DIST) ||
                (dY > 0 && Math.abs(curBounds.y2 - prevBounds.y2) > DRAG_DIST)) {
                    ele.move({parent: null})
            }
        }
            
        

    }
}

function handleDblClickNode(e: cytoscape.EventObject) {
    var ele = e.target
    
    if (ele.hasClass('stix_node') && ele.isChild()) {
        ele.move({parent: null})
    }
}