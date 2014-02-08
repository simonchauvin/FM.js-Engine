
/**
 * {FM.js(engine);} v1.1
 * http://simonchauvin.github.io/FM.js-Engine/
 *
 * Copyright (c) 2013 Simon Chauvin.
 * Licenced under the MIT License.
 */

var FM = {};
/**
 * The asset manager is the unique object for storing and loading content (audio
 * , image, files).
 * @class FM.AssetManager
 * @static
 * @author Simon Chauvin
 */
FM.AssetManager = {
    /**
     * The list of assets stored by the asset manager.
     * @type Array
     * @field
     * @private
     */
    assets: [],
    /**
     * Keep tracks of the current progress in loading assets.
     * @type int
     * @field
     * @private
     */
    loadingProgress: 0,
    /**
     * Add an asset to the list.
     * As for sound the first to be found supported by the browser will be
     * the only one added. You have to provide at least one supported format
     * if you want the game to run.
     * @method FM.AssetManager#addAsset
     * @memberOf FM.AssetManager
     * @param {string] pName The name of the asset to load.
     * @param {FM.ObjectType] pType The type of the asset to load.
     * @param {string] pPath The path of the asset to load.
     */
    addAsset: function (pName, pType, pPath) {
        "use strict";
        var assetManager = FM.AssetManager,
            param = FM.Parameters,
            asset = assetManager.getAssetByName(pName),
            sound;
        if (pType === param.IMAGE) {
            if (!asset) {
                assetManager.assets.push(new FM.ImageAsset(pName, pPath));
            }
        } else if (pType === param.AUDIO) {
            if (!asset) {
                sound = new FM.AudioAsset(pName, pPath);
                //Add the asset only if it is supported by the browser
                if (sound.isSupported()) {
                    assetManager.assets.push(sound);
                } else {
                    console.log("ERROR: The " +
                            pPath.substring(pPath.lastIndexOf('.') + 1) +
                            " audio format is not supported by this browser.");
                    return false;
                }
            }
        } else if (pType === param.FILE) {
            if (!asset) {
                assetManager.assets.push(new FM.FileAsset(pName, pPath));
            }
        }
        return true;
    },
    /**
     * Load all assets.
     * @method FM.AssetManager#loadAssets
     * @memberOf FM.AssetManager
     */
    loadAssets: function () {
        "use strict";
        var i, assetManager = FM.AssetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            assetManager.assets[i].load();
        }
    },
    /**
     * Fired when an asset has been loaded.
     * @method FM.AssetManager#assetLoaded
     * @memberOf FM.AssetManager
     */
    assetLoaded: function () {
        "use strict";
        var assetManager = FM.AssetManager;
        assetManager.loadingProgress += 100 / assetManager.assets.length;
    },
    /**
     * Check if all assets have been loaded.
     * @method FM.AssetManager#areAllAssetsLoaded
     * @memberOf FM.AssetManager
     * @return {boolean} Whether all assets are loaded or not.
     */
    areAllAssetsLoaded: function () {
        "use strict";
        return Math.round(FM.AssetManager.loadingProgress) >= 100;
    },
    /**
     * Get an asset by its name.
     * @method FM.AssetManager#getAssetByName
     * @memberOf FM.AssetManager
     * @param {String} name The name of the asset to retrieve.
     * @return {FM.Asset} The asset matching the given name. Can be an
     * FM.ImageAsset, a FM.AudioAsset or a FM.FileAsset.
     */
    getAssetByName: function (name) {
        "use strict";
        var asset = null, i = 0, assetManager = FM.AssetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            if (assetManager.assets[i].getName() === name) {
                asset = assetManager.assets[i];
            }
        }
        return asset;
    }
};
/*global FM*/
/**
 * List of constants of the FM.js engine.
 * @class FM.Parameters
 * @static
 * @readonly
 * @author Simon Chauvin
 */
FM.Parameters = {
    /**
     * FPS at which the game is running.
     * @type Number
     */
    FPS: 60.0,
    /**
     * Debug mode.
     * @type Boolean
     */
    debug: false,
    /**
     * Minimum width and height of a collider, must be equal to the minimum
     * width a tile can have.
     * @type Number
     */
    COLLIDER_MINIMUM_SIZE: 16,
    /**
     * Box2D body type.
     * @type String
     */
    STATIC: "static",
    /**
     * Box2D body type.
     * @type String
     */
    KINEMATIC: "kinematic",
    /**
     * Box2D body type.
     * @type String
     */
    DYNAMIC: "dynamic",
    /**
     * Used for Box2D conversion.
     * @type Number
     */
    PIXELS_TO_METERS: 30,
    /**
     * Identify an image asset.
     * @type String
     */
    IMAGE: "image",
    /**
     * Identify an audio asset.
     * @type String
     */
    AUDIO: "audio",
    /**
     * Identify a file asset.
     * @type String
     */
    FILE: "file",
    /**
     * Identify the left.
     * @type String
     */
    LEFT: "left",
    /**
     * Identify the right.
     * @type String
     */
    RIGHT: "right",
    /**
     * Identify the up.
     * @type String
     */
    UP: "up",
    /**
     * Identify the down.
     * @type String
     */
    DOWN: "down"
};
/*global FM*/
/**
 * List of possible components.
 * @class FM.ComponentTypes
 * @static
 * @readonly
 * @author Simon Chauvin
 */
FM.ComponentTypes = {
    /**
     * Spatial component.
     * @type String
     */
    SPATIAL: "spatial",
    /**
     * Path component.
     * @type String
     */
    PATHFINDING: "pathfinding",
    /**
     * Renderer component.
     * @type String
     */
    RENDERER: "renderer",
    /**
     * Physic component.
     * @type String
     */
    PHYSIC: "physic",
    /**
     * Audio component.
     * @type String
     */
    SOUND: "sound",
    /**
     * FX component.
     * @type String
     */
    FX: "fx"
};
/*global FM*/
/**
 * Circle object.
 * @class FM.Circle
 * @param {int} pX X position of the circle.
 * @param {int} pY Y position of the circle.
 * @param {int} pRadius Radius of the circle.
 * @constructor
 * @author Simon Chauvin
 */
FM.Circle = function (pX, pY, pRadius) {
    "use strict";
    /**
     * x position.
     * @type int
     * @public
     */
    this.x = pX;
    /**
     * y position.
     * @type int
     * @public
     */
    this.y = pY;
    /**
     * Radius.
     * @type int
     * @public
     */
    this.radius = pRadius;
};
FM.Circle.prototype.constructor = FM.Circle;
/**
 * Destroy the circle and its objects.
 * @method FM.Circle#destroy
 * @memberOf FM.Circle
 */
FM.Circle.prototype.destroy = function () {
    "use strict";
    this.x = null;
    this.y = null;
    this.radius = null;
};
/*global FM*/
/**
 * The Game object is a singleton that represents the game application and
 * contains all the necessary information and methods to handle its execution.
 * @class FM.Game
 * @static
 * @author Simon Chauvin
 */
FM.Game = {
    /**
    * Name of the game.
    * @field
    * @type string
    * @private
    */
    name: "",
    /**
     * Width of the screen.
     * @field
     * @type int
     * @private
     */
    screenWidth: 0,
    /**
     * Height of the screen.
     * @field
     * @type int
     * @private
     */
    screenHeight: 0,
    /**
     * Color of the game's background.
     * @field
     * @type string
     * @private
     */
    backgroundColor: 'rgb(0,0,0)',
    /**
    * Current state of the game.
    * @field
    * @type FM.State
    * @private
    */
    currentState: null,
    /**
    * Canvas elements.
    * @field
    * @type Canvas2D
    * @private
    */
    canvas: null,
    /**
     * Context on which the game will be drawn.
     * @field
     * @type CanvasRenderingContext2D
     * @private
     */
    context: null,
    /**
     * Buffer used for double buffering.
     * @field
     * @type Canvas2D
     * @private
     */
    bufferCanvas: null,
    /**
     * Buffer context that will be drawn onto the displayed context.
     * @field
     * @type CanvasRenderingContext2D
     * @private
     */
    bufferContext: null,
    /**
     * Count the number of frames between two FPS computation.
     * @field
     * @type int
     * @private
     */
    framesCounter: 0,
    /**
     * Count the time between two FPS computation.
     * @field
     * @type float
     * @private
     */
    timeCounter: 0,
    /**
     * Fixed delta time for updating the game.
     * @field
     * @type float
     * @private
     */
    fixedDt: 1 / FM.Parameters.FPS,
    /**
     * Actual FPS at which the game is running.
     * @field
     * @type int
     * @private
     */
    actualFps: FM.Parameters.FPS,
    /**
     * Contains the FPS computed every second.
     * @field
     * @type int
     * @private
     */
    lastComputedFps: FM.Parameters.FPS,
    /**
     * Current time.
     * @field
     * @type float
     * @private
     */
    currentTime: (new Date()).getTime() / 1000,
    /**
     * Delay accumulated by the physics engine.
     * @field
     * @type float
     * @private
     */
    accumulator: 0.0,
    /**
    * Currently pressed keys.
    * @field
    * @type Array
    * @private
    */
    currentPressedKeys: [],
    /**
    * Currently released keys.
    * @field
    * @type Array
    * @private
    */
    currentReleasedKeys: [],
    /**
    * Keeps tracks of the mouse click.
    * @field
    * @type boolean
    * @private
    */
    mouseClicked: false,
    /**
    * Keeps tracks of whether the mouse is pressed or not.
    * @field
    * @type boolean
    * @private
    */
    mousePressed: false,
    /**
    * Keeps tracks of whether the mouse is released or not.
    * @field
    * @type boolean
    * @private
    */
    mouseReleased: false,
    /**
     * Mouse x position.
     * @field
     * @type int
     * @private
     */
    mouseX: 0,
    /**
     * Mouse y position.
     * @field
     * @type int
     * @private
     */
    mouseY: 0,
    /**
     * Whether the game has been paused or not.
     * @field
     * @type boolean
     * @private
     */
    pause: false,
    /**
     * Whether to display the debug information or not.
     * @field
     * @type boolean
     * @private
     */
    debugActivated: false,
    /**
    * Main game loop Calling update and draw on game objects.
    * @method FM.Game#gameLoop
    * @memberOf FM.Game
    * @private
    */
    gameLoop: function () {
        "use strict";
        //Reset the screen
        FM.Game.context.clearRect(0, 0, FM.Game.screenWidth, FM.Game.screenHeight);
        FM.Game.context.fillStyle = FM.Game.backgroundColor;
        FM.Game.context.fillRect(0, 0, FM.Game.screenWidth, FM.Game.screenHeight);

        //Retrieve the current time
        var newTime = (new Date()).getTime() / 1000,
            //Compute actual time since last frame
            frameTime = newTime - FM.Game.currentTime,
            alpha = 0;
        //Avoid spiral of death
        if (frameTime > 0.25) {
            frameTime = 0.25;
        }
        FM.Game.currentTime = newTime;
        //Update if not on pause
        if (!FM.Game.pause) {
            //Update the accumulator
            FM.Game.accumulator += frameTime;
            //Fixed update
            while (FM.Game.accumulator >= FM.Game.fixedDt) {
                FM.Game.accumulator -= FM.Game.fixedDt;
                //Update physics
                FM.Game.currentState.updatePhysics(FM.Game.fixedDt);
                //Update the current state
                FM.Game.currentState.update(FM.Game.fixedDt);
            }
            //Determine the ratio of interpolation
            alpha = FM.Game.accumulator / FM.Game.fixedDt;
        }
        //Compute the actual FPS at which the game is running
        FM.Game.timeCounter += frameTime;
        FM.Game.framesCounter = FM.Game.framesCounter + 1;
        if (FM.Game.timeCounter >= 1) {
            FM.Game.lastComputedFps = FM.Game.framesCounter / FM.Game.timeCounter;
            FM.Game.framesCounter = 0;
            FM.Game.timeCounter = 0;
        }
        FM.Game.actualFps = Math.round(FM.Game.lastComputedFps);

        //Draw the current state of the game
        FM.Game.currentState.draw(FM.Game.bufferContext, alpha);

        if (FM.Game.pause) {
            //Fade screen
            FM.Game.bufferContext.fillStyle = "rgba(99,99,99,0.5)";
            FM.Game.bufferContext.fillRect(0, 0, FM.Game.screenWidth, FM.Game.screenHeight);

            //Draw pause icon
            FM.Game.bufferContext.fillStyle   = 'rgba(255,255,255,1)';
            FM.Game.bufferContext.beginPath();
            FM.Game.bufferContext.moveTo(FM.Game.screenWidth / 2 + 60, FM.Game.screenHeight / 2);
            FM.Game.bufferContext.lineTo(FM.Game.screenWidth / 2 - 60, FM.Game.screenHeight / 2 - 60);
            FM.Game.bufferContext.lineTo(FM.Game.screenWidth / 2 - 60, FM.Game.screenHeight / 2 + 60);
            FM.Game.bufferContext.lineTo(FM.Game.screenWidth / 2 + 60, FM.Game.screenHeight / 2);
            FM.Game.bufferContext.fill();
            FM.Game.bufferContext.closePath();
        }

        // If debug mode if active
        if (FM.Parameters.debug) {
            //Display debug information
            if (FM.Game.isKeyReleased(FM.Keyboard.HOME)) {
                if (!FM.Game.debugActivated) {
                    FM.Game.debugActivated = true;
                } else {
                    FM.Game.debugActivated = false;
                }
            }
            //Draw the number of frames per seconds
            if (FM.Game.debugActivated) {
                FM.Game.bufferContext.fillStyle = '#fcd116';
                FM.Game.bufferContext.font = '30px sans-serif';
                FM.Game.bufferContext.textBaseline = 'middle';
                FM.Game.bufferContext.fillText(FM.Game.actualFps, 10, 20);
            }
        }

        //Draw the buffer onto the screen
        FM.Game.context.drawImage(FM.Game.bufferCanvas, 0, 0);

        //Reset keyboard and mouse inputs
        FM.Game.mouseClicked = false;
        FM.Game.currentReleasedKeys = [];

        //Main loop call
        window.requestAnimationFrame(FM.Game.gameLoop);
    },
    /**
    * Handle keys pressed.
    * @method FM.Game#onKeyPressed
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onKeyPressed: function (event) {
        "use strict";
        FM.Game.currentPressedKeys[event.keyCode] = 1;
    },
    /**
    * Handle keys released.
    * @method FM.Game#onKeyReleased
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onKeyReleased: function (event) {
        "use strict";
        var key = event.keyCode;
        FM.Game.currentReleasedKeys[key] = 1;
        delete FM.Game.currentPressedKeys[key];
    },
    /**
    * Handle mouse moves.
    * @method FM.Game#onMouseMove
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onMouseMove: function (event) {
        "use strict";
        FM.Game.mouseX = event.clientX - event.target.offsetLeft;
        FM.Game.mouseY = event.clientY - event.target.offsetTop;
    },
    /**
    * Handle mouse click.
    * @method FM.Game#onClick
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onClick: function (event) {
        "use strict";
        FM.Game.mouseClicked = true;
    },
    /**
    * Handle mouse pressed.
    * @method FM.Game#onMousePressed
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onMousePressed: function (event) {
        "use strict";
        FM.Game.mousePressed = true;
        FM.Game.mouseReleased = false;
    },
    /**
    * Handle mouse pressed.
    * @method FM.Game#onMouseReleased
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onMouseReleased: function (event) {
        "use strict";
        FM.Game.mouseReleased = true;
        FM.Game.mousePressed = false;
    },
    /**
    * Handle canvas's retrieve of focus.
    * @method FM.Game#onFocus
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onFocus: function (event) {
        "use strict";
        FM.Game.pause = false;
    },
    /**
    * Handle canvas's lost of focus.
    * @method FM.Game#onOutOfFocus
    * @memberOf FM.Game
    * @param {Event} event The associated event object.
    * @private
    */
    onOutOfFocus: function (event) {
        "use strict";
        FM.Game.pause = true;
    },
    /**
     * Start running the game.
     * @method FM.Game#run
    * @memberOf FM.Game
     * @param {string} pCanvasId The string ID of the canvas on which to run 
     * the game.
     * @param {string} pName The name of the game.
     * @param {int} pWidth The width of the screen.
     * @param {int} pHeight The height of the screen.
     * @param {FM.State} pFirstState The first state to perform.
     * @param {FM.Preloader} pCustomPreloader Preloader to be used if you want a
     * custom preloader.
     */
    run: function (pCanvasId, pName, pWidth, pHeight, pFirstState, pCustomPreloader) {
        "use strict";
        FM.Game.name = pName;
        FM.Game.screenWidth = pWidth;
        FM.Game.screenHeight = pHeight;
        FM.Game.canvas = document.getElementById(pCanvasId);
        if (pCustomPreloader) {
            FM.Game.currentState = pCustomPreloader(pFirstState);
        } else {
            FM.Game.currentState = new FM.Preloader(pFirstState);
        }
        //Create canvas context if it exists and use double buffering
        if (FM.Game.canvas && FM.Game.canvas.getContext) {
            FM.Game.context = FM.Game.canvas.getContext("2d");

            if (FM.Game.context) {
                FM.Game.canvas.width = FM.Game.screenWidth;
                FM.Game.canvas.height = FM.Game.screenHeight;
                FM.Game.bufferCanvas = document.createElement("canvas");
                FM.Game.bufferCanvas.width = FM.Game.screenWidth;
                FM.Game.bufferCanvas.height = FM.Game.screenHeight;
                FM.Game.bufferContext = FM.Game.bufferCanvas.getContext("2d");
                FM.Game.bufferContext.xOffset = 0;
                FM.Game.bufferContext.yOffset = 0;
            }
        }
        if (FM.Game.context && FM.Game.bufferContext) {
            FM.Game.canvas.onkeydown = function (event) {
                FM.Game.onKeyPressed(event);
            };
            FM.Game.canvas.onkeyup = function (event) {
                FM.Game.onKeyReleased(event);
            };
            FM.Game.canvas.onclick = function (event) {
                FM.Game.onClick(event);
            };
            FM.Game.canvas.onmousedown = function (event) {
                FM.Game.onMousePressed(event);
            };
            FM.Game.canvas.onmouseup = function (event) {
                FM.Game.onMouseReleased(event);
            };
            FM.Game.canvas.onmousemove = function (event) {
                FM.Game.onMouseMove(event);
            };
            FM.Game.canvas.onfocus = function (event) {
                FM.Game.onFocus(event);
            };
            FM.Game.canvas.onblur = function (event) {
                FM.Game.onOutOfFocus(event);
            };

            //Focus on the canvas
            FM.Game.canvas.focus();

            //Init the current state
            FM.Game.currentState.init();

            //Start the main loop
            window.requestAnimationFrame(FM.Game.gameLoop);
        }
    },
    /**
    * Switch between two states.
    * @method FM.Game#switchState
    * @memberOf FM.Game
    * @param {FM.State} newState The new state to switch to.
    */
    switchState: function (newState) {
        "use strict";
        FM.Game.currentState.destroy();
        FM.Game.currentState = newState;
        FM.Game.currentState.init();
    },
    /**
    * Change the game's background color.
    * @method FM.Game#setBackgroundColor
    * @memberOf FM.Game
    * @param {string} newColor The color to set the background to.
    */
    setBackgroundColor: function (newColor) {
        "use strict";
        FM.Game.backgroundColor = newColor;
    },
    /**
    * Check if a key is pressed.
    * @method FM.Game#isKeyPressed
    * @memberOf FM.Game
    * @param {int} key The key to test if it is pressed.
    * @return {boolean} Whether the given key is pressed or not.
    */
    isKeyPressed: function (key) {
        "use strict";
        if (FM.Game.currentPressedKeys[key]) {
            return true;
        } else {
            return false;
        }
    },
    /**
    * Check if a key has been released.
    * @method FM.Game#isKeyReleased
    * @memberOf FM.Game
    * @param {int} key The key to test if it has been released or not.
    * @return {boolean} Whether the given key was just released or not.
    */
    isKeyReleased: function (key) {
        "use strict";
        if (FM.Game.currentReleasedKeys[key]) {
            return true;
        } else {
            return false;
        }
    },
    /**
    * Check if the mouse has been clicked.
    * @method FM.Game#isMouseClicked
    * @memberOf FM.Game
    * @return {boolean} Whether the mouse left button has been clicked or not.
    */
    isMouseClicked: function () {
        "use strict";
        return FM.Game.mouseClicked;
    },
    /**
    * Check if a mouse button is pressed.
    * @method FM.Game#isMousePressed
    * @memberOf FM.Game
    * @return {boolean} Whether the mouse left button is pressed.
    */
    isMousePressed: function () {
        "use strict";
        return FM.Game.mousePressed;
    },
    /**
    * Check if a mouse button has been released.
    * @method FM.Game#isMouseReleased
    * @memberOf FM.Game
    * @return {boolean} Whether the mouse left button was released or not.
    */
    isMouseReleased: function () {
        "use strict";
        return FM.Game.mouseReleased;
    },
    /**
     * Check if the debug button was pressed and if debug info should
     * be displayed.
     * @method FM.Game#isDebugActivated
     * @memberOf FM.Game
     * @return {boolean} Whether the debug mode is activated or not.
     */
    isDebugActivated: function () {
        "use strict";
        return FM.Game.debugActivated;
    },
    /**
     * Retrieve the name of the game.
     * @method FM.Game#getName
     * @memberOf FM.Game
     * @return {string} The name of the game.
     */
    getName: function () {
        "use strict";
        return FM.Game.name;
    },
    /**
    * Retrieve the mouse x position in world coordinates.
    * @method FM.Game#getMouseX
    * @memberOf FM.Game
    * @return {int} The x position of the mouse cursor.
    */
    getMouseX: function () {
        "use strict";
        return FM.Game.mouseX + FM.Game.currentState.camera.x;
    },
    /**
    * Retrieve the mouse y position in wolrd coordinates.
    * @method FM.Game#getMouseY
    * @memberOf FM.Game
    * @return {int} The y position of the mouse cursor.
    */
    getMouseY: function () {
        "use strict";
        return FM.Game.mouseY + FM.Game.currentState.camera.y;
    },
    /**
    * Retrieve the mouse x position on the screen.
    * @method FM.Game#getMouseScreenX
    * @memberOf FM.Game
    * @return {int} The x position of the mouse on the screen.
    */
    getMouseScreenX: function () {
        "use strict";
        return FM.Game.mouseX;
    },
    /**
    * Retrieve the mouse y position on the screen.
    * @method FM.Game#getMouseScreenY
    * @memberOf FM.Game
    * @return {int} The y position of the mouse on the screen.
    */
    getMouseScreenY: function () {
        "use strict";
        return FM.Game.mouseY;
    },
    /**
    * Retrieve the chosen width of the game screen.
    * @method FM.Game#getScreenWidth
    * @memberOf FM.Game
    * @return {int} The width of the screen.
    */
    getScreenWidth: function () {
        "use strict";
        return FM.Game.screenWidth;
    },
    /**
    * Retrieve the chosen height of the game screen.
    * @method FM.Game#getScreenHeight
    * @memberOf FM.Game
    * @return {int] The height of the screen.
    */
    getScreenHeight: function () {
        "use strict";
        return FM.Game.screenHeight;
    },
    /**
    * Retrieve the current state of the game
    * @method FM.Game#getCurrentState
    * @memberOf FM.Game
    * @return {FM.State] The current state of the game.
    */
    getCurrentState: function () {
        "use strict";
        return FM.Game.currentState;
    }
};
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
    var comp = this.components[FM.ComponentTypes.SPATIAL];
    if (comp) {
        comp.destroy();
        this.components[FM.ComponentTypes.SPATIAL] = null;
    }
    comp = this.components[FM.ComponentTypes.PATHFINDING];
    if (comp) {
        comp.destroy();
        this.components[FM.ComponentTypes.PATHFINDING] = null;
    }
    comp = this.components[FM.ComponentTypes.RENDERER];
    if (comp) {
        comp.destroy();
        this.components[FM.ComponentTypes.RENDERER] = null;
    }
    comp = this.components[FM.ComponentTypes.PHYSIC];
    if (comp) {
        comp.destroy();
        this.components[FM.ComponentTypes.PHYSIC] = null;
    }
    comp = this.components[FM.ComponentTypes.SOUND];
    if (comp) {
        comp.destroy();
        this.components[FM.ComponentTypes.SOUND] = null;
    }
    comp = this.components[FM.ComponentTypes.FX];
    if (comp) {
        comp.destroy();
        this.components[FM.ComponentTypes.FX] = null;
    }
    this.components = null;
};
/*global FM*/
/**
 * List of keyboard codes.
 * @class FM.Keyboard
 * @static
 * @readonly
 * @author Simon Chauvin
 */
