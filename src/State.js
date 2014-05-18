/*global FM*/
/**
 * Object acting as a container of game objects. It helps structure the game in 
 * states.
 * @class FM.State
 * @constructor
 * @author Simon Chauvin
 */
FM.State = function () {
    "use strict";
    /**
     * Width of the screen.
     * @field
     * @type int
     * @private
     */
    this.screenWidth = 0;
    /**
     * Height of the screen.
     * @field
     * @type int
     * @private
     */
    this.screenHeight = 0;
    /**
    * The game object that makes the screen scrolls.
    * @field
    * @type FM.GameObject
    * @private
    */
    this.scroller = null;
    /**
     * Frame of the camera (used in case of scrolling).
     * @field
     * @type FM.Rectangle
     * @private
     */
    this.followFrame = null;
    /**
     * Quad tree containing all game objects with a physic component.
     * @field
     * @type FM.QuadTree
     * @private
     */
    this.quad = null;
    /**
     * Object representing the world topology (bounds, tiles, collisions, 
     * objects).
     * @field
     * @type FM.World
     * @private
     */
    this.world = null;
    /**
     * Whether the camera following is smooth or not.
     * @field
     * @type boolean
     * @private
     */
    this.smoothFollow = false;
    /**
     * Whether the camera movement is smooth or not.
     * @field
     * @type boolean
     * @private
     */
    this.smoothCamera = false;
    /**
     * Speed of the camera for following.
     * @field
     * @type FM.Vector
     * @private
     */
    this.followSpeed = new FM.Vector(60, 60);
    /**
     * Speed of the camera for movement.
     * @field
     * @type FM.Vector
     * @private
     */
    this.cameraSpeed = new FM.Vector(60, 60);
    /**
     * Array containing every game objects of the state.
     * @field
     * @type Array
     * @public
     */
    this.members = [];
    /**
     * Static attributes used to store the last ID affected to a game object.
     * @field
     * @type int
     * @static
     * @public
     */
    FM.State.lastId = 0;
    /**
    * Camera (limited by the screen resolution of the game).
    * @field
    * @type FM.Rectangle
    * @public
    */
    this.camera = new FM.Rectangle(0, 0, 0, 0);
};
FM.State.prototype.constructor = FM.State;
/**
 * Private method that sort game objects according to their z index.
 * @method FM.State#sortZIndex
 * @memberOf FM.State
 * @param {FM.GameObject} gameObjectA First game object to be sorted.
 * @param {FM.GameObject} gameObjectB Second game object to be sorted.
 * @return {int} A negative value means that gameObjectA has a lower z index 
 * whereas a positive value means that it has a bigger z index. 0 means that
 * both have the same z index.
 * @private
 */
FM.State.prototype.sortZIndex = function (gameObjectA, gameObjectB) {
    "use strict";
    return (gameObjectA.zIndex - gameObjectB.zIndex);
};
/**
 * Initialize the state. Can be redefined in sub classes for 
 * specialization.
 * @method FM.State#init
 * @memberOf FM.State
 * @param {int} pWorldWidth The width of the world to create.
 * @param {int} pWorldHeight The height of the world to create.
 */
FM.State.prototype.init = function (pWorldWidth, pWorldHeight) {
    "use strict";
    this.screenWidth = FM.Game.getScreenWidth();
    this.screenHeight = FM.Game.getScreenHeight();
    //By default init the world to the size of the screen
    this.world = new FM.World(pWorldWidth || this.screenWidth, pWorldHeight
            || this.screenHeight);
    //Create the quad tree
    this.quad = new FM.QuadTree(0, new FM.Rectangle(0, 0,
        pWorldWidth || this.screenWidth, pWorldHeight || this.screenHeight));
    //Set the camera size by the chosen screen size
    this.camera.width = this.screenWidth;
    this.camera.height = this.screenHeight;

    if (FM.Parameters.debug) {
        console.log("INIT: The state has been created.");
    }
};
/**
 * Add a game object to the state.
 * @method FM.State#add
 * @memberOf FM.State
 * @param {FM.GameObject} gameObject The game object to add to the state.
 */
FM.State.prototype.add = function (gameObject) {
    "use strict";
    if (gameObject.components) {
        //Add the game object to the state
        this.members.push(gameObject);
        //Affect an ID to the game object
        gameObject.setId(FM.State.lastId);
        FM.State.lastId += 1;
        //Add the game object to the quad tree if it's got a physic component
        if (gameObject.components[FM.ComponentTypes.PHYSIC]) {
            this.quad.insert(gameObject);
        }
    } else {
        if (FM.Parameters.debug) {
            console.log("ERROR: you're trying to add something else" +
                "than a game object to the state. This is not allowed.");
        }
    }
};
/**
 * Remove an object from the state and destroy it.
 * @method FM.State#remove
 * @memberOf FM.State
 * @param {FM.GameObject} gameObject The game object to remove and destroy.
 */
