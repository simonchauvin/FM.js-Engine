/*global FM*/
/**
 * Object representing a game object.
 * @class FM.GameObject
 * @param {int} pZIndex Specifies the z position (the depth) of the game object.
 * @constructor
 * @author Simon Chauvin
 */
FM.GameObject = function (pZIndex) {
    "use strict";
    /**
     * ID allows to uniquely identify game objects.
     * @type int
     * @private
     */
    this.id = 0;
    /**
     * Specify if the game object is alive.
     * @type boolean
     * @private
     */
    this.alive = true;
    /**
     * Specify if the game object is visible.
     * @type boolean
     * @private
     */
    this.visible = true;
    /**
     * Types the game object is associated to.
     * @type Array
     * @private
     */
    this.types = [];
    /**
     * Allows to specify different degrees of scrolling (useful for parallax).
     * @type FM.Vector
     * @public
     */
    this.scrollFactor = new FM.Vector(1, 1);
    /**
     * List of the components owned by the game object.
     * @type Array
     * @public
     */
    this.components = {};
    /**
     * Specify the depth at which the game object is.
     * @type int
     * @public
     */
    this.zIndex = pZIndex;
};
FM.GameObject.prototype.constructor = FM.GameObject;
/**
 * Specify a type associated to this game object.
 * @method FM.GameObject#addType
 * @memberOf FM.GameObject
 * @param {FM.ObjectType} pType The type to add.
 */
FM.GameObject.prototype.addType = function (pType) {
    "use strict";
    this.types.push(pType);
};
/**
 * Remove a type associated to this game object.
 * @method FM.GameObject#removeType
 * @memberOf FM.GameObject
 * @param {FM.ObjectType} pType The type to remove.
 */
FM.GameObject.prototype.removeType = function (pType) {
    "use strict";
    this.types.splice(this.types.indexOf(pType), 1);
};
/**
 * Check if this game object is associated to a given type.
 * @method FM.GameObject#hasType
 * @memberOf FM.GameObject
 * @param {FM.ObjectType} pType The type to look for.
 * @return {boolean} Whether the type specified is associated to this game
 * object or not.
 */
FM.GameObject.prototype.hasType = function (pType) {
    "use strict";
    return this.types.indexOf(pType) !== -1;
};
/**
 * Add a component to the game object.
 * @method FM.GameObject#addComponent
 * @memberOf FM.GameObject
 * @param {FM.Component} pComponent The component to be added.
 * @return {FM.Component} The component just added.
 */
FM.GameObject.prototype.addComponent = function (pComponent) {
    "use strict";
    var componentName = pComponent.name;
    if (!this.components[componentName]) {
        this.components[componentName] = pComponent;
    }
    return this.components[componentName];
};
/**
 * Remove a component from the game object.
 * @method FM.GameObject#removeComponent
 * @memberOf FM.GameObject
 * @param {FM.ComponentTypes} pType The type of the component to be removed.
 */
FM.GameObject.prototype.removeComponent = function (pType) {
    "use strict";
    if (!this.components[pType]) {
        this.components[pType] = null;
    }
};
/**
 * Retrive a particular component.
 * @method FM.GameObject#getComponent
 * @memberOf FM.GameObject
 * @param {FM.ComponentTypes} pType The component's type to be retrieved.
 * @return {FM.Component} The component retrieved.
 */
FM.GameObject.prototype.getComponent = function (pType) {
    "use strict";
    return this.components[pType];
};
/**
 * Gets and sets the spatial component of this game object.
 * @name FM.GameObject#spatial
 */
Object.defineProperty(FM.GameObject.prototype, "spatial", {
    get: function () {
        return this.components[FM.ComponentTypes.SPATIAL];
    },
    set: function (spatial) {
        this.components[FM.ComponentTypes.SPATIAL] = spatial;
    }
});
/**
 * Gets and sets the renderer component of this game object.
 * @name FM.GameObject#renderer
 */
Object.defineProperty(FM.GameObject.prototype, "renderer", {
    get: function () {
        return this.components[FM.ComponentTypes.RENDERER];
    },
    set: function (renderer) {
        this.components[FM.ComponentTypes.RENDERER] = renderer;
    }
});
/**
 * Gets and sets the physic component of this game object.
 * @name FM.GameObject#physic
 */
Object.defineProperty(FM.GameObject.prototype, "physic", {
    get: function () {
        return this.components[FM.ComponentTypes.PHYSIC];
    },
    set: function (physic) {
        this.components[FM.ComponentTypes.PHYSIC] = physic;
    }
});
/**
 * Gets and sets the sound component of this game object.
 * @name FM.GameObject#sound
 */
