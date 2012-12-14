/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that0}
 */
function FMSpatialComponent(pX, pY, pOwner) {
    "use strict";
    var that = FMComponent(FMComponentTypes.SPATIAL, pOwner);
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
     * Pre update taking place before the main update.
     */
    that.preUpdate = function () {
        
    };

    /**
     * Post update taking place after the main update.
     */
    that.postUpdate = function (game, alpha) {
        
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function() {
        that.destroy();
        that = null;
    };

    return that;
};