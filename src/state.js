/**
 * Object acting as a container of game objects. It helps structure the game in 
 * states.
 * @author Simon Chauvin
 */
FM.state = function () {
    "use strict";
    var that = {},
        /**
         * Width of the screen.
         */
        screenWidth = 0,
        /**
         * Height of the screen.
         */
        screenHeight = 0,
        /**
        * The game object that makes the screen scrolls.
        */
        scroller = null,
        /**
         * Frame of the camera (used in case of scrolling).
         */
        followFrame = null,
        /**
         * Quad tree containing all game objects with a physic component.
         */
        quad = null,
        /**
         * Object representing the world topology (bounds, tiles, collisions, 
         * objects).
         */
        world = null,
        /**
         * Private method that sort game objects according to their z index.
         * @param {int} gameObjectA first game object to be sorted.
         * @param {int} gameObjectB second game object to be sorted.
         * @return {int} a negative value means that gameObjectA has a lower z index 
         * whereas a positive value means that it has a bigger z index. 0 means that
         * both have the same z index.
         */
        sortZIndex = function (gameObjectA, gameObjectB) {
            return (gameObjectA.zIndex - gameObjectB.zIndex);
        };
    /**
     * Array containing every game objects of the state.
     */
    that.members = [];
    /**
     * Static attributes used to store the last ID affected to a game object.
     */
    FM.state.lastId = 0;
    /**
    * Camera (limited by the screen resolution of the game).
    */
    that.camera = FM.rectangle(0, 0, 0, 0);

    /**
    * Initialize the state. Can be redefined in sub classes for 
    * specialization.
    */
    that.init = function (pWorldWidth, pWorldHeight) {
        screenWidth = FM.game.getScreenWidth();
        screenHeight = FM.game.getScreenHeight();
        //By default init the world to the size of the screen
        world = FM.world(pWorldWidth || screenWidth, pWorldHeight
                || screenHeight);
        //Create the quad tree
        quad = FM.quadTree(0, FM.rectangle(0, 0,
            pWorldWidth || screenWidth, pWorldHeight || screenHeight));
        //Set the camera size by the chosen screen size
        that.camera.width = screenWidth;
        that.camera.height = screenHeight;

        if (FM.parameters.debug) {
            console.log("INIT: The state has been created.");
        }
    };

    /**
    * Add a game object to the state.
    * @param {gameObject} gameObject the game object to add to the state.
    */
    that.add = function (gameObject) {
        if (gameObject.components) {
            //Add the game object to the state
            that.members.push(gameObject);
            //Affect an ID to the game object
            gameObject.setId(FM.state.lastId);
            FM.state.lastId += 1;
            //Add the game object to the quad tree if it's got a physic component
            if (gameObject.components[FM.componentTypes.PHYSIC]) {
                quad.insert(gameObject);
            }
        } else {
            if (FM.parameters.debug) {
                console.log("ERROR: you're trying to add something else" +
                    "than a game object to the state. This is not allowed.");
            }
        }
    };

    /**
    * Remove an object from the state and destroy it.
    * @param {gameObject} gameObject the game object to remove and destroy.
    */
    that.remove = function (gameObject) {
        //Remove the game object from the state
        that.members.splice(that.members.indexOf(gameObject), 1);
        //Destroy the game object
        gameObject.destroy();
        //TODO remove the object from the quad
    };

    /**
     * Sort the members of the state by their z-index.
     */
    that.sortByZIndex = function () {
        that.members.sort(sortZIndex);
    };

    /**
     * Update the game physics.
     * @param {float} fixedDt fixed time in seconds since the last frame.
     */
    that.updatePhysics = function (fixedDt) {
        var i,
            gameObject,
            components,
            spatial,
            physic;
        //Clear and update the quadtree
        quad.clear();
        for (i = 0; i < that.members.length; i = i + 1) {
            gameObject = that.members[i];
            if (gameObject.isAlive()) {
                components = gameObject.components;
                physic = gameObject.components[FM.componentTypes.PHYSIC];
                //Update the physic component
                if (physic) {
                    quad.insert(gameObject);
                }
            }
        }
        //Update the physic component of every game object present in the state
        for (i = 0; i < that.members.length; i = i + 1) {
            gameObject = that.members[i];
            if (gameObject.isAlive()) {
                components = gameObject.components;
                spatial = components[FM.componentTypes.SPATIAL];
                physic = components[FM.componentTypes.PHYSIC];
                //Update the physic component
                if (physic) {
                    spatial.previous = spatial.position;
                    physic.update(fixedDt);
                }
            }
        }
    };

    /**
    * Update the game objects of the state.
    * @param {float} variable time in seconds since the last frame.
    */
    that.update = function (dt) {
        var i,
            gameObject,
            components,
            spatial,
            physic,
            pathfinding,
            emitter;
        //Update every game object present in the state
        for (i = 0; i < that.members.length; i = i + 1) {
            gameObject = that.members[i];
            if (gameObject.isAlive()) {
                components = gameObject.components;
                spatial = components[FM.componentTypes.SPATIAL];
                physic = components[FM.componentTypes.PHYSIC];
                pathfinding = components[FM.componentTypes.PATHFINDING];
                emitter = components[FM.componentTypes.FX];
                //Update the path
                if (pathfinding) {
                    pathfinding.update(dt);
                }
                //Update the emitter
                if (emitter) {
                    emitter.update(dt);
                }
                //Update the game object
                if (gameObject.update) {
                    gameObject.update(dt);
                }
                //Update scrolling
                if (physic) {
                    if (scroller === gameObject) {
                        var newOffset,
                            frameWidth = followFrame.width, frameHeight = followFrame.height,
                            xPosition = spatial.position.x + physic.offset.x, yPosition = spatial.position.y + physic.offset.y,
                            farthestXPosition = xPosition + physic.width, farthestYPosition = yPosition + physic.height;

                        // Going left
                        if (xPosition <= followFrame.x) {
                            newOffset = that.camera.x - (followFrame.x - xPosition);
                            if (newOffset >= 0) {
                                that.camera.x = newOffset;
                                followFrame.x = xPosition;
                            }
                        }
                        // Going up
                        if (yPosition <= followFrame.y) {
                            newOffset = that.camera.y - (followFrame.y - yPosition);
                            if (newOffset >= 0) {
                                that.camera.y = newOffset;
                                followFrame.y = yPosition;
                            }
                        }
                        // Going right
                        if (farthestXPosition >= followFrame.x + frameWidth) {
                            newOffset = that.camera.x + (farthestXPosition - (followFrame.x + frameWidth));
                            if (newOffset + that.camera.width <= world.width) {
                                that.camera.x = newOffset;
                                followFrame.x = farthestXPosition - frameWidth;
                            }
                        }
                        // Going down
                        if (farthestYPosition >= followFrame.y + frameHeight) {
                            newOffset = that.camera.y + (farthestYPosition - (followFrame.y + frameHeight));
                            if (newOffset + that.camera.height <= world.height) {
                                that.camera.y = newOffset;
                                followFrame.y = farthestYPosition - frameHeight;
                            }
                        }
                    }
                } else {
                    if (FM.parameters.debug && scroller === gameObject) {
                        console.log("ERROR: The scrolling object must have a physic component.");
                    }
                }
            }
        }
    };

    /**
    * Draw the game objects of the state.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
    * drawing is done.
    * @param {float} dt variable time since the last frame.
    */
    that.draw = function (bufferContext, dt) {
        //Clear the screen
        bufferContext.clearRect(0, 0, screenWidth, screenHeight);

        //Update offsets
        bufferContext.xOffset = that.camera.x;
        bufferContext.yOffset = that.camera.y;

        //Search for renderer in the game object list
        var i, gameObject, newPosition, spatial, physic, renderer;
        for (i = 0; i < that.members.length; i = i + 1) {
            gameObject = that.members[i];

            //If the game object is visible or is in debug mode and alive
            if (gameObject.isVisible() || (FM.parameters.debug && FM.game.isDebugActivated() && gameObject.isAlive())) {
                spatial = gameObject.components[FM.componentTypes.SPATIAL];
                //If there is a spatial component then test if the game object is on the screen
                if (spatial) {
                    renderer = gameObject.components[FM.componentTypes.RENDERER];
                    newPosition = FM.vector(spatial.position.x * dt + spatial.previous.x * (1.0 - dt),
                        spatial.position.y * dt + spatial.previous.y * (1.0 - dt));
                    //Draw objects
                    if (renderer && gameObject.isVisible()) {
                        var xPosition = newPosition.x, yPosition = newPosition.y,
                            farthestXPosition = xPosition + renderer.getWidth(),
                            farthestYPosition = yPosition + renderer.getHeight(),
                            newViewX = 0, newViewY = 0;
                        //If the game object has a scrolling factor then apply it
                        newViewX = (that.camera.x + (screenWidth - that.camera.width) / 2) * gameObject.scrollFactor.x;
                        newViewY = (that.camera.y + (screenHeight - that.camera.height) / 2) * gameObject.scrollFactor.y;

                        //Draw the game object if it is within the bounds of the screen
                        if (farthestXPosition >= newViewX && farthestYPosition >= newViewY
                                && xPosition <= newViewX + that.camera.width && yPosition <= newViewY + that.camera.height) {
                            renderer.draw(bufferContext, newPosition);
                        }
                    }
                    //Draw physic debug
                    if (FM.parameters.debug && gameObject.isAlive()) {
                        if (FM.game.isDebugActivated()) {
                            physic = gameObject.components[FM.componentTypes.PHYSIC];
                            if (physic) {
                                physic.drawDebug(bufferContext, newPosition);
                            }
                        }
                    }
                }
            }
        }
        // Debug
        if (FM.parameters.debug) {
            if (FM.game.isDebugActivated()) {
                //Display the world bounds
                bufferContext.strokeStyle = '#f0f';
                bufferContext.strokeRect(0 - that.camera.x, 0 - that.camera.y, world.width, world.height);

                //Display the camera bounds
                bufferContext.strokeStyle = '#8fc';
                bufferContext.strokeRect((screenWidth - that.camera.width) / 2, (screenHeight - that.camera.height) / 2, that.camera.width, that.camera.height);

                //Display the scrolling bounds
                if (followFrame) {
                    bufferContext.strokeStyle = '#f4f';
                    bufferContext.strokeRect(followFrame.x - that.camera.x, followFrame.y - that.camera.y, followFrame.width, followFrame.height);
                }
            }
        }
    };

    /**
    * Center the camera on a specific game object.
    * @param {gameObject} gameObject the game object to center the camera on.
    */
    that.centerCameraOn = function (gameObject) {
        var spatial = gameObject.components[FM.componentTypes.SPATIAL],
            newPosition = spatial.position.x - that.camera.width / 2;
        if (newPosition > world.x && newPosition < world.width) {
            that.camera.x = newPosition;
        }
        newPosition = spatial.position.y - that.camera.height / 2;
        if (newPosition > world.y && newPosition < world.height) {
            that.camera.y = newPosition;
        }
    };

    /**
    * Center the camera at a specific given position.
    * @param {int} xPosition the x position.
    * @param {int} yPosition the y position.
    */
    that.centerCameraAt = function (xPosition, yPosition) {
        var newPosition = xPosition - that.camera.width / 2;
        if (newPosition > world.x && newPosition < world.width) {
            that.camera.x = newPosition;
        }
        newPosition = yPosition - that.camera.height / 2;
        if (newPosition > world.y && newPosition < world.height) {
            that.camera.y = newPosition;
        }
    };

    /**
    * Make an object as the scroller.
    * @param {gameObject} gameObject the game object to follow.
    * @param {int} width the width of the camera.
    * @param {int} height the height of the camera.
    */
    that.follow = function (gameObject, width, height) {
        scroller = gameObject;
        followFrame = FM.rectangle((screenWidth - width) / 2 + that.camera.x, (screenHeight - height) / 2 + that.camera.y, width, height);
    };

    /**
    * Delete the scroller.
    */
    that.unFollow = function () {
        followFrame = null;
        scroller = null;
    };

    /**
    * Destroy the state and its objects.
    */
    that.destroy = function () {
        var i;
        for (i = 0; i < that.members.length; i = i + 1) {
            that.members[i].destroy();
        }
        that.members = null;
        scroller = null;
        if (followFrame) {
            followFrame.destroy();
        }
        followFrame = null;
        that.camera.destroy();
        that.camera = null;
        world.destroy();
        world = null;
        //TODO destroy functions!
        quad.clear();
        quad = null;
        that = null;
    };

    /**
     * Get the game object which ID matches the one given.
     * @return {gameObject} the game object that corresponds or null if it
     * finds nothing.
     */
    that.getGameObjectById = function (pId) {
        var gameObject, i;
        for (i = 0; i < that.members.length; i = i + 1) {
            gameObject = that.members[i];
            if (gameObject.getId() === pId) {
                return gameObject;
            }
        }
        return null;
    };

    /**
     * Get the object that scrolls the screen.
     * @return {gameObject} the game object that scrolls the screen.
     */
    that.getScroller = function () {
        return scroller;
    };

    /**
     * Get the world object.
     * @return {world} the world of the game.
     */
    that.getWorld = function () {
        return world;
    };

    /**
     * Get the quad tree.
     * @return {QuadTree} the quad tree containing every game object with a 
     * physic component.
     */
    that.getQuad = function () {
        return quad;
    };

    return that;
};
