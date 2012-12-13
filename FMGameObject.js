/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param x
 * @param y
 * @param zIndex
 * @returns {FMGameObject}
 */
function FMGameObject(pZIndex) {
    "use strict";
    var that = {},

    /**
     * ID allows to uniquely identify game objects
     */
    id = 0,
    /**
     * 
     */
    name = "",
    /**
     * 
     */
    allowCollisions = FMParameters.ANY;
    /**
     * Allows to specify different degrees of scrolling (useful for parallax).
     */
    that.scrollFactor = FMPoint(1, 1);
    /**
     * List of the components owned by the game object
     */
    that.components = {};
    /**
     * Specify the depth at which the game object is
     */
    that.zIndex = pZIndex;
    /**
     * Specify if the game object is alive
     */
    that.alive = true;
    /**
     * Specify if the game object is visible
     */
    that.visible = true;

    /**
    * Update the game object
    */
    that.update = function (dt) {

    };

    /**
    * Draw the game object
    */
    that.draw = function (bufferContext) {

    };

    /**
     *
     */
    that.addComponent = function(component) {
        var name = component.name;
        if (!that.components[name]) {
            that.components[name] = component;
        }
    };

    /**
     *
     */
    that.getComponent = function (type) {
        return components[type];
    };

    /**
    * Check if two game objects collide
    * To use in case the game objects are very likely to collide
    *
    * @param otherGameObject
    */
    that.collide = function (otherGameObject) {
        var spatial1 = that.components[fmComponentTypes.spatial];
        var spatial2 = otherGameObject.components[fmComponentTypes.spatial];
        var physic1 = that.components[fmComponentTypes.physic];
        var physic2 = otherGameObject.components[fmComponentTypes.physic];
        var renderer1 = that.components[fmComponentTypes.renderer];
        var renderer2 = otherGameObject.components[fmComponentTypes.renderer];
        if (physic1 && physic2) {
            return (spatial2.x + physic2.boundingBox.width > spatial1.x) && (spatial2.x < spatial1.x + physic1.boundingBox.width)
            && (spatial2.y + physic2.boundingBox.height > spatial1.y) && (spatial2.y < spatial1.y + physic1.boundingBox.height);
        } else if (renderer1 || renderer2) {
            return (spatial2.x + renderer2.getWidth() > spatial1.x) && (spatial2.x < spatial1.x + renderer1.getWidth())
            && (spatial2.y + renderer2.getHeight() > spatial1.y) && (spatial2.y < spatial1.y + renderer1.getHeight());
        } else {
            return false;
        }
    };

    /**
    *
    */
    that.destroy = function () {
        name = null;
        allowCollisions = null;
        that.scrollFactor = null;
        for (var i = 0; i < that.components.length; i++) {
                that.components[i].destroy();
        }
        that.components = null;
        that = null;
    };

    /**
     *
     */
    that.getName = function () {
        return name;
    }

    /**
     *
     */
    that.setName = function (n) {
        name = n;
    }

    /**
     *
     */
    that.getId = function () {
        return id;
    }

    /**
     *
     */
    that.setId = function (pId) {
        id = pId;
    }

    return that;
}