/**
 * Top level object shared by every components.
 * The component is automatically added to the game object specified as owner.
 * @author Simon Chauvin
 * @param {String} pComponentType type of the component to add.
 * @param {gameObject} pComponentOwner game object that owns the component.
 */
FM.component = function (pComponentType, pComponentOwner) {
    "use strict";
    var that = {};
    if (pComponentOwner) {
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
            if (FM.parameters.debug) {
                console.log("ERROR: the owner of the " + pComponentType
                        + " component must be a gameObject.");
            }
        }
    } else {
        if (FM.parameters.debug) {
            console.log("ERROR: a owner game object must be specified.");
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
