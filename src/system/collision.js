/**
 * Object representing a collision between two objects.
 * @author Simon Chauvin
 */
FM.collision = function () {
    "use strict";
    var that = {};

    /**
     * Object A.
     */
    that.a = null;
    /**
     * Object B.
     */
    that.b = null;
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
