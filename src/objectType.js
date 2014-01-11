/*global FM*/
/**
 * Class that represents a type of game object.
 * @class objectType
 * @author Simon Chauvin.
 */
FM.objectType = function (pName) {
    "use strict";
    var that = {},
        /**
         * Name of the type.
         */
        name = pName,
        /**
         * Specify if the game objects of the current type are alive.
         */
        alive = true,
        /**
         * Specify if the game objects of the current type are visible.
         */
        visible = true,
        /**
         * Specify the depth at which the game objects of the current type are drawn.
         */
        zIndex = 1,
        /**
         * Specify the different degrees of scrolling of game objects with this type.
         */
        scrollFactor = FM.vector(1, 1),
        /**
         * Other types of game objects the current type has to collide with.
         */
        collidesWith = [];

    /**
     * Check if the game objects of the current type overlap with the game objects
     * of the given type.
     * @param {objectType} pType type to test if it overlaps with the current one.
     * @return {collision} collision object if there is overlapping.
     */
    that.overlapsWithType = function (pType) {
        var state = FM.game.getCurrentState(),
            quad = state.getQuad(),
            gameObjects = state.members,
            otherGameObjects,
            i,
            j,
            hasType,
            hasOtherType,
            gameObject,
            otherGameObject,
            physic,
            otherPhysic,
            collision = null,
            collisionTemp = null;
        for (i = 0; i < gameObjects.length; i = i + 1) {
            gameObject = gameObjects[i];
            physic = gameObject.components[FM.componentTypes.PHYSIC];
            hasType = gameObject.hasType(that);
            hasOtherType = gameObject.hasType(pType);
            if (physic && (hasType || hasOtherType)) {
                otherGameObjects = quad.retrieve(gameObject);
                for (j = 0; j < otherGameObjects.length; j = j + 1) {
                    otherGameObject = otherGameObjects[j];
                    otherPhysic = otherGameObject.components[FM.componentTypes.PHYSIC];
                    if (otherPhysic && gameObject.getId() !== otherGameObject.getId()
                            && ((hasType && otherGameObject.hasType(pType))
                            || (hasOtherType && otherGameObject.hasType(that)))) {
                        collisionTemp = physic.overlapsWithObject(otherPhysic);
                        if (collisionTemp) {
                            collision = collisionTemp;
                        }
                    }
                }
            }
        }
        return collision;
    };

    /**
     * Check if the game objects of the current type are overlapping with a 
     * specified game object.
     * @param {gameObject} pGameObject game object to test with the game objects
     * of the current type.
     * @return {collision} collision object if there is overlapping.
     */
    that.overlapsWithObject = function (pGameObject) {
        var gameObjects = FM.game.getCurrentState().getQuad().retrieve(pGameObject),
            i,
            otherGameObject,
            physic = pGameObject.components[FM.componentTypes.PHYSIC],
            otherPhysic,
            collision = null,
            collisionTemp = null;
        if (physic) {
            for (i = 0; i < gameObjects.length; i = i + 1) {
                otherGameObject = gameObjects[i];
                otherPhysic = otherGameObject.components[FM.componentTypes.PHYSIC];
                if (otherPhysic && pGameObject.getId() !== otherGameObject.getId() && otherGameObject.hasType(that)) {
                    collisionTemp = physic.overlapsWithObject(otherPhysic);
                    if (collisionTemp) {
                        collision = collisionTemp;
                    }
                }
            }
        } else {
            if (FM.parameters.debug) {
                console.log("WARNING: you need to specify a game object with a physic component for checking overlaps.");
            }
        }
        return collision;
    };

    /**
     * Ensure that the game objects of the current type collide with a specified one.
     */
    that.addTypeToCollideWith = function (pType) {
        collidesWith.push(pType);
        var gameObjects = FM.game.getCurrentState().members,
            i,
            gameObject,
            physic;
        for (i = 0; i < gameObjects.length; i = i + 1) {
            gameObject = gameObjects[i];
            physic = gameObject.components[FM.componentTypes.PHYSIC];
            if (physic && gameObject.hasType(that)) {
                physic.addTypeToCollideWith(pType);
            }
        }
    };

    /**
     * Remove a type that was supposed to collide with all the game objects of this type.
     */
    that.removeTypeToCollideWith = function (pType) {
        collidesWith.splice(collidesWith.indexOf(pType), 1);
        var gameObjects = FM.game.getCurrentState().members,
            i,
            gameObject,
            physic;
        for (i = 0; i < gameObjects.length; i = i + 1) {
            gameObject = gameObjects[i];
            physic = gameObject.components[FM.componentTypes.PHYSIC];
            if (physic && gameObject.hasType(that)) {
                physic.removeTypeToCollideWith(pType);
            }
        }
    };

    /**
     * Set the z-index of every game objects of the current type.
     */
    that.setZIndex = function (pZIndex) {
        zIndex = pZIndex;
        var gameObjects = FM.game.getCurrentState().members,
            i,
            gameObject;
        for (i = 0; i < gameObjects.length; i = i + 1) {
            gameObject = gameObjects[i];
            if (gameObject.hasType(that)) {
                gameObject.zIndex = zIndex;
            }
        }
    };

    /**
     * Set the scrollFactor of every game objects of the current type.
     */
    that.setScrollFactor = function (pScrollFactor) {
        scrollFactor = pScrollFactor;
        var gameObjects = FM.game.getCurrentState().members,
            i,
            gameObject;
        for (i = 0; i < gameObjects.length; i = i + 1) {
            gameObject = gameObjects[i];
            if (gameObject.hasType(that)) {
                gameObject.scrollFactor = scrollFactor;
            }
        }
    };

    /**
     * Kill all the game objects of this type.
     */
    that.kill = function () {
        alive = false;
    };

    /**
     * Hide all the game objects of this type.
     */
    that.hide = function () {
        visible = false;
    };

    /**
     * Revive all the game objects of this type.
     */
    that.revive = function () {
        alive = true;
    };

    /**
     * Show all the game objects of this type.
     */
    that.show = function () {
        visible = true;
    };

    /**
     * Check if the game objects of this type are alive.
     * @return {boolean} true if all the game objects of this type are alive, false otherwise.
     */
    that.isAlive = function () {
        return alive;
    };

    /**
     * Check if the game object of this type are visible.
     * @return {boolean} true if all the game object of this type are visible, false otherwise.
     */
    that.isVisible = function () {
        return visible;
    };

    /**
    * Destroy the type.
    */
    that.destroy = function () {
        name = null;
        scrollFactor = null;
        collidesWith = null;
        that = null;
    };

    /**
     * Retrieve the name of the type.
     * @return {string} name of the type.
     */
    that.getName = function () {
        return name;
    };

    return that;
};
