/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @returns {___that0}
 */
function fmObject() {
    "use strict";
    var that = Object.create({});

    that.components = {};

    that.addComponent = function(component) {
        var name = component.name;
        if (!that.components[name]) {
            that.components[name] = component;
        }
    };

    return that;
}