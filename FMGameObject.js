/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param x
 * @param y
 * @param zIndex
 * @returns {FMGameObject}
 */
function fmGameObject(x, y, zIndex) {
    "use strict";
    var that = Object.create(fmObject());

    // Every game object has a position
    var spatial = fmSpatialComponent(that);
    spatial.init(x, y);
    that.addComponent(spatial);

    that.zIndex = zIndex;
    that.destroyed = false;
    that.visible = true;

    /**
    * Update the game object
    */
    that.update = function (game) {

    };

    /**
    * Draw the game object
    */
    that.draw = function (bufferContext) {

    };

    /**
    * Check if two game objects collide
    * To use in case the game objects are very likely to collide
    *
    * @param otherGameObject
    */
    that.collide = function (otherGameObject) {
        var spatial2 = otherGameObject.components[fmComponentTypes.spatial];
        var dynamic1 = that.components[fmComponentTypes.dynamic];
        var dynamic2 = otherGameObject.components[fmComponentTypes.dynamic];
        if (dynamic1 && dynamic2) {
            return (spatial2.x + dynamic2.boundingBox.width > spatial.x) && (spatial2.x < spatial.x + dynamic1.boundingBox.width)
            && (spatial2.y + dynamic2.boundingBox.height > spatial.y) && (spatial2.y < spatial.y + dynamic1.boundingBox.height);
        } else {
            return false;
        }
    };

    /**
    *
    */
    that.destroy = function () {

    };

    return that;
}