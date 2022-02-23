import cytoscape, { CollectionArgument } from "cytoscape"
import { setup_ctx_menu } from "../graph/context-menu"
import { GraphUtils } from "../graph/graphFunctions"
import { node_img } from "../stix"
import { alignlayers, stackLayers } from "./graphLayoutFunctions"

const defense = require("./defenseInDepthSchema.json")
const defenseExtension = require("./defenseInDepthExtension.json")
const killChain = require("./killChainSchema.json")

const DRAG_DIST = 150

export function removeCompoundNodes() {
    const cy = window.cycore
    const comps = cy.$(":parent")

    // Remove child nodes from their parents
    for (var i = 0; i < comps.length; i++) {
        const children = comps[i].children()
        for (var j = 0; j < children.length; j++) {
            const child = children[j]
            child.move({parent: null})
        }
    }

    // Remove parent nodes from the graph
    cy.remove(comps)

    // Remove any ghost nodes from the graph
    cy.remove(".ghost")
}

export function initDefenseGraph() {
    var cy = window.cycore
    if (cy.$(".defense").length == 0) {

        var defId = defense.name.replaceAll(" ", "_")
        
        var elements : Array<cytoscape.ElementDefinition> = [
            { 
                group: 'nodes', 
                data: {
                    id: defId,
                    name: defense.name
                },
                selectable: false,
                classes: "defense",
                style: {
                    'content': defense.name,
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            }
        ]

        var y = 150
        for (const layer of defense.layers) {
            var layerId = layer.name.replaceAll(' ', '_')
            // console.log("layerId: ", layerId)
            var ele : cytoscape.ElementDefinition = {
                group: 'nodes',
                data: {
                    id: layerId,
                    name: layer.name,
                    number: layer.num,
                    parent: defId
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
                classes: "ghost",
                style: {
                    'display':'none',
                    'width': 200
                }
            }

            elements.push(ele)
            elements.push(ghost)
        }

        cy.add(elements)

        // Event listeners
        cy.on('dragfree', handleDropNode)
        cy.on('drag', handleDrag)
        cy.on('dblclick', handleDblClickNode)

        // Add existing nodes with the defense in depth extension defined
        const nodes = cy.nodes(".stix_node")
        for (var i = 0; i < nodes.length; i++) {
            const ele = nodes[i]
            const data = ele.data("raw_data")
            if (data["extensions"]) {
                if (data["extensions"][defenseExtension.node.id]) {
                    var ext = data["extensions"][defenseExtension.node.id]
                    // The layer id is just the name with whitespace replaced with _
                    var id = ext.layer_name.replaceAll(" ", "_")
                    var layer = cy.$id(id)
                    if (layer) {
                        // // // Move the node to its parent
                        // // get the position of the center of the layer
                        // const bounds = layer.boundingBox({})
                        // const x = bounds.x2 - (bounds.w / 2) + ((layer.children.length - 1) * ele.width())
                        // const y = bounds.y1 + (bounds.h / 2)

                        // ele.position({x: x, y: y})
                        ele.move({parent: id})
                        alignlayers()
                    }                    
                }
            }
        }

    }
}

export function initKillChainGraph() {

    var cy = window.cycore
    if (cy.$(".killchain").length == 0) {

        var defId = defense.name.replaceAll(" ", "_")
        
        var elements : Array<cytoscape.ElementDefinition> = [
            { 
                group: 'nodes', 
                data: {
                    id: defId,
                    name: killChain.name
                },
                selectable: false,
                classes: "killchain",
                style: {
                    'content': killChain.name,
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            }
        ]

        var y = 150
        var iPhase = 0
        for (const phase of killChain.phases) {
            var phaseId = phase.name.replaceAll(' ', '_')
            // console.log("layerId: ", layerId)
            var ele : cytoscape.ElementDefinition = {
                group: 'nodes',
                data: {
                    id: phaseId,
                    name: phase.name,
                    number: iPhase,
                    parent: defId
                },
                position: {
                    x: 100,
                    y: y * iPhase
                },
                selectable: false,
                classes: 'phase',
                style: {
                    'content': phase.name,
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            }
            var ghost : cytoscape.ElementDefinition = {
                group: 'nodes',
                data: {
                    id: "ghost_" + phaseId,
                    parent: phaseId
                },
                position: {
                    x: 100,
                    y: y * iPhase
                },
                classes: "ghost",
                style: {
                    'display':'none',
                    'width': 200
                }
            }

            elements.push(ele)
            elements.push(ghost)

            iPhase++
        }

        cy.add(elements)

        // Event listeners
        cy.on('dragfree', handleDropNode)
        cy.on('drag', handleDrag)
        cy.on('dblclick', handleDblClickNode)

        // Add existing nodes with a kill chain phase
        // const nodes = cy.nodes(".stix_node")
        // for (var i = 0; i < nodes.length; i++) {
            
        // }

    }

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
                // if (layer.children().length > 0) {
                //     const dX = ele.width() * layer.children().length + 20
                //     ele.shift({x: dX}) 
                // }
                var data = ele.data("raw_data")
                var property = {}
                var extId = Object.getOwnPropertyNames(defenseExtension.property)[0]
                property[extId] = {
                    extension_type: defenseExtension.property.extension_type,
                    layer_name: "",
                    layer_number: ""
                }
                console.log("extId: ", extId)
                property[extId].layer_name = layer.data("name")
                property[extId].layer_number = layer.data("number")
                if (data["extensions"]) {
                    data["extensions"][extId] = property[extId]
                } else {
                    data["extensions"] = {}
                    data["extensions"][extId] = property[extId]
                }
                
                ele.data("raw_data", data)
            }
        })

        const phases = e.cy.$('.phase')
        phases.forEach(phase => {
            if (Math.abs(ele.position().x - phase.position().x) < phase.width() 
                && Math.abs(ele.position().y - phase.position().y) < phase.height()) {
                ele.move({parent: phase.id()})
                // if (layer.children().length > 0) {
                //     const dX = ele.width() * layer.children().length + 20
                //     ele.shift({x: dX}) 
                // }
                var data = ele.data("raw_data")
                var killChain = {
                    kill_chain_name: "",
                    phase_name: ""
                }
                var property = {}
                var extId = Object.getOwnPropertyNames(defenseExtension.property)[0]
                property[extId] = {
                    extension_type: defenseExtension.property.extension_type,
                    layer_name: "",
                    layer_number: ""
                }
                console.log("extId: ", extId)
                property[extId].layer_name = phase.data("name")
                property[extId].layer_number = phase.data("number")
                if (data["extensions"]) {
                    data["extensions"][extId] = property[extId]
                } else {
                    data["extensions"] = {}
                    data["extensions"][extId] = property[extId]
                }
                
                ele.data("raw_data", data)
            }
        })
    }

    // console.log("Reset prevPosition")
    ele.data("prevPosition", null)
    ele.parent().data("prevBounds", null)

    
}