Object.defineProperty(FM.GameObject.prototype, "sound", {
    get: function () {
        return this.components[FM.ComponentTypes.SOUND];
    },
    set: function (sound) {
        this.components[FM.ComponentTypes.SOUND] = sound;
    }
});
/**
 * Gets and sets the pathfinding component of this game object.
 * @name FM.GameObject#pathfinding
 */
Object.defineProperty(FM.GameObject.prototype, "pathfinding", {
    get: function () {
        return this.components[FM.ComponentTypes.PATHFINDING];
    },
    set: function (pathfinding) {
        this.components[FM.ComponentTypes.PATHFINDING] = pathfinding;
    }
});
/**
 * Gets and sets the fx component of this game object.
 * @name FM.GameObject#fx
 */
Object.defineProperty(FM.GameObject.prototype, "fx", {
    get: function () {
        return this.components[FM.ComponentTypes.FX];
    },
    set: function (fx) {
        this.components[FM.ComponentTypes.FX] = fx;
    }
});
/**
 * Kill the game object.
 * @method FM.GameObject#kill
 * @memberOf FM.GameObject
 */
FM.GameObject.prototype.kill = function () {
    "use strict";
    this.alive = false;
};
/**
 * Hide the game object.
 * @method FM.GameObject#hide
 * @memberOf FM.GameObject
 */
FM.GameObject.prototype.hide = function () {
    "use strict";
    this.visible = false;
};
/**
 * Revive the game object.
 * @method FM.GameObject#revive
 * @memberOf FM.GameObject
 */
FM.GameObject.prototype.revive = function () {
    "use strict";
    this.alive = true;
};
/**
 * Show the game object.
 * @method FM.GameObject#show
 * @memberOf FM.GameObject
 */
FM.GameObject.prototype.show = function () {
    "use strict";
    this.visible = true;
};
/**
 * Retrieve the types of the game object.
 * @method FM.GameObject#getTypes
 * @memberOf FM.GameObject
 * @return {Array} Types of the game object.
 */
FM.GameObject.prototype.getTypes = function () {
    "use strict";
    return this.types;
};
/**
 * Retrieve the id of the game object.
 * @method FM.GameObject#getId
 * @memberOf FM.GameObject
 * @return {int} ID of the game object.
 */
FM.GameObject.prototype.getId = function () {
    "use strict";
    return this.id;
};
/**
 * Set the id of the game object.
 * @method FM.GameObject#setId
 * @memberOf FM.GameObject
 * @param {int} pId ID to give to the game object.
 */
FM.GameObject.prototype.setId = function (pId) {
    "use strict";
    this.id = pId;
};
/**
 * Check if the game object is alive.
 * @method FM.GameObject#isAlive
 * @memberOf FM.GameObject
 * @return {boolean} True if the game object is alive, false otherwise.
 */
FM.GameObject.prototype.isAlive = function () {
    "use strict";
    return this.alive;
};
/**
 * Check if the game object is visible.
 * @method FM.GameObject#isVisible
 * @memberOf FM.GameObject
 * @return {boolean} True if the game object is visible, false otherwise.
 */
FM.GameObject.prototype.isVisible = function () {
    "use strict";
    return this.visible;
};
/**
* Destroy the game object.
* Don't forget to remove it from the state too.
* Better use the remove method from state.
* @method FM.GameObject#destroy
 * @memberOf FM.GameObject
*/
FM.GameObject.prototype.destroy = function () {
    "use strict";
    this.id = null;
    this.alive = null;
    this.visible = null;
    this.types = null;
    this.zIndex = null;
    this.scrollFactor = null;
    var comp = this.spatial;
    if (comp) {
        this.removeComponent(FM.ComponentTypes.SPATIAL);
        comp.destroy();
        this.spatial = null;
    }
    comp = this.pathfinding;
    if (comp) {
        this.removeComponent(FM.ComponentTypes.PATHFINDING);
        comp.destroy();
        this.pathfinding = null;
    }
    comp = this.renderer;
    if (comp) {
        this.removeComponent(FM.ComponentTypes.RENDERER);
        comp.destroy();
        this.renderer = null;
    }
    comp = this.physic;
    if (comp) {
        this.removeComponent(FM.ComponentTypes.PHYSIC);
        comp.destroy();
        this.physic = null;
    }
    comp = this.sound;
    if (comp) {
        this.removeComponent(FM.ComponentTypes.SOUND);
        comp.destroy();
        this.sound = null;
    }
    comp = this.fx;
    if (comp) {
        this.removeComponent(FM.ComponentTypes.FX);
        comp.destroy();
        this.fx = null;
    }
    this.components = null;
};
