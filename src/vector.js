/**
 * Object representing a vector.
 * @class vector
 * @author Simon Chauvin
 * @param {int} pX x position.
 * @param {int} pY y position.
 */
FM.vector = function (pX, pY) {
    "use strict";
    var that = {};

    /**
     * x position.
     */
    that.x = pX === undefined ? 0 : pX;
    /**
     * y position.
     */
    that.y = pY === undefined ? 0 : pY;

    /**
     * Add the specified vector to the current one;
     */
    that.add = function (vector) {
        that.x += vector.x;
        that.y += vector.y;
        return that;
    };
    /**
     * Substract the specified vector from the current one;
     */
    that.substract = function (vector) {
        that.x -= vector.x;
        that.y -= vector.y;
        return that;
    };
    /**
     * Multiply the current vector by the one specified;
     */
    that.multiply = function (vector) {
        that.x *= vector.x;
        that.y *= vector.y;
        return that;
    };
    /**
     * Dot operation on the current vector and the specified one;
     */
    that.dotProduct = function (vector) {
        return (that.x * vector.x + that.y * vector.y);
    };
    /**
     * Calculate the cross product of the current vector and another vector.
     * @param {Vector2D} vector A vector.
     * @return {Number} The cross product.
    */
    that.crossProd = function(vector) {
        return that.x * vector.y - that.y * vector.x;
    }
    /**
     * Reset the vector the specified values.
     */
    that.reset = function (pX, pY) {
        that.x = typeof pX === 'undefined' ? 0 : pX;
        that.y = typeof pY === 'undefined' ? 0 : pY;
        return that;
    };
    /**
     * Return length of the vector;
     */
    that.getLength = function () {
        return Math.sqrt((that.x * that.x) + (that.y * that.y));
    };
    /**
     * Return length of the vector;
     */
    that.getLengthSquared = function () {
        return (that.x * that.x) + (that.y * that.y);
    };
    /**
     * Normalize the vector.
     */
    that.normalize = function () {
        var vlen = that.getLength();
        that.x = that.x / vlen;
        that.y = that.y / vlen;
    };
    /**
     * Copy the given vector to the current one.
     */
    that.copy = function(vector) {
        that.x = vector.x;
        that.y = vector.y;
        return that;
    };
    /**
     * Clone the current vector.
     */
    that.clone = function() {
        return new FM.vector(that.x, that.y);
    };
    /**
     * Check if the current vector is equals to the specified one;
     */
    that.isEquals = function (vector) {
        return (that.x === vector.x && that.y === vector.y);
    };

    /**
    * Destroy the point and its objects.
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
