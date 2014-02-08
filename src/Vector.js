/*global FM*/
/**
 * Vector object.
 * @class FM.Vector
 * @param {int} pX X position.
 * @param {int} pY Y position.
 * @constructor
 * @author Simon Chauvin
 */
FM.Vector = function (pX, pY) {
    "use strict";
    /**
     * x position.
     * @type int
     * @public
     * @default 0
     */
    this.x = pX || 0;
    /**
     * y position.
     * @type int
     * @public
     * @default 0
     */
    this.y = pY || 0;
};
FM.Vector.prototype.constructor = FM.Vector;
/**
 * Add the specified vector to the current one;
 * @method FM.Vector#add
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to add.
 * @return {FM.Vector} The vector modified.
 */
FM.Vector.prototype.add = function (vector) {
    "use strict";
    this.x += vector.x;
    this.y += vector.y;
    return this;
};
/**
 * Substract the specified vector from the current one;
 * @method FM.Vector#substract
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to substract.
 * @return {FM.Vector} The vector modified.
 */
FM.Vector.prototype.substract = function (vector) {
    "use strict";
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
};
/**
 * Multiply the current vector by the one specified;
 * @method FM.Vector#multiply
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to multiply.
 * @return {FM.Vector} The vector modified.
 */
FM.Vector.prototype.multiply = function (vector) {
    "use strict";
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
};
/**
 * Dot operation on the current vector and the specified one;
 * @method FM.Vector#dotProduct
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to dot product.
 * @return {FM.Vector} The dot product.
 */
FM.Vector.prototype.dotProduct = function (vector) {
    "use strict";
    return (this.x * vector.x + this.y * vector.y);
};
/**
 * Calculate the cross product of the current vector and another vector.
 * @method FM.Vector#crossProd
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to cross product.
 * @return {float} The cross product.
*/
FM.Vector.prototype.crossProd = function (vector) {
    "use strict";
    return this.x * vector.y - this.y * vector.x;
};
/**
 * Reset the vector the specified values.
 * @method FM.Vector#reset
 * @memberOf FM.Vector
 * @param {int} pX The x position.
 * @param {int} pY The y position.
 * @return {FM.Vector} The vector reset.
 */
FM.Vector.prototype.reset = function (pX, pY) {
    "use strict";
    this.x = pX || 0;
    this.y = pY || 0;
    return this;
};
/**
 * Return length of the vector;
 * @method FM.Vector#getLength
 * @memberOf FM.Vector
 * @return {float} The length of the vector.
 */
FM.Vector.prototype.getLength = function () {
    "use strict";
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};
/**
 * Return length of the vector;
 * @method FM.Vector#getLengthSquared
 * @memberOf FM.Vector
 * @return {int} The squared length of the vector.
 */
FM.Vector.prototype.getLengthSquared = function () {
    "use strict";
    return (this.x * this.x) + (this.y * this.y);
};
/**
 * Normalize the vector.
 * @method FM.Vector#normalize
 * @memberOf FM.Vector
 */
FM.Vector.prototype.normalize = function () {
    "use strict";
    var vlen = this.getLength();
    this.x = this.x / vlen;
    this.y = this.y / vlen;
};
/**
 * Copy the given vector to the current one.
 * @method FM.Vector#copy
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to copy.
 * @return {FM.Vector} The vector copied.
 */
FM.Vector.prototype.copy = function (vector) {
    "use strict";
    this.x = vector.x;
    this.y = vector.y;
    return this;
};
/**
 * Clone the current vector.
 * @method FM.Vector#clone
 * @memberOf FM.Vector
 * @return {FM.Vector} The new cloned vector.
 */
FM.Vector.prototype.clone = function () {
    "use strict";
    return new FM.Vector(this.x, this.y);
};
/**
 * Check if the current vector is equals to the specified one;
 * @method FM.Vector#isEquals
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to compare.
 * @return {boolean} Whether the two vector are equal or not.
 */
FM.Vector.prototype.isEquals = function (vector) {
    "use strict";
    return (this.x === vector.x && this.y === vector.y);
};
/**
* Destroy the point and its objects.
* @method FM.Vector#destroy
 * @memberOf FM.Vector
*/
FM.Vector.prototype.destroy = function () {
    "use strict";
    this.x = null;
    this.y = null;
};