function handleDrag(e: cytoscape.EventObject) {
    var ele = e.target
    

    if (ele.hasClass("stix_node") && ele.isChild()) {
        var layer = e.cy.$(`#${ele.data("parent")}`)

        var prevPosition = {x:0, y:0}
    
        if (!ele.data("prevPosition")) {
            
            prevPosition.x = ele.position().x
            prevPosition.y = ele.position().y
            // console.log(prevPosition)
            ele.data("prevPosition", prevPosition)
        } else {
            prevPosition = ele.data("prevPosition")
        }

        var prevBounds = layer.data("prevBounds")

        if (prevBounds == null || prevBounds == undefined) {
            prevBounds = layer.boundingBox({})
            layer.data("prevBounds", prevBounds)
        }
        

        // console.log(JSON.stringify(prevPosition))
        // console.log(JSON.stringify(ele.position()))

        // Check if the node can be removed from a layer
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
                var data = ele.data("raw_data")
                // console.log(JSON.stringify(data["extensions"]))
                // console.log("Length: ", Object.getOwnPropertyNames(data["extensions"]).length)
                if (Object.getOwnPropertyNames(data["extensions"]).length == 1) {
                    // There is only one extension. Delete the extensions property.
                    delete data["extensions"]
                    // console.log("check delete extension prop: ", data["extensions"])
                } else {
                    // There are multiple extensions defined. Find the right one and delete it.
                    var extId = Object.getOwnPropertyNames(defenseExtension.property)[0]
                    console.log("removing:", extId)
                    delete data["extensions"][extId]
                    // console.log("check delete one extension: ", data["extensions"][extId])
                }
            }
        } else if (numChildren > 2) {
            var curBounds = layer.boundingBox({})
            // console.log(`dx:${dX}|dy:${dY}|prevBounds:${JSON.stringify(prevBounds)}|curBounds:${JSON.stringify(curBounds)}`)
            if ((dX < 0 && Math.abs(curBounds.x1 - prevBounds.x1) > DRAG_DIST) ||
                (dX > 0 && Math.abs(curBounds.x2 - prevBounds.x2) > DRAG_DIST) ||
                (dY < 0 && Math.abs(curBounds.y1 - prevBounds.y1) > DRAG_DIST) ||
                (dY > 0 && Math.abs(curBounds.y2 - prevBounds.y2) > DRAG_DIST)) {
                    ele.move({parent: null})
                    var data = ele.data("raw_data")
                    if (Object.getOwnPropertyNames(data["extensions"]).length == 1) {
                        // There is only one extension. Delete the extensions property.
                        delete data["extensions"]
                        console.log("check: ", data["extensions"])
                    } else {
                        // There are multiple extensions defined. Find the right one and delete it.
                        var extId = Object.getOwnPropertyNames(defenseExtension.property)[0]
                        console.log("removing:", extId)
                        delete data["extensions"][extId]
                        console.log("check: ", data["extensions"][extId])
                    }
                    ele.data("raw_data", data)
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