FM.Keyboard = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DEL: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    lLEFT_SPECIAL: 91,
    RIGHT_SPECIAL: 92,
    SELECT: 93,
    NUM_ZERO: 96,
    NUM_ONE: 97,
    NUM_TWO: 98,
    NUM_THREE: 99,
    NUM_FOUR: 100,
    NUM_FIVE: 101,
    NUM_SIX: 102,
    NUM_SEVEN: 103,
    NUM_EIGHT: 104,
    NUM_NINE: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBSTRACT: 109,
    DECIMAL_POINT: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    SEMICOLON: 186,
    EQUAL_SIGN: 187,
    COMMA: 188,
    DASH: 189,
    PERIOD: 190,
    FORWARD_SLASH: 191,
    GRAVE_ACCENT: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    SINGLE_QUOTE: 222
};
/*global FM*/
/**
 * Math class for specific game related functions.
 * @class FM.Math
 * @static
 * @author Simon Chauvin
 */
FM.Math = {
    /**
     * Add two vectors together.
     * @method FM.Math#addVectors
     * @memberOf FM.Math
     * @param {FM.Vector} vec1 The first vector to add.
     * @param {FM.Vector} vec2 The second vector to add.
     * @returns {FM.Vector} The vector product of the addition of the two given
     * vectors.
     */
    addVectors: function (vec1, vec2) {
        "use strict";
        return new FM.Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    },
    /**
     * Substract a vector from another.
     * @method FM.Math#substractVectors
     * @memberOf FM.Math
     * @param {FM.Vector} vec1 The vector that gets substracted.
     * @param {FM.Vector} vec2 The vector that subtracts.
     * @returns {FM.Vector} The vector resulting of the substraction of vec2 
     * from vec1.
     */
    substractVectors: function (vec1, vec2) {
        "use strict";
        return new FM.Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    },
    /**
     * Multiply two vectors together.
     * @method FM.Math#multiplyVectors
     * @memberOf FM.Math
     * @param {FM.Vector} vec1 The first vector to multiply.
     * @param {FM.Vector} vec2 The second vector to multiply.
     * @returns {FM.Vector} The vector product of the multiplication of the 
     * two given vector.
     */
    multiplyVectors: function (vec1, vec2) {
        "use strict";
        return new FM.Vector(vec1.x * vec2.x, vec1.y * vec2.y);
    },
    /**
     * Clamp a value between a min and a max to the nearest available value.
     * @method FM.Math#clamp
     * @memberOf FM.Math
     * @param {float} val The value to clamp.
     * @param {float} min The min value possible.
     * @param {float} max The max value possible.
     * @returns {float} The value clamped.
     */
    clamp: function (val, min, max) {
        "use strict";
        return Math.min(max, Math.max(min, val));
    },
};
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
/*global FM*/
/**
 * Rectangle object.
 * @class FM.Rectangle
 * @param {int} pX X position of the rectangle.
 * @param {int} pY Y position of the rectangle.
 * @param {int} pWidth Width of the rectangle.
 * @param {int} pHeight Height of the rectangle.
 * @constructor
 * @author Simon Chauvin
 */
FM.Rectangle = function (pX, pY, pWidth, pHeight) {
    "use strict";
    /**
     * x position.
     * @type int
     * @public
     */
    this.x = pX;
    /**
     * y position.
     * @type int
     * @public
     */
    this.y = pY;
    /**
     * Width of the rectangle.
     * @type int
     * @public
     */
    this.width = pWidth;
    /**
     * Height of the rectangle.
     * @type int
     * @public
     */
    this.height = pHeight;
};
FM.Rectangle.prototype.constructor = FM.Rectangle;
/**
 * Destroy the rectangle and its objects.
 * @method FM.Rectangle#destroy
 * @memberOf FM.Rectangle
 */
FM.Rectangle.prototype.destroy = function () {
    "use strict";
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
};
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
                    var xPosition = newPosition.x, yPosition = newPosition.y,
                        farthestXPosition = xPosition + renderer.getWidth(),
                        farthestYPosition = yPosition + renderer.getHeight(),
                        newViewX = 0, newViewY = 0;
                    //If the game object has a scrolling factor then apply it
                    newViewX = (this.camera.x + (this.screenWidth - this.camera.width) / 2) * gameObject.scrollFactor.x;
                    newViewY = (this.camera.y + (this.screenHeight - this.camera.height) / 2) * gameObject.scrollFactor.y;

                    //Draw the game object if it is within the bounds of the screen
                    if (farthestXPosition >= newViewX && farthestYPosition >= newViewY
                            && xPosition <= newViewX + this.camera.width && yPosition <= newViewY + this.camera.height) {
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
/*global FM*/
/**
 * Represent a tile map for build tiled games.
 * No need to add the tilemap to the state, it's done when the tilemap is 
 * loaded.
 * By default a tilemap does not collide to anything.
 * @class FM.TileMap
 * @param {FM.ImageAsset} tileSet Image of the tile set in the order of 
 * the data given.
 * @param {int} pWidth The number of tiles constituing the width of the tile 
 * map.
 * @param {int} pHeight The number of tiles constituing the height of the tile
 * map.
 * @param {int} pTileWidth The width of a tile.
 * @param {int} pTileHeight The height of a tile.
 * @param {Array} pTypes The types to set the tiles of the tile map to.
 * @param {int} pZIndex The depth of the tiles of the tile map.
 * @param {boolean} pCollide Whether the tile map should collide or not.
 * @constructor
 * @author Simon Chauvin
 */
FM.TileMap = function (pTileSet, pWidth, pHeight, pTileWidth, pTileHeight, pTypes, pZIndex, pCollide) {
    "use strict";
    /**
     * Array containing the IDs of tiles.
     * @type Array
     * @private
     */
    this.data = [];
    /**
     * Image of the tile set.
     * @type Image
     * @private
     */
    this.tileSet = pTileSet;
    /**
     * Width of the map, in columns.
     * @type int
     * @private
     */
    this.width = pWidth;
    /**
     * Height of the map, in lines.
     * @type int
     * @private
     */
    this.height = pHeight;
    /**
     * Width of a tile.
     * @type int
     * @private
     */
    this.tileWidth = pTileWidth;
    /**
     * Height of a tile.
     * @type int
     * @private
     */
    this.tileHeight = pTileHeight;
    /**
     * Types the tile map is associated to.
     * @type Array
     * @private
     */
    this.types = pTypes;
    /**
     * Z-index of the tilemap.
     * @type int
     * @private
     */
    this.zIndex = pZIndex;
    /**
     * Allow collisions or not with this tile map.
     * @type boolean
     * @private
     */
    this.collide = pCollide;
};
FM.TileMap.prototype.constructor = FM.TileMap;
/**
 * Load the tilemap.
 * @method FM.TileMap#load
 * @memberOf FM.TileMap
 * @param {string} pData Comma and line return sparated string of numbers 
 * representing the position and type of tiles.
 */
FM.TileMap.prototype.load = function (pData) {
    "use strict";
    var rows = pData.split("\n"),
        row = null,
        resultRow = null,
        columns = null,
        gid = null,
        tile = null,
        state = FM.Game.getCurrentState(),
        renderer,
        xOffset,
        yOffset,
        image = this.tileSet.getImage(),
        i,
        j,
        n;
    for (i = 0; i < rows.length; i = i + 1) {
        row = rows[i];
        if (row) {
            resultRow = [];
            columns = row.split(",", this.width);
            for (j = 0; j < columns.length; j = j + 1) {
                gid = parseInt(columns[j]);
                if (gid > 0) {
                    tile = new FM.GameObject(this.zIndex);
                    for (n = 0; n < this.types.length; n = n + 1) {
                        tile.addType(this.types[n]);
                    }
                    tile.addComponent(new FM.SpatialComponent(j * this.tileWidth, i * this.tileHeight, tile));
                    renderer = tile.addComponent(new FM.SpriteRendererComponent(this.tileSet, this.tileWidth, this.tileHeight, tile));
                    //Select the right tile in the tile set
                    xOffset = gid * this.tileWidth;
                    yOffset = Math.floor(xOffset / image.width) * this.tileHeight;
                    if (xOffset >= image.width) {
                        yOffset = Math.floor(xOffset / image.width) * this.tileHeight;
                        xOffset = (xOffset % image.width);
                    }
                    renderer.offset.reset(xOffset, yOffset);
                    //Add tile to the state
                    state.add(tile);
                    //Add the game object's ID
                    resultRow.push(tile.getId());
                } else {
                    //No tile
                    resultRow.push(-1);
                }
            }
            //New line
            this.data.push(resultRow);
        }
    }
};
/**
 * Allow collisions for this tile map.
 * @method FM.TileMap#allowCollisions
 * @memberOf FM.TileMap
 */
FM.TileMap.prototype.allowCollisions = function () {
    "use strict";
    this.collide = true;
};
/**
 * Prevent collisions for this tile map.
 * @method FM.TileMap#preventCollisions
 * @memberOf FM.TileMap
 */
FM.TileMap.prototype.preventCollisions = function () {
    "use strict";
    this.collide = false;
};
/**
 * Check if this tile map can collide.
 * @method FM.TileMap#canCollide
 * @memberOf FM.TileMap
 * @return {boolean} Whether this tile map can collide or not.
 */
FM.TileMap.prototype.canCollide = function () {
    "use strict";
    return this.collide;
};
/**
 * Check if this tile map has a specified type.
 * @method FM.TileMap#hasType
 * @memberOf FM.TileMap
 * @return {boolean} Whether this tile map has the given type or not.
 */
FM.TileMap.prototype.hasType = function (pType) {
    "use strict";
    return this.types.indexOf(pType) !== -1;
};
/**
 * Retrive the 2D array of tile IDs.
 * @method FM.TileMap#getData
 * @memberOf FM.TileMap
 * @return {Array} The list of tile IDs of tile map.
 */
FM.TileMap.prototype.getData = function () {
    "use strict";
    return this.data;
};
/**
 * Retrive the tile set.
 * @method FM.TileMap#getTileSet
 * @memberOf FM.TileMap
 * @return {Image} The tile set.
 */
FM.TileMap.prototype.getTileSet = function () {
    "use strict";
    return this.tileSet;
};
/**
 * Retrieve the tile ID associated to a given position.
 * @method FM.TileMap#getTileId
 * @memberOf FM.TileMap
 * @param {int} pX The x position of the tile to retrieve.
 * @param {int} pY The y position of the tile to retrieve.
 * @return {int} The ID of the tile at the given position.
 */
FM.TileMap.prototype.getTileId = function (pX, pY) {
    "use strict";
    return this.data[Math.floor(pY / this.tileHeight)][Math.floor(pX / this.tileWidth)];
};
/**
 * Get the width of the map.
 * @method FM.TileMap#getWidth
 * @memberOf FM.TileMap
 * @return {int} The number of tiles constituing the width of the tile map.
 */
FM.TileMap.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Get the height of the map.
 * @method FM.TileMap#getHeight
 * @memberOf FM.TileMap
 * @return {int} The number of tiles constituing the height of the tile map.
 */
FM.TileMap.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Get the width of a tile.
 * @method FM.TileMap#getTileWidth
 * @memberOf FM.TileMap
 * @return {int} The width of a tile.
 */
FM.TileMap.prototype.getTileWidth = function () {
    "use strict";
    return this.tileWidth;
};
/**
 * Get the height of a tile.
 * @method FM.TileMap#getTileHeight
 * @memberOf FM.TileMap
 * @return {int} The height of a tile.
 */
FM.TileMap.prototype.getTileHeight = function () {
    "use strict";
    return this.tileHeight;
};
/**
 * Get the z-index of the map.
 * @method FM.TileMap#getZIndex
 * @memberOf FM.TileMap
 * @return {int} The depth of the tiles of the tile map.
 */
FM.TileMap.prototype.getZIndex = function () {
    "use strict";
    return this.zIndex;
};
/**
* Destroy the tile map and its objects.
* @method FM.TileMap#destroy
 * @memberOf FM.TileMap
*/
FM.TileMap.prototype.destroy = function () {
    "use strict";
    this.data = null;
    this.tileSet = null;
    this.width = null;
    this.height = null;
    this.tileWidth = null;
    this.tileHeight = null;
    this.types = null;
    this.zIndex = null;
    this.collide = null;
};
/*global FM*/
/**
 * Vector object.
 * @class FM.Vector
 * @param {int} pX X position.
 * @param {int} pY Y position.
 * @constructor
 * @author Simon Chauvin
 */
FM.Vector = function (pX, pY) {
    "use strict";
    /**
     * x position.
     * @type int
     * @public
     * @default 0
     */
    this.x = pX || 0;
    /**
     * y position.
     * @type int
     * @public
     * @default 0
     */
    this.y = pY || 0;
};
FM.Vector.prototype.constructor = FM.Vector;
/**
 * Add the specified vector to the current one;
 * @method FM.Vector#add
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to add.
 * @return {FM.Vector} The vector modified.
 */
FM.Vector.prototype.add = function (vector) {
    "use strict";
    this.x += vector.x;
    this.y += vector.y;
    return this;
};
/**
 * Substract the specified vector from the current one;
 * @method FM.Vector#substract
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to substract.
 * @return {FM.Vector} The vector modified.
 */
FM.Vector.prototype.substract = function (vector) {
    "use strict";
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
};
/**
 * Multiply the current vector by the one specified;
 * @method FM.Vector#multiply
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to multiply.
 * @return {FM.Vector} The vector modified.
 */
FM.Vector.prototype.multiply = function (vector) {
    "use strict";
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
};
/**
 * Dot operation on the current vector and the specified one;
 * @method FM.Vector#dotProduct
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to dot product.
 * @return {FM.Vector} The dot product.
 */
FM.Vector.prototype.dotProduct = function (vector) {
    "use strict";
    return (this.x * vector.x + this.y * vector.y);
};
/**
 * Calculate the cross product of the current vector and another vector.
 * @method FM.Vector#crossProd
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to cross product.
 * @return {float} The cross product.
*/
FM.Vector.prototype.crossProd = function (vector) {
    "use strict";
    return this.x * vector.y - this.y * vector.x;
};
/**
 * Reset the vector the specified values.
 * @method FM.Vector#reset
 * @memberOf FM.Vector
 * @param {int} pX The x position.
 * @param {int} pY The y position.
 * @return {FM.Vector} The vector reset.
 */
FM.Vector.prototype.reset = function (pX, pY) {
    "use strict";
    this.x = pX || 0;
    this.y = pY || 0;
    return this;
};
/**
 * Return length of the vector;
 * @method FM.Vector#getLength
 * @memberOf FM.Vector
 * @return {float} The length of the vector.
 */
FM.Vector.prototype.getLength = function () {
    "use strict";
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};
/**
 * Return length of the vector;
 * @method FM.Vector#getLengthSquared
 * @memberOf FM.Vector
 * @return {int} The squared length of the vector.
 */
FM.Vector.prototype.getLengthSquared = function () {
    "use strict";
    return (this.x * this.x) + (this.y * this.y);
};
/**
 * Normalize the vector.
 * @method FM.Vector#normalize
 * @memberOf FM.Vector
 */
FM.Vector.prototype.normalize = function () {
    "use strict";
    var vlen = this.getLength();
    this.x = this.x / vlen;
    this.y = this.y / vlen;
};
/**
 * Copy the given vector to the current one.
 * @method FM.Vector#copy
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to copy.
 * @return {FM.Vector} The vector copied.
 */
FM.Vector.prototype.copy = function (vector) {
    "use strict";
    this.x = vector.x;
    this.y = vector.y;
    return this;
};
/**
 * Clone the current vector.
 * @method FM.Vector#clone
 * @memberOf FM.Vector
 * @return {FM.Vector} The new cloned vector.
 */
FM.Vector.prototype.clone = function () {
    "use strict";
    return new FM.Vector(this.x, this.y);
};
/**
 * Check if the current vector is equals to the specified one;
 * @method FM.Vector#isEquals
 * @memberOf FM.Vector
 * @param {FM.Vector} vector The vector to compare.
 * @return {boolean} Whether the two vector are equal or not.
 */
FM.Vector.prototype.isEquals = function (vector) {
    "use strict";
    return (this.x === vector.x && this.y === vector.y);
};
/**
* Destroy the point and its objects.
* @method FM.Vector#destroy
 * @memberOf FM.Vector
*/
FM.Vector.prototype.destroy = function () {
    "use strict";
    this.x = null;
    this.y = null;
};
/*global FM*/
/**
 * World represent the concrete space of the game.
 * @class FM.World
 * @extends FM.Rectangle
 * @param {int} pWidth Width of the tile map in pixels
 * @param {int} pHeight Height of the tile map in pixels
 * @constructor
 * @author Simon Chauvin
 */
FM.World = function (pWidth, pHeight) {
    "use strict";
    //Calling the constructor of the FM.Rectangle
    FM.Rectangle.call(this, 0, 0, pWidth, pHeight);
    /**
     * Tile maps of the world.
     * @type Array
     * @private
     */
    this.tileMaps = [];
};
/**
 * FM.World inherits from FM.Rectangle.
 */
FM.World.prototype = Object.create(FM.Rectangle.prototype);
FM.World.prototype.constructor = FM.World;
/**
 * Add a tile map to the current world.
 * @method FM.World#loadTileMap
 * @memberOf FM.World
 * @param {FM.TileMap} pTileMap Tile map to add.
 * @param {FM.TmxMap} pMap TmxMap containing the tile map data.
 * @param {string} pLayerName Name of the layer of the tile map.
 * @param {string} pTileSetName Name of the tile set to use.
 */
FM.World.prototype.loadTileMap = function (pTileMap, pMap, pLayerName, pTileSetName) {
    "use strict";
    pTileMap.load(pMap.getLayer(pLayerName).toCsv(pMap.getTileSet(pTileSetName)));
    this.tileMaps.push(pTileMap);
};
/**
 * Retrieve the tile map from the given type.
 * @method FM.World#getTileMapFromType
 * @memberOf FM.World
 * @param {FM.ObjectType} pType The type of the tile map to retrieve.
 * @return {FM.TileMap} The tile map corresponding to the given type or null if none is found.
 */
FM.World.prototype.getTileMapFromType = function (pType) {
    "use strict";
    var i, tileMap;
    for (i = 0; i < this.tileMaps.length; i = i + 1) {
        tileMap = this.tileMaps[i];
        if (tileMap.hasType(pType)) {
            return tileMap;
        }
    }
    return null;
};
/**
 * Check if a tile map allow collisions.
 * @method FM.World#hasTileCollisions
 * @memberOf FM.World
 * @return {boolean} Whether there is a tile map with potential collisions or not.
 */
FM.World.prototype.hasTileCollisions = function () {
    "use strict";
    var i;
    for (i = 0; i < this.tileMaps.length; i = i + 1) {
        if (this.tileMaps[i].canCollide()) {
            return true;
        }
    }
    return false;
};
/**
 * Destroy the world and its objects.
 * @method FM.World#destroy
 * @memberOf FM.World
 */
FM.World.prototype.destroy = function () {
    "use strict";
    this.tileMaps = null;
    FM.Rectangle.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The collision object represents a collision between two objects.
 * @class FM.Collision
 * @param {FM.PhysicComponent} pPhysicObjectA One of the two game objects' physic 
 * component colliding.
 * @param {FM.PhysicComponent} pPhysicObjectB One of the two game objects' physic 
 * component colliding.
 * @constructor
 * @author Simon Chauvin
 */
FM.Collision = function (pPhysicObjectA, pPhysicObjectB) {
    "use strict";
    /**
     * Physic object A.
     * @type FM.PhysicComponent
     * @public
     */
    this.a = pPhysicObjectA || null;
    /**
     * Physic object B.
     * @type FM.PhysicComponent
     * @public
     */
    this.b = pPhysicObjectB || null;
    /**
     * How much the two objects penetrates one another.
     * @type float
     * @public
     */
    this.penetration = 0.0;
    /**
     * Normal of the collision, starting at the center of object a and ending
     * in the center of the object b.
     * @type FM.Vector
     * @public
     */
    this.normal = null;
};
FM.Collision.prototype.constructor = FM.Collision;
/**
 * Destroy the manifold and its objects.
 * @method FM.Collision#destroy
 * @memberOf FM.Collision
 */
FM.Collision.prototype.destroy = function () {
    "use strict";
    this.a = null;
    this.b = null;
    this.normal = null;
    this.penetration = null;
};
/*global FM*/
/**
 * Top level object shared by every components.
 * You need to add the created component to the game object owner.
 * @class FM.Component
 * @param {string} pComponentType Type of the component to add.
 * @param {FM.GameObject} pComponentOwner Game object that owns the component.
 * @constructor
 * @author Simon Chauvin
 */
FM.Component = function (pComponentType, pComponentOwner) {
    "use strict";
    if (pComponentOwner) {
        if (pComponentOwner.components) {
            /**
             * Component's name.
             * @type FM.ComponentTypes
             * @public
             */
            this.name = pComponentType;
            /**
             * Component's owner.
             * @type FM.GameObject
             * @public
             */
            this.owner = pComponentOwner;
        } else {
            if (FM.Parameters.debug) {
                console.log("ERROR: the owner of the " + pComponentType
                        + " component must be a gameObject.");
            }
        }
    } else {
        if (FM.Parameters.debug) {
            console.log("ERROR: a owner game object must be specified.");
        }
    }
};
FM.Component.prototype.constructor = FM.Component;
/**
 * Destroy the component and its objects.
 * @method FM.Component#destroy
 * @memberOf FM.Component
 */
FM.Component.prototype.destroy = function () {
    "use strict";
    this.name = null;
    this.owner = null;
};
/*global FM*/
/**
 * An audio asset represents an Audio object that is usable in the FM.js 
 * engine.
 * @class FM.AudioAsset
 * @param {string} pName Name of the asset.
 * @param {string} pPath Path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.AudioAsset = function (pName, pPath) {
    "use strict";
    /**
     * The HTML5 Audio object.
     * @type Audio
     * @private
     */
    this.audio = new Audio();
    /**
     * Name of the given to the asset.
     * @type string
     * @private
     */
    this.name = pName;
    /**
     * Path to the audio file.
     * @type string
     * @private
     */
    this.path = pPath;
    /**
     * Extension of the audio file.
     * @type string
     * @private
     */
    this.extension = this.path.substring(this.path.lastIndexOf('.') + 1);
    /**
     * Specify the loading state of the audio file.
     * @type boolean
     * @private
     */
    this.loaded = false;
};
FM.AudioAsset.prototype.constructor = FM.AudioAsset;
/**
 * Fired when the audio file has finished loading.
 * @method FM.AudioAsset#loadComplete
 * @memberOf FM.AudioAsset
 * @param {Event} event Contains data about the event.
 * @private
 */
FM.AudioAsset.prototype.loadComplete = function (event) {
    "use strict";
    if (event) {
        event.target.owner.loaded = true;
    }
    FM.AssetManager.assetLoaded();
};
/**
 * Load the audio file.
 * @method FM.AudioAsset#load
 * @memberOf FM.AudioAsset
 * @param {Function} pCallbackFunction The function that will be called when the
 * asset is loaded.
 */
FM.AudioAsset.prototype.load = function (pCallbackFunction) {
    "use strict";
    this.audio.src = this.path;
    this.loaded = false;
    if (!pCallbackFunction) {
        this.audio.addEventListener("loadeddata", FM.AudioAsset.prototype.loadComplete, false);
    } else {
        this.audio.addEventListener("loadeddata", function () {
            FM.AudioAsset.prototype.loadComplete();
            pCallbackFunction(this);
        }, false);
    }
    this.audio.owner = this;
};
/**
 * Check if this audio file has been loaded.
 * @method FM.AudioAsset#isLoaded
 * @memberOf FM.AudioAsset
 * @return {boolean} Whether the asset is loaded or not.
 */
FM.AudioAsset.prototype.isLoaded = function () {
    "use strict";
    return this.loaded;
};
/**
 * Get the HTML5 Audio object.
 * @method FM.AudioAsset#getAudio
 * @memberOf FM.AudioAsset
 * @return {Audio} The HTML5 object.
 */
FM.AudioAsset.prototype.getAudio = function () {
    "use strict";
    return this.audio;
};
/**
 * Get the name of the asset.
 * @method FM.AudioAsset#getName
 * @memberOf FM.AudioAsset
 * @return {string} The name of the asset.
 */
FM.AudioAsset.prototype.getName = function () {
    "use strict";
    return this.name;
};
/**
 * Get the path to the audio file.
 * @method FM.AudioAsset#getPath
 * @memberOf FM.AudioAsset
 * @return {string} The path to the asset.
 */
FM.AudioAsset.prototype.getPath = function () {
    "use strict";
    return this.path;
};
/**
 * Check if the audio format is supported by the browser.
 * @method FM.AudioAsset#isSupported
 * @memberOf FM.AudioAsset
 * @return {boolean} Whether the file type is supported by the browser.
 */
FM.AudioAsset.prototype.isSupported = function () {
    "use strict";
    var canPlayThisType = false;
    if (this.extension === "wav") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/wav; codecs="1"') !== "";
    } else if (this.extension === "ogg") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/ogg; codecs="vorbis"') !== "";
    } else if (this.extension === "mp3") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/mpeg;') !== "";
    } else if (this.extension === "aac") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/mp4; codecs="mp4a.40.2"') !== "";
    }
    return canPlayThisType;
};
/*global FM*/
/**
 * The file asset represents a file object that can be used by the FM.js engine.
 * @class FM.FileAsset
 * @param {string} pName Name of the asset.
 * @param {string} pPath The path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.FileAsset = function (pName, pPath) {
    "use strict";
    /**
     * The HTML5 XMLHttpRequest object.
     * @type XMLHttpRequest
     * @private
     */
    this.request = new XMLHttpRequest();
    /**
     * Name of the asset.
     * @type string
     * @private
     */
    this.name = pName;
    /**
     * Path of the file.
     * @type string
     * @private
     */
    this.path = pPath;
    /**
     * Content of the file.
     * @type string
     * @private
     */
    this.content = null;
    /**
     * Specify the loading state of the file.
     * @type boolean
     * @private
     */
    this.loaded = false;
};
FM.FileAsset.prototype.constructor = FM.FileAsset;
/**
 * Fired when the loading is complete.
 * @method FM.FileAsset#loadComplete
 * @memberOf FM.FileAsset
 * @param {Event} event Contains data about the event.
 * @private
 */
