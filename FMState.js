/**
 * Object acting as a container of game objects. It helps structure the game in 
 * states.
 * @author Simon Chauvin
 */
FMENGINE.fmState = function () {
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
    FMENGINE.fmState.lastId = 0;
    /**
     * Object representing the world topology (bounds, tiles, collisions, objects).
     */
    that.world = null;
    /**
    * Camera (limited by the screen resolution of the game).
    */
    that.camera = FMENGINE.fmRectangle(0, 0, 0, 0);
    /**
    * Array of arrays that stores colliders.
    */
    //var colliders = [];

    /**
    * Initialize the state the state. Can be redefined in sub classes for 
    * specialization.
    */
    that.init = function () {
        screenWidth = FMENGINE.fmGame.getScreenWidth();
        screenHeight = FMENGINE.fmGame.getScreenHeight();
        //By default init the world to the size of the screen with all borders solid
        that.world = FMENGINE.fmWorld(that, screenWidth, screenHeight);

        //Set the camera size by the chosen screen size
        that.camera.width = screenWidth;
        that.camera.height = screenHeight;

        //TODO quadtree for colliders (ease up collision detection)
        /*var i;
        for (i = 0; i < 8; i++) {
            colliders.push([]);
            var j;
            for (j = 0; j < 8; j++) {
                colliders[i].push([]);
            }
        }*/
        if (FMENGINE.fmParameters.debug) {
            console.log("INIT: The state has been created.");
        }
    };

    /**
    * Add a game object to the state.
    * @param {fmGameObject} gameObject the game object to add to the state.
    */
    that.add = function (gameObject) {
        //Add the game object to the state
        that.members.push(gameObject);

        //Affect an ID to the game object
        FMENGINE.fmState.lastId += 1;
        gameObject.setId(FMENGINE.fmState.lastId);

        if (FMENGINE.fmParameters.debug) {
            console.log("INIT: " + gameObject + " has been added to the state.");
        }

//        if (gameObject && gameObject.components[fmComponentTypes.renderer]) {
//                var spatial = gameObject.components[fmComponentTypes.spatial];
//                if (gameObject.components[fmComponentTypes.collider]) {
//                        var indexI = Math.floor((spatial.x - 1) / (that.worldBounds.width / 8));
//                        var indexJ = Math.floor((spatial.y - 1) / (that.worldBounds.height / 8));
//                        colliders[indexI][indexJ].push(gameObject);
//                }
//        }
    };

    /**
    * Remove an object from the state and destroy it.
    * @param {fmGameObject} gameObject the game object to remove and destroy.
    */
    that.remove = function (gameObject) {
        //Remove the game object from the state
        that.members.splice(that.members.indexOf(gameObject), 1);
        //Destroy the game object
        gameObject.destroy();
    };

    /**
     * Sort the members of the state by their z-index.
     */
    that.sortByZIndex = function () {
        that.members.sort(sortZIndex);
    };

    /**
    * Update the game objects of the state.
    * @param {float} dt time in seconds since the last frame.
    */
    var mainUpdate = function (dt) {
        //Update the Box2D world if it is present
        //TODO fix the physics timestep !
        //TODO regular simple physics should update here too
        var world = that.world.box2DWorld;
        if (world) {
            world.Step(1 / FMENGINE.fmParameters.FPS, 10, 10);
            world.ClearForces();
        }
        //Update every game object present in the state
        var i, gameObject, spatial, physic, controller, components;
        for (i = 0; i < that.members.length; i = i + 1) {
            gameObject = that.members[i];
            if (gameObject.isAlive()) {
                components = gameObject.components;
                spatial = components[FMENGINE.fmComponentTypes.SPATIAL];
                controller = components[FMENGINE.fmComponentTypes.CONTROLLER];
                physic = components[FMENGINE.fmComponentTypes.PHYSIC];
                //Update the game object
                gameObject.update(dt);
                //Update the physic component
                if (physic) {
                    physic.update(dt);

                    //Update scrolling
                    if (scroller === gameObject) {
                        var newOffset, velocity = physic.getLinearVelocity(),
                            frameWidth = followFrame.width, frameHeight = followFrame.height,
                            xPosition = spatial.x, yPosition = spatial.y,
                            farthestXPosition = xPosition + physic.getWidth(), farthestYPosition = yPosition + physic.getHeight();

                        // Going left
                        if (velocity.x < 0 && xPosition <= followFrame.x) {
                            newOffset = that.camera.x + velocity.x * dt;
                            if (newOffset >= 0) {
                                that.camera.x = newOffset;
                                followFrame.x += velocity.x * dt;
                            }
                        }
                        // Going up
                        if (velocity.y < 0 && yPosition <= followFrame.y) {
                            newOffset = that.camera.y + velocity.y * dt;
                            if (newOffset >= 0) {
                                that.camera.y = newOffset;
                                followFrame.y += velocity.y * dt;
                            }
                        }
                        // Going right
                        if (velocity.x > 0 && farthestXPosition >= followFrame.x + frameWidth) {
                            newOffset = that.camera.x + velocity.x * dt;
                            if (newOffset + that.camera.width <= that.world.width) {
                                that.camera.x = newOffset;
                                followFrame.x += velocity.x * dt;
                            }
                        }
                        // Going down
                        if (velocity.y > 0 && farthestYPosition >= followFrame.y + frameHeight) {
                            newOffset = that.camera.y + velocity.y * dt;
                            if (newOffset + that.camera.height <= that.world.height) {
                                that.camera.y = newOffset;
                                followFrame.y += velocity.y * dt;
                            }
                        }
                    }
                } else {
                    if (FMENGINE.fmParameters.debug && scroller === gameObject) {
                        console.log("ERROR: The scrolling object must have a physic component.");
                    }
                }
            }
        }
    };

    /**
    * Pre update taking place before the main update.
    */
    that.preUpdate = function () {
        //TODO
    };

    /**
    * Update the state.
    * @param {float} dt time in seconds since the last frame.
    */
    that.update = function (dt) {
        mainUpdate(dt);
    };

    /**
    * Post update taking place after the main update.
    * @param {float} alpha
    */
    that.postUpdate = function (alpha) {
        //TODO
    };

    /**
    * Draw the game objects of the state.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
    * drawing is done.
    * @param {float} dt time in seconds since the last frame.
    */
    that.draw = function (bufferContext, dt) {
        //Clear the screen
        bufferContext.clearRect(0, 0, screenWidth, screenHeight);

        //Update offsets
        bufferContext.xOffset = that.camera.x;
        bufferContext.yOffset = that.camera.y;

        //Search for renderer in the game object list
        var i, gameObject, spatial, renderer;
        for (i = 0; i < that.members.length; i = i + 1) {
            gameObject = that.members[i];

            //If the game object is visible
            if (gameObject.isVisible()) {
                spatial = gameObject.components[FMENGINE.fmComponentTypes.SPATIAL];
                renderer = gameObject.components[FMENGINE.fmComponentTypes.RENDERER];
                //If there is a spatial component then test if the game object is on the screen
                if (spatial && renderer) {
                    var xPosition = spatial.x, yPosition = spatial.y,
                        farthestXPosition = xPosition + renderer.getWidth(),
                        farthestYPosition = yPosition + renderer.getHeight(),
                        newViewX = 0, newViewY = 0;
                    //If the game object has a scrolling factor then apply it
                    newViewX = (that.camera.x + (screenWidth - that.camera.width) / 2) * gameObject.scrollFactor.x;
                    newViewY = (that.camera.y + (screenHeight - that.camera.height) / 2) * gameObject.scrollFactor.y;

                    //Draw the game object if it is within the bounds of the screen
                    if (farthestXPosition >= newViewX && farthestYPosition >= newViewY
                            && xPosition <= newViewX + that.camera.width && yPosition <= newViewY + that.camera.height) {
                        renderer.draw(bufferContext, dt);
                    }
                }
            }

            //Draw the physics debug information
            //TODO draw the debug from box2d
            if (FMENGINE.fmParameters.debug) {
                var physic = gameObject.components[FMENGINE.fmComponentTypes.PHYSIC];
                if (physic) {
                    physic.drawDebug(bufferContext);
                }
            }
        }
        // Debug
        if (FMENGINE.fmParameters.debug) {
            //Display the world bounds
            bufferContext.strokeStyle = '#f0f';
            bufferContext.strokeRect(0 - that.camera.x, 0 - that.camera.y, that.world.width, that.world.height);

            //Display the camera bounds
            bufferContext.strokeStyle = '#8fc';
            bufferContext.strokeRect((screenWidth - that.camera.width) / 2, (screenHeight - that.camera.height) / 2, that.camera.width, that.camera.height);

            //Display the scrolling bounds
            if (followFrame) {
                bufferContext.strokeStyle = '#f4f';
                bufferContext.strokeRect(followFrame.x - that.camera.x, followFrame.y - that.camera.y, followFrame.width, followFrame.height);
            }
        }
    };

    /**
    * Center the camera on a specific game object.
    * @param {fmGameObject} gameObject the game object to center the camera on.
    */
    that.centerCameraOn = function (gameObject) {
        var spatial = gameObject.components[FMENGINE.fmComponentTypes.SPATIAL],
            newPosition = spatial.x - that.camera.width / 2;
        if (newPosition > that.world.x && newPosition < that.world.width) {
            that.camera.x = newPosition;
        }
        newPosition = spatial.y - that.camera.height / 2;
        if (newPosition > that.world.y && newPosition < that.world.height) {
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
        if (newPosition > that.world.x && newPosition < that.world.width) {
            that.camera.x = newPosition;
        }
        newPosition = yPosition - that.camera.height / 2;
        if (newPosition > that.world.y && newPosition < that.world.height) {
            that.camera.y = newPosition;
        }
    };

    /**
    * Make an object as the scroller.
    * @param {fmGameObject} gameObject the game object to follow.
    * @param {int} width the width of the camera.
    * @param {int} height the height of the camera.
    */
    that.follow = function (gameObject, width, height) {
        scroller = gameObject;
        followFrame = FMENGINE.fmRectangle((screenWidth - width) / 2 + that.camera.x, (screenHeight - height) / 2 + that.camera.y, width, height);
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
        that.world.destroy();
        that.world = null;
        that = null;
    };

    /**
     * Get the object that scrolls the screen.
     * @return {fmGameObject} the game object that scrolls the screen.
     */
    that.getScroller = function () {
        return scroller;
    };

    return that;
};