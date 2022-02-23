export function stackLayers() {
    var layers = window.cycore.$(".layer")
    
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i]
        const layerNum = layer.data("number")
        const children = layer.children()
        for (var j = 0; j < children.length; j++) {
            const child = children[j]
            child.position({x: 150 * j, y: 150 * layerNum})
        }
    }   
}

export function alignlayers() {
    var layers = window.cycore.$(".layer")
    
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i]
        const layerNum = layer.data("number")
        const children = layer.children()
        for (var j = 0; j < children.length; j++) {
            const child = children[j]
            child.position({x: 150 * layerNum, y: 150 * j})
        }
    }
}