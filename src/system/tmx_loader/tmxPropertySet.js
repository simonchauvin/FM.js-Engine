/**
 * 
 */
FM.tmxPropertySet = function () {
    "use strict";
    var that = [];

    /**
     * 
     */
    that.add = function (propertyNode) {
        var key = propertyNode.getAttribute("name"),
            value = propertyNode.getAttribute("value");
        that[key] = value;
    };

    return that;
};