FM.State.prototype.remove = function (gameObject) {
    "use strict";
    //Remove the game object from the state
    this.members.splice(this.members.indexOf(gameObject), 1);
    //Remove the object from the quad tree if it is a physic object
    if (gameObject.components[FM.ComponentTypes.PHYSIC]) {
        this.quad.remove(gameObject);
    }
    //Destroy the game object
    gameObject.destroy();
};
/**
 * Sort the members of the state by their z-index.
 * @method FM.State#sortByZIndex
 * @memberOf FM.State
 */
FM.State.prototype.sortByZIndex = function () {
    "use strict";
    this.members.sort(this.sortZIndex);
};
/**
 * Update the game physics.
 * @method FM.State#updatePhysics
 * @memberOf FM.State
 * @param {float} dt The fixed delta time in seconds since the 
 * last frame.
 */
FM.State.prototype.updatePhysics = function (dt) {
    "use strict";
    var i,
        gameObject,
        components,
        physic;
    //Clear and update the quadtree
    this.quad.clear();
    for (i = 0; i < this.members.length; i = i + 1) {
        gameObject = this.members[i];
        if (gameObject.isAlive()) {
            components = gameObject.components;
            physic = gameObject.components[FM.ComponentTypes.PHYSIC];
            //Add physic objects in the quad tree
            if (physic) {
                this.quad.insert(gameObject);
            }
        }
    }
    //Update the physic component of every game object present in the state
    for (i = 0; i < this.members.length; i = i + 1) {
        gameObject = this.members[i];
        if (gameObject.isAlive()) {
            components = gameObject.components;
            physic = components[FM.ComponentTypes.PHYSIC];
            //Update the physic component
            if (physic) {
                physic.update(dt);
            }
        }
    }
};
/**
 * Update the game objects of the state.
 * @method FM.State#update
 * @memberOf FM.State
 * @param {float} dt The fixed delta time in seconds since the last frame.
 */
FM.State.prototype.update = function (dt) {
    "use strict";
    var i,
        gameObject,
        components,
        spatial,
        physic,
        pathfinding,
        emitter,
        newOffset,
        frameWidth,
        frameHeight,
        xPosition,
        yPosition,
        farthestXPosition,
        farthestYPosition;
    //Update every game object present in the state
    for (i = 0; i < this.members.length; i = i + 1) {
        gameObject = this.members[i];
        if (gameObject.isAlive()) {
            components = gameObject.components;
            spatial = components[FM.ComponentTypes.SPATIAL];
            physic = components[FM.ComponentTypes.PHYSIC];
            pathfinding = components[FM.ComponentTypes.PATHFINDING];
            emitter = components[FM.ComponentTypes.FX];
            //Update the path
            if (pathfinding) {
                pathfinding.update(dt);
            }
            //Update the emitter
            if (emitter) {
                emitter.update(dt);
            }
            //Update scrolling
            if (physic) {
                if (this.scroller === gameObject) {
                    frameWidth = this.followFrame.width;
                    frameHeight = this.followFrame.height;
                    xPosition = spatial.position.x + physic.offset.x;
                    yPosition = spatial.position.y + physic.offset.y;
                    farthestXPosition = xPosition + physic.width;
                    farthestYPosition = yPosition + physic.height;

                    // Going left
                    if (xPosition <= this.followFrame.x) {
                        newOffset = this.camera.x - (this.followFrame.x - xPosition);
                        if (newOffset >= 0) {
                            if (this.smoothFollow) {
                                this.camera.x -= this.followSpeed.x * dt;
                                this.followFrame.x -= this.followSpeed.x * dt;
                            } else {
                                this.camera.x = newOffset;
                                this.followFrame.x = xPosition;
                            }
                        }
                    }
                    // Going up
                    if (yPosition <= this.followFrame.y) {
                        newOffset = this.camera.y - (this.followFrame.y - yPosition);
                        if (newOffset >= 0) {
                            if (this.smoothFollow) {
                                this.camera.y -= this.followSpeed.y * dt;
                                this.followFrame.y -= this.followSpeed.y * dt;
                            } else {
                                this.camera.y = newOffset;
                                this.followFrame.y = yPosition;
                            }
                        }
                    }
                    // Going right
                    if (farthestXPosition >= this.followFrame.x + frameWidth) {
                        newOffset = this.camera.x + (farthestXPosition - (this.followFrame.x + frameWidth));
                        if (newOffset + this.camera.width <= this.world.width) {
                            if (this.smoothFollow) {
                                this.camera.x += this.followSpeed.x * dt;
                                this.followFrame.x += this.followSpeed.x * dt;
                            } else {
                                this.camera.x = newOffset;
                                this.followFrame.x = farthestXPosition - frameWidth;
                            }
                        }
                    }
                    // Going down
                    if (farthestYPosition >= this.followFrame.y + frameHeight) {
                        newOffset = this.camera.y + (farthestYPosition - (this.followFrame.y + frameHeight));
                        if (newOffset + this.camera.height <= this.world.height) {
                            if (this.smoothFollow) {
                                this.camera.y += this.followSpeed.y * dt;
                                this.followFrame.y += this.followSpeed.y * dt;
                            } else {
                                this.camera.y = newOffset;
                                this.followFrame.y = farthestYPosition - frameHeight;
                            }
                        }
                    }
                    //Check if the scroller is in the follow frame and stop the smooth movement
                    if (this.smoothFollow && xPosition >= this.followFrame.x && farthestXPosition <= this.followFrame.x + frameWidth
                            && yPosition >= this.followFrame.y && farthestYPosition <= this.followFrame.y + frameHeight) {
                        this.smoothFollow = false;
                    }
                }
            } else {
                if (FM.Parameters.debug && this.scroller === gameObject) {
                    console.log("ERROR: The scrolling object must have a physic component.");
                }
            }
            //Update the game object
            if (gameObject.update) {
                gameObject.update(dt);
            }
        }
    }
};
/**
 * Draw the game objects of the state.
 * @method FM.State#draw
 * @memberOf FM.State
 * @param {CanvasRenderingContext2D} bufferContext Context (buffer) on wich 
 * drawing is done.
 * @param {float} dt Variable delta time since the last frame.
 */
