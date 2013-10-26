/**
 * Object representing a vector.
 * @author Simon Chauvin
 * @param {int} pX x position.
 * @param {int} pY y position.
 */
FMENGINE.fmVector = function (pX, pY) {
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
     * Add the specified vector to the current one;
     */
    that.add = function (vector) {
        that.x += vector.x;
        that.y += vector.y;
    };
    /**
     * Substract the specified vector from the current one;
     */
    that.substract = function (vector) {
        that.x -= vector.x;
        that.y -= vector.y;
    };
    /**
     * Multiply the current vector by the one specified;
     */
    that.multiply = function (vector) {
        that.x *= vector.x;
        that.y *= vector.y;
    };
    /**
     * Dot operation on the current vector and the specified one;
     */
    that.dotProduct = function (vector) {
        return (that.x * vector.x + that.y * vector.y);
    };
    /**
     * Return length of the vector;
     */
    that.length = function () {
        return Math.sqrt((that.x * that.x) + (that.y * that.y));
    };
    /**
     * Return length of the vector;
     */
    that.lengthSquared = function () {
        return (that.x * that.x) + (that.y * that.y);
    };
    /**
     * Normalize the vector.
     */
    this.normalize = function () {
        var vlen = that.length();
        that.x = that.x / vlen;
        that.y = that.y / vlen;
    };
    /**
     * Check if the current vector is equals to the specified one;
     */
    that.equals = function (vector) {
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