FM.FileAsset.prototype.loadComplete = function (event) {
    "use strict";
    event.target.owner.setLoaded();
    event.target.owner.setContent(this.responseText);
    FM.AssetManager.assetLoaded();
};
/**
 * Load the file.
 * @method FM.FileAsset#load
 * @memberOf FM.FileAsset
 */
FM.FileAsset.prototype.load = function () {
    "use strict";
    this.request.addEventListener("load", FM.FileAsset.prototype.loadComplete, false);
    this.request.owner = this;
    this.request.open("GET", this.path, false);
    this.request.send();
};
/**
 * Check if this file has been loaded.
 * @method FM.FileAsset#isLoaded
 * @memberOf FM.FileAsset
 * @return {boolean} Whether the asset is loaded.
 */
FM.FileAsset.prototype.isLoaded = function () {
    "use strict";
    return this.loaded;
};
/**
 * Set the loaded boolean variable to true.
 * @method FM.FileAsset#setLoaded
 * @memberOf FM.FileAsset
 */
FM.FileAsset.prototype.setLoaded = function () {
    "use strict";
    this.loaded = true;
};
/**
 * Get the HTML5 XMLHttpRequest object.
 * @method FM.FileAsset#getRequest
 * @memberOf FM.FileAsset
 * @return {XMLHttpRequest} The HTML5 object.
 */
FM.FileAsset.prototype.getRequest = function () {
    "use strict";
    return this.request;
};
/**
 * Get the name of the file.
 * @method FM.FileAsset#getName
 * @memberOf FM.FileAsset
 * @return {string} The name of the asset.
 */
FM.FileAsset.prototype.getName = function () {
    "use strict";
    return this.name;
};
/**
 * Get the path to the file.
 * @method FM.FileAsset#getPath
 * @memberOf FM.FileAsset
 * @return {string} The path of the asset.
 */
FM.FileAsset.prototype.getPath = function () {
    "use strict";
    return this.path;
};
/**
 * Get the content of the file.
 * @method FM.FileAsset#getContent
 * @memberOf FM.FileAsset
 * @return {string} The content of the asset.
 */
FM.FileAsset.prototype.getContent = function () {
    "use strict";
    return this.content;
};
/**
 * Set the content of the file.
 * @method FM.FileAsset#setContent
 * @memberOf FM.FileAsset
 * @param {string} pNewContent The new content of the file.
 */
FM.FileAsset.prototype.setContent = function (pNewContent) {
    "use strict";
    this.content = pNewContent;
};
/*global FM*/
/**
 * An image asset is used to represent a sprite usable by the FM.js engine.
 * @class FM.ImageAsset
 * @param {string} pName The name of the asset.
 * @param {string} pPath The path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.ImageAsset = function (pName, pPath) {
    "use strict";
    /**
     * The HTML5 Image object.
     * @type Image
     * @private
     */
    this.image = new Image();
    /**
     * Name of the given to the asset.
     * @type string
     * @private
     */
    this.name = pName;
    /**
     * Path to the image file.
     * @type string
     * @private
     */
    this.path = pPath;
    /**
     * Specify the loading state of the image.
     * @type boolean
     * @private
     */
    this.loaded = false;
};
FM.ImageAsset.prototype.constructor = FM.ImageAsset;
/**
 * Fired when the image has finished loading.
 * @method FM.ImageAsset#loadComplete
 * @memberOf FM.ImageAsset
 * @param {Event} event Contains data about the event.
 * @private
 */
FM.ImageAsset.prototype.loadComplete = function (event) {
    "use strict";
    event.target.owner.setLoaded();
    FM.AssetManager.assetLoaded();
};
/**
 * Load the image.
 * @method FM.ImageAsset#load
 * @memberOf FM.ImageAsset
 */
FM.ImageAsset.prototype.load = function () {
    "use strict";
    this.image.src = this.path;
    this.image.addEventListener("load", FM.ImageAsset.prototype.loadComplete, false);
    this.image.owner = this;
};
/**
 * Check if this image has been loaded.
 * @method FM.ImageAsset#isLoaded
 * @memberOf FM.ImageAsset
 * @return {boolean} Whether the image is loaded or not.
 */
FM.ImageAsset.prototype.isLoaded = function () {
    "use strict";
    return this.loaded;
};
/**
 * Set the loaded boolean variable to true.
 * @method FM.ImageAsset#setLoaded
 * @memberOf FM.ImageAsset
 */
FM.ImageAsset.prototype.setLoaded = function () {
    "use strict";
    this.loaded = true;
};
/**
 * Get the HTML5 Image object.
 * @method FM.ImageAsset#getImage
 * @memberOf FM.ImageAsset
 * @return {Image} The HTML5 object.
 */
FM.ImageAsset.prototype.getImage = function () {
    "use strict";
    return this.image;
};
/**
 * Get the name of the asset.
 * @method FM.ImageAsset#getName
 * @memberOf FM.ImageAsset
 * @return {string} The name of the asset.
 */
FM.ImageAsset.prototype.getName = function () {
    "use strict";
    return this.name;
};
/**
 * Get the path to the image file.
 * @method FM.ImageAsset#getPath
 * @memberOf FM.ImageAsset
 * @return {string} The path to the asset.
 */
FM.ImageAsset.prototype.getPath = function () {
    "use strict";
    return this.path;
};
/*global FM*/
/**
 * The Preloader is used to set the preload page.
 * You can create a custom preloader extending this one and providing it to 
 * the init function of game object.
 * @class FM.Preloader
 * @extends FM.State
 * @param {FM.State} pFirstState The first state to switch to once the preload
 * is complete.
 * @constructor
 * @author Simon Chauvin
 */
FM.Preloader = function (pFirstState) {
    "use strict";
    //Calling the constructor of the FM.State
    FM.State.call(this);
    /**
     * The first state to perform after preloading.
     * @type FM.State
     * @private
     */
    this.firstState = pFirstState;
    /**
     * Logo of the engine.
     * @type Image
     * @private
     */
    this.logo = new Image();
    /**
     * Whether the logo is loaded or not.
     * @type boolean
     * @private
     */
    this.logoLoaded = false;
    //Load logo
    this.logo.src = "data:image/png;base64,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";
    var that = this;
    this.logo.onload = function () {
        that.logoLoaded = true;
    };
};
/**
 * FM.Preloader inherits from FM.State.
 */
FM.Preloader.prototype = Object.create(FM.State.prototype);
FM.Preloader.prototype.constructor = FM.Preloader;
/**
 * Init the preloader.
 * @method FM.Preloader#init
 * @memberOf FM.Preloader
 */
FM.Preloader.prototype.init = function () {
    "use strict";
    FM.State.prototype.init.call(this);
    //Change the color of the background
    FM.Game.setBackgroundColor("#fff");
};
/**
 * Update the preloader.
 * @method FM.Preloader#update
 * @memberOf FM.Preloader
 * @param {float} dt The fixed delta time since the last frame.
 */
FM.Preloader.prototype.update = function (dt) {
    "use strict";
    FM.State.prototype.update.call(this, dt);

    //If all the assets are loaded then start the first state
    var assetManager = FM.AssetManager;
    if (assetManager.assets.length === 0 || assetManager.areAllAssetsLoaded()) {
        FM.Game.switchState(this.firstState);
        FM.Game.setBackgroundColor("#000");
    }
};
/**
 * Draw on the preloader state.
 * @method FM.Preloader#draw
 * @memberOf FM.Preloader
 * @param {CanvasRenderingContext2D} bufferContext Context (buffer) on wich 
 * drawing is done.
 * @param {float} dt Variable delta time in seconds since the last frame.
 */
FM.Preloader.prototype.draw = function (bufferContext, dt) {
    "use strict";
    FM.State.prototype.draw.call(this, bufferContext, dt);

    //Update the value of the loading text
    bufferContext.fillStyle = '#000';
    bufferContext.font = '30px sans-serif';
    bufferContext.textBaseline = 'middle';
    bufferContext.fillText(Math.ceil(FM.AssetManager.loadingProgress) + "%", this.screenWidth / 2 - 20, this.screenHeight / 2 + 20);
    if (this.logoLoaded) {
        bufferContext.drawImage(this.logo, this.screenWidth / 2 - this.logo.width / 2, this.screenHeight / 4);
    }
};
/**
 * Destroy the quad tree.
 * @method FM.Preloader#destroy
 * @memberOf FM.Preloader
 */
FM.Preloader.prototype.destroy = function () {
    "use strict";
    this.firstState = null;
    this.logo = null;
    this.logoLoaded = null;
    FM.State.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The quad tree is used to subdivide the game space to optimize the performance
 * for collisions testing.
 * @class FM.QuadTree
 * @param {int} pLevel The level of depth of the quad tree to create.
 * @param {FM.Rectangle} pBounds The rectangle delimiting the quad tree in the
 * screen space.
 * @constructor
 * @author Simon Chauvin
 */
FM.QuadTree = function (pLevel, pBounds) {
    "use strict";
    /**
     * Maximum number of objects per quad tree.
     * @constant
     * @type int
     * @private
     */
    this.MAX_OBJECTS = 10;
    /**
     * Maximum depth of the quad tree.
     * @constant
     * @type int
     * @private
     */
    this.MAX_LEVELS = 5;
    /**
     * Current depth level of the quad tree.
     * @type int
     * @private
     */
    this.level = pLevel;
    /**
     * Objects present in the quad tree.
     * @type Array
     * @private
     */
    this.objects = [];
    /**
     * Bounds delimiting the quad tree in the screen space.
     * @type FM.Rectangle
     * @private
     */
    this.bounds = pBounds;
    /**
     * The four nodes created when a quad tree is split.
     * @type Array
     * @private
     */
    this.nodes = [];
};
FM.QuadTree.prototype.constructor = FM.QuadTree;
/**
 * Determine which node the object belongs to. -1 means
 * object cannot completely fit within a child node and is part
 * of the parent node.
 * @method FM.QuadTree#getIndex
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to retrieve the
 * index from.
 * @return {int} The index of the node in which the given object is.
 * @private
 */
FM.QuadTree.prototype.getIndex = function (gameObject) {
    "use strict";
    var index = -1,
        spatial = gameObject.components[FM.ComponentTypes.SPATIAL],
        physic = gameObject.components[FM.ComponentTypes.PHYSIC],
        verticalMidpoint = this.bounds.x + (this.bounds.width / 2),
        horizontalMidpoint = this.bounds.y + (this.bounds.height / 2),
        topQuadrant = (spatial.position.y < horizontalMidpoint && spatial.position.y + physic.height < horizontalMidpoint),
        bottomQuadrant = (spatial.position.y > horizontalMidpoint);
    if (spatial.position.x < verticalMidpoint && spatial.position.x + physic.width < verticalMidpoint) {
        if (topQuadrant) {
            index = 1;
        } else if (bottomQuadrant) {
            index = 2;
        }
    } else if (spatial.position.x > verticalMidpoint) {
        if (topQuadrant) {
            index = 0;
        } else if (bottomQuadrant) {
            index = 3;
        }
    }
    return index;
};
/*
 * Splits the node into 4 subnodes.
 * @method FM.QuadTree#split
 * @memberOf FM.QuadTree
 * @private
 */
FM.QuadTree.prototype.split = function () {
    "use strict";
    var subWidth = this.bounds.width / 2,
        subHeight = this.bounds.height / 2,
        x = this.bounds.x,
        y = this.bounds.y;
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x + subWidth, y, subWidth, subHeight)));
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x, y, subWidth, subHeight)));
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x, y + subHeight, subWidth, subHeight)));
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x + subWidth, y + subHeight, subWidth, subHeight)));
};
/*
 * Insert the object into the quadtree. If the node
 * exceeds the capacity, it will split and add all
 * objects to their corresponding nodes.
 * @method FM.QuadTree#insert
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to insert in the quad
 * tree.
 */
FM.QuadTree.prototype.insert = function (gameObject) {
    "use strict";
    if (this.nodes.length > 0) {
        var index = this.getIndex(gameObject);
        if (index !== -1) {
            this.nodes[index].insert(gameObject);
            return;
        }
    }
    this.objects.push(gameObject);
    if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
        if (this.nodes.length === 0) {
            this.split();
        }
        var i = 0, index;
        while (i < this.objects.length) {
            index = this.getIndex(this.objects[i]);
            if (index !== -1) {
                this.nodes[index].insert(this.objects.splice(i, 1)[0]);
            } else {
                i = i + 1;
            }
        }
    }
};
/*
 * Remove the object from the quadtree.
 * @method FM.QuadTree#remove
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to insert in the quad
 * tree.
 */
FM.QuadTree.prototype.remove = function (gameObject) {
    "use strict";
    if (this.nodes.length > 0) {
        var index = this.getIndex(gameObject);
        if (index !== -1) {
            this.nodes[index].remove(gameObject);
            return;
        }
    }
    this.objects.splice(this.objects.indexOf(gameObject), 1);
};
/*
 * Return all objects that could collide with the given object.
 * @method FM.QuadTree#retrieve
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to test if it can
 * collide with any other object.
 * @return {Array} The list of objects that can collide with the given one.
 */
FM.QuadTree.prototype.retrieve = function (gameObject) {
    "use strict";
    var returnObjects = [],
        index = this.getIndex(gameObject);
    if (index !== -1 && this.nodes.length > 0) {
        returnObjects = this.nodes[index].retrieve(gameObject);
    }
    var i;
    for (i = 0; i < this.objects.length; i = i + 1) {
        returnObjects.push(this.objects[i]);
    }
    return returnObjects;
};
/**
 * Clears the quadtree.
 * @method FM.QuadTree#clear
 * @memberOf FM.QuadTree
 */
FM.QuadTree.prototype.clear = function () {
    "use strict";
    this.objects = [];
    var i;
    for (i = 0; i < this.nodes.length; i = i + 1) {
        if (this.nodes[i]) {
            this.nodes[i].clear();
            this.nodes[i] = null;
        }
    }
    this.nodes = [];
};
/**
 * Destroy the quad tree.
 * @method FM.QuadTree#destroy
 * @memberOf FM.QuadTree
 */
FM.QuadTree.prototype.destroy = function () {
    "use strict";
    this.level = null;
    this.bounds = null;
    this.nodes = null;
    this.objects = null;
    this.MAX_LEVELS = null;
    this.MAX_OBJECTS = null;
};
/*global FM*/
/**
 * 
 * @author Simon Chauvin
 */
(function () {
    "use strict";
    /**
     * Create a new object inheriting from the specified one.
     * @param {Object} o The object to inherit from.
     * @return {Object} The new created object.
     */
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    /**
     * Retrieve the prototype of an object.
     * @param {Object} object The object to retrieve the prototype from.
     * @return {Object} The prototype of the given object.
     */
    if (typeof Object.getPrototypeOf !== "function") {
        if (typeof "test".__proto__ === "object") {
            Object.getPrototypeOf = function(object) {
                return object.__proto__;
            };
        } else {
            Object.getPrototypeOf = function(object) {
                "use strict";
                // May break if the constructor has been tampered with
                return object.constructor.prototype;
            };
        }
    }
    /**
     * Hack to get the requestAnimationFrame work on every browser.
     */
    var x, lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
    /**
     * Include a javascript file to the game.
     * @param {string} filename The name and path of the file to include.
     */
    FM.includeJsFile = function (filename) {
        "use strict";
        var head = document.getElementsByTagName("head")[0],
            script = document.createElement("script");
        script = document.createElement("script");
        script.src = filename;
        script.type = "text/javascript";

        head.appendChild(script);
    };
}());
/*global FM*/
/**
 * Object representing a layer of the tile map.
 * @class FM.TmxLayer
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxLayer = function () {
    "use strict";
    /**
     * The map that contains this layer.
     * @type FM.TmxMap
     * @public
     */
    this.map = null;
    /**
     * The name of the layer.
     * @type string
     * @public
     */
    this.name = null;
    /**
     * The x position of the layer.
     * @type int
     * @public
     */
    this.x = 0;
    /**
     * The y position of the layer.
     * @type int
     * @public
     */
    this.y = 0;
    /**
     * The width of the layer.
     * @type int
     * @public
     */
    this.width = 0;
    /**
     * The height of the layer.
     * @type int
     * @public
     */
    this.height = 0;
    /**
     * The opacity of the layer.
     * @type float
     * @public
     */
    this.opacity = 0;
    /**
     * Whether the layer is visible or not.
     * @type boolean
     * @public
     */
    this.visible = false;
    /**
     * The list of IDs of the tiles of the layer.
     * @type Array
     * @public
     */
    this.tileGids = [];
    /**
     * The properties of the layer.
     * @type FM.TmxPropertySet
     * @public
     */
    this.properties = null;
};
FM.TmxLayer.prototype.constructor = FM.TmxLayer;
/**
 * Load the layer.
 * @method FM.TmxLayer#load
 * @memberOf FM.TmxLayer
 * @param {Node} pLayerNode The node containing the layer.
 * @param {FM.TmxMap} pParent The tile map that contains the layer.
 */
