/*global FM*/
/**
 * The collision object represents a collision between two objects.
 * @class FM.Collision
 * @param {FM.PhysicComponent} pPhysicObjectA One of the two game objects' physic 
 * component colliding.
 * @param {FM.PhysicComponent} pPhysicObjectB One of the two game objects' physic 
 * component colliding.
 * @constructor
 * @author Simon Chauvin
 */
FM.Collision = function (pPhysicObjectA, pPhysicObjectB) {
    "use strict";
    /**
     * Physic object A.
     * @type FM.PhysicComponent
     * @public
     */
    this.a = pPhysicObjectA || null;
    /**
     * Physic object B.
     * @type FM.PhysicComponent
     * @public
     */
    this.b = pPhysicObjectB || null;
    /**
     * How much the two objects penetrates one another.
     * @type float
     * @public
     */
    this.penetration = 0.0;
    /**
     * Normal of the collision, starting at the center of object a and ending
     * in the center of the object b.
     * @type FM.Vector
     * @public
     */
    this.normal = null;
};
FM.Collision.prototype.constructor = FM.Collision;
/**
 * Destroy the manifold and its objects.
 * @method FM.Collision#destroy
 * @memberOf FM.Collision
 */
FM.Collision.prototype.destroy = function () {
    "use strict";
    this.a = null;
    this.b = null;
    this.normal = null;
    this.penetration = null;
};
