/*global FM*/
/**
 * The spatial component allows positionning of the game object in the 2d space.
 * @class FM.SpatialComponent
 * @extends FM.Component
 * @param {int} pX X position of the game object.
 * @param {int} pY Y position of the game object.
 * @param {FM.GameObject} pOwner The game object that own this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.SpatialComponent = function (pX, pY, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.SPATIAL, pOwner);
    /**
     * Current position of the game object.
     * @type FM.Vector
     * @public
     */
    this.position = new FM.Vector(pX, pY);
    /**
     * Position of the game object at last frame.
     * @type FM.Vector
     * @public
     */
    this.previous = new FM.Vector(pX, pY);
    /**
     * Angle of the object defined in radians.
     * @type float
     * @public
     */
    this.angle = 0;
};
/**
 * FM.SpatialComponent inherits from FM.Component.
 */
FM.SpatialComponent.prototype = Object.create(FM.Component.prototype);
FM.SpatialComponent.prototype.constructor = FM.SpatialComponent;
/**
 * Destroy the component and its objects.
 * @method FM.SpatialComponent#destroy
 * @memberOf FM.SpatialComponent
 */
FM.SpatialComponent.prototype.destroy = function () {
    "use strict";
    this.position = null;
    this.previous = null;
    this.angle = null;
    FM.Component.prototype.destroy.call(this);
};
