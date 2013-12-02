/**
 * 
 */
var tmxObjectGroup = function () {
    "use strict";
    var that = {};
    /**
     * 
     */
    that.map;
    that.name;
    that.x;
    that.y;
    that.width;
    that.height;
    that.opacity;
    that.visible;
    that.properties = null;
    that.objects = [];

    that.load = function (objectGroupNode, parent) {
        that.map = parent;
        that.name = objectGroupNode.getAttribute("name");
        that.x = parseInt(objectGroupNode.getAttribute("x"));
        that.y = parseInt(objectGroupNode.getAttribute("y"));
        that.width = parseInt(objectGroupNode.getAttribute("width"));
        that.height = parseInt(objectGroupNode.getAttribute("height"));
        that.visible = !objectGroupNode.getAttribute("visible")
            || (objectGroupNode.getAttribute("visible") !== 0);
        that.opacity = parseInt(objectGroupNode.getAttribute("opacity"));

        var properties = objectGroupNode.getElementsByTagName("properties")[0],
            objects = objectGroupNode.getElementsByTagName("object"),
            property,
            object,
            i;
        //Load properties
        if (properties) {
            for (i = 0; i < properties.childNodes.length; i = i + 1) {
                if (properties.hasChildNodes() === true) {
                    property = properties.childNodes[i];
                    if (property.nodeType === 1) {
                        if (that.properties) {
                            that.properties.add(property);
                        } else {
                            that.properties = tmxPropertySet();
                            that.properties.add(property);
                        }
                    }
                }
            }
        }
        //Load objects
        if (objects) {
            for (i = 0; i < objects.length; i = i + 1) {
                object = objects[i];
                that.objects.push(tmxObject(object, that));
            }
        }
    };

    return that;
};