FM.TmxLayer.prototype.load = function (pLayerNode, pParent) {
    "use strict";
    this.map = pParent;
    this.name = pLayerNode.getAttribute("name");
    this.x = parseInt(pLayerNode.getAttribute("x"));
    this.y = parseInt(pLayerNode.getAttribute("y"));
    this.width = parseInt(pLayerNode.getAttribute("width"));
    this.height = parseInt(pLayerNode.getAttribute("height"));
    this.visible = !pLayerNode.getAttribute("visible")
                    || (pLayerNode.getAttribute("visible") !== 0);
    this.opacity = parseInt(pLayerNode.getAttribute("opacity"));

    var properties = pLayerNode.getElementsByTagName("properties")[0],
        data = pLayerNode.getElementsByTagName("data")[0],
        tiles = data.getElementsByTagName("tile"),
        property,
        tile,
        i;
    //Load properties
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (this.properties) {
                        this.properties.add(property);
                    } else {
                        this.properties = new FM.TmxPropertySet();
                        this.properties.add(property);
                    }
                }
            }
        }
    }
    //Load tile GIDs
    if (data) {
        var chunk = "",
            lineWidth = this.width,
            rowIdx = -1,
            gid;
        if (!data.getAttribute("encoding") || (data.getAttribute("encoding") && data.getAttribute("encoding").length === 0)) {
            //Create a 2dimensional array
            for (i = 0; i < tiles.length; i = i + 1) {
                tile = tiles[i];
                //new line?
                if (++lineWidth >= this.width) {
                    this.tileGids[++rowIdx] = [];
                    lineWidth = 0;
                }
                gid = tile.getAttribute("gid");
                this.tileGids[rowIdx].push(gid);
            }
        } else if (data.getAttribute("encoding") === "csv") {
            chunk = data.childNodes[0].nodeValue;
            this.tileGids = this.csvToArray(chunk, this.width);
        } else if (data.getAttribute("encoding") === "base64") {
            console.log("ERROR: TmxLoader, use XML or CSV export.");
        }
    }
};
/**
 * Convert the layer into a csv string.
 * @method FM.TmxLayer#toCsv
 * @memberOf FM.TmxLayer
 * @param {FM.TmxTileSet} pTileSet The tile set corresponding to this layer.
 * @return {string} The csv data of the layer.
 */
FM.TmxLayer.prototype.toCsv = function (pTileSet) {
    "use strict";
    var max = 0xFFFFFF,
        offset = 0,
        result = "",
        row = null,
        chunk = "",
        id = 0,
        i,
        j;
    if (pTileSet) {
        offset = pTileSet.firstGID;
        max = pTileSet.numTiles - 1;
    }
    for (i = 0; i < this.tileGids.length; i = i + 1) {
        row = this.tileGids[i];
        chunk = "";
        id = 0;
        for (j = 0; j < row.length; j = j + 1) {
            id = row[j];
            id -= offset;
            if (id < 0 || id > max) {
                id = 0;
            }
            result += chunk;
            chunk = id + ",";
        }
        result += id + "\n";
    }
    return result;
};
/**
 * Convert a CSV string into an array.
 * @method FM.TmxLayer#csvToArray
 * @memberOf FM.TmxLayer
 * @param {string} pInput The csv data to convert.
 * @param {int} pLineWidth The number of tiles in a line.
 * @return {Array} The array containing the data of the layer.
 */
FM.TmxLayer.prototype.csvToArray = function (pInput, pLineWidth) {
    "use strict";
    var result = [],
        rows = pInput.split("\n"),
        row = null,
        resultRow = null,
        entries = null,
        i,
        j;
    for (i = 0; i < rows.length; i = i + 1) {
        row = rows[i];
        if (row) {
            resultRow = [];
            entries = row.split(",", pLineWidth);
            for (j = 0; j < entries.length; j = j + 1) {
                resultRow.push(entries[j]);
            }
            result.push(resultRow);
        }
    }
    return result;
};
/*global FM*/
/**
 * Object representing a tile map generated by Tiled Map Editor.
 * Parses the .tmx file content and facilitates the access to its data.
 * @class TmxMap
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxMap = function () {
    "use strict";
    /**
     * The map.
     * @type XMLNode
     * @private
     */
    this.map = null;
    /**
     * Version number of the tile map.
     * @type string
     * @public
     */
    this.version = "unknown";
    /**
     * Whether the tile map is orthogonal or isometric.
     * @type string
     * @public
     */
    this.orientation = "orthogonal";
    /**
     * Number of tiles along the x-axis.
     * @type int
     * @public
     */
    this.width = 0;
    /**
     * Number of tiles along the y-axis.
     * @type int
     * @public
     */
    this.height = 0;
    /**
     * Width of a tile.
     * @type int
     * @public
     */
    this.tileWidth = 0;
    /**
     * Height of a tile.
     * @type int
     * @public
     */
    this.tileHeight = 0;
    /**
     * Custom properties of the map.
     * @type FM.TmxPropertySet
     * @public
     */
    this.properties = null;
    /**
     * The different layers of the map.
     * @type Array
     * @public
     */
    this.layers = [];
    /**
     * The different tile sets of the tile map.
     * @type Array
     * @public
     */
    this.tileSets = [];
    /**
     * The different groups of objects defined in the tile map.
     * @type Array
     * @public
     */
    this.objectGroups = [];
};
FM.TmxMap.prototype.constructor = FM.TmxMap;
/**
 * Load the tile map and create javascript objects.
 * @method FM.TmxMap#load
 * @memberOf FM.TmxMap
 * @param {string} pSource The string of the .tmx file content.
 */
FM.TmxMap.prototype.load = function (pSource) {
    "use strict";
    var xmlDoc, parser;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(pSource, "text/xml");
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(pSource);
    }

    this.map = xmlDoc.getElementsByTagName("map")[0];
    this.version = this.map.getAttribute("version") || "unknown";
    this.orientation = this.map.getAttribute("orientation") || "orthogonal";
    this.width = parseInt(this.map.getAttribute("width"));
    this.height = parseInt(this.map.getAttribute("height"));
    this.tileWidth = parseInt(this.map.getAttribute("tilewidth"));
    this.tileHeight = parseInt(this.map.getAttribute("tileheight"));

    var properties = this.map.getElementsByTagName("properties")[0],
        tileSets = this.map.getElementsByTagName("tileset"),
        layers = this.map.getElementsByTagName("layer"),
        objectGroups = this.map.getElementsByTagName("objectgroup"),
        property,
        tileSet,
        layer,
        objectGroup,
        i;
    //Load properties
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (this.properties) {
                        this.properties.add(property);
                    } else {
                        this.properties = new FM.TmxPropertySet();
                        this.properties.add(property);
                    }
                }
            }
        }
    }
    //Load tilesets
    if (tileSets) {
        for (i = 0; i < tileSets.length; i = i + 1) {
            tileSet = tileSets[i];
            this.tileSets[tileSet.getAttribute("name")] = new FM.TmxTileSet();
            this.tileSets[tileSet.getAttribute("name")].load(tileSet, this);
        }
    }
    //Load layer
    if (layers) {
        for (i = 0; i < layers.length; i = i + 1) {
            layer = layers[i];
            this.layers[layer.getAttribute("name")] = new FM.TmxLayer();
            this.layers[layer.getAttribute("name")].load(layer, this);
        }
    }
    //Load object group
    if (objectGroups) {
        for (i = 0; i < objectGroups.length; i = i + 1) {
            objectGroup = objectGroups[i];
            this.objectGroups[objectGroup.getAttribute("name")] = new FM.TmxObjectGroup();
            this.objectGroups[objectGroup.getAttribute("name")].load(objectGroup, this);
        }
    }
};
/**
 * Retrieve a tile set from its name.
 * @method FM.TmxMap#getTileSet
 * @memberOf FM.TmxMap
 * @param {string} pName The name of the tile set to retrieve.
 * @return {FM.TmxTileSet} Tile set corresponding to the given name.
 */
FM.TmxMap.prototype.getTileSet = function (pName) {
    "use strict";
    return this.tileSets[pName];
};
/**
 * Retrieve a layer from its name.
 * @method FM.TmxMap#getLayer
 * @memberOf FM.TmxMap
 * @param {string} pName Name of the layer to retrieve.
 * @returns {FM.TmxLayer} Layer corresponding of the specified name.
 */
FM.TmxMap.prototype.getLayer = function (pName) {
    "use strict";
    return this.layers[pName];
};
/**
 * Retrieve an object group from its name.
 * @method FM.TmxMap#getObjectGroup
 * @memberOf FM.TmxMap
 * @param {string} pName Name of the group to retrieve.
 * @returns {FM.TmxGroup} Group of objects matching the given name.
 */
FM.TmxMap.prototype.getObjectGroup = function (pName) {
    "use strict";
    return this.objectGroups[pName];
};
/**
 * Retrieve the tile set matching the specified id.
 * Works only after TmxTileSet has been initialized with an image.
 * @method FM.TmxMap#getGidOwner
 * @memberOf FM.TmxMap
 * @param {int} pGid The gid of the tileset to retrieve.
 * @returns {FM.TmxTileSet} The tile set matching the gid provided, or null if none is found.
 */
FM.TmxMap.prototype.getGidOwner = function (pGid) {
    "use strict";
    var tileSet = null;
    for (tileSet in this.tileSets) {
        if (tileSet.hasGid(pGid)) {
            return tileSet;
        }
    }
    return null;
};
/*global FM*/
/**
 * Represents an object extracted from the .tmx file.
 * @class FM.TmxObject
 * @param {Node} pObjectNode The node containing the object.
 * @param {FM.TmxObjectGroup} pParent The group this object belongs to.
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxObject = function (pObjectNode, pParent) {
    "use strict";
    /**
     * The group this object belongs to.
     * @type FM.TmxObjectGroup
     * @public
     */
    this.group = pParent;
    /**
     * The name of the object.
     * @type string
     * @public
     */
    this.name = pObjectNode.getAttribute("name");
    /**
     * The type of the object.
     * @type string
     * @public
     */
    this.type = pObjectNode.getAttribute("type");
    /**
     * The x position of the object.
     * @type int
     * @public
     */
    this.x = parseInt(pObjectNode.getAttribute("x"));
    /**
     * The y position of the object.
     * @type int
     * @public
     */
    this.y = parseInt(pObjectNode.getAttribute("y"));
    /**
     * The width of the object.
     * @type int
     * @public
     */
    this.width = parseInt(pObjectNode.getAttribute("width"));
    /**
     * The height of the object.
     * @type int
     * @public
     */
    this.height = parseInt(pObjectNode.getAttribute("height"));
    /**
     * Resolve inheritance.
     * 
     */
    this.shared = null;
    /**
     * The ID of the object.
     * @type int
     * @public
     */
    this.gid = -1;
    //
    if (pObjectNode.getAttribute("gid") && pObjectNode.getAttribute("gid").length !== 0) {
        this.gid = parseInt(pObjectNode.getAttribute("gid"));
        var tileSets = this.group.map.tileSets,
            tileSet,
            i;
        if (tileSets) {
            for (i = 0; i < tileSets.length; i = i + 1) {
                tileSet = tileSets[i];
                this.shared = tileSet.getPropertiesByGid(this.gid);
                if (this.shared) {
                    break;
                }
            }
        }
    }
    //Load properties
    var properties = pObjectNode.getElementsByTagName("properties")[0],
        property,
        i;
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (this.custom) {
                        this.custom.add(property);
                    } else {
                        this.custom = new FM.TmxPropertySet();
                        this.custom.add(property);
                    }
                }
            }
        }
    }
};
FM.TmxObject.prototype.constructor = FM.TmxObject;
/*global FM*/
/**
 * Object representing a group of objects of the tile map.
 * @class FM.TmxObjectGroup
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxObjectGroup = function () {
    "use strict";
    /**
     * The map that this group belongs to.
     * @type FM.TmxMap
     * @public
     */
    this.map = null;
    /**
     * The name of the group.
     * @type string
     * @public
     */
    this.name = null;
    /**
     * The x position of the objects of the group.
     * @type int
     * @public
     */
    this.x = 0;
    /**
     * The y position of the objects of the group.
     * @type int
     * @public
     */
    this.y = 0;
    /**
     * The width of the objects of the group.
     * @type int
     * @public
     */
    this.width = 0;
    /**
     * The height of the objects of the group.
     * @type int
     * @public
     */
    this.height = 0;
    /**
     * The level of opacity of the objects of the group.
     * @type float
     * @public
     */
    this.opacity = 0;
    /**
     * Whether the objects of the group are visible or not.
     * @type boolean
     * @public
     */
    this.visible = false;
    /**
     * The properties of the group.
     * @type FM.TmxPropertySet
     * @public
     */
    this.properties = null;
    /**
     * The list of objects of the group.
     * @type Array
     * @public
     */
    this.objects = [];
};
FM.TmxObjectGroup.prototype.constructor = FM.TmxObjectGroup;
/**
 * Load the group of objects.
 * @method FM.TmxObjectGroup#load
 * @memberOf FM.TmxObjectGroup
 * @param {FM.TmxObjectGroup} pObjectGroupNode The node of the group the load.
 * @param {FM.TmxMap} pParent The tile map this group belongs to.
 */
FM.TmxObjectGroup.prototype.load = function (pObjectGroupNode, pParent) {
    "use strict";
    this.map = pParent;
    this.name = pObjectGroupNode.getAttribute("name");
    this.x = parseInt(pObjectGroupNode.getAttribute("x"));
    this.y = parseInt(pObjectGroupNode.getAttribute("y"));
    this.width = parseInt(pObjectGroupNode.getAttribute("width"));
    this.height = parseInt(pObjectGroupNode.getAttribute("height"));
    this.visible = !pObjectGroupNode.getAttribute("visible")
        || (pObjectGroupNode.getAttribute("visible") !== 0);
    this.opacity = parseInt(pObjectGroupNode.getAttribute("opacity"));

    var properties = pObjectGroupNode.getElementsByTagName("properties")[0],
        objects = pObjectGroupNode.getElementsByTagName("object"),
        property,
        object,
        i;
    //Load properties
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (this.properties) {
                        this.properties.add(property);
                    } else {
                        this.properties = new FM.TmxPropertySet();
                        this.properties.add(property);
                    }
                }
            }
        }
    }
    //Load objects
    if (objects) {
        for (i = 0; i < objects.length; i = i + 1) {
            object = objects[i];
            this.objects.push(new FM.TmxObject(object, this));
        }
    }
};
/*global FM*/
/**
 * Object representing a set of properties.
 * @class FM.TmxPropertySet
 * @extends Array
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxPropertySet = function () {
    "use strict";
    Array.call(this);
};
/**
 * FM.TmxPropertySet inherits from Array.
 */
FM.TmxPropertySet.prototype = Object.create(Array.prototype);
FM.TmxPropertySet.prototype.constructor = FM.TmxPropertySet;
/**
 * Add a property to this set.
 * @method FM.TmxPropertySet#add
 * @memberOf FM.TmxPropertySet
 * @param {Node} pPropertyNode The property node to add to this set of 
 * properties.
 */
FM.TmxPropertySet.prototype.add = function (pPropertyNode) {
    "use strict";
    var key = pPropertyNode.getAttribute("name"),
        value = pPropertyNode.getAttribute("value");
    this[key] = value;
};
/*global FM*/
/**
 * Object representing a tile set from a tile map.
 * @class FM.TmxTileSet
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxTileSet = function () {
    "use strict";
    /**
     * The custom properties of the tile set.
     * @type Array
     * @private
     */
    this.tileProperties = [];
    /**
     * The image associated to this tile set.
     * @type Image
     * @private
     */
    this.image = null;
    /**
     * First ID of the tile of this tile set.
     * @type int
     * @public
     */
    this.firstGID = 0;
    /**
     * Tile map that owns this tile set.
     * @type FM.TmxMap
     * @public
     */
    this.map = null;
    /**
     * Name of the tile set.
     * @type string
     * @public
     */
    this.name = null;
    /**
     * The width of a tile.
     * @type int
     * @public
     */
    this.tileWidth = 0;
    /**
     * The height of a tile.
     * @type int
     * @public
     */
    this.tileHeight = 0;
    /**
     * Spacing between tiles.
     * @type int
     * @public
     */
    this.spacing = 0;
    /**
     * Margin before tiles.
     * @type int
     * @public
     */
    this.margin = 0;
    /**
     * The image of the tile set.
     * @type Image
     * @public
     */
    this.imageSource = null;
    /**
     * Number of tiles in the tile set.
     * @type int
     * @public
     */
    this.numTiles = 0xFFFFFF;
    /**
     * Number of rows in the tile set
     * @type int
     * @public
     */
    this.numRows = 1;
    /**
     * Number of columns in the tile set.
     * @type int
     * @public
     */
    this.numCols = 1;
};
FM.TmxTileSet.prototype.constructor = FM.TmxTileSet;
/**
 * Load the tile set.
 * @method FM.TmxTileSet#load
 * @memberOf FM.TmxTileSet
 * @param {string} pTileSetNode The xml node containing the data to load.
 * @param {FM.TmxMap} pParent The tile map containing this tile set.
 */
FM.TmxTileSet.prototype.load = function (pTileSetNode, pParent) {
    "use strict";
    this.map = pParent;
    this.firstGID = parseInt(pTileSetNode.getAttribute("firstgid"));
    this.imageSource = pTileSetNode.getElementsByTagName("image")[0].getAttribute("source");
    this.name = pTileSetNode.getAttribute("name");
    this.tileWidth = parseInt(pTileSetNode.getAttribute("tilewidth"));
    this.tileHeight = parseInt(pTileSetNode.getAttribute("tileheight"));
    this.spacing = parseInt(pTileSetNode.getAttribute("spacing"));
    this.margin = parseInt(pTileSetNode.getAttribute("margin"));

    //Load properties
    var tiles = pTileSetNode.getElementsByTagName("tile"),
        tile,
        properties,
        property,
        i,
        j;
    if (tiles) {
        for (i = 0; i < tiles.length; i = i + 1) {
            tile = tiles[i];
            properties = tile.getElementsByTagName("properties")[0];
            if (properties) {
                for (j = 0; j < properties.childNodes.length; j = j + 1) {
                    if (properties.hasChildNodes() === true) {
                        property = properties.childNodes[j];
                        if (property.nodeType === 1) {
                            this.tileProperties[tile.getAttribute("id")] = new FM.TmxPropertySet();
                            this.tileProperties[tile.getAttribute("id")].add(property);
                        }
                    }
                }
            }
        }
    }
};
/**
 * Retrieve the image associated to this tile set.
 * @method FM.TmxTileSet#getImage
 * @memberOf FM.TmxTileSet
 * @return {Image} The image associated to the tile set.
 */
FM.TmxTileSet.prototype.getImage = function () {
    "use strict";
    return this.image;
};
/**
 * Provide the image of the tile set.
 * @method FM.TmxTileSet#setImage
 * @memberOf FM.TmxTileSet
 * @param {Image} pImage The image to use as tile set.
 */
FM.TmxTileSet.prototype.setImage = function (pImage) {
    "use strict";
    this.image = pImage;
    //TODO: consider spacing & margin
    this.numCols = Math.floor(this.image.width / this.tileWidth);
    this.numRows = Math.floor(this.image.height / this.tileHeight);
    this.numTiles = this.numRows * this.numCols;
};
/**
 * Check if this tile set contains a given id of tile.
 * @method FM.TmxTileSet#hasGid
 * @memberOf FM.TmxTileSet
 * @param {int} pGid The id of the tile to check the presence of in this tile set.
 * @return {boolean} Whether this tile set owns the given ID of tile.
 */
FM.TmxTileSet.prototype.hasGid = function (pGid) {
    "use strict";
    return (pGid >= this.firstGID) && (pGid < this.firstGID + this.numTiles);
};
/**
 * Retrieve the ID of a tile in the tile set from its global ID.
 * @method FM.TmxTileSet#fromGid
 * @memberOf FM.TmxTileSet
 * @param {int} pGid The global ID of the tile.
 * @return {int} The ID of the tile in the tile set.
 */
FM.TmxTileSet.prototype.fromGid = function (pGid) {
    "use strict";
    return pGid - this.firstGID;
};
/**
 * Retrieve the global ID of a tile.
 * @method FM.TmxTileSet#toGid
 * @memberOf FM.TmxTileSet
 * @param {int} pId The ID of the tile to retrieve the global ID from.
 * @return {int} The global ID of the tile.
 */
FM.TmxTileSet.prototype.toGid = function (pId) {
    "use strict";
    return this.firstGID + pId;
};
/**
 * Retrieve the properties of a particular tile by specifying the global ID of
 * the tile.
 * @method FM.TmxTileSet#getPropertiesByGid
 * @memberOf FM.TmxTileSet
 * @param {int} pGid The global ID of the tile to retrieve the properties from.
 * @return {FM.PropertySet} The property set of the tile.
 */
FM.TmxTileSet.prototype.getPropertiesByGid = function (pGid) {
    "use strict";
    return this.tileProperties[pGid - this.firstGID];
};
/**
 * Retrieve the properties of a given tile's ID.
 * @method FM.TmxTileSet#getProperties
 * @memberOf FM.TmxTileSet
 * @param {int} pId The ID of the tile to retrieve the properties from.
 * @return {FM.TmxPropertySet} The property set of the tile.
 */
FM.TmxTileSet.prototype.getProperties = function (pId) {
    "use strict";
    return this.tileProperties[pId];
};
/**
 * Retieve the rectangle of the given tile's ID.
 * @method FM.TmxTileSet#getRect
 * @memberOf FM.TmxTileSet
 * @param {int} pId The ID of the tile to retrieve the rectangle from.
 * @return {FM.Rectangle} The rectangle of the tile.
 */
FM.TmxTileSet.prototype.getRect = function (pId) {
    "use strict";
    //TODO: consider spacing & margin
    return new FM.Rectangle(0, 0, (pId % this.numCols) * this.tileWidth, (pId / this.numCols) * this.tileHeight);
};
/*global FM*/
/**
 * The emitter component is used for the emission of particles.
 * @class FM.EmitterComponent
 * @extends FM.Component
 * @param {FM.Vector} pOffset The vector specifying the offset from the upper 
 * left corner of the game object at which the particles should spawn.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.EmitterComponent = function (pOffset, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.FX, pOwner);
    /**
     * Particles belonging to this emitter.
     * @type Array
     * @private
     */
    this.particles = [];
    /**
     * Offset from the owner.
     * @type FM.Vector
     * @private
     */
    this.offset = pOffset;
    /**
     * Directions the particles can take.
     * @type Array
     * @private
     */
    this.directions = [FM.Parameters.LEFT, FM.Parameters.RIGHT, FM.Parameters.UP, FM.Parameters.DOWN];
    /**
     * Limit of particles that this emitter can bear.
     * 0 means an infinite number.
     * @type int
     * @private
     */
    this.maxParticles = 0;
    /**
     * Frequency of particle emission.
     * @type float
     * @private
     */
    this.frequency = 0.1;
    /**
     * Quantity of particles to emit.
     * @type int
     * @private
     */
    this.quantity = 0;
    /**
     * Transparency of the particles.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Minimum velocity of all particles.
     * @type FM.Vector
     * @private
     */
    this.minParticleVelocity = new FM.Vector(-100, -100);
    /**
     * Maximum velocity of all particles.
     * @type FM.Vector
     * @private
     */
    this.maxParticleVelocity = new FM.Vector(100, 100);
    /**
     * Minimum angular velocity of all particles.
     * @type int
     * @private
     */
    this.minParticleAngularVelocity = -100;
    /**
     * Maximum angular velocity of all particles.
     * @type int
     * @private
     */
    this.maxParticleAngularVelocity = 100;
    /**
     * Whether the emitter is active or not.
     * @type boolean
     * @private
     */
    this.active = false;
    /**
     * Timer for the emission at the right frequency.
     * @type float
     * @private
     */
    this.timer = 0;
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present.
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
};
/**
 * FM.EmitterComponent inherits from FM.Component.
 */
