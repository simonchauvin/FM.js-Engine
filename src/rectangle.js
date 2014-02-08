/*global FM*/
/**
 * Rectangle object.
 * @class FM.Rectangle
 * @param {int} pX X position of the rectangle.
 * @param {int} pY Y position of the rectangle.
 * @param {int} pWidth Width of the rectangle.
 * @param {int} pHeight Height of the rectangle.
 * @constructor
 * @author Simon Chauvin
 */
FM.Rectangle = function (pX, pY, pWidth, pHeight) {
    "use strict";
    /**
     * x position.
     * @type int
     * @public
     */
    this.x = pX;
    /**
     * y position.
     * @type int
     * @public
     */
    this.y = pY;
    /**
     * Width of the rectangle.
     * @type int
     * @public
     */
    this.width = pWidth;
    /**
     * Height of the rectangle.
     * @type int
     * @public
     */
    this.height = pHeight;
};
FM.Rectangle.prototype.constructor = FM.Rectangle;
/**
 * Destroy the rectangle and its objects.
 * @method FM.Rectangle#destroy
 * @memberOf FM.Rectangle
 */
FM.Rectangle.prototype.destroy = function () {
    "use strict";
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
};
