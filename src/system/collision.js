/**
 * Object representing a collision between two objects.
 * @author Simon Chauvin
 */
FM.collision = function (pObjectA, pObjectB) {
    "use strict";
    var that = {};

    /**
     * Object A.
     */
    that.a = pObjectA === 'undefined' ? null : pObjectA;
    /**
     * Object B.
     */
    that.b = pObjectB === 'undefined' ? null : pObjectB;
    /**
     * How much the two objects penetrates one another.
     */
    that.penetration = 0.0;
    /**
     * Normal of the collision, starting at the center of object a and ending
     * in the center of the object b.
     */
    that.normal = null;

    /**
    * Destroy the manifold and its objects.
    */
    that.destroy = function () {
        that.normal = null;
        that = null;
    };

    return that;
};