FM.EmitterComponent.prototype = Object.create(FM.Component.prototype);
FM.EmitterComponent.prototype.constructor = FM.EmitterComponent;
/**
 * Add a particle to this emitter.
 * @method FM.EmitterComponent#add
 * @memberOf FM.EmitterComponent
 * @param {FM.GameObject} pParticle Particle to add to the emitter.
 * @return {FM.GameObject} The particle added.
 */
FM.EmitterComponent.prototype.add = function (pParticle) {
    "use strict";
    this.particles.push(pParticle);
    return pParticle;
};
/**
 * Add particles to this emitter.
 * @method FM.EmitterComponent#createParticles
 * @memberOf FM.EmitterComponent
 * @param {int} pNumber Number of particles to create.
 * @param {FM.ImageAsset} pImage Image to use as a particle.
 * @param {int} pWidth Width of the particles.
 * @param {int} pHeight Height of the particles.
 * @param {float} pAlpha Transparency of the particles.
 * @param {int} pZIndex Z depth of the particles.
 */
FM.EmitterComponent.prototype.createParticles = function (pNumber, pImage, pWidth, pHeight, pAlpha, pZIndex) {
    "use strict";
    var i, particle, renderer,
        state = FM.Game.getCurrentState();
    this.alpha = pAlpha;
    for (i = 0; i < pNumber; i = i + 1) {
        particle = new FM.GameObject(pZIndex);
        particle.addComponent(new FM.SpatialComponent(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y, particle));
        renderer = particle.addComponent(new FM.SpriteRendererComponent(pImage, pWidth, pHeight, particle));
        renderer.setAlpha(this.alpha);
        particle.addComponent(new FM.AabbComponent(pWidth, pHeight, particle));
        particle.age = 0;
        particle.lifeSpan = 0;
        particle.hide();
        particle.kill();
        state.add(particle);
        this.particles.push(particle);
    }
};
/**
 * Start emitting particles.
 * @method FM.EmitterComponent#emit
 * @memberOf FM.EmitterComponent
 * @param {float} pLifeSpan Time to live for each particle.
 * @param {float} pFrequency Time between each emission.
 * @param {int} pQuantity Number of particles to emit at each emission.
 */
FM.EmitterComponent.prototype.emit = function (pLifeSpan, pFrequency, pQuantity) {
    "use strict";
    this.active = true;
    this.timer = 0;
    this.frequency = pFrequency;
    this.quantity = pQuantity;
    var i;
    for (i = 0; i < this.particles.length; i = i + 1) {
        this.particles[i].lifeSpan = pLifeSpan;
    }
};
/**
 * Update the component.
 * @method FM.EmitterComponent#update
 * @memberOf FM.EmitterComponent
 * @param {float} dt Fixed delta time in seconds since the last frame.
 */
FM.EmitterComponent.prototype.update = function (dt) {
    "use strict";
    if (this.active) {
        //Update alive particles
        var i, j, count, particle, particleSpatial, physic, renderer, speed;
        for (i = 0; i < this.particles.length; i = i + 1) {
            particle = this.particles[i];
            if (particle.isAlive()) {
                //Check the age of the particle
                if (particle.age >= particle.lifeSpan) {
                    particle.hide();
                    particle.kill();
                } else {
                    //The more the particle is aging the less it is visible
                    renderer = particle.getComponent(FM.ComponentTypes.RENDERER);
                    if (renderer.getAlpha() >= 1 - (particle.age / particle.lifeSpan)) {
                        renderer.setAlpha(1 - (particle.age / particle.lifeSpan));
                    }
                    //Aging of the particle
                    particle.age += dt;
                }
            }
        }
        //Emit new particles
        this.timer += dt;
        if (this.frequency === 0 || this.timer >= this.frequency) {
            this.timer = 0;
            count = 0;
            j = 0;
            //Emit the number of particles given by quantity
            while (count < this.quantity && j < this.particles.length) {
                particle = this.particles[j];
                //Reinit the particle
                if (particle && !particle.isAlive()) {
                    particleSpatial = particle.getComponent(FM.ComponentTypes.SPATIAL);
                    physic = particle.components[FM.ComponentTypes.PHYSIC];
                    particle.components[FM.ComponentTypes.RENDERER].setAlpha(this.alpha);
                    particleSpatial.position.x = this.spatial.position.x + this.offset.x;
                    particleSpatial.position.y = this.spatial.position.y + this.offset.y;
                    particle.age = 0;
                    speed = Math.random() * (this.maxParticleVelocity.x - this.minParticleVelocity.x) + this.minParticleVelocity.x;
                    if (this.directions.indexOf(FM.Parameters.LEFT) !== -1) {
                        if (Math.random() > 0.5) {
                            speed = -speed;
                        }
                    }
                    physic.velocity.x = speed;
                    speed = Math.random() * (this.maxParticleVelocity.y - this.minParticleVelocity.y) + this.minParticleVelocity.y;
                    if (this.directions.indexOf(FM.Parameters.UP) !== -1) {
                        if (Math.random() > 0.5) {
                            speed = -speed;
                        }
                    }
                    physic.velocity.y = speed;
                    speed = Math.random() * (this.maxParticleAngularVelocity - this.minParticleAngularVelocity) + this.minParticleAngularVelocity;
                    physic.angularVelocity = speed;
                    particle.show();
                    particle.revive();
                    count = count + 1;
                }
                j = j + 1;
            }
        }
    }
};
/**
 * Set the directions the particles can take.
 * @method FM.EmitterComponent#setDirections
 * @memberOf FM.EmitterComponent
 * @param {Array} pDirections Directions the particles can take.
 */
FM.EmitterComponent.prototype.setDirections = function (pDirections) {
    "use strict";
    this.directions = pDirections;
};
/**
 * Set the transparency of the particles.
 * @method FM.EmitterComponent#setAlpha
 * @memberOf FM.EmitterComponent
 * @param {float} pAlpha Transparency of the particles.
 */
FM.EmitterComponent.prototype.setAlpha = function (pAlpha) {
    "use strict";
    this.alpha = pAlpha;
    var i;
    for (i = 0; i < this.particles.length; i = i + 1) {
        this.particles[i].components[FM.ComponentTypes.RENDERER].setAlpha(this.alpha);
    }
};
/**
 * Set the horizontal velocity of all particles.
 * @method FM.EmitterComponent#setXVelocity
 * @memberOf FM.EmitterComponent
 * @param {int} pMin Minimum horizontal velocity of a particle.
 * @param {int} pMax Maximum horizontal velocity of a particle.
 */
FM.EmitterComponent.prototype.setXVelocity = function (pMin, pMax) {
    "use strict";
    this.minParticleVelocity.x = pMin;
    this.maxParticleVelocity.x = pMax;
};
/**
 * Set the vertical velocity of all particles.
 * @method FM.EmitterComponent#setYVelocity
 * @memberOf FM.EmitterComponent
 * @param {int} pMin Minimum vertical velocity of a particle.
 * @param {int} pMax Maximum vertical velocity of a particle.
 */
FM.EmitterComponent.prototype.setYVelocity = function (pMin, pMax) {
    "use strict";
    this.minParticleVelocity.y = pMin;
    this.maxParticleVelocity.y = pMax;
};
/**
 * Set the rotation's speed of all particles.
 * @method FM.EmitterComponent#setAngularVelocity
 * @memberOf FM.EmitterComponent
 * @param {int} pMin Minimum angular velocity of a particle.
 * @param {int} pMax Maximum angular velocity of a particle.
 */
FM.EmitterComponent.prototype.setAngularVelocity = function (pMin, pMax) {
    "use strict";
    this.minParticleAngularVelocity = pMin;
    this.maxParticleAngularVelocity = pMax;
};
/**
 * Retrieve the transparency of the particles.
 * @method FM.EmitterComponent#getAlpha
 * @memberOf FM.EmitterComponent
 * @return {float} Current transparency of the particles.
 */
FM.EmitterComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the emitter component.
 * @method FM.EmitterComponent#destroy
 * @memberOf FM.EmitterComponent
 */
FM.EmitterComponent.prototype.destroy = function () {
    "use strict";
    this.particles = null;
    this.active = null;
    this.alpha = null;
    this.directions = null;
    this.frequency = null;
    this.timer = null;
    this.quantity = null;
    this.maxParticleAngularVelocity = null;
    this.minParticleAngularVelocity = null;
    this.maxParticles = null;
    this.offset = null;
    this.minParticleVelocity.destroy();
    this.minParticleVelocity = null;
    this.maxParticleVelocity.destroy();
    this.maxParticleVelocity = null;
    this.spatial = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The simple path component can make a game object follow a predefined path.
 * @class FM.SimplePathComponent
 * @extends FM.Component
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.SimplePathComponent = function (pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.PATHFINDING, pOwner);
    /**
     * Waypoints constituing the path.
     * @type Array
     * @private
     */
    this.waypoints = [];
    /**
     * Current index of the waypoint to reach.
     * @type int
     * @private
     */
    this.currentIndex = 0;
    /**
     * Speed at which the game object should follow the path if it is a
     * movement with a coefficient equals to 1.
     * @type FM.Vector
     * @private
     */
    this.desiredSpeed = 0;
    /**
     * Speed at which the game object follow the path.
     * @type FM.Vector
     * @private
     */
    this.actualSpeed = new FM.Vector(0, 0);
    /**
     * Whether the path is being followed or not.
     * @type boolean
     * @private
     */
    this.active = false;
    /**
     * Whether the desired x position of the current waypoint was reached.
     * or not.
     * @type boolean
     * @private
     */
    this.xReached = false;
    /**
     * Whether the desired y position of the current waypoint was reached.
     * or not.
     * @type boolean
     * @private
     */
    this.yReached = false;
    /**
     * Position before stopping following the path, used to know if the game
     * object following the path has been moved during the stopping time.
     * @type FM.Vector
     * @private
     */
    this.positionBeforeStopping = new FM.Vector(0, 0);
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];
    /**
     * Physic component reference.
     * @type FM.PhysicComponent
     * @private
     */
    this.physic = pOwner.components[FM.ComponentTypes.PHYSIC];

    //Check if the needed components are present.
    if (FM.Parameters.debug) {
        if (!this.spatial) {
            console.log("ERROR: No spatial component was added and you need one for using the path component.");
        }
        if (!this.physic) {
            console.log("ERROR: No physic component was added and you need one for using the path component.");
        }
    }
};
/**
 * FM.SimplePathComponent inherits from FM.Component.
 */
FM.SimplePathComponent.prototype = Object.create(FM.Component.prototype);
FM.SimplePathComponent.prototype.constructor = FM.SimplePathComponent;
/**
 * Follow the specified path.
 * @method FM.SimplePathComponent#startFollowingPath
 * @memberOf FM.SimplePathComponent
 * @param {int} pSpeed Speed at which the game object must follow the path.
 * @param {int} pIndexToStartFrom The index at which the game object should start
 * following the path.
 */
FM.SimplePathComponent.prototype.startFollowingPath = function (pSpeed, pIndexToStartFrom) {
    "use strict";
    if (this.waypoints.length > 0) {
        this.active = true;
        this.currentIndex = pIndexToStartFrom || 0;
        this.xReached = false;
        this.yReached = false;
        this.desiredSpeed = pSpeed;
        //Adjust speed so that the movement is linear
        var xDiff =  Math.abs((this.spatial.position.x + this.physic.offset.x + this.physic.width / 2) - this.waypoints[this.currentIndex].x),
            yDiff =  Math.abs((this.spatial.position.y + this.physic.offset.y + this.physic.height / 2) - this.waypoints[this.currentIndex].y),
            coeff;
        if (xDiff < yDiff) {
            coeff = xDiff / yDiff;
            this.actualSpeed.x = this.desiredSpeed * coeff;
            this.actualSpeed.y = this.desiredSpeed;
        } else if (xDiff > yDiff) {
            coeff = yDiff / xDiff;
            this.actualSpeed.x = this.desiredSpeed;
            this.actualSpeed.y = this.desiredSpeed * coeff;
        } else {
            this.actualSpeed.x = this.desiredSpeed;
            this.actualSpeed.y = this.desiredSpeed;
        }
    } else if (FM.Parameters.debug) {
        console.log("WARNING: path with no waypoints defined.");
    }
    if (!this.physic) {
        console.log("WARNING: path added to a game object with no physic component.");
    }
};
/**
 * Continue following the current path where it had stopped.
 * @method FM.SimplePathComponent#resumeFollowingPath
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.resumeFollowingPath = function () {
    "use strict";
    if (this.waypoints.length > 0) {
        this.active = true;
        if (this.positionBeforeStopping.x !== this.spatial.position.x
                || this.positionBeforeStopping.y !== this.spatial.position.y) {
            this.xReached = false;
            this.yReached = false;
            //Adjust speed so that the movement is linear
            var xDiff =  Math.abs((this.spatial.position.x + this.physic.offset.x + this.physic.width / 2) - this.waypoints[this.currentIndex].x),
                yDiff =  Math.abs((this.spatial.position.y + this.physic.offset.y + this.physic.height / 2) - this.waypoints[this.currentIndex].y),
                coeff;
            if (xDiff < yDiff) {
                coeff = xDiff / yDiff;
                this.actualSpeed.x = this.desiredSpeed * coeff;
                this.actualSpeed.y = this.desiredSpeed;
            } else if (xDiff > yDiff) {
                coeff = yDiff / xDiff;
                this.actualSpeed.x = this.desiredSpeed;
                this.actualSpeed.y = this.desiredSpeed * coeff;
            } else {
                this.actualSpeed.x = this.desiredSpeed;
                this.actualSpeed.y = this.desiredSpeed;
            }
        }
    } else if (FM.Parameters.debug) {
        console.log("WARNING: path with no waypoints defined.");
    }
    if (!this.physic) {
        console.log("WARNING: path added to a game object with no physic component.");
    }
};
/**
 * Stop following the current path.
 * @method FM.SimplePathComponent#stopFollowingPath
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.stopFollowingPath = function () {
    "use strict";
    this.active = false;
    this.physic.velocity.x = 0;
    this.physic.velocity.y = 0;
    this.positionBeforeStopping = new FM.Vector(this.spatial.position.x, this.spatial.position.y);
};
/**
 * Erase every waypoints in the path.
 * @method FM.SimplePathComponent#clearPath
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.clearPath = function () {
    "use strict";
    this.waypoints = [];
};
/**
 * Update the component.
 * @method FM.SimplePathComponent#update
 * @memberOf FM.SimplePathComponent
 * @param {float} dt Fixed delta time in seconds since the last frame.
 */
FM.SimplePathComponent.prototype.update = function (dt) {
    "use strict";
    //Update the motion if the path is active
    if (this.active && this.physic) {
        //Update motion whether a physic component is present or not
        var xPos =  this.spatial.position.x + this.physic.offset.x + this.physic.width / 2,
            yPos =  this.spatial.position.y + this.physic.offset.y + this.physic.height / 2,
            xDiff,
            yDiff,
            coeff;
        //Update x position
        if (xPos < this.waypoints[this.currentIndex].x) {
            if (this.waypoints[this.currentIndex].x - xPos < this.actualSpeed.x * dt) {
                this.physic.velocity.x = this.waypoints[this.currentIndex].x - xPos;
                this.xReached = true;
            } else {
                this.physic.velocity.x = this.actualSpeed.x;
            }
        } else if (xPos > this.waypoints[this.currentIndex].x) {
            if (xPos - this.waypoints[this.currentIndex].x < this.actualSpeed.x * dt) {
                this.physic.velocity.x = xPos - this.waypoints[this.currentIndex].x;
                this.xReached = true;
            } else {
                this.physic.velocity.x = -this.actualSpeed.x;
            }
        } else {
            this.xReached = true;
            this.physic.velocity.x = 0;
        }
        //Update y position
        if (yPos < this.waypoints[this.currentIndex].y) {
            if (this.waypoints[this.currentIndex].y - yPos < this.actualSpeed.y * dt) {
                this.physic.velocity.y = this.waypoints[this.currentIndex].y - yPos;
                this.yReached = true;
            } else {
                this.physic.velocity.y = this.actualSpeed.y;
            }
        } else if (yPos > this.waypoints[this.currentIndex].y) {
            if (yPos - this.waypoints[this.currentIndex].y < this.actualSpeed.y * dt) {
                this.physic.velocity.y = yPos - this.waypoints[this.currentIndex].y;
                this.yReached = true;
            } else {
                this.physic.velocity.y = -this.actualSpeed.y;
            }
        } else {
            this.yReached = true;
            this.physic.velocity.y = 0;
        }
        //Select the next waypoint if the current has been reached
        if (this.xReached && this.yReached) {
            if (this.waypoints.length > this.currentIndex + 1) {
                //TODO call startfollowingpath ??
                this.xReached = false;
                this.yReached = false;
                this.currentIndex = this.currentIndex + 1;
                //Adjust speed so that the movement is linear
                xDiff =  Math.abs(xPos - this.waypoints[this.currentIndex].x);
                yDiff =  Math.abs(yPos - this.waypoints[this.currentIndex].y);
                if (xDiff < yDiff) {
                    coeff = xDiff / yDiff;
                    this.actualSpeed.x = this.desiredSpeed * coeff;
                    this.actualSpeed.y = this.desiredSpeed;
                } else if (xDiff > yDiff) {
                    coeff = yDiff / xDiff;
                    this.actualSpeed.x = this.desiredSpeed;
                    this.actualSpeed.y = this.desiredSpeed * coeff;
                } else {
                    this.actualSpeed.x = this.desiredSpeed;
                    this.actualSpeed.y = this.desiredSpeed;
                }
            } else {
                this.active = false;
                this.actualSpeed = new FM.Vector(0, 0);
                this.desiredSpeed = 0;
                this.physic.velocity = new FM.Vector(0, 0);
            }
        }
    }
};
/**
 * Add a waypoint to the path.
 * @method FM.SimplePathComponent#add
 * @memberOf FM.SimplePathComponent
 * @param {int} pX X position.
 * @param {int} pY Y position.
 * @param {int} index Optional index at which adding the waypoint.
 */
FM.SimplePathComponent.prototype.add = function (pX, pY, index) {
    "use strict";
    if (!index) {
        this.waypoints.push({x : pX, y : pY});
    } else {
        this.waypoints[index] = {x : pX, y : pY};
    }
};

/**
 * Remove a waypoint from the path.
 * @method FM.SimplePathComponent#remove
 * @memberOf FM.SimplePathComponent
 * @param {int} pIndex Index of the waypoint to remove.
 */
FM.SimplePathComponent.prototype.remove = function (pIndex) {
    "use strict";
    this.waypoints.splice(pIndex, 1);
};
/**
 * Return the waypoints of the path.
 * @method FM.SimplePathComponent#getWaypoints
 * @memberOf FM.SimplePathComponent
 * @return {Array} Waypoints of the path.
 */
FM.SimplePathComponent.prototype.getWaypoints = function () {
    "use strict";
    return this.waypoints;
};
/**
 * Return the current index of the waypoint to reach.
 * @method FM.SimplePathComponent#getCurrentIndex
 * @memberOf FM.SimplePathComponent
 * @return {int} Index of the waypoint to reach.
 */
FM.SimplePathComponent.prototype.getCurrentIndex = function () {
    "use strict";
    return this.currentIndex;
};
/**
 * Return the current waypoint to reach.
 * @method FM.SimplePathComponent#getCurrentWaypoint
 * @memberOf FM.SimplePathComponent
 * @return {Object} Waypoint to reach, a literal with a x and y property.
 */
FM.SimplePathComponent.prototype.getCurrentWaypoint = function () {
    "use strict";
    return this.waypoints[this.currentIndex];
};
/**
 * Return the number of waypoints.
 * @method FM.SimplePathComponent#getLength
 * @memberOf FM.SimplePathComponent
 * @return {int} Number of waypoints.
 */
FM.SimplePathComponent.prototype.getLength = function () {
    "use strict";
    return this.waypoints.length;
};
/**
 * Check if the last waypoint has been reached.
 * @method FM.SimplePathComponent#isLastWaypointReached
 * @memberOf FM.SimplePathComponent
 * @return {boolean} Whether the last waypoint has been reached or not.
 */
FM.SimplePathComponent.prototype.isLastWaypointReached = function () {
    "use strict";
    return this.currentIndex === this.waypoints.length - 1 && !this.active;
};
/**
 * Check if the path is being followed.
 * @method FM.SimplePathComponent#isActive
 * @memberOf FM.SimplePathComponent
 * @return {boolean} Whether the path is being followed.
 */
FM.SimplePathComponent.prototype.isActive = function () {
    "use strict";
    return this.active;
};
/**
 * Destroy the path.
 * @method FM.SimplePathComponent#destroy
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.destroy = function () {
    "use strict";
    this.waypoints = null;
    this.active = null;
    this.positionBeforeStopping.destroy();
    this.positionBeforeStopping = null;
    this.currentIndex = null;
    this.actualSpeed.destroy();
    this.actualSpeed = null;
    this.desiredSpeed = null;
    this.xReached = null;
    this.yReached = null;
    this.spatial = null;
    this.physic = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * Parent component of physics components to add to a game object for collisions
 * and physics behavior.
 * @class FM.PhysicComponent
 * @extends FM.Component
 * @param {int} pWidth Width of the collider.
 * @param {int} pHeight Height of the collider.
 * @param {FM.GameObject} pOwner The object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.PhysicComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    //Calling the constructor of the FM.Component
    FM.Component.call(this, FM.ComponentTypes.PHYSIC, pOwner);
    /**
     * World of the game.
     * @type FM.World
     * @private
     */
    this.world = FM.Game.getCurrentState().getWorld();
    /**
    * Quad tree containing all game objects with a physic component.
    * @type FM.QuadTree
    * @private
     */
    this.quad = FM.Game.getCurrentState().getQuad();
    /**
     * Represent the mass of the physic game object, 0 means infinite mass.
     * @type int
     * @private
     */
    this.mass = 1;
    /**
     * Represent the inverse mass.
     * @type float
     * @private
     */
    this.invMass = 1 / this.mass;
    /**
     * Array storing the types of game objects that can collide with this one.
     * @type Array
     * @private
     */
    this.collidesWith = [];
    /**
     * Store the collisions that this object has.
     * @type Array
     * @private
     */
    this.collisions = [];
    /**
     * Store the types of tile map that this object collides with.
     * @type Array
     * @private
     */
    this.tilesCollisions = [];
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];
    /**
     * Offset of the bounding box or circle.
     * @type FM.Vector
     * @public
     */
    this.offset = new FM.Vector(0, 0);
    /**
     * Width of the collider.
     * @type int
     * @public
     */
    this.width = pWidth;
    /**
     * Height of the collider.
     * @type int
     * @public
     */
    this.height = pHeight;
    /**
     * Velocity of the physic component.
     * @type FM.Vector
     * @public
     */
    this.velocity = new FM.Vector(0, 0);
    /**
     * Acceleration applied to the physic object.
     * @type FM.Vector
     * @public
     */
    this.acceleration = new FM.Vector(0, 0);
    /**
     * How much the object's velocity is decreasing when acceleration is
     * equal to 0.
     * @type FM.Vector
     * @public
     */
    this.drag = new FM.Vector(0, 0);
    /**
     * Angular velocity.
     * @type int
     * @public
     */
    this.angularVelocity = 0;
    /**
     * How much the object's velocity is decreasing when acceleration is
     * equal to 0.
     * @type FM.Vector
     * @public
     */
    this.angularDrag = new FM.Vector(0, 0);
    /**
     * Represent the maximum absolute value of the velocity.
     * @type FM.Vector
     * @public
     */
    this.maxVelocity = new FM.Vector(1000, 1000);
    /**
     * Maximum angular velocity.
     * @type int
     * @public
     */
    this.maxAngularVelocity = 10000;
    /**
     * Elasticity is a factor between 0 and 1 used for bouncing purposes.
     * @type float
     * @public
     */
    this.elasticity = 0;

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for physics.");
    }
};
/**
 * FM.PhysicComponent inherits from FM.Component.
 */
