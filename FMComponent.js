/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param componentName
 * @param componentOwner
 * @returns {___that0}
 */
function fmComponent(componentName, componentOwner) {
    "use strict";
    var that = Object.create({});

    that.name = componentName;
    that.owner = componentOwner;

    return that;
};