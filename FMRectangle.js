/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param width
 * @param height
 * @returns {___that0}
 */
function FMRectangle(pX, pY, pWidth, pHeight) {
    "use strict";
    var that_ = {},
        /**
         * Width
         */
        width = pWidth,
        /**
         * Height
         */
        height = pHeight;

    /**
     * x position
     */
    that_.x = pX;
    /**
     * y position
     */
    that_.y = pY;

    /**
     * Get the width
     */
    that_.getWidth = function () {
        return width;
    }

    /**
     * Get the height
     */
    that_.getHeight = function () {
        return height;
    }

    /**
     * Set the width
     */
    that_.setWidth = function (pWidth) {
        width = pWidth;
    }

    /**
     * Set the height
     */
    that_.setHeight = function (pHeight) {
        height = pHeight;
    }

    return that_;
}