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
     * Used to know when to pause the game.
     */
    pause = false,
    /**
     * 
     */
    screenWidth = 0,
    /**
     * 
     */
    screenHeight = 0,
    /**
    * The game object that makes the screen scrolls
    */
    scroller = null,
    /**
     * Frame of the camera (used in case of scrolling)
     */
    followFrame = null;

    /**
     * Object representing the world topology (bounds, tiles, collisions, objects)
     */
    that.world = null;
    /**
    * Bounds of the view (limited by the screen resolution of the game)
    */
    that.viewport = FMRectangle(0, 0, 0, 0);
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
        that.world = FMWorld(that, [0, screenWidth, 0, screenHeight]);

        //Set the viewport size by the chosen screen size
        that.viewport.setWidth(game.getScreenWidth());
        that.viewport.setHeight(game.getScreenHeight());

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
     * Initialize the game objects of the state
     */
    that.postInit = function () {
        var i;
        for (i = 0; i < that.gameObjects.length; i++) {
            that.gameObjects[i].postInit();
        }
        if (FMParameters.debug) {
            console.log("INIT: The game objects have been initialized.");
        }
    }

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
        var i, gameObject, spatial, physic, controller, script, components;
        for (i = 0; i < that.gameObjects.length; i = i + 1) {
            gameObject = that.gameObjects[i];
            if (!gameObject.destroyed) {
                components = gameObject.components;
                spatial = components[FMComponentTypes.spatial];
                physic = components[FMComponentTypes.physic];
                controller = components[FMComponentTypes.controller];
                script = components[FMComponentTypes.script];
                //Update the game object
                gameObject.update(game, dt);
                //Update the physic component
                if (physic) {
                    physic.update(game, dt);

                    //Update scrolling
                    if (scroller === gameObject) {
                        var newOffset, velocity = physic.getLinearVelocity(),
                            frameWidth = followFrame.getWidth(), frameHeight = followFrame.getHeight(),
                            xPosition = spatial.x, yPosition = spatial.y,
                            farthestXPosition = xPosition + physic.getWidth(), farthestYPosition = yPosition + physic.getHeight();
    
                        // Going left
                        if (velocity.x < 0 && xPosition <= followFrame.x) {
                            newOffset = that.world.xOffset + velocity.x * dt;
                            if (newOffset >= 0) {
                                that.world.xOffset = newOffset;
                                followFrame.x += velocity.x * dt;
                            }
                        }
                        // Going up
                        if (velocity.y < 0 && yPosition <= followFrame.y) {
                            newOffset = that.world.yOffset + velocity.y * dt;
                            if (newOffset >= 0) {
                                that.world.yOffset = newOffset;
                                followFrame.y += velocity.y * dt;
                            }
                        }
                        // Going right
                        if (velocity.x > 0 && farthestXPosition >= followFrame.x + frameWidth) {
                            newOffset = that.world.xOffset + velocity.x * dt;
                            if (newOffset + that.viewport.getWidth() <= that.world.getWidth()) {
                                that.world.xOffset = newOffset;
                                followFrame.x += velocity.x * dt;
                            }
                        }
                        // Going down
                        if (velocity.y > 0 && farthestYPosition >= followFrame.y + frameHeight) {
                            newOffset = that.world.yOffset + velocity.y * dt;
                            if (newOffset + that.viewport.getHeight() <= that.world.getHeight()) {
                                that.world.yOffset = newOffset;
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
        bufferContext.xOffset = that.world.xOffset;
        bufferContext.yOffset = that.world.yOffset;

        //Display every game objects
        var i, gameObject, renderer, physic, components;
        for (i = 0; i < that.gameObjects.length; i = i + 1) {
            gameObject = that.gameObjects[i];
            renderer = gameObject.components[FMComponentTypes.renderer];
            physic = gameObject.components[FMComponentTypes.physic];

            //If the game object has a renderer
            if (renderer) {
                components = gameObject.components;
                var spatial = components[FMComponentTypes.spatial];
                var xPosition = spatial.x, yPosition = spatial.y;
                var farthestXPosition = xPosition + renderer.getWidth(), farthestYPosition = yPosition + renderer.getHeight();

                //Draw the object to render if it is on screen
                var newViewX = that.viewport.x, newViewY = that.viewport.y;
                if (renderer.scrolled) {
                    newViewX = that.viewport.x + that.world.xOffset;
                    newViewY = that.viewport.y + that.world.yOffset;
                }
                if (farthestXPosition >= newViewX && farthestYPosition >= newViewY
                    && xPosition <= newViewX + that.viewport.getWidth() && yPosition <= newViewY + that.viewport.getHeight()) {
                    if (!gameObject.destroyed && gameObject.visible) {
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
            //Display the view bounds
            bufferContext.strokeStyle = '#fff';
            bufferContext.strokeRect(0, 0, that.viewport.getWidth(), that.viewport.getHeight());

            //Display the world bounds
            bufferContext.strokeStyle = '#fff';
            bufferContext.strokeRect(that.viewport.x - 0, 0 - that.viewport.y, that.world.getWidth(), that.world.getHeight());

            // Debug display the camera bounds
            if (scroller) {
                var frameWidth = followFrame.getWidth(), frameHeight = followFrame.getHeight();
                bufferContext.strokeStyle = '#fff';
                bufferContext.strokeRect(followFrame.x - that.world.xOffset, followFrame.y - that.world.yOffset, frameWidth,
                frameHeight);
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
    * Center the viewport on a specific game object
    */
    that.centerViewportOn = function(gameObject) {
        var spatial = gameObject.components[fmComponentTypes.spatial];
        that.world.xOffset = spatial.x - screenWidth / 2;
        that.world.yOffset = spatial.y - screenHeight / 2;
    };

    /**
    * Center the viewport at a specific given position
    */
    that.centerViewportAt = function(xPosition, yPosition) {
        that.world.xOffset = xPosition - screenWidth / 2;
        that.world.yOffset = yPosition -screenHeight  / 2;
    };

    /**
    * Make an object as the scroller
    */
    that.follow = function(gameObject, width, height) {
        scroller = gameObject;
        followFrame = FMRectangle(screenWidth / 2 - width / 2 + that.world.xOffset, screenHeight / 2 - height / 2 + that.world.yOffset, width, height);
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