/**
 * Under Creative Commons Licence
 * @class rectangle
 * @author Simon Chauvin
 * @param width
 * @param height
 * @returns {___that0}
 */
FM.rectangle = function (pX, pY, pWidth, pHeight) {
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
     * Width of the rectangle.
     */
    that.width = pWidth;
    /**
     * Height of the rectangle.
     */
    that.height = pHeight;

    /**
    * Destroy the rectangle and its objects.
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
