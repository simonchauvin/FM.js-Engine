/**
 * Top level object shared by every components.
 * @author Simon Chauvin
 * @param {String} pComponentType type of the component to add.
 * @param {fmGameObject} pComponentOwner game object that owns the component.
 */
FMENGINE.fmComponent = function (pComponentType, pComponentOwner) {
    "use strict";
    var that = {};
    /**
     * Component's name.
     */
    that.name = pComponentType;
    /**
     * Component's owner.
     */
    that.owner = pComponentOwner;
    /**
     * Add the component to the owner.
     */
    that.owner.addComponent(that);

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        that.name = null;
        that.owner = null;
        that = null;
    };

    return that;
};