FM.PhysicComponent.prototype = Object.create(FM.Component.prototype);
FM.PhysicComponent.prototype.constructor = FM.PhysicComponent;
/**
 * Correct the position of the physic component.
 * @method FM.PhysicComponent#correctPosition
 * @memberOf FM.PhysicComponent
 * @param {FM.Collision} pCollision The collision object containing the
 * that needs position correcting.
 * @private
 */
FM.PhysicComponent.prototype.correctPosition = function (pCollision) {
    "use strict";
    //Position correction
    var correction = new FM.Vector(pCollision.penetration * pCollision.normal.x, pCollision.penetration * pCollision.normal.y),
        aSpatial = pCollision.a.owner.components[FM.ComponentTypes.SPATIAL],
        bSpatial = pCollision.b.owner.components[FM.ComponentTypes.SPATIAL],
        //aPhysic = collision.a.owner.components[FM.ComponentTypes.PHYSIC],
        //bPhysic = collision.b.owner.components[FM.ComponentTypes.PHYSIC],
        massSum = 0,
        aInvMass = pCollision.a.getInvMass(),
        bInvMass = pCollision.b.getInvMass();
    massSum = aInvMass + bInvMass;

    //TODO make it work instead of the other below
    /*var percent = 0.2; // usually 20% to 80%
    var slop = 0.01; // usually 0.01 to 0.1
    correction.x = (Math.max(collision.penetration - slop, 0) / (massSum)) * percent * collision.normal.x;
    correction.y = (Math.max(collision.penetration - slop, 0) / (massSum)) * percent * collision.normal.y;
    aSpatial.position.x -= invMass * correction.x;
    aSpatial.position.y -= invMass * correction.y;
    bSpatial.position.x += otherInvMass * correction.x;
    bSpatial.position.y += otherInvMass * correction.y;*/

    //TODO this is here that it goes wrong, need to add offset ?
    aSpatial.position.x -= correction.x * (aInvMass / massSum);
    aSpatial.position.y -= correction.y * (aInvMass / massSum);
    bSpatial.position.x += correction.x * (bInvMass / massSum);
    bSpatial.position.y += correction.y * (bInvMass / massSum);
    //TODO try with physic tiles with fixed integer position value
    //aSpatial.position.reset(Math.floor(aSpatial.position.x), Math.floor(aSpatial.position.y));
    //bSpatial.position.reset(Math.floor(bSpatial.position.x), Math.floor(bSpatial.position.y));
};
/**
 * Check collisions with a given array of tiles.
 * @method FM.PhysicComponent#correctPosition
 * @memberOf FM.PhysicComponent
 * @param {Array} pTiles The list of tile IDs to test for collisions.
 * @param {int} pTileWidth Width of a tile.
 * @param {int} pTileHeight Height of a tile.
 * @param {int} pXPos X position of the object to test.
 * @param {int} pYPos Y position of the object to test.
 * @return {boolean} Whether there is collision between with a tile.
 * @private
 */
FM.PhysicComponent.prototype.checkCollisionsWithTiles = function (pTiles, pTileWidth, pTileHeight, pXPos, pYPos) {
    "use strict";
    var i1 = Math.floor(pYPos / pTileHeight),
        j1 = Math.floor(pXPos / pTileWidth),
        i2 = Math.floor((pYPos + this.height) / pTileHeight),
        j2 = Math.floor((pXPos + this.width) / pTileWidth),
        i,
        j;
    for (i = i1; i <= i2; i = i + 1) {
        for (j = j1; j <= j2; j = j + 1) {
            if (pTiles[i] !== 0 && pTiles[i][j] !== -1) {
                if (j === j1 || j === j2 || i === i1 || i === i2) {
                    return true;
                }
            }
        }
    }
    return false;
};
/**
 * Try to move the physic object and rollback if it collides with a tile.
 * @method FM.PhysicComponent#tryToMove
 * @memberOf FM.PhysicComponent
 * @param {Array} pTiles The list of tile IDs to test for collisions.
 * @param {int} pTileWidth The width of a tile.
 * @param {int} pTileHeight The height of a tile.
 * @param {float} pXVel The x velocity of the object.
 * @param {float} pYVel The y velocity of the object.
 * @return {boolean} Whether the object can move or not.
 * @private
 */
FM.PhysicComponent.prototype.tryToMove = function (pTiles, pTileWidth, pTileHeight, pXVel, pYVel) {
    "use strict";
    var spX = this.spatial.position.x + pXVel,
        spY = this.spatial.position.y + pYVel;
    if (!this.checkCollisionsWithTiles(pTiles, pTileWidth, pTileHeight, spX + this.offset.x, spY + this.offset.y)) {
        this.spatial.position.x = spX;
        this.spatial.position.y = spY;
        return true;
    }
    return false;
};
/**
 * Move the physic object one pixel at a time.
 * @method FM.PhysicComponent#move
 * @memberOf FM.PhysicComponent
 * @param {FM.TileMap} pTileMap The tile map on which to move.
 * @param {float} pXVel The x velocity of the object.
 * @param {float} pYVel The y velocity of the object.
 * @return {boolean} Whether the object has collided against the tile
 * map or not.
 * @private
 */
FM.PhysicComponent.prototype.move = function (tileMap, xVel, yVel) {
    "use strict";
    var tiles = tileMap.getData(),
        tileWidth = tileMap.getTileWidth(),
        tileHeight = tileMap.getTileHeight(),
        hasCollided = false;
    if (Math.abs(xVel) >= tileWidth || Math.abs(yVel) >= tileHeight) {
        this.move(tileMap, xVel / 2, yVel / 2);
        this.move(tileMap, xVel - xVel / 2, yVel - yVel / 2);
        return;
    }

    var hor = this.tryToMove(tiles, tileWidth, tileHeight, xVel, 0),
        ver = this.tryToMove(tiles, tileWidth, tileHeight, 0, yVel),
        i,
        maxSpeed,
        vel;
    if (hor && ver) {
        return;
    }
    if (!hor) {
        this.velocity.x = 0;
        maxSpeed = Math.abs(xVel);
        for (i = 0; i < maxSpeed; i = i + 1) {
            if (xVel === 0) {
                vel = 0;
            } else if (xVel > 0) {
                vel = 1;
            } else {
                vel = -1;
            }
            if (!this.tryToMove(tiles, tileWidth, tileHeight, vel, 0)) {
                hasCollided = true;
                break;
            } else {
                this.velocity.x += vel;
            }
        }
    }
    if (!ver) {
        this.velocity.y = 0;
        maxSpeed = Math.abs(yVel);
        for (i = 0; i < maxSpeed; i = i + 1) {
            if (yVel === 0) {
                vel = 0;
            } else if (yVel > 0) {
                vel = 1;
            } else {
                vel = -1;
            }
            if (!this.tryToMove(tiles, tileWidth, tileHeight, 0, vel)) {
                hasCollided = true;
                break;
            } else {
                this.velocity.y += vel;
            }
        }
    }
    return hasCollided;
};
/**
 * Update the component.
 * @method FM.PhysicComponent#update
 * @memberOf FM.PhysicComponent
 * @param {float} dt The fixed delta time since the last frame.
 */
FM.PhysicComponent.prototype.update = function (dt) {
    "use strict";
    this.collisions = [];
    this.tilesCollisions = [];

    //Limit velocity to a max value
    //TODO maxvelocity should be in pixels per seconds
    var currentVelocity = this.velocity.x + (this.invMass * this.acceleration.x) * dt,
        maxVelocity = this.maxVelocity.x + (this.invMass * this.acceleration.x) * dt,
        canMove = true,
        hasCollided = false,
        tileMap,
        gameObjects,
        i,
        j,
        otherGameObject,
        otherPhysic,
        collision = null;
    if (Math.abs(currentVelocity) <= maxVelocity) {
        this.velocity.x = currentVelocity;
    } else if (currentVelocity < 0) {
        this.velocity.x = -maxVelocity;
    } else if (currentVelocity > 0) {
        this.velocity.x = maxVelocity;
    }
    currentVelocity = this.velocity.y + (this.invMass * this.acceleration.y) * dt;
    maxVelocity = this.maxVelocity.y + (this.invMass * this.acceleration.y) * dt;
    if (Math.abs(currentVelocity) <= maxVelocity) {
        this.velocity.y = currentVelocity;
    } else if (currentVelocity < 0) {
        this.velocity.y = -maxVelocity;
    } else if (currentVelocity > 0) {
        this.velocity.y = maxVelocity;
    }

    //Apply drag
    if (this.acceleration.x === 0) {
        if (this.velocity.x > 0) {
            this.velocity.x -= this.drag.x;
            if (this.velocity.x < 0) {
                this.velocity.x = 0;
            }
        } else if (this.velocity.x < 0) {
            this.velocity.x += this.drag.x;
            if (this.velocity.x > 0) {
                this.velocity.x = 0;
            }
        }
    }
    if (this.acceleration.y === 0) {
        if (this.velocity.y > 0) {
            this.velocity.y -= this.drag.y;
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
            }
        } else if (this.velocity.y < 0) {
            this.velocity.y += this.drag.y;
            if (this.velocity.y > 0) {
                this.velocity.y = 0;
            }
        }
    }

    if (this.collidesWith.length > 0) {
        if (this.world.hasTileCollisions()) {
            for (i = 0; i < this.collidesWith.length; i = i + 1) {
                tileMap = this.world.getTileMapFromType(this.collidesWith[i]);
                if (tileMap && tileMap.canCollide()) {
                    hasCollided = this.move(tileMap, this.velocity.x * dt, this.velocity.y * dt);
                    if (hasCollided) {
                        this.tilesCollisions.push({a: this.owner, b: tileMap});
                    }
                    canMove = false;
                }
            }
        }
    }

    //Update position
    if (canMove) {
        this.spatial.position.x += this.velocity.x * dt;
        this.spatial.position.y += this.velocity.y * dt;
    }

    //If this game object collides with at least one type of game object
    if (this.collidesWith.length > 0) {
        this.quad = FM.Game.getCurrentState().getQuad();
        gameObjects = this.quad.retrieve(this.owner);
        //If there are other game objects near this one
        for (i = 0; i < gameObjects.length; i = i + 1) {
            otherGameObject = gameObjects[i];
            otherPhysic = otherGameObject.components[FM.ComponentTypes.PHYSIC];
            //If a game object is found and is alive and is not the current one
            if (otherGameObject.isAlive() && this.owner.getId() !== otherGameObject.getId() && !otherPhysic.isCollidingWith(this.owner) && !this.isCollidingWith(otherGameObject)) {
                for (j = 0; j < this.collidesWith.length; j = j + 1) {
                    if (otherGameObject.hasType(this.collidesWith[j])) {
                        collision = this.owner.components[FM.ComponentTypes.PHYSIC].overlapsWithObject(otherPhysic);
                        if (collision !== null) {
                            this.addCollision(collision);
                            otherPhysic.addCollision(collision);
                            this.resolveCollision(otherPhysic, collision);
                            otherPhysic.resolveCollision(this, collision);
                            this.correctPosition(collision);
                        }
                    }
                }
            }
        }
    }
};
/**
 * Resolve collision between current game object and the specified one.
 * @method FM.PhysicComponent#resolveCollision
 * @memberOf FM.PhysicComponent
 * @param {FM.PhysicComponent} pOtherPhysic The other physic component of 
 * the collision.
 * @param {FM.Collision} pCollision The collision object containing the 
 * data about the collision to resolve.
 */
FM.PhysicComponent.prototype.resolveCollision = function (pOtherPhysic, pCollision) {
    "use strict";
    var relativeVelocity = FM.Math.substractVectors(pOtherPhysic.velocity, this.velocity),
        velocityAlongNormal = relativeVelocity.dotProduct(pCollision.normal),
        //Compute restitution
        e = Math.min(this.elasticity, pOtherPhysic.elasticity),
        j = 0,
        otherInvMass = pOtherPhysic.getInvMass(),
        impulse = new FM.Vector(0, 0);
    //Do not resolve if velocities are separating.
    if (velocityAlongNormal > 0) {
        return;
    }
    //Compute impulse scalar
    j = -(1 + e) * velocityAlongNormal;
    j /= this.invMass + otherInvMass;
    //Apply impulse
    impulse.reset(j * pCollision.normal.x, j * pCollision.normal.y);
    this.velocity.x -= this.invMass * impulse.x;
    this.velocity.y -= this.invMass * impulse.y;
    pOtherPhysic.velocity.x += otherInvMass * impulse.x;
    pOtherPhysic.velocity.y += otherInvMass * impulse.y;
};
/**
 * Ensure that a game object collides with a certain type of other game 
 * objects (with physic components of course).
 * @method FM.PhysicComponent#addTypeToCollideWith
 * @memberOf FM.PhysicComponent
 * @param {FM.ObjectType} pType The type to add to the list of types that
 * this object can collide with.
 */
FM.PhysicComponent.prototype.addTypeToCollideWith = function (pType) {
    "use strict";
    this.collidesWith.push(pType);
};
/**
 * Remove a type that was supposed to collide with this game object.
 * @method FM.PhysicComponent#removeTypeToCollideWith
 * @memberOf FM.PhysicComponent
 * @param {FM.ObjectType} pType The type to remove from the list of types
 * that this object can collide with.
 */
FM.PhysicComponent.prototype.removeTypeToCollideWith = function (pType) {
    "use strict";
    this.collidesWith.splice(this.collidesWith.indexOf(pType), 1);
};
/**
 * Add a collision object representing the collision to the list of current
 * collisions.
 * @method FM.PhysicComponent#addCollision
 * @memberOf FM.PhysicComponent
 * @param {FM.Collision} pCollision The collision object to add.
 */
FM.PhysicComponent.prototype.addCollision = function (pCollision) {
    "use strict";
    this.collisions.push(pCollision);
};
/**
 * Get the velocity.
 * @method FM.PhysicComponent#getLinearVelocity
 * @memberOf FM.PhysicComponent
 * @return {FM.Vector} The vector containing the current velocity of the 
 * object.
 */
FM.PhysicComponent.prototype.getLinearVelocity = function () {
    "use strict";
    return this.velocity;
};
/**
 * Check if the current physic component is colliding a specified type of physic component.
 * @method FM.PhysicComponent#isCollidingWithType
 * @memberOf FM.PhysicComponent
 * @param {FM.ObjectType} pOtherType The type of objects to test for
 * collision with this one.
 * @return {boolean} Whether there is already collision between the the current physic component and the specified type of physic component.
 */
FM.PhysicComponent.prototype.isCollidingWithType = function (pOtherType) {
    "use strict";
    var i, collision;
    for (i = 0; i < this.collisions.length; i = i + 1) {
        collision = this.collisions[i];
        if ((collision.b && collision.b.owner.hasType(pOtherType))
                || (collision.a && collision.a.owner.hasType(pOtherType))) {
            return true;
        }
    }
    for (i = 0; i < this.tilesCollisions.length; i = i + 1) {
        collision = this.tilesCollisions[i];
        if ((collision.b && collision.b.hasType(pOtherType))
                || (collision.a && collision.a.hasType(pOtherType))) {
            return true;
        }
    }
    return false;
};
/**
 * Check if the current physic component is colliding with another one.
 * @method FM.PhysicComponent#isCollidingWith
 * @memberOf FM.PhysicComponent
 * @param {FM.GameObject} pOtherGameObject The game object to test for 
 * collision with this one.
 * @return {boolean} Whether there is already collision between the physic components.
 */
FM.PhysicComponent.prototype.isCollidingWith = function (pOtherGameObject) {
    "use strict";
    var i, collision;
    for (i = 0; i < this.collisions.length; i = i + 1) {
        collision = this.collisions[i];
        if ((collision.b && collision.b.owner.getId() === pOtherGameObject.getId())
                || (collision.a && collision.a.owner.getId() === pOtherGameObject.getId())) {
            return true;
        }
    }
    return false;
};
/**
 * Set the mass of the physic object.
 * @method FM.PhysicComponent#setMass
 * @memberOf FM.PhysicComponent
 * @param {int} pNewMass The new mass to set.
 */
FM.PhysicComponent.prototype.setMass = function (pNewMass) {
    "use strict";
    this.mass = pNewMass;
    if (this.mass === 0) {
        this.invMass = 0;
    } else {
        this.invMass = 1 / this.mass;
    }
};
/**
 * Retrieve the mass of the physic object.
 * @method FM.PhysicComponent#getMass
 * @memberOf FM.PhysicComponent
 * @return {int} The mass of this object.
 */
FM.PhysicComponent.prototype.getMass = function () {
    "use strict";
    return this.mass;
};
/**
 * Retrieve the inverse mass of the physic object.
 * @method FM.PhysicComponent#getInvMass
 * @memberOf FM.PhysicComponent
 * @return {int} The inverse mass of this object.
 */
FM.PhysicComponent.prototype.getInvMass = function () {
    "use strict";
    return this.invMass;
};
/**
 * Destroy the component and its objects.
 * @method FM.PhysicComponent#destroy
 * @memberOf FM.PhysicComponent
 */
FM.PhysicComponent.prototype.destroy = function () {
    "use strict";
    this.quad = null;
    this.world = null;
    this.collisions = null;
    this.tilesCollisions = null;
    this.collidesWith = null;
    this.offset.destroy();
    this.offset = null;
    this.velocity.destroy();
    this.velocity = null;
    this.acceleration.destroy();
    this.acceleration = null;
    this.spatial = null;
    this.mass = null;
    this.invMass = null;
    this.width = null;
    this.height = null;
    this.maxAngularVelocity = null;
    this.drag.destroy();
    this.drag = null;
    this.angularDrag.destroy();
    this.angularDrag = null;
    this.maxVelocity.destroy();
    this.maxVelocity = null;
    this.elasticity = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * Represent an axis aligned bounding box to add to a game object for physics
 * behavior and collisions.
 * @class FM.AabbComponent
 * @extends FM.PhysicComponent
 * @param {int} pWidth Width of the aabb.
 * @param {int} pHeight Height of the aabb.
 * @param {FM.GameObject} pOwner The game object to which the component belongs.
 * @constructor
 * @author Simon Chauvin.
 */
FM.AabbComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    //Calling the constructor of the FM.PhysicComponent
    FM.PhysicComponent.call(this, pWidth, pHeight, pOwner);
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];
    /**
     * Check if the needed components are present.
     */
    if (FM.Parameters.debug) {
        if (!this.spatial) {
            console.log("ERROR: No spatial component was added and you need one for physics.");
        }
    }
};
/**
 * FM.AabbComponent inherits from FM.PhysicComponent.
 */
FM.AabbComponent.prototype = Object.create(FM.PhysicComponent.prototype);
FM.AabbComponent.prototype.constructor = FM.AabbComponent;
/**
 * Check if the current circle is overlapping with the specified type.
 * @method FM.AabbComponent#overlapsWithType
 * @memberOf FM.AabbComponent
 * @param {FM.ObjectType} pType The type to test for overlap with this 
 * aabb component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithType = function (pType) {
    "use strict";
    //TODO
    return null;
};
/**
 * Check if the current aabb is overlapping with the given physic 
 * object.
 * @method FM.AabbComponent#overlapsWithObject
 * @memberOf FM.AabbComponent
 * @param {FM.PhysicComponent} pPhysic The physic component to test for
 * overlap with the current one.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithObject = function (pPhysic) {
    "use strict";
    var collision = pPhysic.overlapsWithAabb(this);
    if (collision) {
        return collision;
    }
    return null;
};
/**
 * Check if the current aabb is overlapping with the specified aabb.
 * @method FM.AabbComponent#overlapsWithAabb
 * @memberOf FM.AabbComponent
 * @param {FM.AabbComponent} aabb The aabb component that needs to be tested
 * for overlap with the current aabb component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithAabb = function (aabb) {
    "use strict";
    var otherSpatial = aabb.owner.components[FM.ComponentTypes.SPATIAL],
        min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
        otherMin = new FM.Vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
        max = new FM.Vector(min.x + this.width, min.y + this.height),
        otherMax = new FM.Vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
        center = new FM.Vector(min.x + this.width / 2, min.y + this.height / 2),
        otherCenter = new FM.Vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
        normal = FM.Math.substractVectors(otherCenter, center),
        extent = (max.x - min.x) / 2,
        otherExtent = (otherMax.x - otherMin.x) / 2,
        xOverlap = extent + otherExtent - Math.abs(normal.x),
        yOverlap,
        collision = null;
    // Exit with no intersection if found separated along an axis
    if (max.x < otherMin.x || min.x > otherMax.x) { return null; }
    if (max.y < otherMin.y || min.y > otherMax.y) { return null; }

    if (xOverlap > 0) {
        extent = (max.y - min.y) / 2;
        otherExtent = (otherMax.y - otherMin.y) / 2;
        yOverlap = extent + otherExtent - Math.abs(normal.y);
        if (yOverlap > 0) {
            collision = new FM.Collision(this, aabb);
            // Find out which axis is the one of least penetration
            if (xOverlap < yOverlap) {
                if (normal.x < 0) {
                    collision.normal = normal.reset(-1, 0);
                } else {
                    collision.normal = normal.reset(1, 0);
                }
                collision.penetration = xOverlap;
            } else {
                if (normal.y < 0) {
                    collision.normal = normal.reset(0, -1);
                } else {
                    collision.normal = normal.reset(0, 1);
                }
                collision.penetration = yOverlap;
            }
            return collision;
        }
    }
    return null;
};
/**
 * Check if the current aabb is overlapping with the specified circle.
 * @method FM.AabbComponent#overlapsWithCircle
 * @memberOf FM.AabbComponent
 * @param {FM.CircleComponent} circle The circle component that needs to 
 * be tested for overlap with the current aabb component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithCircle = function (circle) {
    "use strict";
    var otherSpatial = circle.owner.components[FM.ComponentTypes.SPATIAL],
        min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
        otherMin = new FM.Vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
        max = new FM.Vector(min.x + this.width, min.y + this.height),
        center = new FM.Vector(min.x + this.width / 2, min.y + this.height / 2),
        otherCenter = new FM.Vector(otherMin.x + circle.radius, otherMin.y + circle.radius),
        normal = FM.Math.substractVectors(otherCenter, center),
        distance,
        radius,
        closest = normal.clone(),
        xExtent = (max.x - min.x) / 2,
        yExtent = (max.y - min.y) / 2,
        inside = false,
        collision = null;
    closest.x = FM.Math.clamp(closest.x, -xExtent, xExtent);
    closest.y = FM.Math.clamp(closest.y, -yExtent, yExtent);
    if (normal.isEquals(closest)) {
        inside = true;
        if (Math.abs(normal.x) > Math.abs(normal.y)) {
            if (closest.x > 0) {
                closest.x = xExtent;
            } else {
                closest.x = -xExtent;
            }
        } else {
            if (closest.y > 0) {
                closest.y = yExtent;
            } else {
                closest.y = -yExtent;
            }
        }
    }
    collision = new FM.Collision();
    collision.a = this;
    collision.b = circle;
    collision.normal = FM.Math.substractVectors(normal, closest);
    distance = collision.normal.getLengthSquared();
    radius = circle.radius;
    if (distance > radius * radius && !inside) {
        return null;
    }
    distance = Math.sqrt(distance);
    collision.penetration = radius - distance;
    if (inside) {
        collision.normal.reset(-collision.normal.x, -collision.normal.y);
    }
    collision.normal.normalize();
    return collision;
};
/**
 * Draw debug information.
 * @method FM.AabbComponent#drawDebug
 * @memberOf FM.AabbComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on wich drawing 
 * is done.
 * @param {FM.Vector} newPosition Position of the sprite to render.
 */