FM.State.prototype.draw = function (bufferContext, dt) {
    "use strict";
    //Clear the screen
    bufferContext.clearRect(0, 0, this.screenWidth, this.screenHeight);

    //Update offsets
    bufferContext.xOffset = this.camera.x;
    bufferContext.yOffset = this.camera.y;

    //Search for renderer in the game object list
    var i, gameObject, newPosition, spatial, physic, renderer;
    for (i = 0; i < this.members.length; i = i + 1) {
        gameObject = this.members[i];

        //If the game object is visible or is in debug mode and alive
        if (gameObject.isVisible() || (FM.Parameters.debug && FM.Game.isDebugActivated() && gameObject.isAlive())) {
            spatial = gameObject.components[FM.ComponentTypes.SPATIAL];
            //If there is a spatial component then test if the game object is on the screen
            if (spatial) {
                renderer = gameObject.components[FM.ComponentTypes.RENDERER];
                spatial.previous.copy(spatial.position);
                newPosition = new FM.Vector(spatial.position.x * dt + spatial.previous.x * (1.0 - dt),
                    spatial.position.y * dt + spatial.previous.y * (1.0 - dt));
                //Draw objects
                if (renderer && gameObject.isVisible()) {
                    var center = new FM.Vector(newPosition.x + renderer.getWidth() / 2, newPosition.y + renderer.getHeight() / 2),
                        biggestSide = renderer.getWidth() > renderer.getHeight() ? renderer.getWidth() : renderer.getHeight(),
                        //If the game object has a scrolling factor then apply it
                        newView = new FM.Vector((this.camera.x + (this.screenWidth - this.camera.width) / 2) * gameObject.scrollFactor.x, 
                            (this.camera.y + (this.screenHeight - this.camera.height) / 2) * gameObject.scrollFactor.y);
                    //Draw the game object if it is within the bounds of the screen
                    if (center.x + biggestSide / 2 >= newView.x && center.y + biggestSide / 2 >= newView.y
                            && center.x - biggestSide / 2 <= newView.x + this.camera.width && center.y - biggestSide / 2 <= newView.y + this.camera.height) {
                        renderer.draw(bufferContext, newPosition);
                    }
                }
                
                //Draw physic debug
                if (FM.Parameters.debug && gameObject.isAlive()) {
                    if (FM.Game.isDebugActivated()) {
                        physic = gameObject.components[FM.ComponentTypes.PHYSIC];
                        if (physic) {
                            physic.drawDebug(bufferContext, newPosition);
                        }
                    }
                }
            }
        }
    }
    // Debug
    if (FM.Parameters.debug) {
        if (FM.Game.isDebugActivated()) {
            //Display the world bounds
            bufferContext.strokeStyle = '#f0f';
            bufferContext.strokeRect(0 - this.camera.x, 0 - this.camera.y, this.world.width, this.world.height);

            //Display the camera bounds
            bufferContext.strokeStyle = '#8fc';
            bufferContext.strokeRect((this.screenWidth - this.camera.width) / 2, (this.screenHeight - this.camera.height) / 2, this.camera.width, this.camera.height);

            //Display the scrolling bounds
            if (this.followFrame) {
                bufferContext.strokeStyle = '#f4f';
                bufferContext.strokeRect(this.followFrame.x - this.camera.x, this.followFrame.y - this.camera.y, this.followFrame.width, this.followFrame.height);
            }
        }
    }
};
/**
 * Center the camera on a specific game object.
 * @method FM.State#centerCameraOn
 * @memberOf FM.State
 * @param {FM.GameObject} gameObject The game object to center the camera on.
 */
