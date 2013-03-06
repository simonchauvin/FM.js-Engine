/**
 * 
 */
var tmxObjectGroup = function () {
    var that = {};
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

    that.load = function (objectGroupNode, parent)
    {
        that.map = parent;
        that.name = objectGroupNode.getAttribute("name");
        that.x = objectGroupNode.getAttribute("x"); 
        that.y = objectGroupNode.getAttribute("y"); 
        that.width = objectGroupNode.getAttribute("width"); 
        that.height = objectGroupNode.getAttribute("height"); 
        that.visible = !source.@visible || (source.@visible != 0);
        that.opacity = objectGroupNode.getAttribute("opacity");

        //load properties
        var node:XML;
        for each(node in source.properties)
                properties = properties ? properties.extend(node) : new TmxPropertySet(node);

        //load objects
        for each(node in source.object)
                objects.push(new TmxObject(node, this));		
    };

    return that;
};