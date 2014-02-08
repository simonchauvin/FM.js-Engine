/*global FM*/
/**
 * An object type can be associated to a game object. Then all game objects of a
 * certain type can be processed uniformally through the object type object.
 * @class FM.ObjectType
 * @param {string} pName The name of the object type.
 * @constructor
 * @author Simon Chauvin.
 */
FM.ObjectType = function (pName) {
    "use strict";
    /**
     * Name of the type.
     * @type string
     * @private
     */
    this.name = pName;
    /**
     * Specify if the game objects of the current type are alive.
     * @type boolean
     * @private
     */
    this.alive = true;
    /**
     * Specify if the game objects of the current type are visible.
     * @type boolean
     * @private
     */
    this.visible = true;
    /**
     * Specify the depth at which the game objects of the current type are drawn.
     * @type int
     * @private
     */
    this.zIndex = 1;
    /**
     * Specify the different degrees of scrolling of game objects with this type.
     * @type FM.Vector
     * @private
     */
    this.scrollFactor = new FM.Vector(1, 1);
    /**
     * Other types of game objects the current type has to collide with.
     * @type Array
     * @private
     */
    this.collidesWith = [];
};
FM.ObjectType.prototype.constructor = FM.ObjectType;
/**
 * Check if the game objects of the current type overlap with the game objects
 * of the given type.
 * @method FM.ObjectType#overlapsWithType
 * @memberOf FM.ObjectType
 * @param {FM.ObjectType} pType The type to test if it overlaps with the 
 * current one.
 * @return {FM.Collision} Collision object if there is overlapping.
 */
