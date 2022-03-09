export function stackCompoundNodes(clss : string) {
    var layers = window.cycore.$(clss)
    
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

export function alignCompoundNodes(clss : string) {
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