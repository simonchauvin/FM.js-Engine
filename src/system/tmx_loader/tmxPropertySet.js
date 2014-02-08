/*global FM*/
/**
 * Object representing a set of properties.
 * @class FM.TmxPropertySet
 * @extends Array
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxPropertySet = function () {
    "use strict";
    Array.call(this);
};
/**
 * FM.TmxPropertySet inherits from Array.
 */
FM.TmxPropertySet.prototype = Object.create(Array.prototype);
FM.TmxPropertySet.prototype.constructor = FM.TmxPropertySet;
/**
 * Add a property to this set.
 * @method FM.TmxPropertySet#add
 * @memberOf FM.TmxPropertySet
 * @param {Node} pPropertyNode The property node to add to this set of 
 * properties.
 */
FM.TmxPropertySet.prototype.add = function (pPropertyNode) {
    "use strict";
    var key = pPropertyNode.getAttribute("name"),
        value = pPropertyNode.getAttribute("value");
    this[key] = value;
};
