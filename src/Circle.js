/*global FM*/
/**
 * Circle object.
 * @class FM.Circle
 * @param {int} pX X position of the circle.
 * @param {int} pY Y position of the circle.
 * @param {int} pRadius Radius of the circle.
 * @constructor
 * @author Simon Chauvin
 */
FM.Circle = function (pX, pY, pRadius) {
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
     * Radius.
     * @type int
     * @public
     */
    this.radius = pRadius;
};
FM.Circle.prototype.constructor = FM.Circle;
/**
 * Destroy the circle and its objects.
 * @method FM.Circle#destroy
 * @memberOf FM.Circle
 */
FM.Circle.prototype.destroy = function () {
    "use strict";
    this.x = null;
    this.y = null;
    this.radius = null;
};
