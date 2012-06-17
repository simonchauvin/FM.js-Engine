/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that0}
 */
function fmSpatialComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.spatial, owner));

    that.x = 0;
    that.y = 0;

    that.init = function (x, y) {
        that.x = x;
        that.y = y;
    };

    return that;
};