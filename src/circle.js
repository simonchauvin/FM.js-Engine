/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param radius
 * @returns {circle}
 */
FM.circle = function (pX, pY, pRadius) {
    "use strict";
    var that = {};

    /**
     * x position.
     */
    that.x = pX;
    /**
     * y position.
     */
    that.y = pY;

    /**
     * Radius.
     */
    that.radius = pRadius;

    /**
    * Destroy the circle and its objects.
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
