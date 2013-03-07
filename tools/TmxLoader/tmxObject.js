/**
 * 
 */
var tmxObject = function (objectNode, parent) {
    var that = {};
    /**
     * 
     */
    that.group = parent;
    that.name = objectNode.getAttribute("name");
    that.type = objectNode.getAttribute("type");
    that.x = parseInt(objectNode.getAttribute("x"));
    that.y = parseInt(objectNode.getAttribute("y"));
    that.width = parseInt(objectNode.getAttribute("width"));
    that.height = parseInt(objectNode.getAttribute("height"));
    //resolve inheritence
    that.shared = null;
    that.gid = -1;
    if (objectNode.getAttribute("gid") && objectNode.getAttribute("gid").length !== 0) {
        that.gid = parseInt(objectNode.getAttribute("gid"));
        var tileSets = objectNode.map.getElementsByTagName("tileset"),
            tileSet,
            i;
        if (tileSets) {
            for (i = 0; i < tileSets.length; i = i + 1) {
                tileSet = tileSets[i];
                that.shared = tileSet.getPropertiesByGid(that.gid);
                if (that.shared) {
                    break;
                }
            }
        }
    }

    //Load properties
    var properties = objectNode.getElementsByTagName("properties")[0],
        property,
        i;
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (that.custom) {
                        that.custom.add(property);
                    } else {
                        that.custom = tmxPropertySet();
                        that.custom.add(property);
                    }
                }
            }
        }
    }

    return that;
};