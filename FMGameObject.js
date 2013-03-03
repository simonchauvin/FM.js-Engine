/**
 * Object representing a game object.
 * @author Simon Chauvin
 * @param {int} pZIndex specifies the z position of the game object.
 */
FMENGINE.fmGameObject = function (pZIndex) {
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
    that.scrollFactor = FMENGINE.fmPoint(1, 1);
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
     * @param {String} name the name of the type.
     */
    that.addType = function (name) {
        types.push(name);
    };

    /**
     * Remove a type associated to this game object.
     * @param {String} name the name of the type.
     */
    that.removeType = function (name) {
        types.splice(types.indexOf(name), 1);
    };

    /**
     * Check if this game object is associated to a given type.
     * @param {String} name the name of the type to look for.
     * @return {bool} whether the type specified is associated to this game
     * object or not.
     */
    that.hasType = function (name) {
        return types.indexOf(name) !== -1;
    };

    /**
     * Add a component to the game object.
     * @param {fmComponent} component the component to be added.
     */
    that.addComponent = function (component) {
        var name = component.name;
        if (!that.components[name]) {
            that.components[name] = component;
        }
    };

    /**
     * Retrive a particular component.
     * @param {fmComponentTypes} type the component's type to be retrieved.
     * @return {fmComponent} the component retrieved.
     */
    that.getComponent = function (type) {
        return that.components[type];
    };

    /**
    * Destroy the game object.
    * Don't forget to remove it from the state too.
    * Better use the remove method from fmState.
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