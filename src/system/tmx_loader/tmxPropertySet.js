/**
 * Object representing a set of properties.
 * @class tmxPropertySet
 */
FM.tmxPropertySet = function () {
    "use strict";
    var that = [];

    /**
     * Add a property to this set.
     */
    that.add = function (propertyNode) {
        var key = propertyNode.getAttribute("name"),
            value = propertyNode.getAttribute("value");
        that[key] = value;
    };

    return that;
};