FM.AabbComponent.prototype.drawDebug = function (bufferContext, newPosition) {
    "use strict";
    var newCenter = new FM.Vector(newPosition.x + this.width / 2, newPosition.y + this.height / 2),
        dir = new FM.Vector(Math.cos(this.spatial.angle), Math.sin(this.spatial.angle));
    bufferContext.strokeStyle = '#f4f';
    bufferContext.strokeRect(newPosition.x + this.offset.x - bufferContext.xOffset, newPosition.y + this.offset.y - bufferContext.yOffset, this.width,
                            this.height);
    bufferContext.beginPath();
    bufferContext.strokeStyle = "Blue";
    bufferContext.beginPath();
    bufferContext.moveTo(newCenter.x + this.offset.x - bufferContext.xOffset, newCenter.y + this.offset.y - bufferContext.yOffset);
    bufferContext.lineTo((newCenter.x + this.offset.x + dir.x * 50) - bufferContext.xOffset, (newCenter.y + this.offset.y  + dir.y * 50) - bufferContext.yOffset);
    bufferContext.stroke();
};
/**
 * Destroy the component and its objects.
 * @method FM.AabbComponent#destroy
 * @memberOf FM.AabbComponent
 */
FM.AabbComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    FM.PhysicComponent.prototype.destroy.call(this);
};
/*global FM*/
/**
 * A circle component is a physic component to add to a game object for
 * for collisions and physics behaviors as a circle.
 * @class FM.CircleComponent
 * @extends FM.PhysicComponent
 * @param {int} pRadius The radius of the circle component.
 * @param {FM.GameObject} pOwner The game object to which the component belongs.
 * @constructor
 * @author Simon Chauvin.
 */
FM.CircleComponent = function (pRadius, pOwner) {
    "use strict";
    //Calling the constructor of the FM.PhysicComponent
    FM.PhysicComponent.call(this, pRadius * 2, pRadius * 2, pOwner);
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];
    /**
     * Check if the needed components are present.
     */
    if (FM.Parameters.debug) {
        if (!this.spatial) {
            console.log("ERROR: No spatial component was added and you need one for physics.");
        }
    }
    /**
     * Radius of the circle.
     * @type int
     * @public
     */
    this.radius = pRadius;
};
/**
 * FM.CircleComponent inherits from FM.PhysicComponent.
 */
FM.CircleComponent.prototype = Object.create(FM.PhysicComponent.prototype);
FM.CircleComponent.prototype.constructor = FM.CircleComponent;
/**
 * Check if the current circle is overlapping with the specified type.
 * @method FM.CircleComponent#overlapsWithType
 * @memberOf FM.CircleComponent
 * @param {FM.ObjectType} pType The type to test for overlap with this 
 * circle component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithType = function (pType) {
    "use strict";
    //TODO
    return null;
};
/**
 * Check if the current circle is overlapping with the specified physic object.
 * @method FM.CircleComponent#overlapsWithObject
 * @memberOf FM.CircleComponent
 * @param {FM.PhysicComponent} pPhysic The physic component to test for
 * overlap with the current one.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithObject = function (pPhysic) {
    "use strict";
    var collision = pPhysic.overlapsWithCircle(this);
    if (collision) {
        return collision;
    }
    return null;
};
/**
 * Check if the current circle is overlapping with the specified aabb.
 * @method FM.CircleComponent#overlapsWithAabb
 * @memberOf FM.CircleComponent
 * @param {FM.AabbComponent} aabb The aabb component that needs to be tested
 * for overlap with the current circle component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithAabb = function (aabb) {
    "use strict";
    var otherSpatial = aabb.owner.components[FM.ComponentTypes.SPATIAL],
        min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
        otherMin = new FM.Vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
        otherMax = new FM.Vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
        center = new FM.Vector(min.x + this.radius, min.y + this.radius),
        otherCenter = new FM.Vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
        normal = FM.Math.substractVectors(otherCenter, center),
        distance,
        radius,
        closest = normal.clone(),
        xExtent = (otherMax.x - otherMin.x) / 2,
        yExtent = (otherMax.y - otherMin.y) / 2,
        inside = false,
        collision = null;
    closest.x = FM.Math.clamp(closest.x, -xExtent, xExtent);
    closest.y = FM.Math.clamp(closest.y, -yExtent, yExtent);
    if (normal.isEquals(closest)) {
        inside = true;
        if (Math.abs(normal.x) > Math.abs(normal.y)) {
            if (closest.x > 0) {
                closest.x = xExtent;
            } else {
                closest.x = -xExtent;
            }
        } else {
            if (closest.y > 0) {
                closest.y = yExtent;
            } else {
                closest.y = -yExtent;
            }
        }
    }
    collision = new FM.Collision();
    collision.a = this;
    collision.b = aabb;
    collision.normal = FM.Math.substractVectors(normal, closest);
    distance = collision.normal.getLengthSquared();
    radius = this.radius;
    if (distance > (radius * radius) && !inside) {
        return null;
    }
    distance = Math.sqrt(distance);
    collision.penetration = radius - distance;
    if (inside) {
        collision.normal.reset(-collision.normal.x, -collision.normal.y);
    }
    collision.normal.normalize();
    return collision;
};

/**
 * Check if the current circle is overlapping with the specified circle.
 * @method FM.CircleComponent#overlapsWithCircle
 * @memberOf FM.CircleComponent
 * @param {FM.CircleComponent} circle The circle component that needs to 
 * be tested for overlap with the current circle component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithCircle = function (circle) {
    "use strict";
    var otherSpatial = circle.owner.components[FM.ComponentTypes.SPATIAL],
        min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
        otherMin = new FM.Vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
        center = new FM.Vector(min.x + this.width / 2, min.y + this.height / 2),
        otherCenter = new FM.Vector(otherMin.x + circle.width / 2, otherMin.y + circle.height / 2),
        radius = this.radius + circle.radius,
        radius = radius * radius,
        normal = FM.Math.substractVectors(otherCenter, center),
        distance = normal.getLength(),
        collision = null;
    if (normal.getLengthSquared() > radius) {
        return null;
    } else {
        collision = new FM.Collision();
        collision.a = this;
        collision.b = circle;
        if (distance !== 0) {
            collision.penetration = radius - distance;
            collision.normal = normal.reset(normal.x / distance, normal.y / distance);
        } else {
            collision.penetration = this.radius;
            collision.normal = normal.reset(1, 0);
        }
        return collision;
    }
    return null;
};
/**
 * Draw debug information.
 * @method FM.CircleComponent#drawDebug
 * @memberOf FM.CircleComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on wich drawing 
 * is done.
 * @param {FM.Vector} newPosition Position of the sprite to render.
 */
FM.CircleComponent.prototype.drawDebug = function (bufferContext, newPosition) {
    "use strict";
    var newCenter = new FM.Vector(newPosition.x + this.radius, newPosition.y + this.radius),
        dir = new FM.Vector(Math.cos(this.spatial.angle), Math.sin(this.spatial.angle));
    bufferContext.beginPath();
    bufferContext.strokeStyle = '#f4f';
    bufferContext.arc((newCenter.x + this.offset.x) - bufferContext.xOffset, (newCenter.y + this.offset.y) - bufferContext.yOffset, this.radius, 0, 2 * Math.PI, false);
    bufferContext.stroke();
    bufferContext.beginPath();
    bufferContext.strokeStyle = "Blue";
    bufferContext.beginPath();
    bufferContext.moveTo(newCenter.x + this.offset.x - bufferContext.xOffset, newCenter.y + this.offset.y - bufferContext.yOffset);
    bufferContext.lineTo((newCenter.x + this.offset.x + dir.x * 50) - bufferContext.xOffset, (newCenter.y + this.offset.y  + dir.y * 50) - bufferContext.yOffset);
    bufferContext.stroke();
};
/**
 * Destroy the component and its objects.
 * @method FM.CircleComponent#destroy
 * @memberOf FM.CircleComponent
 */
FM.CircleComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    this.radius = null;
    FM.PhysicComponent.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The animated sprite renderer component is used for drawing sprites with
 * animations, it requires a spritesheet.
 * @class FM.AnimatedSpriteRendererComponent
 * @extends FM.Component
 * @param {FM.ImageAsset} pImage Image of the spritesheet.
 * @param {int} pWidth Width of a frame of the spritesheet.
 * @param {int} pHeight Height of a frame of the spritesheet.
 * @param {FM.GameObject} pOwner Game object owner of the component.
 * @constructor
 * @author Simon Chauvin
 */
FM.AnimatedSpriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Read-only attributes that specifies whether the current animation has
     * finished playing or not.
     * @type boolean
     * @public
     */
    this.finished = false;
    /**
     * Image of the sprite.
     * @type FM.ImageAsset
     * @private
     */
    this.image = pImage.getImage();
    /**
     * Width of the spritesheet.
     * @type int
     * @private
     */
    this.imageWidth = this.image.width;
    /**
     * Height of the spritesheet.
     * @type int
     * @private
     */
    this.imageHeight = this.image.height;
    /**
     * Width of a frame of the spritesheet.
     * @type int
     * @private
     */
    this.frameWidth = pWidth;
    /**
     * Height of a frame of the spritesheet.
     * @type int
     * @private
     */
    this.frameHeight = pHeight;
    /**
     * Width of a resized frame of the spritesheet.
     * @type int
     * @private
     */
    this.changedWidth = pWidth;
    /**
     * Height of a resized frame of the spritesheet.
     * @type int
     * @private
     */
    this.changedHeight = pHeight;
    /**
     * Transparency of the sprite.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Current animation being played.
     * @type string
     * @private
     */
    this.currentAnim = "";
    /**
     * Whether there is a flipped version of the animation frames or not.
     * @type boolean
     * @private
     */
    this.flipped = false;
    /**
     * Current horizontal offset of position on the spritesheet.
     * @type int
     * @private
     */
    this.xOffset = 0;
    /**
     * Current vertical offset of position on the spritesheet.
     * @type int
     * @private
     */
    this.yOffset = 0;
    /**
     * Frames constituing the animation.
     * @type Array
     * @private
     */
    this.frames = [];
    /**
     * Current frame being displayed.
     * @type int
     * @private
     */
    this.currentFrame = 0;
    /**
     * Current time in seconds.
     * @type float
     * @private
     */
    this.currentTime = 0;
    /**
     * Maximum delay between each frames.
     * @type float
     * @private
     */
    this.delay = 0.1;
    /**
     * Current delay between frames.
     * @type float
     * @private
     */
    this.currentDelay = 0.1;
    /**
     * Whether a specific animation should loop or not.
     * @type Array
     * @private
     */
    this.loop = [];
    /**
     * Spatial component.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    if (!this.image && FM.Parameters.debug) {
        console.log("ERROR: No image was provided and you need one for rendering an animated sprite.");
    }
};
/**
 * FM.AnimatedSpriteRendererComponent inherits from FM.Component.
 */
FM.AnimatedSpriteRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.AnimatedSpriteRendererComponent.prototype.constructor = FM.AnimatedSpriteRendererComponent;
/**
 * Add an animation.
 * @method FM.AnimatedSpriteRendererComponent#addAnimation
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {string} pName Name of the animation.
 * @param {Array} pFrames Frames of the animation.
 * @param {int} pFrameRate Speed of the animation.
 * @param {boolean} pIsLooped Whether the animation should loop or not.
 */
FM.AnimatedSpriteRendererComponent.prototype.addAnimation = function (pName, pFrames, pFrameRate, pIsLooped) {
    "use strict";
    this.currentFrame = 0;
    this.currentAnim = pName;
    this.frames[pName] = pFrames;
    this.delay = 1 / pFrameRate;
    //TODO generate flipped version
    //flipped = isReversed;
    this.currentDelay = this.delay;
    this.loop[pName] = pIsLooped;
};
/**
 * Play the given animation.
 * @method FM.AnimatedSpriteRendererComponent#play
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {string} pAnimName Name of the animation to be played.
 */
FM.AnimatedSpriteRendererComponent.prototype.play = function (pAnimName) {
    "use strict";
    //In case the width of the sprite have been modified
    //imageWidth = image.width;
    //imageHeight = image.height;
    this.currentAnim = pAnimName;
    this.finished = false;
    this.currentFrame = 0;
    this.xOffset = this.frames[this.currentAnim][this.currentFrame] * this.frameWidth;
    this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
    if (this.xOffset >= this.imageWidth) {
        this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
        this.xOffset = (this.xOffset % this.imageWidth);
        this.xOffset = Math.round(this.xOffset);
        this.yOffset = Math.round(this.yOffset);
    }
};
/**
 * Stop the animation.
 * @method FM.AnimatedSpriteRendererComponent#stop
 * @memberOf FM.AnimatedSpriteRendererComponent
 */
FM.AnimatedSpriteRendererComponent.prototype.stop = function () {
    "use strict";
    this.finished = true;
};
/**
 * Draw the sprite.
 * @method FM.AnimatedSpriteRendererComponent#draw
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition The position of the object to draw.
 */
FM.AnimatedSpriteRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x, yPosition = newPosition.y,
        newTime = (new Date()).getTime() / 1000;
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    xPosition = Math.round(xPosition);
    yPosition = Math.round(yPosition);
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
        bufferContext.translate(Math.round(this.frameWidth / 2), Math.round(this.frameHeight / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.drawImage(this.image, Math.round(this.xOffset), Math.round(this.yOffset), this.frameWidth, this.frameHeight, Math.round(-this.changedWidth / 2), Math.round(-this.changedHeight / 2), this.changedWidth, this.changedHeight);
        bufferContext.restore();
    } else {
        bufferContext.drawImage(this.image, Math.round(this.xOffset), Math.round(this.yOffset), this.frameWidth, this.frameHeight, Math.round(xPosition), Math.round(yPosition), this.changedWidth, this.changedHeight);
    }
    bufferContext.globalAlpha = 1;
    //If the anim is not finished playing
    if (!this.finished) {
        if (this.currentDelay <= 0) {
            this.currentDelay = this.delay;
            if (this.frames[this.currentAnim]) {
                if (this.frames[this.currentAnim].length > 1) {
                    this.currentFrame = this.currentFrame + 1;
                    //If the current anim exists and that the current frame is the last one
                    if (this.frames[this.currentAnim] && (this.currentFrame === this.frames[this.currentAnim].length - 1)) {
                        if (this.loop[this.currentAnim]) {
                            this.currentFrame = 0;
                        } else {
                            this.finished = true;
                        }
                    }
                } else {
                    this.finished = true;
                }
                this.xOffset = this.frames[this.currentAnim][this.currentFrame] * this.frameWidth;
                this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
                if (this.xOffset >= this.imageWidth) {
                    this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
                    this.xOffset = (this.xOffset % this.imageWidth);
                    this.xOffset = Math.round(this.xOffset);
                    this.yOffset = Math.round(this.yOffset);
                }
            }
        } else {
            this.currentDelay -= newTime - this.currentTime;
        }
    }
    this.currentTime = newTime;
};
/**
 * Get the current animation being played.
 * @method FM.AnimatedSpriteRendererComponent#getCurrentAnim
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {string} The name of the current animation.
 */
FM.AnimatedSpriteRendererComponent.prototype.getCurrentAnim = function () {
    "use strict";
    return this.currentAnim;
};
/**
 * Change the size of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.AnimatedSpriteRendererComponent#changeSize
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pFactor Factor by which the size will be changed.
 */
FM.AnimatedSpriteRendererComponent.prototype.changeSize = function (pFactor) {
    "use strict";
    this.changedWidth = pFactor * this.frameWidth;
    this.changedHeight = pFactor * this.frameHeight;
};
/**
 * Set the width of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.AnimatedSpriteRendererComponent#setWidth
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pNewWidth New width of the sprite.
 */
FM.AnimatedSpriteRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.changedWidth = pNewWidth;
};
/**
 * Set the height of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.AnimatedSpriteRendererComponent#setHeight
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pNewHeight New height of the sprite.
 */
FM.AnimatedSpriteRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.changedHeight = pNewHeight;
};
/**
 * Set the transparency of the sprite.
 * @method FM.AnimatedSpriteRendererComponent#setAlpha
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.AnimatedSpriteRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the height of a frame of the spritesheet.
 * @method FM.AnimatedSpriteRendererComponent#getWidth
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The actual width of a frame.
 */
FM.AnimatedSpriteRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.changedWidth;
};
/**
 * Retrieve the height of a frame of the spritesheet.
 * @method FM.AnimatedSpriteRendererComponent#getHeight
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The actual height of a frame.
 */
FM.AnimatedSpriteRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.changedHeight;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.AnimatedSpriteRendererComponent#getOriginalWidth
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The width of a frame before resizing.
 */
FM.AnimatedSpriteRendererComponent.prototype.getOriginalWidth = function () {
    "use strict";
    return this.frameWidth;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.AnimatedSpriteRendererComponent#getOriginalHeight
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The height of a frame before resizing.
 */
FM.AnimatedSpriteRendererComponent.prototype.getOriginalHeight = function () {
    "use strict";
    return this.frameHeight;
};
/**
 * Retrieve the transparency value of the sprite.
 * @method FM.AnimatedSpriteRendererComponent#getAlpha
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {float} Current transparency value.
 */
FM.AnimatedSpriteRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.AnimatedSpriteRendererComponent#destroy
 * @memberOf FM.AnimatedSpriteRendererComponent
 */
FM.AnimatedSpriteRendererComponent.prototype.destroy = function () {
    "use strict";
    this.image = null;
    this.currentAnim = null;
    this.frames = null;
    this.loop = null;
    this.spatial = null;
    this.flipped = null;
    this.changedWidth = null;
    this.changedHeight = null;
    this.delay = null;
    this.currentDelay = null;
    this.currentFrame = null;
    this.finished = null;
    this.xOffset = null;
    this.yOffset = null;
    this.alpha = null;
    this.frameWidth = null;
    this.frameHeight = null;
    this.imageWidth = null;
    this.imageHeight = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The box renderer component is used to associate a box of a given color to a 
 * game object.
 * @class FM.BoxRendererComponent
 * @extends FM.Component
 * @param {int} pWidth The width of the box to render.
 * @param {int} pHeight The height of the box to render.
 * @param {string} pColor Color of the box to render.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.BoxRendererComponent = function (pWidth, pHeight, pColor, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Width of the box.
     * @type int
     * @private
     */
    this.width = pWidth;
    /**
     * Height of the box.
     * @type int
     * @private
     */
    this.height = pHeight;
    /**
     * Color of the box.
     * @type string
     * @private
     */
    this.color = pColor;
    /**
     * Transparency of the box.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Spatial component.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
};
/**
 * FM.BoxRendererComponent inherits from FM.Component.
 */
FM.BoxRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.BoxRendererComponent.prototype.constructor = FM.BoxRendererComponent;
/**
 * Draw the box.
 * @method FM.BoxRendererComponent#draw
 * @memberOf FM.BoxRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition Position of the box to render.
 */
FM.BoxRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x, yPosition = newPosition.y;
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    xPosition = Math.round(xPosition);
    yPosition = Math.round(yPosition);
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(xPosition, yPosition);
        bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.beginPath();
        bufferContext.rect(xPosition, yPosition, this.width, this.height);
        bufferContext.restore();
    } else {
        bufferContext.beginPath();
        bufferContext.rect(xPosition, yPosition, this.width, this.height);
    }
    bufferContext.fillStyle = this.color;
    bufferContext.fill();
    bufferContext.globalAlpha = 1;
};
/**
 * Set the width of the box.
 * @method FM.BoxRendererComponent#setWidth
 * @memberOf FM.BoxRendererComponent
 * @param {int} pNewWidth New width desired.
 */
FM.BoxRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.width = pNewWidth;
};
/**
 * Set the height of the box.
 * @method FM.BoxRendererComponent#setHeight
 * @memberOf FM.BoxRendererComponent
 * @param {int} pNewHeight New height desired.
 */
FM.BoxRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.height = pNewHeight;
};
/**
 * Set the color of the  box.
 * @method FM.BoxRendererComponent#setColor
 * @memberOf FM.BoxRendererComponent
 * @param {string} pNewColor New color desired.
 */
FM.BoxRendererComponent.prototype.setColor = function (pNewColor) {
    "use strict";
    this.color = pNewColor;
};
/**
 * Set the transparency of the box.
 * @method FM.BoxRendererComponent#setAlpha
 * @memberOf FM.BoxRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.BoxRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the box.
 * @method FM.BoxRendererComponent#getWidth
 * @memberOf FM.BoxRendererComponent
 * @return {int} Width of the box.
 */
FM.BoxRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the box.
 * @method FM.BoxRendererComponent#getHeight
 * @memberOf FM.BoxRendererComponent
 * @return {int} Height of the box.
 */
FM.BoxRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the color of the box.
 * @method FM.BoxRendererComponent#getColor
 * @memberOf FM.BoxRendererComponent
 * @return {string} Color of the box.
 */
FM.BoxRendererComponent.prototype.getColor = function () {
    "use strict";
    return this.color;
};
/**
 * Retrieve the transparency value of the box.
 * @method FM.BoxRendererComponent#getAlpha
 * @memberOf FM.BoxRendererComponent
 * @return {float} Current transparency value.
 */
FM.BoxRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.BoxRendererComponent#destroy
 * @memberOf FM.BoxRendererComponent
 */