FM.ObjectType.prototype.overlapsWithType = function (pType) {
    "use strict";
    var state = FM.Game.getCurrentState(),
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
        physic = gameObject.components[FM.ComponentTypes.PHYSIC];
        hasType = gameObject.hasType(this);
        hasOtherType = gameObject.hasType(pType);
        if (physic && (hasType || hasOtherType)) {
            otherGameObjects = quad.retrieve(gameObject);
            for (j = 0; j < otherGameObjects.length; j = j + 1) {
                otherGameObject = otherGameObjects[j];
                otherPhysic = otherGameObject.components[FM.ComponentTypes.PHYSIC];
                if (otherPhysic && gameObject.getId() !== otherGameObject.getId()
                        && ((hasType && otherGameObject.hasType(pType))
                        || (hasOtherType && otherGameObject.hasType(this)))) {
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
 * @method FM.ObjectType#overlapsWithObject
 * @memberOf FM.ObjectType
 * @param {FM.GameObject} pGameObject Game object to test with the game objects
 * of the current type.
 * @return {FM.Collision} Collision object if there is overlapping.
 */
FM.ObjectType.prototype.overlapsWithObject = function (pGameObject) {
    "use strict";
    var gameObjects = FM.Game.getCurrentState().getQuad().retrieve(pGameObject),
        i,
        otherGameObject,
        physic = pGameObject.components[FM.ComponentTypes.PHYSIC],
        otherPhysic,
        collision = null,
        collisionTemp = null;
    if (physic) {
        for (i = 0; i < gameObjects.length; i = i + 1) {
            otherGameObject = gameObjects[i];
            otherPhysic = otherGameObject.components[FM.ComponentTypes.PHYSIC];
            if (otherPhysic && pGameObject.getId() !== otherGameObject.getId() && otherGameObject.hasType(this)) {
                collisionTemp = physic.overlapsWithObject(otherPhysic);
                if (collisionTemp) {
                    collision = collisionTemp;
                }
            }
        }
    } else {
        if (FM.Parameters.debug) {
            console.log("WARNING: you need to specify a game object with a physic component for checking overlaps.");
        }
    }
    return collision;
};
/**
 * Ensure that the game objects of the current type collide with a specified one.
 * @method FM.ObjectType#addTypeToCollideWith
 * @memberOf FM.ObjectType
 * @param {FM.ObjectType} pType The type to collide with to add to all game 
 * objects of this type.
 */
FM.ObjectType.prototype.addTypeToCollideWith = function (pType) {
    "use strict";
    this.collidesWith.push(pType);
    var gameObjects = FM.Game.getCurrentState().members,
        i,
        gameObject,
        physic;
    for (i = 0; i < gameObjects.length; i = i + 1) {
        gameObject = gameObjects[i];
        physic = gameObject.components[FM.ComponentTypes.PHYSIC];
        if (physic && gameObject.hasType(this)) {
            physic.addTypeToCollideWith(pType);
        }
    }
};
/**
 * Remove a type that was supposed to collide with all the game objects of this type.
 * @method FM.ObjectType#removeTypeToCollideWith
 * @memberOf FM.ObjectType
 * @param {FM.ObjectType} pType The type to collide with to remove from all 
 * game objects of this type.
 */
FM.ObjectType.prototype.removeTypeToCollideWith = function (pType) {
    "use strict";
    this.collidesWith.splice(this.collidesWith.indexOf(pType), 1);
    var gameObjects = FM.Game.getCurrentState().members,
        i,
        gameObject,
        physic;
    for (i = 0; i < gameObjects.length; i = i + 1) {
        gameObject = gameObjects[i];
        physic = gameObject.components[FM.ComponentTypes.PHYSIC];
        if (physic && gameObject.hasType(this)) {
            physic.removeTypeToCollideWith(pType);
        }
    }
};
/**
 * Set the z-index of every game objects of the current type.
 * @method FM.ObjectType#setZIndex
 * @memberOf FM.ObjectType
 * @param {int} pZIndex The z index at which all game objects of this type must
 * be.
 */
FM.ObjectType.prototype.setZIndex = function (pZIndex) {
    "use strict";
    this.zIndex = pZIndex;
    var gameObjects = FM.Game.getCurrentState().members,
        i,
        gameObject;
    for (i = 0; i < gameObjects.length; i = i + 1) {
        gameObject = gameObjects[i];
        if (gameObject.hasType(this)) {
            gameObject.zIndex = this.zIndex;
        }
    }
};
/**
 * Set the scrollFactor of every game objects of the current type.
 * @method FM.ObjectType#setScrollFactor
 * @memberOf FM.ObjectType
 * @param {FM.Vector} pScrollFactor The factor of scrolling to apply to all
 * game objects of this type.
 */
FM.ObjectType.prototype.setScrollFactor = function (pScrollFactor) {
    "use strict";
    this.scrollFactor = pScrollFactor;
    var gameObjects = FM.Game.getCurrentState().members,
        i,
        gameObject;
    for (i = 0; i < gameObjects.length; i = i + 1) {
        gameObject = gameObjects[i];
        if (gameObject.hasType(this)) {
            gameObject.scrollFactor = this.scrollFactor;
        }
    }
};
/**
 * Kill all the game objects of this type.
 * @method FM.ObjectType#kill
 * @memberOf FM.ObjectType
 */
FM.ObjectType.prototype.kill = function () {
    "use strict";
    this.alive = false;
};
/**
 * Hide all the game objects of this type.
 * @method FM.ObjectType#hide
 * @memberOf FM.ObjectType
 */
FM.ObjectType.prototype.hide = function () {
    "use strict";
    this.visible = false;
};
/**
 * Revive all the game objects of this type.
 * @method FM.ObjectType#revive
 * @memberOf FM.ObjectType
 */
FM.ObjectType.prototype.revive = function () {
    "use strict";
    this.alive = true;
};
/**
 * Show all the game objects of this type.
 * @method FM.ObjectType#show
 * @memberOf FM.ObjectType
 */
FM.ObjectType.prototype.show = function () {
    "use strict";
    this.visible = true;
};
/**
 * Check if the game objects of this type are alive.
 * @method FM.ObjectType#isAlive
 * @memberOf FM.ObjectType
 * @return {boolean} Whether all the game objects of this type are alive.
 */
FM.ObjectType.prototype.isAlive = function () {
    "use strict";
    return this.alive;
};
/**
 * Check if the game object of this type are visible.
 * @method FM.ObjectType#isVisible
 * @memberOf FM.ObjectType
 * @return {boolean} Whether all the game objects of this type are visible.
 */
FM.ObjectType.prototype.isVisible = function () {
    "use strict";
    return this.visible;
};
/**
 * Retrieve the name of the type.
 * @method FM.ObjectType#getName
 * @memberOf FM.ObjectType
 * @return {string} The name of the type.
 */
FM.ObjectType.prototype.getName = function () {
    "use strict";
    return this.name;
};
/**
* Destroy the type.
* @method FM.ObjectType#destroy
 * @memberOf FM.ObjectType
*/
FM.ObjectType.prototype.destroy = function () {
    "use strict";
    this.name = null;
    this.alive = null;
    this.visible = null;
    this.zIndex = null;
    this.scrollFactor.destroy();
    this.scrollFactor = null;
    this.collidesWith = null;
};
