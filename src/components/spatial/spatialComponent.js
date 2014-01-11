/*global FM*/
/**
 * The spatial component allows positionning of the game object in the 2d space.
 * @author Simon Chauvin
 */
FM.spatialComponent = function (pX, pY, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.SPATIAL, pOwner);
    /**
     * Current position.
     */
    that.position = FM.vector(pX, pY);
    that.previous = FM.vector(pX, pY);
    /**
     * Angle of the object defined in radians.
     */
    that.angle = 0;
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        that.position = null;
        that.previous = null;
        that.destroy();
        that = null;
    };

    return that;
};
