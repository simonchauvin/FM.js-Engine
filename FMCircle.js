/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param radius
 * @returns {___that0}
 */
function fmCircle(radius) {
    "use strict";
    var that = Object.create({});

    that.spatial = fmSpatialComponent(that);

    that.radius = radius;

    return that;
}