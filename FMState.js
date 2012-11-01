/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMState is a simple container of game objects and helps structure the game
 *
 * @returns {FMState}
 */
function FMState() {
    "use strict";
    var that = {},
        /**
         * 
         */
        screenWidth = 0,
        /**
         * 
         */
        screenHeight = 0,
        /**
         * Used to know when to pause the game.
         */
        pause = false,
        /**
        * The game object that makes the screen scrolls
        */
        scroller = null,
        /**
         * Frame of the camera (used in case of scrolling)
         */
        followFrame = null;
    /**
     * Static attributes used to store the last ID affected to a game object
     */
    FMState.lastId = 0;
    /**
     * Object representing the world topology (bounds, tiles, collisions, objects)
     */
    that.world = null;
    /**
    * Camera (limited by the screen resolution of the game)
    */
    that.camera = FMRectangle(0, 0, 0, 0);
    /**
    * Array containing every game objects of the state
    */
    that.gameObjects = [];
    /**
    * Array of arrays that stores colliders
    */
    //var colliders = [];

    /**
    * Create the state
    */
    that.init = function (game) {
        screenWidth = game.getScreenWidth();
        screenHeight = game.getScreenHeight();
        //By default init the world to the size of the screen with all borders solid
        that.world = FMWorld(that, screenWidth, screenHeight);

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
        if (FMParameters.debug) {
            console.log("INIT: The state has been created.");
        }
    };

    /**
    * Private method that sort game objects according to their z index
    */
    var sortZIndex = function (a, b) {
            return (a.zIndex - b.zIndex);
    };

    /**
    * Add a game object to the state and sort it
    */
    that.add = function (gameObject) {
        that.gameObjects.push(gameObject);
        that.gameObjects.sort(sortZIndex);

        //Affect an ID to the game object
        FMState.lastId++;
        gameObject.setId(FMState.lastId);

        if (FMParameters.debug) {
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
    * Remove an object from the state
    */
    that.remove = function (gameObject) {
        var tmpGameObject, i = 0;
        while (i < that.gameObjects.length) {
            tmpGameObject = that.gameObjects.shift();
            if (tmpGameObject !== gameObject) {
                that.gameObjects.push(tmpGameObject);
            } else {
                gameObject.destroy();
                return;
            }
            i = i + 1;
        }
    };

    /**
    * Call all the updates
    */
    that.update = function (game, dt) {
        if (!pause) {
            mainUpdate(game, dt);
        }
    };

    /**
    * Pre update taking place before the main update.
    */
    that.preUpdate = function () {
        
    };

    /**
    * Update the game objects of the state.
    */
    var mainUpdate = function (game, dt) {
        //Update the Box2D world if it is present
        //TODO fix the physics timestep !
        //TODO regular simple physics should update here too
        var world = that.world.box2DWorld;
        if (world) {
            world.Step(1 / FMParameters.FPS, 10, 10);
            world.ClearForces();
        }
        //Update every game object present in the state
        var i, gameObject, spatial, physic, controller, components;
        for (i = 0; i < that.gameObjects.length; i = i + 1) {
            gameObject = that.gameObjects[i];
            if (gameObject.alive) {
                components = gameObject.components;
                spatial = components[FMComponentTypes.SPATIAL];
                controller = components[FMComponentTypes.CONTROLLER];
                physic = components[FMComponentTypes.PHYSIC];
                //Update the game object
                gameObject.update(dt);
                //Update the physic component
                if (physic) {
                    physic.update(game, dt);

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
                    if (FMParameters.debug && scroller == gameObject) {
                        console.log("ERROR: The scrolling object must have a physic component.");
                    }
                }
            }
        }
    };

    /**
    * Post update taking place after the main update.
    */
    that.postUpdate = function (game, alpha) {
        
    };

    /**
    * Draw the game objects of the state.
    */
    that.draw = function (bufferContext) {
        //Clear the screen
        bufferContext.clearRect(0, 0, screenWidth, screenHeight);

        //Update offsets
        bufferContext.xOffset = that.camera.x;
        bufferContext.yOffset = that.camera.y;

        //Search for renderer in the game object list
        var i, gameObject, renderer, physic;
        for (i = 0; i < that.gameObjects.length; i = i + 1) {
            gameObject = that.gameObjects[i];
            renderer = gameObject.components[FMComponentTypes.RENDERER];
            physic = gameObject.components[FMComponentTypes.PHYSIC];

            //If the game object has a renderer
            if (renderer) {
                var spatial = gameObject.components[FMComponentTypes.SPATIAL],
                xPosition = spatial.x, yPosition = spatial.y,
                farthestXPosition = xPosition + renderer.getWidth(), farthestYPosition = yPosition + renderer.getHeight();

                //If the game object has a scrolling factor then apply it
                var newViewX = 0, newViewY = 0;
                newViewX = (that.camera.x + (screenWidth - that.camera.width) / 2) * gameObject.scrollFactor.x;
                newViewY = (that.camera.y + (screenHeight - that.camera.height) / 2) * gameObject.scrollFactor.y;
                //Draw the game object if it is within the bounds of the screen
                if (farthestXPosition >= newViewX && farthestYPosition >= newViewY
                    && xPosition <= newViewX + that.camera.width && yPosition <= newViewY + that.camera.height) {
                    if (gameObject.visible) {
                        renderer.draw(bufferContext);
                    }
                }
            }
            //Draw the physics debug information
            if (FMParameters.debug) {
                if (physic) {
                    physic.drawDebug(bufferContext);
                }
            }
        }
        // Debug
        if (FMParameters.debug) {
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
        if (pause) {
            //TODO le petit bonhomme (son animation se reset sur 0 je pense) disparait quand on met pause
            //Fade screen
            bufferContext.fillStyle = "rgba(99,99,99,0.5)";
            bufferContext.fillRect(0, 0, screenWidth, screenHeight);

            //Show pause icon
            bufferContext.drawImage(FMAssetManager.getAssetByName("fmPauseIcon"), screenWidth / 2 - 50, screenHeight / 2 - 100);
            bufferContext.drawImage(FMAssetManager.getAssetByName("fmMuteIcon"), screenWidth / 2 - 25, screenHeight - 160);

            //Show pause texts
            bufferContext.fillStyle = '#fff';
            bufferContext.font = '50px bold sans-serif';
            bufferContext.textBaseline = 'middle';
            bufferContext.fillText("PAUSE", screenWidth / 2 - 70, screenHeight / 2 - 200);
            bufferContext.font = '15px sans-serif';
            bufferContext.fillText("Powered by {FM.js(engine);}", screenWidth / 2 - 65, screenHeight - 15);
        }
    };

    /**
    * Center the camera on a specific game object
    */
    that.centerCameraOn = function(gameObject) {
        var spatial = gameObject.components[FMComponentTypes.SPATIAL],
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
    * Center the camera at a specific given position
    */
    that.centerCameraAt = function(xPosition, yPosition) {
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
    * Make an object as the scroller
    */
    that.follow = function(gameObject, width, height) {
        scroller = gameObject;
        followFrame = FMRectangle((screenWidth - width) / 2 + that.camera.x, (screenHeight - height) / 2 + that.camera.y, width, height);
    }

    /**
    * Delete the scroller
    */
    that.unFollow = function() {
        followFrame = null;
        scroller = null;
    }

    /**
     * Triggered when the canvas elements loses focus, show pause screen and pause the game.
     */
    that.pause = function (bufferContext) {
        pause = true;
    }

    /**
     * Triggered when the canvas elements retrieves focus, restart the game.
     */
    that.restart = function (bufferContext) {
        pause = false;
    }

    /**
    * Destroy the state and its objects
    */
    that.destroy = function() {
        for ( var i = 0; i < that.gameObjects.length; i++) {
                that.gameObjects[i].destroy();
        }
        that.gameObjects = null;
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
    }
    
    /**
     * Get the object that scrolls the screen
     * @returns {FMGameObject} The game object that scrolls the screen.
     */
    that.getScroller = function () {
        return scroller;
    }

    return that;
}