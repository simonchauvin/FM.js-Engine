/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param componentName
 * @param componentOwner
 * @returns {___that0}
 */
function FMComponent(pComponentName, pComponentOwner) {
    "use strict";
    var that = {};
    /**
     * Component's name.
     */
    that.name = pComponentName;
    /**
     * Component's owner (a FmGameObject).
     */
    that.owner = pComponentOwner;

    /**
     * Add the component to the owner.
     */
    that.owner.addComponent(that);

    /**
    * Destroy the component and its objects
    */
    that.destroy = function() {
        that.name = null;
        that.owner = null;
        that = null;
    };

    return that;
};