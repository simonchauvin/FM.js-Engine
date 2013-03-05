/**
 * The spatial component allows positionning of the game object in the 2d space.
 * @author Simon Chauvin
 */
FMENGINE.fmSpatialComponent = function (pX, pY, pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.SPATIAL, pOwner);
    /**
     * x position.
     */
    that.x = pX;
    /**
     * y position.
     */
    that.y = pY;
    /**
     * Angle of the object defined in radians.
     */
    that.angle = 0;

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        that.destroy();
        that = null;
    };

    return that;
};