FM.State.prototype.centerCameraOn = function (gameObject) {
    "use strict";
    var spatial = gameObject.components[FM.ComponentTypes.SPATIAL],
        newPosition = spatial.position.x - this.camera.width / 2;
    if (newPosition > this.world.x && newPosition < this.world.width) {
        this.camera.x = newPosition;
    }
    newPosition = spatial.position.y - this.camera.height / 2;
    if (newPosition > this.world.y && newPosition < this.world.height) {
        this.camera.y = newPosition;
    }
};
/**
 * Center the camera at a specific given position.
 * @method FM.State#centerCameraAt
 * @memberOf FM.State
 * @param {int} xPosition The target x position of the camera.
 * @param {int} yPosition The target y position of the camera.
 */
FM.State.prototype.centerCameraAt = function (xPosition, yPosition) {
    "use strict";
    var newPosition = xPosition - this.camera.width / 2;
    if (newPosition > this.world.x && newPosition < this.world.width) {
        this.camera.x = newPosition;
    }
    newPosition = yPosition - this.camera.height / 2;
    if (newPosition > this.world.y && newPosition < this.world.height) {
        this.camera.y = newPosition;
    }
};
/**
 * Make an object as the scroller.
 * @method FM.State#follow
 * @memberOf FM.State
 * @param {FM.GameObject} gameObject The game object to follow.
 * @param {int} width The width of the camera.
 * @param {int} height The height of the camera.
 */
FM.State.prototype.follow = function (gameObject, width, height, pSmooth, pFollowSpeed) {
    "use strict";
    this.scroller = gameObject;
    this.followFrame = new FM.Rectangle((this.screenWidth - width) / 2 + this.camera.x, (this.screenHeight - height) / 2 + this.camera.y, width, height);
    this.smoothFollow = pSmooth || false;
    this.followSpeed = pFollowSpeed || new FM.Vector(60, 60);
};
/**
 * Delete the scroller.
 * @method FM.State#unFollow
 * @memberOf FM.State
 */
FM.State.prototype.unFollow = function () {
    "use strict";
    this.followFrame = null;
    this.scroller = null;
};
/**
 * Destroy the state and its objects.
 * @method FM.State#destroy
 * @memberOf FM.State
 */
FM.State.prototype.destroy = function () {
    "use strict";
    this.scroller = null;
    if (this.followFrame) {
        this.followFrame.destroy();
    }
    this.followFrame = null;
    this.camera.destroy();
    this.camera = null;
    //In case it's the preloader
    if (this.world) {
        this.world.destroy();
        this.world = null;
        this.quad.clear();
        this.quad.destroy();
        this.quad = null;
    }
    var i;
    for (i = 0; i < this.members.length; i = i + 1) {
        this.members[i].destroy();
        this.members[i] = null;
    }
    this.members = null;
};
/**
 * Get the game object which ID matches the one given.
 * @method FM.State#getGameObjectById
 * @memberOf FM.State
 * @param {int} pId The ID of the object to retrieve.
 * @return {FM.GameObject} The game object that corresponds or null if it
 * finds nothing.
 */
FM.State.prototype.getGameObjectById = function (pId) {
    "use strict";
    var gameObject, i;
    for (i = 0; i < this.members.length; i = i + 1) {
        gameObject = this.members[i];
        if (gameObject.getId() === pId) {
            return gameObject;
        }
    }
    return null;
};
/**
 * Get the object that scrolls the screen.
 * @method FM.State#getScroller
 * @memberOf FM.State
 * @return {FM.GameObject} The game object that scrolls the screen.
 */
FM.State.prototype.getScroller = function () {
    "use strict";
    return this.scroller;
};
/**
 * Get the world object.
 * @method FM.State#getWorld
 * @memberOf FM.State
 * @return {FM.World} The world of the game.
 */
FM.State.prototype.getWorld = function () {
    "use strict";
    return this.world;
};
/**
 * Get the quad tree.
 * @method FM.State#getQuad
 * @memberOf FM.State
 * @return {FM.QuadTree} The quad tree containing every game object with a 
 * physic component.
 */
FM.State.prototype.getQuad = function () {
    "use strict";
    return this.quad;
};
