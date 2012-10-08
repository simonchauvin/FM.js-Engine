/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMVector(pX, pY) {
    "use strict";
    var that = {};

    /**
     *
     */
    that.x = pX;
    /**
     *
     */
    that.y = pY;

    /**
     *
     */
    var zero = function () {
        return new Vector(0, 0);
    },

    /**
     *
     */
    clone = function () {
        return new Vector(that.x, that.y);
    },

    /**
     *
     */
    add = function (v) {
        return new Vector(that.x + v.x, that.y + v.y);
    },

    /**
     *
     */
    subtract = function (v) {
        return new Vector(that.x - v.x, that.y - v.y);
    },

    /**
     *
     */
    /**
     *
     */
    multiply = function (n) {
        return new Vector(that.x * n, that.y * n);
    },

    /**
     *
     */
    divide = function (n) {
        return multiply( 1 / n );
    },

    /**
     *
     */
    addEq = function (v) {
        that.x += v.x;
        that.y += v.y;
        return this;
    },

    /**
     *
     */
    subtractEq = function (v) {
        that.x -= v.x;
        that.y -= v.y;
        return this;
    },

    /**
     *
     */
    multiplyEq = function (n) {
        that.x *= n;
        that.y *= n;
        return this;
    },

    /**
     *
     */
    divideEq = function (n) {
        return multiplyEq( 1 / n );
    },

    /**
     *
     */
    getLength = function () {
        return Math.sqrt(that.x * that.x + that.y * that.y);
    },

    /**
     *
     */
    minus = function () {
        return new Vector(-that.x, -that.y);
    },

    /**
     *
     */
    unit = function () {
        var s = length;
        if(s != 0) {
            return divide(s);
        } else {
            return null;
        }
    };

    return that;
}