FM.BoxRendererComponent.prototype.destroy = function () {
    "use strict";
    this.width = null;
    this.height = null;
    this.spatial = null;
    this.color = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The circle renderer component is used to render a circle associated to a game
 * object.
 * @class FM.CircleRendererComponent
 * @extends FM.Component
 * @param {int} pRadius Radius of the circle to render.
 * @param {string} pColor The color of the circle to render.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.CircleRendererComponent = function (pRadius, pColor, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Width of the circle.
     * @type int
     * @private
     */
    this.width = pRadius * 2;
    /**
     * Height of the circle.
     * @type int
     * @private
     */
    this.height = pRadius * 2;
    /**
     * Color of the circle.
     * @type string
     * @private
     */
    this.color = pColor;
    /**
     * Transparency of the circle.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Spatial component.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
};
/**
 * FM.CircleRendererComponent inherits from FM.Component.
 */
FM.CircleRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.CircleRendererComponent.prototype.constructor = FM.CircleRendererComponent;
/**
 * Draw the circle.
 * @method FM.CircleRendererComponent#draw
 * @memberOf FM.CircleRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition The position of the circle to draw.
 */
FM.CircleRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x - bufferContext.xOffset * this.owner.scrollFactor.x,
        yPosition = newPosition.y - bufferContext.yOffset * this.owner.scrollFactor.y,
        newCenter = new FM.Vector(xPosition + this.width / 2, yPosition + this.height / 2);
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
        bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.beginPath();
        bufferContext.arc(Math.round(newCenter.x), Math.round(newCenter.y), Math.round(this.width / 2), 0, 2 * Math.PI);
        bufferContext.restore();
    } else {
        bufferContext.beginPath();
        bufferContext.arc(Math.round(newCenter.x), Math.round(newCenter.y), Math.round(this.width / 2), 0, 2 * Math.PI);
    }
    bufferContext.fillStyle = this.color;
    bufferContext.fill();
    bufferContext.globalAlpha = 1;
};
/**
 * Set the width of the  circle.
 * @method FM.CircleRendererComponent#setWidth
 * @memberOf FM.CircleRendererComponent
 * @param {int} pNewWidth New width desired.
 */
FM.CircleRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.width = pNewWidth;
    this.height = pNewWidth;
};
/**
 * Set the height of the circle.
 * @method FM.CircleRendererComponent#setHeight
 * @memberOf FM.CircleRendererComponent
 * @param {int} pNewHeight New height desired.
 */
FM.CircleRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.height = pNewHeight;
    this.width = pNewHeight;
};
/**
 * Set the radius of the  circle.
 * @method FM.CircleRendererComponent#setRadius
 * @memberOf FM.CircleRendererComponent
 * @param {int} pNewRadius New radius desired.
 */
FM.CircleRendererComponent.prototype.setRadius = function (pNewRadius) {
    "use strict";
    this.width = pNewRadius * 2;
    this.height = pNewRadius * 2;
};
/**
 * Set the color of the  circle.
 * @method FM.CircleRendererComponent#setColor
 * @memberOf FM.CircleRendererComponent
 * @param {string} pNewColor New color desired.
 */
FM.CircleRendererComponent.prototype.setColor = function (pNewColor) {
    "use strict";
    this.color = pNewColor;
};
/**
 * Set the transparency of the circle.
 * @method FM.CircleRendererComponent#setAlpha
 * @memberOf FM.CircleRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.CircleRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the circle.
 * @method FM.CircleRendererComponent#getWidth
 * @memberOf FM.CircleRendererComponent
 * @return {int} The width of the circle.
 */
FM.CircleRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the circle.
 * @method FM.CircleRendererComponent#getHeight
 * @memberOf FM.CircleRendererComponent
 * @return {int} The height of the circle.
 */
FM.CircleRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the radius of the circle.
 * @method FM.CircleRendererComponent#getRadius
 * @memberOf FM.CircleRendererComponent
 * @return {int} The radius of the circle.
 */
FM.CircleRendererComponent.prototype.getRadius = function () {
    "use strict";
    return this.width / 2;
};
/**
 * Retrieve the color of the circle.
 * @method FM.CircleRendererComponent#getColor
 * @memberOf FM.CircleRendererComponent
 * @return {string} The color of the circle.
 */
FM.CircleRendererComponent.prototype.getColor = function () {
    "use strict";
    return this.color;
};
/**
 * Retrieve the transparency value of the circle.
 * @method FM.CircleRendererComponent#getAlpha
 * @memberOf FM.CircleRendererComponent
 * @return {float} Current transparency value.
 */
FM.CircleRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.CircleRendererComponent#destroy
 * @memberOf FM.CircleRendererComponent
 */
FM.CircleRendererComponent.prototype.destroy = function () {
    "use strict";
    this.width = null;
    this.height = null;
    this.color = null;
    this.alpha = null;
    this.spatial = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The line renderer component is used to render a line associated to a game 
 * object.
 * @class FM.LineRendererComponent
 * @extends FM.Component
 * @param {int} pLineWidth Width of the line to render.
 * @param {string} pLineStyle The style of the line to draw.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.LineRendererComponent = function (pLineWidth, pLineStyle, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Points constituing the line.
     * @type Array
     * @private
     */
    this.points = [];
    /**
     * Width of the line.
     * @type int
     * @private
     */
    this.width = 0;
    /**
     * Height of the line.
     * @type int
     * @private
     */
    this.height = 0;
    /**
     * Width of the line.
     * @type int
     * @private
     */
    this.lineWidth = pLineWidth;
    /**
     * Style of the line.
     * @type string
     * @private
     */
    this.lineStyle = pLineStyle;
    /**
     * Transparency of the line.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Spatial component.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
};
/**
 * FM.LineRendererComponent inherits from FM.Component.
 */
FM.LineRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.LineRendererComponent.prototype.constructor = FM.LineRendererComponent;
/**
 * Draw the line.
 * @method FM.LineRendererComponent#draw
 * @memberOf FM.LineRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition Position of the line to render.
 */
FM.LineRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    if (this.points.length > 0) {
        var xPosition = newPosition.x, yPosition = newPosition.y, i;
        xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
        bufferContext.globalAlpha = this.alpha;
        if (this.spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
            bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
            bufferContext.rotate(this.spatial.angle);
            //TODO might not work since I freed the physics
            // Needs to interpolate the points
            bufferContext.beginPath();
            bufferContext.moveTo(Math.round(this.points[0].x), Math.round(this.points[0].y));
            for (i = 1; i < this.points.length; i = i + 1) {
                bufferContext.lineTo(Math.round(this.points[i].x), Math.round(this.points[i].y));
            }
            bufferContext.restore();
        } else {
            bufferContext.beginPath();
            bufferContext.moveTo(Math.round(this.points[0].x), Math.round(this.points[0].y));
            for (i = 1; i < this.points.length; i = i + 1) {
                bufferContext.lineTo(Math.round(this.points[i].x), Math.round(this.points[i].y));
            }
        }
        bufferContext.strokeStyle = this.lineStyle;
        bufferContext.lineWidth = this.lineWidth;
        bufferContext.stroke();
        bufferContext.globalAlpha = 1;
        bufferContext.lineWidth = 1;
    }
};
/**
 * Add a point to the line to be drawn.
 * @method FM.LineRendererComponent#addPoint
 * @memberOf FM.LineRendererComponent
 * @param {FM.Vector} pNewPoint The new point to add.
 */
FM.LineRendererComponent.prototype.addPoint = function (pNewPoint) {
    "use strict";
    this.points.push(pNewPoint);
    var i, point, farthestRightX = 0, farthestLeftX = 0, farthestUpY = 0, farthestDownY = 0;
    for (i = 0; i < this.points.length; i = i + 1) {
        point = this.points[i];
        if (point.x > farthestRightX) {
            farthestRightX = point.x;
        }
        if (point.x < farthestLeftX) {
            farthestLeftX = point.x;
        }
        if (point.y < farthestUpY) {
            farthestUpY = point.y;
        }
        if (point.y > farthestDownY) {
            farthestDownY = point.y;
        }
    }

    this.width = Math.abs(farthestRightX - farthestLeftX);
    this.height = Math.abs(farthestDownY - farthestUpY);
};
/**
 * Reset the lines.
 * @method FM.LineRendererComponent#clear
 * @memberOf FM.LineRendererComponent
 */
FM.LineRendererComponent.prototype.clear = function () {
    "use strict";
    delete this.points;
    this.points = [];
};
/**
 * Set the width of the  line (weight).
 * @method FM.LineRendererComponent#setLineWidth
 * @memberOf FM.LineRendererComponent
 * @param {int} pNewLineWidth New line width desired.
 */
FM.LineRendererComponent.prototype.setLineWidth = function (pNewLineWidth) {
    "use strict";
    this.lineWidth = pNewLineWidth;
};
/**
 * Set the style of the  line.
 * @method FM.LineRendererComponent#setLineStyle
 * @memberOf FM.LineRendererComponent
 * @param {string} pNewLineStyle New line style desired.
 */
FM.LineRendererComponent.prototype.setLineStyle = function (pNewLineStyle) {
    "use strict";
    this.lineStyle = pNewLineStyle;
};
/**
 * Set the transparency of the line.
 * @method FM.LineRendererComponent#setAlpha
 * @memberOf FM.LineRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.LineRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the line (distance from start to end).
 * @method FM.LineRendererComponent#getWidth
 * @memberOf FM.LineRendererComponent
 * @return {int} The width of the line.
 */
FM.LineRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the line(distance from start to end).
 * @method FM.LineRendererComponent#getHeight
 * @memberOf FM.LineRendererComponent
 * @return {int} The height of the line.
 */
FM.LineRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the width of the line (weight).
 * @method FM.LineRendererComponent#getLineWidth
 * @memberOf FM.LineRendererComponent
 * @return {int} The width of the line.
 */
FM.LineRendererComponent.prototype.getLineWidth = function () {
    "use strict";
    return this.lineWidth;
};
/**
 * Retrieve the style of the line.
 * @method FM.LineRendererComponent#getLineStyle
 * @memberOf FM.LineRendererComponent
 * @return {string} The style of the line.
 */
FM.LineRendererComponent.prototype.getLineStyle = function () {
    "use strict";
    return this.lineStyle;
};
/**
 * Retrieve the transparency value of the line.
 * @method FM.LineRendererComponent#getAlpha
 * @memberOf FM.LineRendererComponent
 * @return {float} Current transparency value.
 */
FM.LineRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.LineRendererComponent#destroy
 * @memberOf FM.LineRendererComponent
 */
FM.LineRendererComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    this.width = null;
    this.height = null;
    this.lineWidth = null;
    this.lineHeight = null;
    this.alpha = null;
    var i;
    for (i = 0; i < this.points.length; i = i + 1) {
        this.points[i].destroy();
        this.points[i] = null;
    }
    this.points = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The sprite renderer component is used to associate an image to a game object.
 * @class FM.SpriteRendererComponent
 * @extends FM.Component
 * @param {FM.ImageAsset} pImage Image to use for rendering.
 * @param {int} pWidth Width of the sprite.
 * @param {int} pHeight Height of the sprite.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.SpriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Offset in case the image width is greater than the sprite.
     * @type FM.Vector
     * @public
     */
    this.offset = new FM.Vector(0, 0);
    /**
     * Image of the sprite.
     * @type FM.ImageAsset
     * @private
     */
    this.image = pImage.getImage();
    /**
     * Width of the sprite to display.
     * @type int
     * @private
     */
    this.width = pWidth;
    /**
     * Height of the sprite to display.
     * @type int
     * @private
     */
    this.height = pHeight;
    /**
     * Width of the resized sprite.
     * @type int
     * @private
     */
    this.changedWidth = pWidth;
    /**
     * Height of the resized sprite.
     * @type int
     * @private
     */
    this.changedHeight = pHeight;
    /**
     * Transparency of the sprite.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Spatial component.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    //Check if an image was provided
    if (!this.image && FM.Parameters.debug) {
        console.log("ERROR: No image was provided and you need one for rendering a sprite.");
    }
};
/**
 * FM.SpriteRendererComponent inherits from FM.Component.
 */
FM.SpriteRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.SpriteRendererComponent.prototype.constructor = FM.SpriteRendererComponent;
/**
 * Draw the sprite.
 * @method FM.SpriteRendererComponent#draw
 * @memberOf FM.SpriteRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition Position of the sprite to render.
 */
FM.SpriteRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x,
        yPosition = newPosition.y,
        offset = new FM.Vector(Math.round(this.offset.x), Math.round(this.offset.y));
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
        bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.drawImage(this.image, offset.x, offset.y, this.width, this.height, Math.round(-this.changedWidth / 2), Math.round(-this.changedHeight / 2), this.changedWidth, this.changedHeight);
        bufferContext.restore();
    } else {
        bufferContext.drawImage(this.image, offset.x, offset.y, this.width, this.height, Math.round(xPosition), Math.round(yPosition), this.changedWidth, this.changedHeight);
    }
    bufferContext.globalAlpha = 1;
};
/**
 * Change the size of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.SpriteRendererComponent#changeSize
 * @memberOf FM.SpriteRendererComponent
 * @param {float} pFactor Factor by which the size will be changed.
 */
FM.SpriteRendererComponent.prototype.changeSize = function (pFactor) {
    "use strict";
    this.changedWidth = pFactor * this.width;
    this.changedHeight = pFactor * this.height;
};
/**
 * Set the width of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.SpriteRendererComponent#setWidth
 * @memberOf FM.SpriteRendererComponent
 * @param {int} pNewWidth New width of the sprite.
 */
FM.SpriteRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.changedWidth = pNewWidth;
};
/**
 * Set the height of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.SpriteRendererComponent#setHeight
 * @memberOf FM.SpriteRendererComponent
 * @param {float} pNewHeight New height of the sprite.
 */
FM.SpriteRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.changedHeight = pNewHeight;
};
/**
 * Set a new image.
 * @method FM.SpriteRendererComponent#setImage
 * @memberOf FM.SpriteRendererComponent
 * @param {FM.ImageAsset} pImage The new image of the sprite.
 * @param {int} pWidth The width of the sprite.
 * @param {int} pHeight The height of the sprite.
 */
FM.SpriteRendererComponent.prototype.setImage = function (pImage, pWidth, pHeight) {
    "use strict";
    this.image = pImage.getImage();
    this.width = pWidth;
    this.height = pHeight;
};
/**
 * Set the transparency of the sprite.
 * @method FM.SpriteRendererComponent#setAlpha
 * @memberOf FM.SpriteRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.SpriteRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the sprite.
 * @method FM.SpriteRendererComponent#getWidth
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The actual width of the sprite.
 */
FM.SpriteRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.changedWidth;
};
/**
 * Retrieve the height of the sprite.
 * @method FM.SpriteRendererComponent#getHeight
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The actual height of the sprite.
 */
FM.SpriteRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.changedHeight;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.SpriteRendererComponent#getOriginalWidth
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The width of the sprite before resizing.
 */
FM.SpriteRendererComponent.prototype.getOriginalWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.SpriteRendererComponent#getOriginalHeight
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The height of the sprite before resizing.
 */
FM.SpriteRendererComponent.prototype.getOriginalHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the transparency value of the sprite.
 * @method FM.SpriteRendererComponent#getAlpha
 * @memberOf FM.SpriteRendererComponent
 * @return {float} Current transparency value.
 */
FM.SpriteRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.SpriteRendererComponent#destroy
 * @memberOf FM.SpriteRendererComponent
 */
FM.SpriteRendererComponent.prototype.destroy = function () {
    "use strict";
    this.offset.destroy();
    this.offset = null;
    this.image = null;
    this.spatial = null;
    this.width = null;
    this.height = null;
    this.changedWidth = null;
    this.changedHeight = null;
    this.alpha = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * A component for rendering text.
 * @class FM.TextRendererComponent
 * @extends FM.Component
 * @param {string} pTextToDisplay The text to be rendered.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.TextRendererComponent = function (pTextToDisplay, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Text to be displayed.
     * @type string
     * @public
     */
    this.text = pTextToDisplay;
    /**
     * With of the text container.
     * @type int
     * @public
     */
    this.width = 50;
    /**
     * Height of the text container.
     * @type int
     * @public
     */
    this.height = 50;
    /**
     * The color of the font.
     * @type string
     * @public
     */
    this.fillStyle = '#fff';
    /**
     * The font size and font name to use.
     * @type string
     * @public
     */
    this.font = '30px sans-serif';
    /**
     * Alignment of the text.
     * @type string
     * @public
     */
    this.textBaseline = 'middle';
    /**
     * The spatial component.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
};
/**
 * FM.TextRendererComponent inherits from FM.Component.
 */
FM.TextRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.TextRendererComponent.prototype.constructor = FM.TextRendererComponent;
/**
 * Format the text.
 * @method FM.TextRendererComponent#setFormat
 * @memberOf FM.TextRendererComponent
 * @param {string} pColor The color of the text.
 * @param {string} pFont The font size and name of the text.
 * @param {string} pAlignment Alignment of the text.
 */
FM.TextRendererComponent.prototype.setFormat = function (pColor, pFont, pAlignment) {
    "use strict";
    this.fillStyle = pColor;
    this.font = pFont;
    this.textBaseline = pAlignment;
};
/**
 * Draw the text.
 * @method FM.TextRendererComponent#draw
 * @memberOf FM.TextRendererComponent
 * @param {CanvasRenderingContext2D} bufferCanvas The context on which to draw.
 * @param {FM.Vector} newPosition The position to draw the text.
 * 
 */
FM.TextRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x, yPosition = newPosition.y;
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    bufferContext.fillStyle = this.fillStyle;
    bufferContext.font = this.font;
    bufferContext.textBaseline = this.textBaseline;
    bufferContext.fillText(this.text, Math.round(xPosition), Math.round(yPosition));
};
/**
 * Retrieve the width of the text container.
 * @method FM.TextRendererComponent#getWidth
 * @memberOf FM.TextRendererComponent
 * @return {int} The width of the text container.
 */
FM.TextRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the text container.
 * @method FM.TextRendererComponent#getHeight
 * @memberOf FM.TextRendererComponent
 * @return {int} The height of the text container.
 */
FM.TextRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Destroy the component and its objects.
 * @method FM.TextRendererComponent#destroy
 * @memberOf FM.TextRendererComponent
 */
FM.TextRendererComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    this.text = null;
    this.width = null;
    this.height = null;
    this.fillStyle = null;
    this.font = null;
    this.textBaseline = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * Audio component to add to a game object for playing sounds.
 * @class FM.AudioComponent
 * @extends FM.Component
 * @param {FM.GameObject} pOwner Game object owner of this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.AudioComponent = function (pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.SOUND, pOwner);
    /**
     * The list of sound objects.
     * @type Array
     * @private
     */
    this.sounds = [];
};
/**
 * FM.AudioComponent inherits from FM.Component.
 */
FM.AudioComponent.prototype = Object.create(FM.Component.prototype);
FM.AudioComponent.prototype.constructor = FM.AudioComponent;
/**
 * Replay a sound from the beginning.
 * @method FM.AudioComponent#replay
 * @memberOf FM.AudioComponent
 * @param {Audio} pSound The sound to be replayed.
 * @private
 */
FM.AudioComponent.prototype.replay = function (pSound) {
    "use strict";
    pSound.currentTime = 0;
    pSound.play();
};
/**
 * Play the sound given a certain volume and whether the sound loops or not.
 * @method FM.AudioComponent#play
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to play.
 * @param {float} pVolume The volume at which playing the sound (0 to 1).
 * @param {boolean} pLoop Whether the sound should loop or not.
 */
FM.AudioComponent.prototype.play = function (pSoundName, pVolume, pLoop) {
    "use strict";
    var i, sound, soundFound = false;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound && sound.getName() === pSoundName) {
            soundFound = true;
            sound.getAudio().volume = pVolume;
            if (pLoop) {
                sound.getAudio().addEventListener('ended', function () {
                    if (window.chrome) {
                        this.load(FM.AudioComponent.prototype.replay);
                    } else {
                        this.currentTime = 0;
                        this.play();
                    }
                }, false);
            }
            if (window.chrome) {
                sound.load(FM.AudioComponent.prototype.replay);
            } else {
                sound.getAudio().play();
            }
        }
    }
    if (!soundFound) {
        if (FM.Parameters.debug) {
            console.log("WARNING: you're trying to play a sound that does not exist.");
        }
    }
};
/**
 * Pause the sound.
 * @method FM.AudioComponent#pause
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to pause.
 */
FM.AudioComponent.prototype.pause = function (pSoundName) {
    "use strict";
    var i, sound;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound.getName() === pSoundName) {
            sound.getAudio().pause();
        }
    }
};
/**
 * Add a sound to the component.
 * @method FM.AudioComponent#addSound
 * @memberOf FM.AudioComponent
 * @param {FM.AudioAsset} pSound The sound to add to this component.
 */
FM.AudioComponent.prototype.addSound = function (pSound) {
    "use strict";
    this.sounds.push(pSound);
};
/**
 * Check if a sound is currently playing.
 * @method FM.AudioComponent#isPlaying
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to check.
 * @return {boolean} Whether the sound is playing or not.
 */
FM.AudioComponent.prototype.isPlaying = function (pSoundName) {
    "use strict";
    var i, sound;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound.getName() === pSoundName) {
            return !sound.getAudio().paused;
        }
    }
};
/**
 * Retrieve the audio object.
 * @method FM.AudioComponent#getSoundByName
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to retrieve.
 * @return {FM.AudioAsset} The sound found or null if not.
 */
FM.AudioComponent.prototype.getSoundByName = function (pSoundName) {
    "use strict";
    var i, sound;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound.getName() === pSoundName) {
            return sound;
        }
    }
    return null;
};
/**
 * Destroy the sound component and its objects.
 * @method FM.AudioComponent#destroy
 * @memberOf FM.AudioComponent
 */
FM.AudioComponent.prototype.destroy = function () {
    "use strict";
    this.sounds = null;
    FM.Component.prototype.destroy.call(this);
};
/*global FM*/
/**
 * The spatial component allows positionning of the game object in the 2d space.
 * @class FM.SpatialComponent
 * @extends FM.Component
 * @param {int} pX X position of the game object.
 * @param {int} pY Y position of the game object.
 * @param {FM.GameObject} pOwner The game object that own this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.SpatialComponent = function (pX, pY, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.SPATIAL, pOwner);
    /**
     * Current position of the game object.
     * @type FM.Vector
     * @public
     */
    this.position = new FM.Vector(pX, pY);
    /**
     * Position of the game object at last frame.
     * @type FM.Vector
     * @public
     */
    this.previous = new FM.Vector(pX, pY);
    /**
     * Angle of the object defined in radians.
     * @type float
     * @public
     */
    this.angle = 0;
};
/**
 * FM.SpatialComponent inherits from FM.Component.
 */
FM.SpatialComponent.prototype = Object.create(FM.Component.prototype);
FM.SpatialComponent.prototype.constructor = FM.SpatialComponent;
/**
 * Destroy the component and its objects.
 * @method FM.SpatialComponent#destroy
 * @memberOf FM.SpatialComponent
 */
FM.SpatialComponent.prototype.destroy = function () {
    "use strict";
    this.position = null;
    this.previous = null;
    this.angle = null;
    FM.Component.prototype.destroy.call(this);
};
