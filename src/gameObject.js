/**
 * Object representing a game object.
 * @class gameObject
 * @author Simon Chauvin
 * @param {int} pZIndex specifies the z position of the game object.
 */
FM.gameObject = function (pZIndex) {
    "use strict";
    var that = {},
        /**
         * ID allows to uniquely identify game objects.
         */
        id = 0,
        /**
         * A name for a game object sounds useful ?
         */
        name = "",
        /**
         * Specify if the game object is alive.
         */
        alive = true,
        /**
         * Specify if the game object is visible.
         */
        visible = true,
        /**
         * Types the game object is associated to.
         */
        types = [];
    /**
     * Allows to specify different degrees of scrolling (useful for parallax).
     */
    that.scrollFactor = FM.vector(1, 1);
    /**
     * List of the components owned by the game object.
     */
    that.components = {};
    /**
     * Specify the depth at which the game object is.
     */
    that.zIndex = pZIndex;

    /**
     * Specify a type associated to this game object.
     * @param {objectType} pType the type to add.
     */
    that.addType = function (pType) {
        types.push(pType);
    };

    /**
     * Remove a type associated to this game object.
     * @param {objectType} pType the type to remove.
     */
    that.removeType = function (pType) {
        types.splice(types.indexOf(pType), 1);
    };

    /**
     * Check if this game object is associated to a given type.
     * @param {objectType} pType the type to look for.
     * @return {bool} whether the type specified is associated to this game
     * object or not.
     */
    that.hasType = function (pType) {
        return types.indexOf(pType) !== -1;
    };

    /**
     * Add a component to the game object.
     * @param {component} component the component to be added.
     */
    that.addComponent = function (component) {
        var name = component.name;
        if (!that.components[name]) {
            that.components[name] = component;
        }
    };

    /**
     * Retrive a particular component.
     * @param {componentTypes} type the component's type to be retrieved.
     * @return {component} the component retrieved.
     */
    that.getComponent = function (type) {
        return that.components[type];
    };

    /**
    * Destroy the game object.
    * Don't forget to remove it from the state too.
    * Better use the remove method from state.
    */
    that.destroy = function () {
        name = null;
        that.scrollFactor = null;
        var i;
        for (i = 0; i < that.components.length; i = i + 1) {
            that.components[i].destroy();
        }
        that.components = null;
        that = null;
    };

    /**
     * Kill the game object.
     */
    that.kill = function () {
        alive = false;
    };

    /**
     * Hide the game object.
     */
    that.hide = function () {
        visible = false;
    };

    /**
     * Revive the game object.
     */
    that.revive = function () {
        alive = true;
    };

    /**
     * Show the game object.
     */
    that.show = function () {
        visible = true;
    };

    /**
     * Retrieve the types of the game object.
     * @return {Array} types of the game object.
     */
    that.getTypes = function () {
        return types;
    };

    /**
     * Retrieve the name of the game object.
     * @return {string} name of the game object.
     */
    that.getName = function () {
        return name;
    };

    /**
     * Set the name of the game object.
     * @param {string} pName name to give to the game object.
     */
    that.setName = function (pName) {
        name = pName;
    };

    /**
     * Retrieve the id of the game object.
     * @return {int} id of the game object.
     */
    that.getId = function () {
        return id;
    };

    /**
     * Set the id of the game object.
     * @param {int} pId id to give to the game object.
     */
    that.setId = function (pId) {
        id = pId;
    };

    /**
     * Check if the game object is alive.
     * @return {boolean} true if the game object is alive, false otherwise.
     */
    that.isAlive = function () {
        return alive;
    };

    /**
     * Check if the game object is visible.
     * @return {boolean} true if the game object is visible, false otherwise.
     */
    that.isVisible = function () {
        return visible;
    };

    return that;
};
