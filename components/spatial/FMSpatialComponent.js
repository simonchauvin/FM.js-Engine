/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that0}
 */
function FMSpatialComponent(pX, pY, pOwner) {
    "use strict";
    var that = FMComponent(FMComponentTypes.spatial, pOwner);
    /**
     * x position.
     */
    that.x = pX;
    /**
     * y position.
     */
    that.y = pY;

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        
    };

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

    return that;
};