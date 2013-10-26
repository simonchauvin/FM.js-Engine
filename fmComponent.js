/**
 * Top level object shared by every components.
 * The component is automatically added to the game object specified as owner.
 * @author Simon Chauvin
 * @param {String} pComponentType type of the component to add.
 * @param {fmGameObject} pComponentOwner game object that owns the component.
 */
FMENGINE.fmComponent = function (pComponentType, pComponentOwner) {
    "use strict";
    var that = {};
    if (pComponentOwner.components !== undefined) {
        /**
         * Component's name.
         */
        that.name = pComponentType;
        /**
         * Component's owner.
         */
        that.owner = pComponentOwner;
    } else {
        if (FMENGINE.fmParameters.debug) {
            console.log("ERROR: the owner of the " + pComponentType
                    + " component must be a fmGameObject.");
        }
    }

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