/*global FM*/
/**
 * Math class for specific game related functions.
 * @class FM.Math
 * @static
 * @author Simon Chauvin
 */
FM.Math = {
    /**
     * Add two vectors together.
     * @method FM.Math#addVectors
     * @memberOf FM.Math
     * @param {FM.Vector} vec1 The first vector to add.
     * @param {FM.Vector} vec2 The second vector to add.
     * @returns {FM.Vector} The vector product of the addition of the two given
     * vectors.
     */
    addVectors: function (vec1, vec2) {
        "use strict";
        return new FM.Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    },
    /**
     * Substract a vector from another.
     * @method FM.Math#substractVectors
     * @memberOf FM.Math
     * @param {FM.Vector} vec1 The vector that gets substracted.
     * @param {FM.Vector} vec2 The vector that subtracts.
     * @returns {FM.Vector} The vector resulting of the substraction of vec2 
     * from vec1.
     */
    substractVectors: function (vec1, vec2) {
        "use strict";
        return new FM.Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    },
    /**
     * Multiply two vectors together.
     * @method FM.Math#multiplyVectors
     * @memberOf FM.Math
     * @param {FM.Vector} vec1 The first vector to multiply.
     * @param {FM.Vector} vec2 The second vector to multiply.
     * @returns {FM.Vector} The vector product of the multiplication of the 
     * two given vector.
     */
    multiplyVectors: function (vec1, vec2) {
        "use strict";
        return new FM.Vector(vec1.x * vec2.x, vec1.y * vec2.y);
    },
    /**
     * Clamp a value between a min and a max to the nearest available value.
     * @method FM.Math#clamp
     * @memberOf FM.Math
     * @param {float} val The value to clamp.
     * @param {float} min The min value possible.
     * @param {float} max The max value possible.
     * @returns {float} The value clamped.
     */
    clamp: function (val, min, max) {
        "use strict";
        return Math.min(max, Math.max(min, val));
    },
    /**
     * Get the angle between two vectors.
     * @method FM.Math#getAngle
     * @memberOf FM.Math
     * @param {FM.Vector} vec1 First vector.
     * @param {FM.Vector} vec2 Second vector.
     * @returns {Number} The angle in radians between the two vectors.
     */
    getAngle: function (vec1, vec2) {
        return Math.atan2(vec2.y - vec1.y, vec2.x - vec1.x);
    },
};
