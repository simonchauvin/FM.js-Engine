/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param width
 * @param height
 * @returns {___that0}
 */
function fmRectangle(width, height) {
    "use strict";
    var that = Object.create({});

    that.spatial = fmSpatialComponent(that);

    that.width = width;
    that.height = height;

    return that;
}