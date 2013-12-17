var FM = FM || {};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.assetManager = {
    //List of assets
    assets: [],

    /**
     * Keep tracks of the current progress in loading assets.
     */
    loadingProgress: 0,

    /**
     * Add an asset to the list.
     * As for sound the first to be found supported by the browser will be
     * the only one added. You have to provide at least one supported format
     * if you want the game to run.
     */
    addAsset: function (name, type, path) {
        "use strict";
        var assetManager = FM.assetManager,
            param = FM.parameters,
            asset = assetManager.getAssetByName(name),
            sound;
        if (type === param.IMAGE) {
            if (!asset) {
                assetManager.assets.push(FM.imageAsset(name, path));
            }
        } else if (type === param.AUDIO) {
            if (!asset) {
                sound = FM.audioAsset(name, path);
                //Add the asset only if it is supported by the browser
                if (sound.isSupported()) {
                    assetManager.assets.push(sound);
                } else if (FM.parameters.debug) {
                    console.log("ERROR: The " + 
                            path.substring(path.lastIndexOf('.') + 1) + 
                            " audio format is not supported by this browser.");
                    return false;
                }
            }
        } else if (type === param.FILE) {
            if (!asset) {
                assetManager.assets.push(FM.fileAsset(name, path));
            }
        }
        return true;
    },

    /**
     * Load all assets.
     */
    loadAssets: function () {
        "use strict";
        var i, assetManager = FM.assetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            assetManager.assets[i].load();
        }
    },

    /**
     * Fired when an asset has been loaded.
     */
    assetLoaded: function () {
        "use strict";
        var assetManager = FM.assetManager;
        assetManager.loadingProgress += 100 / assetManager.assets.length;
    },

    /**
     * Check if all assets have been loaded.
     */
    areAllAssetsLoaded: function () {
        "use strict";
        return Math.round(FM.assetManager.loadingProgress) >= 100;
    },

    /**
     * Get an asset by its name.
     */
    getAssetByName: function (name) {
        "use strict";
        var asset = null, i = 0, assetManager = FM.assetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            if (assetManager.assets[i].getName() === name) {
                asset = assetManager.assets[i];
            }
        }
        return asset;
    }
};
/**
 * Under Creative Commons Licence
 * 
 * @author Simon Chauvin
 */
FM.parameters = {
    //FPS at which the game is running
    FPS: 60.0,

    //The name of the library directory
    libFolder: "lib",

    //Debug mode
    debug: false,

    //Minimum width and height of a collider, must be equal to the minimum
    //width a tile can have
    COLLIDER_MINIMUM_SIZE: 16,

    //Box2D body types
    STATIC: "static",
    KINEMATIC: "kinematic",
    DYNAMIC: "dynamic",

    //Used for Box2D conversion
    PIXELS_TO_METERS: 30,

    //System constants
    IMAGE: "image",
    AUDIO: "audio",
    FILE: "file",
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down",

    //Background color
    backgroundColor: 'rgb(0,0,0)'
};
/**
 * List of possible component.
 * @author Simon Chauvin
 */
FM.componentTypes = {
    SPATIAL: "spatial",
    PATHFINDING: "pathfinding",
    RENDERER: "renderer",
    PHYSIC: "physic",
    SOUND: "sound",
    FX: "fx"
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param radius
 * @returns {circle}
 */
FM.circle = function (pX, pY, pRadius) {
    "use strict";
    var that = {};

    /**
     * x position.
     */
    that.x = pX;
    /**
     * y position.
     */
    that.y = pY;

    /**
     * Radius.
     */
    that.radius = pRadius;

    /**
    * Destroy the circle and its objects.
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
/**
 * game is a singleton that represents the game application and
 * contains all the necessary information and methods to handle its execution.
 * @author Simon Chauvin
 */
FM.game = (function () {
    "use strict";
    var that = {},
        /**
        * Name of the game.
        */
        name = "",
        /**
         * Width of the screen.
         */
        screenWidth = 0,
        /**
         * Height of the screen.
         */
        screenHeight = 0,
        /**
        * Current state of the game.
        */
        currentState = null,
        /**
        * Canvas elements.
        */
        canvas = "",
        /**
         * Context on which the game will be drawn.
         */
        context = null,
        /**
         * Buffer used for double buffering.
         */
        bufferCanvas = null,
        /**
         * Buffer context that will be drawn onto the displayed context.
         */
        bufferContext = null,
        /**
         * Count the number of frames between two FPS computation.
         * @type Number
         */
        framesCounter = 0,
        /**
         * Count the time between two FPS computation.
         * @type Number
         */
        timeCounter = 0,
        /**
         * Fixed delta time for updating the game.
         * @type Number
         */
        fixedDt = 1 / FM.parameters.FPS,
        /**
         * Actual FPS at which the game is running.
         */
        actualFps = FM.parameters.FPS,
        /**
         * Contains the FPS computed every second.
         * @type Number
         */
        lastComputedFps = FM.parameters.FPS,
        /**
         * Current time.
         */
        currentTime = (new Date()).getTime() / 1000,
        /**
         * Delay accumulated by the physics engine.
         * @type Number
         */
        accumulator = 0.0,
        /**
        * Currently pressed keys.
        */
        currentPressedKeys = [],
        /**
        * Currently released keys.
        */
        currentReleasedKeys = [],
        /**
        * Keeps tracks of the mouse click.
        */
        mouseClicked = false,
        /**
        * Keeps tracks of whether the mouse is pressed or not.
        */
        mousePressed = false,
        /**
        * Keeps tracks of whether the mouse is released or not.
        */
        mouseReleased = false,
        /**
         * Mouse x position.
         */
        mouseX = 0,
        /**
         * Mouse y position.
         */
        mouseY = 0,
        /**
         * Whether the game has been paused or not.
         */
        pause = false,
        /**
         * Whether to display the debug information or not.
         * @type Boolean
         */
        debugActivated = false,

        /**
        * Main game loop Calling update and draw on game objects.
        */
        gameLoop = function () {
            //Reset the screen
            context.clearRect(0, 0, screenWidth, screenHeight);
            context.fillStyle = FM.parameters.backgroundColor;
            context.fillRect(0, 0, screenWidth, screenHeight);

            //Retrieve the current time
            var newTime = (new Date()).getTime() / 1000,
                //Compute actual time since last frame
                frameTime = newTime - currentTime,
                alpha = 0;
            //Avoid spiral of death
            if (frameTime > 0.25) {
                frameTime = 0.25;
            }
            currentTime = newTime;
            //Update the accumulator
            accumulator += frameTime;
            //Update if not on pause
            if (!pause) {
                //Update the physic a fixed number of times
                while (accumulator >= fixedDt) {
                    accumulator -= fixedDt;
                    currentState.updatePhysics(fixedDt);
                }
                alpha = accumulator / fixedDt;
                //Update the current state
                currentState.update(frameTime);
            }
            //Compute the actual FPS at which the game is running
            timeCounter += frameTime;
            framesCounter = framesCounter + 1;
            if (timeCounter >= 1) {
                lastComputedFps = framesCounter / timeCounter;
                framesCounter = 0;
                timeCounter = 0;
            }
            actualFps = Math.round(lastComputedFps);

            //Draw the current state of the game
            currentState.draw(bufferContext, alpha);

            if (pause) {
                //Fade screen
                bufferContext.fillStyle = "rgba(99,99,99,0.5)";
                bufferContext.fillRect(0, 0, screenWidth, screenHeight);

                //Draw pause icon
                bufferContext.fillStyle   = 'rgba(255,255,255,1)';
                bufferContext.beginPath();
                bufferContext.moveTo(screenWidth / 2 + 60, screenHeight / 2);
                bufferContext.lineTo(screenWidth / 2 - 60, screenHeight / 2 - 60);
                bufferContext.lineTo(screenWidth / 2 - 60, screenHeight / 2 + 60);
                bufferContext.lineTo(screenWidth / 2 + 60, screenHeight / 2);
                bufferContext.fill();
                bufferContext.closePath();
            }

            // If debug mode if active
            if (FM.parameters.debug) {
                //Display debug information
                if (that.isKeyReleased(FM.keyboard.HOME)) {
                    if (!debugActivated) {
                        debugActivated = true;
                    } else {
                        debugActivated = false;
                    }
                }
                //Draw the number of frames per seconds
                if (debugActivated) {
                    bufferContext.fillStyle = '#fcd116';
                    bufferContext.font = '30px sans-serif';
                    bufferContext.textBaseline = 'middle';
                    bufferContext.fillText(actualFps, 10, 20);
                }
            }

            //Draw the buffer onto the screen
            context.drawImage(bufferCanvas, 0, 0);

            //Reset keyboard and mouse inputs
            mouseClicked = false;
            currentReleasedKeys = [];

            //Main loop call
            requestAnimationFrame(gameLoop);
        },
        /**
        * Handle keys pressed.
        */
        onKeyPressed = function (event) {
            currentPressedKeys[event.keyCode] = 1;
        },
        /**
        * Handle keys released.
        */
        onKeyReleased = function (event) {
            var key = event.keyCode;
            currentReleasedKeys[key] = 1;
            delete currentPressedKeys[key];
        },
        /**
        * Handle mouse moves.
        */
        onMouseMove = function (event) {
            mouseX = event.clientX - event.target.offsetLeft;
            mouseY = event.clientY - event.target.offsetTop;
        },
        /**
        * Handle mouse click.
        */
        onClick = function (event) {
            mouseClicked = true;
        },
        /**
        * Handle mouse pressed.
        */
        onMousePressed = function (event) {
            mousePressed = true;
            mouseReleased = false;
        },
        /**
        * Handle mouse pressed.
        */
        onMouseReleased = function (event) {
            mouseReleased = true;
            mousePressed = false;
        },
        /**
        * Handle canvas's retrieve of focus.
        */
        onFocus = function (event) {
            pause = false;
        },
        /**
        * Handle canvas's lost of focus.
        */
        onOutOfFocus = function (event) {
            pause = true;
        };

    /**
     * Start running the game.
     * @param {type} pCanvasId description.
     * @param {string} pName description.
     * @param {int} pWidth description.
     * @param {int} pHeight description.
     * @param {state} pFirstState description.
     * @param {preloader} pCustomPreloader preloader to be used.
     * 
     */
    that.run = function (pCanvasId, pName, pWidth, pHeight, pFirstState, pCustomPreloader) {
        name = pName;
        screenWidth = pWidth;
        screenHeight = pHeight;
        canvas = document.getElementById(pCanvasId);
        if (pCustomPreloader) {
            currentState = pCustomPreloader(pFirstState);
        } else {
            currentState = FM.preloader(pFirstState);
        }
        //Create canvas context if it exists and use double buffering
        if (canvas && canvas.getContext) {
            context = canvas.getContext("2d");

            if (context) {
                canvas.width = screenWidth;
                canvas.height = screenHeight;
                bufferCanvas = document.createElement("canvas");
                bufferCanvas.width = screenWidth;
                bufferCanvas.height = screenHeight;
                bufferContext = bufferCanvas.getContext("2d");
                bufferContext.xOffset = 0;
                bufferContext.yOffset = 0;
            }
        }
        if (context && bufferContext) {
            canvas.onkeydown = function (event) {
                onKeyPressed(event);
            };
            canvas.onkeyup = function (event) {
                onKeyReleased(event);
            };
            canvas.onclick = function (event) {
                onClick(event);
            };
            canvas.onmousedown = function (event) {
                onMousePressed(event);
            };
            canvas.onmouseup = function (event) {
                onMouseReleased(event);
            };
            canvas.onmousemove = function (event) {
                onMouseMove(event);
            };
            canvas.onfocus = function (event) {
                onFocus(event);
            };
            canvas.onblur = function (event) {
                onOutOfFocus(event);
            };

            //Focus on the canvas
            canvas.focus();

            //Init the current state
            currentState.init(that);

            //Start the main loop
            requestAnimationFrame(gameLoop);
        }
    };

    /**
     * Hack to get the requestAnimationFrame work on every browser.
     */
    (function () {
        var x, lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
        for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());

    /**
    * Switch between two states.
    */
    that.switchState = function (newState) {
        currentState.destroy();
        currentState = newState;
        currentState.init(that);
    };

    /**
    * Check if a key is pressed.
    * @param key
    * @returns {Boolean}
    */
    that.isKeyPressed = function (key) {
        if (currentPressedKeys[key]) {
            return true;
        } else {
            return false;
        }
    };

    /**
    * Check if a key has been released.
    * @param key
    * @returns {Boolean}
    */
    that.isKeyReleased = function (key) {
        if (currentReleasedKeys[key]) {
            return true;
        } else {
            return false;
        }
    };

    /**
    * Check if the mouse has been clicked
    * @returns {Boolean}
    */
    that.isMouseClicked = function () {
        return mouseClicked;
    };

    /**
    * Check if a mouse button is pressed
    * @returns {Boolean}
    */
    that.isMousePressed = function () {
        return mousePressed;
    };

    /**
    * Check if a mouse button has been released
    * @returns {Boolean}
    */
    that.isMouseReleased = function () {
        return mouseReleased;
    };

    /**
     * Check if the debug button was pressed and if debug info should
     * be displayed.
     * @returns {Boolean}
     */
    that.isDebugActivated = function () {
        return debugActivated;
    };

    that.getName = function () {
        return name;
    };

    /**
    * Retrieve the mouse x position.
    * @returns {Number}
    */
    that.getMouseX = function () {
        return mouseX + currentState.camera.x;
    };

    /**
    * Retrieve the mouse y position.
    * @returns {Number}
    */
    that.getMouseY = function () {
        return mouseY + currentState.camera.y;
    };

    /**
    * Retrieve the mouse x position on the screen.
    * @returns {Number}
    */
    that.getMouseScreenX = function () {
        return mouseX;
    };

    /**
    * Retrieve the mouse y position on the screen.
    * @returns {Number}
    */
    that.getMouseScreenY = function () {
        return mouseY;
    };

    /**
    * Retrieve the chosen width of the game screen
    * @returns
    */
    that.getScreenWidth = function () {
        return screenWidth;
    };

    /**
    * Retrieve the chosen height of the game screen
    * @returns
    */
    that.getScreenHeight = function () {
        return screenHeight;
    };

    /**
    * Retrieve the current state of the game
    * @returns
    */
    that.getCurrentState = function () {
        return currentState;
    };

    return that;
}());
/**
 * Object representing a game object.
 * @author Simon Chauvin
 * @param {int} pZIndex specifies the z position of the game object.
 */
FM.gameObject = function (pZIndex) {
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
    that.scrollFactor = FM.vector(1, 1);
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
     * @param {objectType} pType the type to add.
     */
    that.addType = function (pType) {
        types.push(pType);
    };

    /**
     * Remove a type associated to this game object.
     * @param {objectType} pType the type to remove.
     */
    that.removeType = function (pType) {
        types.splice(types.indexOf(pType), 1);
    };

    /**
     * Check if this game object is associated to a given type.
     * @param {objectType} pType the type to look for.
     * @return {bool} whether the type specified is associated to this game
     * object or not.
     */
    that.hasType = function (pType) {
        return types.indexOf(pType) !== -1;
    };

    /**
     * Add a component to the game object.
     * @param {component} component the component to be added.
     */
    that.addComponent = function (component) {
        var name = component.name;
        if (!that.components[name]) {
            that.components[name] = component;
        }
    };

    /**
     * Retrive a particular component.
     * @param {componentTypes} type the component's type to be retrieved.
     * @return {component} the component retrieved.
     */
    that.getComponent = function (type) {
        return that.components[type];
    };

    /**
    * Destroy the game object.
    * Don't forget to remove it from the state too.
    * Better use the remove method from state.
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
     * Retrieve the types of the game object.
     * @return {Array} types of the game object.
     */
    that.getTypes = function () {
        return types;
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
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.keyboard = {
	BACKSPACE : 8,
	TAB : 9,
	ENTER : 13,
	SHIFT : 16,
	CTRL : 17,
	ALT : 18,
	PAUSE : 19,
	CAPS : 20,
	ESCAPE : 27,
	SPACE : 32,
	PAGE_UP : 33,
	PAGE_DOWN : 34,
	END : 35,
	HOME : 36,
	LEFT : 37,
	UP : 38,
	RIGHT : 39,
	DOWN : 40,
	INSERT : 45,
	DEL : 46,
	ZERO : 48,
	ONE : 49,
	TWO : 50,
	THREE : 51,
	FOUR : 52,
	FIVE : 53,
	SIX : 54,
	SEVEN : 55,
	EIGHT : 56,
	NINE : 57,
	A : 65,
	B : 66,
	C : 67,
	D : 68,
	E : 69,
	F : 70,
	G : 71,
	H : 72,
	I : 73,
	J : 74,
	K : 75,
	L : 76,
	M : 77,
	N: 78,
	O : 79,
	P : 80,
	Q : 81,
	R : 82,
	S : 83,
	T : 84,
	U : 85,
	V : 86,
	W : 87,
	X : 88,
	Y : 89,
	Z : 90,
        lLEFT_SPECIAL : 91,
        RIGHT_SPECIAL : 92,
        SELECT : 93,
        NUM_ZERO : 96,
        NUM_ONE : 97,
        NUM_TWO : 98,
        NUM_THREE : 99,
        NUM_FOUR : 100,
        NUM_FIVE : 101,
        NUM_SIX : 102,
        NUM_SEVEN : 103,
        NUM_EIGHT : 104,
        NUM_NINE : 105,
        MULTIPLY : 106,
        ADD : 107,
        SUBSTRACT : 109,
        DECIMAL_POINT : 110,
        DIVIDE : 111,
        F1 : 112,
        F2 : 113,
        F3 : 114,
        F4 : 115,
        F5 : 116,
        F6 : 117,
        F7 : 118,
        F8 : 119,
        F9 : 120,
        F10 : 121,
        F11 : 122,
        F12 : 123,
        NUM_LOCK : 144,
        SCROLL_LOCK : 145,
        SEMICOLON : 186,
        EQUAL_SIGN : 187,
        COMMA : 188,
        DASH : 189,
        PERIOD : 190,
        FORWARD_SLASH : 191,
        GRAVE_ACCENT : 192,
        OPEN_BRACKET : 219,
        BACK_SLASH : 220,
        CLOSE_BRACKET : 221,
        SINGLE_QUOTE : 222
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.math = {
    addVectors: function (vec1, vec2) {
        return FM.vector(vec1.x + vec2.x, vec1.y + vec2.y);
    },
    substractVectors: function (vec1, vec2) {
        return FM.vector(vec1.x - vec2.x, vec1.y - vec2.y);
    },
    multiplyVectors: function (vec1, vec2) {
        return FM.vector(vec1.x * vec2.x, vec1.y * vec2.y);
    },
    clamp: function(val, min, max) {
        return Math.min(max, Math.max(min, val));
    },
};
/**
 * @class objectType
 * Class that represents a type of game object.
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
            collision = null;
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
                        collision = physic.overlapsWithObject(otherPhysic);
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
            collision = null;
        if (physic) {
            for (i = 0; i < gameObjects.length; i = i + 1) {
                otherGameObject = gameObjects[i];
                otherPhysic = otherGameObject.components[FM.componentTypes.PHYSIC];
                if (otherPhysic && pGameObject.getId() !== otherGameObject.getId() && otherGameObject.hasType(that)) {
                    collision = physic.overlapsWithObject(otherPhysic);
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
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param width
 * @param height
 * @returns {___that0}
 */
FM.rectangle = function (pX, pY, pWidth, pHeight) {
    "use strict";
    var that = {};
    /**
     * x position.
     */
    that.x = pX;
    /**
     * y position.
     */
    that.y = pY;
    /**
     * Width of the rectangle.
     */
    that.width = pWidth;
    /**
     * Height of the rectangle.
     */
    that.height = pHeight;

    /**
    * Destroy the rectangle and its objects.
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
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
                //Add physic objects in the quad tree
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
                    //spatial.previous.copy(spatial.position);
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
            emitter,
            newOffset,
            frameWidth,
            frameHeight,
            xPosition,
            yPosition,
            farthestXPosition,
            farthestYPosition;
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
                //Update scrolling
                if (physic) {
                    if (scroller === gameObject) {
                        frameWidth = followFrame.width;
                        frameHeight = followFrame.height;
                        xPosition = spatial.position.x + physic.offset.x;
                        yPosition = spatial.position.y + physic.offset.y;
                        farthestXPosition = xPosition + physic.width;
                        farthestYPosition = yPosition + physic.height;

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
                //Update the game object
                if (gameObject.update) {
                    gameObject.update(dt);
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
                    spatial.previous.copy(spatial.position);
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
/**
 * Under Creative Commons Licence
 * No need to add the tilemap to the state, it's done when the tilemap is 
 * loaded.
 * By default a tilemap does not collide to anything.
 * @param {imageAsset} tileSet  Image of the tile set in the order of 
 * the data given
 * @author Simon Chauvin
 */
FM.tileMap = function (pTileSet, pWidth, pHeight, pTileWidth, pTileHeight, pTypes, pZIndex, pCollide) {
    "use strict";
    var that = {},
        /**
         * Array containing the IDs of tiles.
         */
        data = [],
        /**
         * Image of the tile set.
         */
        tileSet = pTileSet,
        /**
         * Width of the map, in columns.
         */
        width = pWidth,
        /**
         * Height of the map, in lines.
         */
        height = pHeight,
        /**
         * Width of a tile.
         */
        tileWidth = pTileWidth,
        /**
         * Height of a tile.
         */
        tileHeight = pTileHeight,
        /**
         * Types the tile map is associated to.
         */
        types = pTypes,
        /**
         * z-index of the tilemap.
         */
        zIndex = pZIndex,
        /**
         * Allow collisions or not with this tile map.
         */
        collide = pCollide;

    /**
     * Load the tilemap.
     * @param {Array} data  Comma and line return sparated string of numbers 
     * representing the position and type of tiles.
     */
    that.load = function (pData) {
        var rows = pData.split("\n"),
            row = null,
            resultRow = null,
            columns = null,
            gid = null,
            tile = null,
            state = FM.game.getCurrentState(),
            spatial,
            renderer,
            xOffset,
            yOffset,
            i,
            j,
            n;
        for (i = 0; i < rows.length; i = i + 1) {
            row = rows[i];
            if (row) {
                resultRow = [];
                columns = row.split(",", width);
                for (j = 0; j < columns.length; j = j + 1) {
                    gid = parseInt(columns[j]);
                    if (gid > 0) {
                        tile = FM.gameObject(zIndex);
                        for (n = 0; n < pTypes.length; n = n + 1) {
                            tile.addType(pTypes[n]);
                        }
                        spatial = FM.spatialComponent(j * tileWidth, i * tileHeight, tile);
                        renderer = FM.spriteRendererComponent(tileSet, tileWidth, tileHeight, tile);
                        //Select the right tile in the tile set
                        xOffset = gid * tileWidth;
                        yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                        if (xOffset >= tileSet.width) {
                            yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                            xOffset = (xOffset % tileSet.width);
                        }
                        renderer.setOffset(xOffset, yOffset);
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
                data.push(resultRow);
            }
        }
    };

    /**
     * Allow collisions for this tile map.
     */
    that.allowCollisions = function () {
        collide = true;
    };

    /**
     * Prevent collisions for this tile map.
     */
    that.preventCollisions = function () {
        collide = false;
    };

    /**
    * Destroy the tile map and its objects.
    */
    that.destroy = function () {
        data = null;
        tileSet = null;
        that = null;
    };

    /**
     * Check if this tile map can collide.
     * @return {Boolean} whether this tile map can collide or not.
     */
    that.canCollide = function () {
        return collide;
    };

    /**
     * Check if this tile map has a specified type.
     * @return {Boolean} whether this tile map has the given type or not.
     */
    that.hasType = function (pType) {
        return types.indexOf(pType) !== -1;
    };

    /**
     * Retrive the 2D array of tile IDs.
     */
    that.getData = function () {
        return data;
    };

    /**
     * Retrive the tile set.
     */
    that.getTileSet = function () {
        return tileSet;
    };

    /**
     * Retrieve the tile ID associated to a given position.
     */
    that.getTileId = function (x, y) {
        return data[Math.floor(y / tileHeight)][Math.floor(x / tileWidth)];
    };

    /**
     * Get the width of the map.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Get the height of the map.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Get the width of a tile.
     */
    that.getTileWidth = function () {
        return tileWidth;
    };

    /**
     * Get the height of a tile.
     */
    that.getTileHeight = function () {
        return tileHeight;
    };

    /**
     * Get the z-index of the map.
     */
    that.getZIndex = function () {
        return zIndex;
    };

    return that;
};
/**
 * Object representing a vector.
 * @author Simon Chauvin
 * @param {int} pX x position.
 * @param {int} pY y position.
 */
FM.vector = function (pX, pY) {
    "use strict";
    var that = {};

    /**
     * x position.
     */
    that.x = pX === 'undefined' ? 0 : pX;
    /**
     * y position.
     */
    that.y = pY === 'undefined' ? 0 : pY;

    /**
     * Add the specified vector to the current one;
     */
    that.add = function (vector) {
        that.x += vector.x;
        that.y += vector.y;
        return that;
    };
    /**
     * Substract the specified vector from the current one;
     */
    that.substract = function (vector) {
        that.x -= vector.x;
        that.y -= vector.y;
        return that;
    };
    /**
     * Multiply the current vector by the one specified;
     */
    that.multiply = function (vector) {
        that.x *= vector.x;
        that.y *= vector.y;
        return that;
    };
    /**
     * Dot operation on the current vector and the specified one;
     */
    that.dotProduct = function (vector) {
        return (that.x * vector.x + that.y * vector.y);
    };
    /**
     * Calculate the cross product of the current vector and another vector.
     * @param {Vector2D} vector A vector.
     * @return {Number} The cross product.
    */
    that.crossProd = function(vector) {
        return that.x * vector.y - that.y * vector.x;
    }
    /**
     * Reset the vector the specified values.
     */
    that.reset = function (pX, pY) {
        that.x = typeof pX === 'undefined' ? 0 : pX;
        that.y = typeof pY === 'undefined' ? 0 : pY;
        return that;
    };
    /**
     * Return length of the vector;
     */
    that.getLength = function () {
        return Math.sqrt((that.x * that.x) + (that.y * that.y));
    };
    /**
     * Return length of the vector;
     */
    that.getLengthSquared = function () {
        return (that.x * that.x) + (that.y * that.y);
    };
    /**
     * Normalize the vector.
     */
    that.normalize = function () {
        var vlen = that.getLength();
        that.x = that.x / vlen;
        that.y = that.y / vlen;
    };
    /**
     * Copy the given vector to the current one.
     */
    that.copy = function(vector) {
        that.x = vector.x;
        that.y = vector.y;
        return that;
    };
    /**
     * Clone the current vector.
     */
    that.clone = function() {
        return new FM.vector(that.x, that.y);
    };
    /**
     * Check if the current vector is equals to the specified one;
     */
    that.isEquals = function (vector) {
        return (that.x === vector.x && that.y === vector.y);
    };

    /**
    * Destroy the point and its objects.
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
/**
 * World represent the concrete space of the game.
 * @author Simon Chauvin
 */
FM.world = function (pWidth, pHeight) {
    "use strict";
    var that = FM.rectangle(0, 0, pWidth, pHeight),
        /**
         * Tile maps of the world.
         */
        tileMaps = [];

    /**
     * Add a tile map to the current world.
     * @param {tileMap} pTileMap tile map to add.
     */
    that.loadTileMap = function (pTileMap, pMap, pLayerName, pTileSetName) {
        pTileMap.load(pMap.getLayer(pLayerName).toCsv(pMap.getTileSet(pTileSetName)));
        tileMaps.push(pTileMap);
    };

    /**
     * Retrieve the tile map from the given type.
     * @param {objectType} pType the type of the tile map to retrieve.
     * @return {tileMap} the tile map corresponding to the given type.
     */
    that.getTileMapFromType = function (pType) {
        var i, tileMap;
        for (i = 0; i < tileMaps.length; i = i + 1) {
            tileMap = tileMaps[i];
            if (tileMap.hasType(pType)) {
                return tileMap;
            }
        }
        return null;
    };

    /**
     * Check if a tile map allow collisions.
     * @return {Boolean} Whether there is a tile map with potential collisions.
     */
    that.hasTileCollisions = function () {
        var i;
        for (i = 0; i < tileMaps.length; i = i + 1) {
            if (tileMaps[i].canCollide()) {
                return true;
            }
        }
        return false;
    };

    /**
    * Destroy the world and its objects
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
/**
 * Object representing a collision between two objects.
 * @author Simon Chauvin
 */
FM.collision = function (pObjectA, pObjectB) {
    "use strict";
    var that = {};

    /**
     * Object A.
     */
    that.a = pObjectA === 'undefined' ? null : pObjectA;
    /**
     * Object B.
     */
    that.b = pObjectB === 'undefined' ? null : pObjectB;
    /**
     * How much the two objects penetrates one another.
     */
    that.penetration = 0.0;
    /**
     * Normal of the collision, starting at the center of object a and ending
     * in the center of the object b.
     */
    that.normal = null;

    /**
    * Destroy the manifold and its objects.
    */
    that.destroy = function () {
        that.normal = null;
        that = null;
    };

    return that;
};
/**
 * Top level object shared by every components.
 * The component is automatically added to the game object specified as owner.
 * @author Simon Chauvin
 * @param {String} pComponentType type of the component to add.
 * @param {gameObject} pComponentOwner game object that owns the component.
 */
FM.component = function (pComponentType, pComponentOwner) {
    "use strict";
    var that = {};
    if (pComponentOwner) {
        if (pComponentOwner.components !== undefined) {
            /**
             * Component's name.
             */
            that.name = pComponentType;
            /**
             * Component's owner.
             */
            that.owner = pComponentOwner;
        } else {
            if (FM.parameters.debug) {
                console.log("ERROR: the owner of the " + pComponentType
                        + " component must be a gameObject.");
            }
        }
    } else {
        if (FM.parameters.debug) {
            console.log("ERROR: a owner game object must be specified.");
        }
    }

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        that.name = null;
        that.owner = null;
        that = null;
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.audioAsset = function (pName, pPath) {
    "use strict";
    var that = new Audio(),

        /**
         * Name of the given to the asset.
         */
        name = pName,
        /**
         * Path to the audio file.
         */
        path = pPath,
        /**
         * Extension of the audio file.
         */
        extension = path.substring(path.lastIndexOf('.') + 1),
        /**
         * Specify the loading state of the audio file.
         */
        loaded = false,
        /**
         * Fired when the audio file has finished loading.
         */
        loadComplete = function () {
            loaded = true;
            FM.assetManager.assetLoaded();
        };

    /**
     * Load the audio file.
     */
    that.load = function () {
        that.src = path;

        that.addEventListener("loadeddata", loadComplete, false);
    };

    /**
     * Check if this audio file has been loaded.
     */
    that.isLoaded = function () {
        return loaded;
    };

    /**
    * Destroy the asset and its objects
    */
    that.destroy = function () {
        name = null;
        path = null;
        that = null;
    };

    /**
     * Get the name of the asset.
     */
    that.getName = function () {
        return name;
    };

    /**
     * Get the path to the audio file.
     */
    that.getPath = function () {
        return path;
    };

    /**
     * Check if the audio format is supported by the browser.
     */
    that.isSupported = function () {
        var canPlayThisType = false;
        if (extension === "wav") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/wav; codecs="1"') !== "";
        } else if (extension === "ogg") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/ogg; codecs="vorbis"') !== "";
        } else if (extension === "mp3") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/mpeg;') !== "";
        } else if (extension === "aac") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/mp4; codecs="mp4a.40.2"') !== "";
        }
        return canPlayThisType;
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.fileAsset = function (pName, pPath) {
    "use strict";
    var that = new XMLHttpRequest(),
        /**
         * Name of the asset.
         */
        name = pName,
        /**
         * Path of the file.
         */
        path = pPath,
        /**
         * Content of the file.
         */
        content = null,
        /**
         * Specify the loading state of the file.
         */
        loaded = false,
        /**
         * Fired when the loading is complete.
         */
        loadComplete = function () {
            loaded = true;
            content = that.responseText;
            FM.assetManager.assetLoaded();
        };

    /**
     * Load the file.
     */
    that.load = function () {
        that.addEventListener("load", loadComplete, false);
        that.open("GET", path, false);
        that.send();
    };

    /**
     * Check if this file has been loaded.
     */
    that.isLoaded = function () {
        return loaded;
    };

    /**
    * Destroy the asset and its objects
    */
    that.destroy = function () {
        name = null;
        path = null;
        content = null;
        that = null;
    };

    /**
     * Get the name of the file.
     */
    that.getName = function () {
        return name;
    };

    /**
     * Get the path to the file.
     */
    that.getPath = function () {
        return path;
    };

    /**
     * Get the content of the file.
     */
    that.getContent = function () {
        return content;
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.imageAsset = function (pName, pPath) {
    "use strict";
    var that = new Image(),

        /**
         * Name of the given to the asset.
         */
        name = pName,
        /**
         * Path to the image file.
         */
        path = pPath,
        /**
         * Specify the loading state of the image.
         */
        loaded = false,
        /**
         * Fired when the image has finished loading.
         */
        loadComplete = function () {
            loaded = true;
            FM.assetManager.assetLoaded();
        };

    /**
     * Load the image.
     */
    that.load = function () {
        that.src = path;

        that.addEventListener("load", loadComplete, false);
    };

    /**
     * Check if this image has been loaded.
     */
    that.isLoaded = function () {
        return loaded;
    };

    /**
    * Destroy the asset and its objects
    */
    that.destroy = function () {
        name = null;
        path = null;
        that = null;
    };

    /**
     * Get the name of the asset.
     */
    that.getName = function () {
        return name;
    };

    /**
     * Get the path to the image file.
     */
    that.getPath = function () {
        return path;
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * preloader is used to set the preload page
 * You can create a custom preloader extending this one and providing it to 
 * the init function of game object.
 * 
 */
FM.preloader = function (pFirstState) {
    "use strict";
    var that = Object.create(FM.state()),
    /**
     * Screen width
     */
    screenWidth,
    /**
     * Screen height
     */
    screenHeight;

    /**
     * Init the preloader.
     */
    that.init = function () {
        Object.getPrototypeOf(that).init();

        //Retrieve the screen width and height
        screenWidth = FM.game.getScreenWidth();
        screenHeight = FM.game.getScreenHeight();
    };

    /**
     * Update the preloader.
     */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

        //If all the assets are loaded then start the first state
        var assetManager = FM.assetManager;
        if (assetManager.assets.length === 0 || assetManager.areAllAssetsLoaded()) {
            FM.game.switchState(pFirstState());
        }
    };

    /**
     * Draw on the preloader state.
     * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
     * drawing is done.
     * @param {float} dt time in seconds since the last frame.
     */
    that.draw = function (bufferContext, dt) {
        Object.getPrototypeOf(that).draw(bufferContext, dt);

        //Update the value of the loading text
        bufferContext.fillStyle = '#fff';
        bufferContext.font = '30px sans-serif';
        bufferContext.textBaseline = 'middle';
        bufferContext.fillText(Math.ceil(FM.assetManager.loadingProgress) + "%", screenWidth / 2, screenHeight / 2);
    };

    return that;
};
/**
 * 
 */
FM.quadTree = function (pLevel, pBounds) {
    "use strict";
    var that = {},
        /**
         * 
         */
        MAX_OBJECTS = 10,
        /**
         * 
         */
        MAX_LEVELS = 5,
        /**
         * 
         */
        level = pLevel,
        /**
         * 
         */
        objects = [],
        /**
         * 
         */
        bounds = pBounds,
        /**
         * 
         */
        nodes = [],
        /**
         * Determine which node the object belongs to. -1 means
         * object cannot completely fit within a child node and is part
         * of the parent node.
         */
        getIndex = function (gameObject) {
            var index = -1,
                spatial = gameObject.components[FM.componentTypes.SPATIAL],
                physic = gameObject.components[FM.componentTypes.PHYSIC],
                verticalMidpoint = bounds.x + (bounds.width / 2),
                horizontalMidpoint = bounds.y + (bounds.height / 2),
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
         },
         /*
          * Splits the node into 4 subnodes.
          */
         split = function () {
             var subWidth = bounds.width / 2,
                 subHeight = bounds.height / 2,
                 x = bounds.x,
                 y = bounds.y;
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x + subWidth, y, subWidth, subHeight)));
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x, y, subWidth, subHeight)));
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x, y + subHeight, subWidth, subHeight)));
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x + subWidth, y + subHeight, subWidth, subHeight)));
         };

    /*
     * Insert the object into the quadtree. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    that.insert = function (gameObject) {
        if (nodes.length > 0) {
            var index = getIndex(gameObject);
            if (index !== -1) {
                nodes[index].insert(gameObject);
                return;
            }
        }
        objects.push(gameObject);
        if (objects.length > MAX_OBJECTS && level < MAX_LEVELS) {
            if (nodes.length === 0) {
                split();
            }
            var i = 0, index;
            while (i < objects.length) {
                index = getIndex(objects[i]);
                if (index !== -1) {
                    nodes[index].insert(objects.splice(i, 1)[0]);
                } else {
                    i = i + 1;
                }
            }
        }
    };

    /*
     * Return all objects that could collide with the given object.
     */
    that.retrieve = function (gameObject) {
        var returnObjects = [];
        var index = getIndex(gameObject);
        if (index !== -1 && nodes.length > 0) {
            returnObjects = nodes[index].retrieve(gameObject);
        }
        var i;
        for (i = 0; i < objects.length; i = i + 1) {
            returnObjects.push(objects[i]);
        }
        return returnObjects;
    };

    /**
     * Clears the quadtree.
     */
    that.clear = function () {
        objects = [];
        var i;
        for (i = 0; i < nodes.length; i = i + 1) {
            if (nodes[i]) {
                nodes[i].clear();
                nodes[i] = null;
            }
        }
        nodes = [];
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {
            "use strict";
        };
        F.prototype = o;
        return new F();
    };
}

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

FM.includeJsFile = function (filename) {
    "use strict";
    var head = document.getElementsByTagName("head")[0],
        script = document.createElement("script");
    script = document.createElement("script");
    script.src = filename;
    script.type = "text/javascript";

    head.appendChild(script);
}
/**
 * 
 */
FM.tmxLayer = function () {
    "use strict";
    var that = {};
    that.map;
    that.name;
    that.x;
    that.y;
    that.width;
    that.height;
    that.opacity;
    that.visible;
    that.tileGids = [];
    that.properties = null;

    /**
     * 
     */
    that.load = function (layerNode, parent) {
        that.map = parent;
        that.name = layerNode.getAttribute("name");
        that.x = parseInt(layerNode.getAttribute("x")); 
        that.y = parseInt(layerNode.getAttribute("y")); 
        that.width = parseInt(layerNode.getAttribute("width")); 
        that.height = parseInt(layerNode.getAttribute("height")); 
        that.visible = !layerNode.getAttribute("visible") 
                        || (layerNode.getAttribute("visible") !== 0);
        that.opacity = parseInt(layerNode.getAttribute("opacity"));

        var properties = layerNode.getElementsByTagName("properties")[0],
            data = layerNode.getElementsByTagName("data")[0],
            tiles = data.getElementsByTagName("tile"),
            property,
            tile,
            i;
        //Load properties
        if (properties) {
            for (i = 0; i < properties.childNodes.length; i++) {
                if (properties.hasChildNodes() === true) {
                    property = properties.childNodes[i];
                    if (property.nodeType === 1) {
                        if (that.properties) {
                            that.properties.add(property);
                        } else {
                            that.properties = FM.tmxPropertySet();
                            that.properties.add(property);
                        }
                    }
                }
            }
        }
        //Load tile GIDs
        if (data) {
            var chunk = "",
                lineWidth = that.width,
                rowIdx = -1,
                gid;
            if (!data.getAttribute("encoding") || (data.getAttribute("encoding") && data.getAttribute("encoding").length === 0)) {
                //Create a 2dimensional array
                for (i = 0; i < tiles.length; i = i + 1) {
                    tile = tiles[i];
                    //new line?
                    if (++lineWidth >= that.width) {
                        that.tileGids[++rowIdx] = [];
                        lineWidth = 0;
                    }
                    gid = tile.getAttribute("gid");
                    that.tileGids[rowIdx].push(gid);
                }
            } else if (data.getAttribute("encoding") === "csv") {
                chunk = data.childNodes[0].nodeValue;
                that.tileGids = that.csvToArray(chunk, that.width);
            } else if (data.getAttribute("encoding") === "base64") {
                console.log("ERROR: TmxLoader, use XML or CSV export.");
            }
        }
    };

    /**
     * 
     */
    that.toCsv = function (tileSet) {
        var max = 0xFFFFFF,
            offset = 0,
            result = "",
            row = null,
            chunk = "",
            id = 0,
            i,
            j;
        if (tileSet) {
            offset = tileSet.firstGID;
            max = tileSet.numTiles - 1;
        }
        for (i = 0; i < that.tileGids.length; i = i + 1) {
            row = that.tileGids[i];
            chunk = "";
            id = 0;
            for (j = 0; j < row.length; j = j + 1) {
                id = row[j];
                id -= offset;
                if(id < 0 || id > max) {
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
     * 
     */
    that.csvToArray = function (input, lineWidth) {
        var result = [],
            rows = input.split("\n"),
            row = null,
            resultRow = null,
            entries = null,
            i,
            j;
        for (i = 0; i < rows.length; i = i + 1) {
            row = rows[i];
            if (row) {
                resultRow = [];
                entries = row.split(",", lineWidth);
                for (j = 0; j < entries.length; j = j + 1) {
                    resultRow.push(entries[j]);
                }
                result.push(resultRow);
            }
        }
        return result;
    };

    return that;
};/**
 * 
 */
FM.tmxMap = function () {
    "use strict";
    var that = {},
        /**
         * 
         */
        map = null;
    /**
     * 
     */
    that.version = "unknown";
    /**
     * 
     */
    that.orientation = "orthogonal";
    /**
     * 
     */
    that.width = 0;
    /**
     * 
     */
    that.height = 0;
    /**
     * 
     */
    that.tileWidth = 0;
    /**
     * 
     */
    that.tileHeight = 0;
    /**
     * 
     */
    that.properties = null;
    /**
     * 
     */
    that.layers = [];
    /**
     * 
     */
    that.tileSets = [];
    /**
     * 
     */
    that.objectGroups = [];

    /**
     * 
     */
    that.load = function (source) {
        var xmlDoc, parser;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(source, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(source); 
        }

        map = xmlDoc.getElementsByTagName("map")[0];
        that.version = map.getAttribute("version") || "unknown";
        that.orientation = map.getAttribute("orientation") || "orthogonal";
        that.width = parseInt(map.getAttribute("width"));
        that.height = parseInt(map.getAttribute("height"));
        that.tileWidth = parseInt(map.getAttribute("tilewidth"));
        that.tileHeight = parseInt(map.getAttribute("tileheight"));

        var properties = map.getElementsByTagName("properties")[0],
            tileSets = map.getElementsByTagName("tileset"),
            layers = map.getElementsByTagName("layer"),
            objectGroups = map.getElementsByTagName("objectgroup"),
            property,
            tileSet,
            layer,
            objectGroup,
            i;
        //Load properties
        if (properties) {
            for (i = 0; i < properties.childNodes.length; i++) {
                if (properties.hasChildNodes() === true) {
                    property = properties.childNodes[i];
                    if (property.nodeType === 1) {
                        if (that.properties) {
                            that.properties.add(property);
                        } else {
                            that.properties = FM.tmxPropertySet();
                            that.properties.add(property);
                        }
                    }
                }
            }
        }
        //Load tilesets
        if (tileSets) {
            for (i = 0; i < tileSets.length; i++) {
                tileSet = tileSets[i];
                that.tileSets[tileSet.getAttribute("name")] = FM.tmxTileSet();
                that.tileSets[tileSet.getAttribute("name")].load(tileSet, that);
            }
        }
        //Load layer
        if (layers) {
            for (i = 0; i < layers.length; i++) {
                layer = layers[i];
                that.layers[layer.getAttribute("name")] = FM.tmxLayer();
                that.layers[layer.getAttribute("name")].load(layer, that);
            }
        }
        //Load object group
        if (objectGroups) {
            for (i = 0; i < objectGroups.length; i++) {
                objectGroup = objectGroups[i];
                that.objectGroups[objectGroup.getAttribute("name")] = FM.tmxObjectGroup();
                that.objectGroups[objectGroup.getAttribute("name")].load(objectGroup, that);
            }
        }
    };

    /**
     * 
     */
    that.getTileSet = function (name) {
        return that.tileSets[name];
    };

    /**
     * 
     */
    that.getLayer = function (name) {
        return that.layers[name];
    };

    /**
     * 
     */
    that.getObjectGroup = function (name) {
        return that.objectGroups[name];	
    };			

    /**
     * works only after TmxTileSet has been initialized with an image...
     */
    that.getGidOwner = function (gid) {
        var last = null;
        for (var tileSet in that.tileSets)
        {
            if(tileSet.hasGid(gid))
                return tileSet;
        }
        return null;
    };

    return that;
};/**
 * 
 */
FM.tmxObject = function (objectNode, parent) {
    "use strict";
    var that = {};
    /**
     * 
     */
    that.group = parent;
    that.name = objectNode.getAttribute("name");
    that.type = objectNode.getAttribute("type");
    that.x = parseInt(objectNode.getAttribute("x"));
    that.y = parseInt(objectNode.getAttribute("y"));
    that.width = parseInt(objectNode.getAttribute("width"));
    that.height = parseInt(objectNode.getAttribute("height"));
    //resolve inheritence
    that.shared = null;
    that.gid = -1;
    if (objectNode.getAttribute("gid") && objectNode.getAttribute("gid").length !== 0) {
        that.gid = parseInt(objectNode.getAttribute("gid"));
        var tileSets = that.group.map.tileSets,
            tileSet,
            i;
        if (tileSets) {
            for (i = 0; i < tileSets.length; i = i + 1) {
                tileSet = tileSets[i];
                that.shared = tileSet.getPropertiesByGid(that.gid);
                if (that.shared) {
                    break;
                }
            }
        }
    }

    //Load properties
    var properties = objectNode.getElementsByTagName("properties")[0],
        property,
        i;
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (that.custom) {
                        that.custom.add(property);
                    } else {
                        that.custom = FM.tmxPropertySet();
                        that.custom.add(property);
                    }
                }
            }
        }
    }

    return that;
};/**
 * 
 */
FM.tmxObjectGroup = function () {
    "use strict";
    var that = {};
    /**
     * 
     */
    that.map;
    that.name;
    that.x;
    that.y;
    that.width;
    that.height;
    that.opacity;
    that.visible;
    that.properties = null;
    that.objects = [];

    that.load = function (objectGroupNode, parent) {
        that.map = parent;
        that.name = objectGroupNode.getAttribute("name");
        that.x = parseInt(objectGroupNode.getAttribute("x"));
        that.y = parseInt(objectGroupNode.getAttribute("y"));
        that.width = parseInt(objectGroupNode.getAttribute("width"));
        that.height = parseInt(objectGroupNode.getAttribute("height"));
        that.visible = !objectGroupNode.getAttribute("visible")
            || (objectGroupNode.getAttribute("visible") !== 0);
        that.opacity = parseInt(objectGroupNode.getAttribute("opacity"));

        var properties = objectGroupNode.getElementsByTagName("properties")[0],
            objects = objectGroupNode.getElementsByTagName("object"),
            property,
            object,
            i;
        //Load properties
        if (properties) {
            for (i = 0; i < properties.childNodes.length; i = i + 1) {
                if (properties.hasChildNodes() === true) {
                    property = properties.childNodes[i];
                    if (property.nodeType === 1) {
                        if (that.properties) {
                            that.properties.add(property);
                        } else {
                            that.properties = FM.tmxPropertySet();
                            that.properties.add(property);
                        }
                    }
                }
            }
        }
        //Load objects
        if (objects) {
            for (i = 0; i < objects.length; i = i + 1) {
                object = objects[i];
                that.objects.push(FM.tmxObject(object, that));
            }
        }
    };

    return that;
};/**
 * 
 */
FM.tmxPropertySet = function () {
    "use strict";
    var that = [];

    /**
     * 
     */
    that.add = function (propertyNode) {
        var key = propertyNode.getAttribute("name"),
            value = propertyNode.getAttribute("value");
        that[key] = value;
    };

    return that;
};/**
 * 
 */
FM.tmxTileSet = function () {
    "use strict";
    var that = {},
        tileProperties = [],
        image = null;

    that.firstGID = 0;
    that.map;
    that.name;
    that.tileWidth;
    that.tileHeight;
    that.spacing;
    that.margin;
    that.imageSource;

    //available only after immage has been assigned:
    that.numTiles = 0xFFFFFF;
    that.numRows = 1;
    that.numCols = 1;

    /**
     * 
     * @param {type} tileSetNode
     * @param {type} parent
     */
    that.load = function (tileSetNode, parent) {
        that.map = parent;
        that.firstGID = parseInt(tileSetNode.getAttribute("firstgid"));
        that.imageSource = tileSetNode.getElementsByTagName("image")[0].getAttribute("source");
        that.name = tileSetNode.getAttribute("name");
        that.tileWidth = parseInt(tileSetNode.getAttribute("tilewidth"));
        that.tileHeight = parseInt(tileSetNode.getAttribute("tileheight"));
        that.spacing = parseInt(tileSetNode.getAttribute("spacing"));
        that.margin = parseInt(tileSetNode.getAttribute("margin"));

        //Load properties
        var tiles = tileSetNode.getElementsByTagName("tile"),
            tile,
            properties,
            property,
            i,
            j;
        if (tiles) {
            for (i = 0; i < tiles.length; i++) {
                tile = tiles[i];
                properties = tile.getElementsByTagName("properties")[0];
                if (properties) {
                    for (j = 0; j < properties.childNodes.length; j++) {
                        if (properties.hasChildNodes() === true) {
                            property = properties.childNodes[j];
                            if (property.nodeType === 1) {
                                tileProperties[tile.getAttribute("id")] = FM.tmxPropertySet();
                                tileProperties[tile.getAttribute("id")].add(property);
                            }
                        }
                    }
                }
            }
        }
    };

    that.getImage = function () {
        return image;
    };

    that.setImage = function (pImage) {
        image = pImage;
        //TODO: consider spacing & margin
        that.numCols = Math.floor(image.width / that.tileWidth);
        that.numRows = Math.floor(image.height / that.tileHeight);
        that.numTiles = that.numRows * that.numCols;
    };

    that.hasGid = function (gid) {
        return (gid >= that.firstGID) && (gid < that.firstGID + that.numTiles);
    };

    that.fromGid = function (gid) {
        return gid - that.firstGID;
    };

    that.toGid = function (id) {
        return that.firstGID + id;
    };

    that.getPropertiesByGid = function (gid) {
        return tileProperties[gid - that.firstGID];
    };

    that.getProperties = function (id) {
        return tileProperties[id];
    };

    that.getRect = function (id) {
        //TODO: consider spacing & margin
        return new FM.rectangle(0, 0, (id % that.numCols) * that.tileWidth, (id / that.numCols) * that.tileHeight);
    };

    return that;
};/**
 * The emitter component is used for the emission of particles. 
 * object.
 * @author Simon Chauvin
 */
FM.emitterComponent = function (pOffset, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.FX, pOwner),
        /**
         * Particles belonging to this emitter.
         */
        particles = [],
        /**
         * Offset from the owner.
         */
        offset = pOffset,
        /**
         * Directions the particles can take.
         */
        directions = [FM.parameters.LEFT, FM.parameters.RIGHT, FM.parameters.UP, FM.parameters.DOWN],
        /**
         * Limit of particles that this emitter can bear.
         * 0 means an infinite number.
         */
        maxParticles = 0,
        /**
         * Frequency of particle emission.
         */
        frequency = 0.1,
        /**
         * Quantity of particles to emit.
         */
        quantity = 0,
        /**
         * Transparency of the particles.
         */
        alpha = 1,
        /**
         * Minimum velocity of all particles.
         */
        minParticleVelocity = FM.vector(-100, -100),
        /**
         * Maximum velocity of all particles.
         */
        maxParticleVelocity = FM.vector(100, 100),
        /**
         * Minimum angular velocity of all particles.
         */
        minParticleAngularVelocity = -100,
        /**
         * Maximum angular velocity of all particles.
         */
        maxParticleAngularVelocity = 100,
        /**
         * Whether the emitter is active or not.
         */
        active = false,
        /**
         * Timer for the emission at the right frequency.
         */
        timer = 0,
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    /**
     * Check if a spatial component is present.
     */
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Add a particle to this emitter.
     * @param {fmParticle} particle particle to add to the emitter.
     * @return {fmParticle} the particle added.
     */
    that.add = function (particle) {
        particles.push(particle);
        return particle;
    };

    /**
     * Add particles to this emitter.
     * @param {int} number number of particles to create.
     * @param {imageAsset} image image to use as a particle.
     * @param {int} width width of the particles.
     * @param {int} height height of the particles.
     * @param {float} pAlpha transparency of the particles.
     * @param {int} zIndex z depth of the particles.
     */
    that.createParticles = function (number, image, width, height, pAlpha, zIndex) {
        var i, particle, spatial, renderer, physic,
            state = FM.game.getCurrentState();
        alpha = pAlpha;
        for (i = 0; i < number; i = i + 1) {
            particle = FM.gameObject(zIndex);
            spatial = FM.spatialComponent(spatial.position.x + offset.x, spatial.position.y + offset.y, particle);
            renderer = FM.spriteRendererComponent(image, width, height, particle);
            renderer.setAlpha(alpha);
            physic = FM.aabbComponent(width, height, particle);
            particle.age = 0;
            particle.lifeSpan = 0;
            particle.hide();
            particle.kill();
            state.add(particle);
            particles.push(particle);
        }
    };

    /**
     * Start emitting particles.
     * @param {float} lifeSpan time to live for each particle
     * @param {float} pFrequency time between each emission
     * @param {int} pQuantity number of particles to emit at each emission
     */
    that.emit = function (lifeSpan, pFrequency, pQuantity) {
        active = true;
        timer = 0;
        frequency = pFrequency;
        quantity = pQuantity;
        var i;
        for (i = 0; i < particles.length; i = i + 1) {
            particles[i].lifeSpan = lifeSpan;
        }
    };

    /**
     * Update the component.
     * * @param {float} dt time in seconds since the last frame.
     */
    that.update = function (dt) {
        if (active) {
            //Update alive particles
            var i, j, count, particle, particleSpatial, physic, renderer, speed;
            for (i = 0; i < particles.length; i = i + 1) {
                particle = particles[i];
                if (particle.isAlive()) {
                    //Check the age of the particle
                    if (particle.age >= particle.lifeSpan) {
                        particle.hide();
                        particle.kill();
                    } else {
                        //The more the particle is aging the less it is visible
                        renderer = particle.getComponent(FM.componentTypes.RENDERER);
                        if (renderer.getAlpha() >= 1 - (particle.age / particle.lifeSpan)) {
                            renderer.setAlpha(1 - (particle.age / particle.lifeSpan));
                        }
                        //Aging of the particle
                        particle.age += dt;
                    }
                }
            }
            //Emit new particles
            timer += dt;
            if (frequency === 0 || timer >= frequency) {
                timer = 0;
                count = 0;
                j = 0;
                //Emit the number of particles given by quantity
                while (count < quantity && j < particles.length) {
                    particle = particles[j];
                    //Reinit the particle
                    if (particle && !particle.isAlive()) {
                        particleSpatial = particle.getComponent(FM.componentTypes.SPATIAL);
                        physic = particle.components[FM.componentTypes.PHYSIC];
                        particle.components[FM.componentTypes.RENDERER].setAlpha(alpha);
                        particleSpatial.position.x = spatial.position.x + offset.x;
                        particleSpatial.position.y = spatial.position.y + offset.y;
                        particle.age = 0;
                        speed = Math.random() * (maxParticleVelocity.x - minParticleVelocity.x) + minParticleVelocity.x;
                        if (directions.indexOf(FM.parameters.LEFT) !== -1) {
                            if (Math.random() > 0.5) {
                                speed = -speed;
                            }
                        }
                        physic.velocity.x = speed;
                        speed = Math.random() * (maxParticleVelocity.y - minParticleVelocity.y) + minParticleVelocity.y;
                        if (directions.indexOf(FM.parameters.UP) !== -1) {
                            if (Math.random() > 0.5) {
                                speed = -speed;
                            }
                        }
                        physic.velocity.y = speed;
                        speed = Math.random() * (maxParticleAngularVelocity - minParticleAngularVelocity) + minParticleAngularVelocity;
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
     * @param {Array} pDirections directions the particles can take.
     */
    that.setDirections = function (pDirections) {
        directions = pDirections;
    };

    /**
     * Set the transparency of the particles.
     * @param {float} pAlpha transparency of the particles.
     */
    that.setAlpha = function (pAlpha) {
        alpha = pAlpha;
        var i;
        for (i = 0; i < particles.length; i = i + 1) {
            particles[i].components[FM.componentTypes.RENDERER].setAlpha(alpha);
        }
    };

    /**
     * Set the horizontal velocity of all particles.
     * @param {int} min minimum horizontal velocity of a particle.
     * @param {int} max maximum horizontal velocity of a particle.
     */
    that.setXVelocity = function (min, max) {
        minParticleVelocity.x = min;
        maxParticleVelocity.x = max;
    };

    /**
     * Set the vertical velocity of all particles.
     * @param {int} min minimum vertical velocity of a particle.
     * @param {int} max maximum vertical velocity of a particle.
     */
    that.setYVelocity = function (min, max) {
        minParticleVelocity.y = min;
        maxParticleVelocity.y = max;
    };

    /**
     * Set the rotation's speed of all particles.
     * @param {int} min minimum angular velocity of a particle.
     * @param {int} max maximum angular velocity of a particle.
     */
    that.setAngularVelocity = function (min, max) {
        minParticleAngularVelocity = min;
        maxParticleAngularVelocity = max;
    };

    /**
     * Retrieve the transparency of the particles.
     * @returns {float} current transparency of the particles.
     */
    that.getAlpha = function () {
        return alpha;
    };

    /**
     * Destroy the emitter component.
     */
    that.destroy = function () {
        particles = null;
        that = null;
    };

    return that;
};
/**
 * The simple path component allows to affect a path to follow to any game 
 * object.
 * @author Simon Chauvin
 */
FM.simplePathComponent = function (pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.PATHFINDING, pOwner),
        /**
         * Waypoints constituing the path.
         */
        waypoints = [],
        /**
         * Current index of the waypoint to reach.
         */
        currentIndex = 0,
        /**
         * Speed at which the game object should follow the path if it is a
         * movement with a coefficient equals to 1.
         */
        desiredSpeed = FM.vector(0, 0),
        /**
         * Speed at which the game object follow the path.
         */
        actualSpeed = FM.vector(0, 0),
        /**
         * Whether the path is being followed or not.
         */
        active = false,
        /**
         * Whether the desired x position of the current waypoint was reached.
         * or not.
         */
        xReached = false,
        /**
         * Whether the desired y position of the current waypoint was reached.
         * or not.
         */
        yReached = false,
        /**
         * Position before stopping following the path, used to know if the game
         * object following the path has been moved during the stopping time.
         */
        positionBeforeStopping = FM.vector(0, 0),
        /**
         * Factor modifying speed so that the movement is linear.
         */
        factor = 1,
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL],
        /**
         * Physic component reference.
         */
        physic = pOwner.components[FM.componentTypes.PHYSIC];
    /**
     * Check if the needed components are present.
     */
    if (FM.parameters.debug) {
        if (!spatial) {
            console.log("ERROR: No spatial component was added and you need one for using the path component.");
        }
        if (!physic) {
            console.log("ERROR: No physic component was added and you need one for using the path component.");
        }
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Follow the specified path.
     * @param {int} pSpeed speed at which the game object must follow the path.
     */
    that.startFollowingPath = function (pSpeed, pIndexToStartFrom) {
        if (waypoints.length > 0) {
            active = true;
            currentIndex = pIndexToStartFrom || 0;
            xReached = false;
            yReached = false;
            desiredSpeed = pSpeed;
            //Adjust speed so that the movement is linear
            var xDiff =  Math.abs((spatial.position.x + physic.offset.x + physic.width / 2) - waypoints[currentIndex].x),
                yDiff =  Math.abs((spatial.position.y + physic.offset.y + physic.height / 2) - waypoints[currentIndex].y),
                coeff;
            if (xDiff < yDiff) {
                coeff = xDiff / yDiff;
                actualSpeed.x = desiredSpeed * coeff;
                actualSpeed.y = desiredSpeed;
            } else if (xDiff > yDiff) {
                coeff = yDiff / xDiff;
                actualSpeed.x = desiredSpeed;
                actualSpeed.y = desiredSpeed * coeff;
            } else {
                actualSpeed.x = desiredSpeed;
                actualSpeed.y = desiredSpeed;
            }
        } else if (FM.parameters.debug) {
            console.log("WARNING: path with no waypoints defined.");
        }
        if (!physic) {
            console.log("WARNING: path added to a game object with no physic component.");
        }
    };

    /**
     * Continue following the current path where it had stopped.
     * @param {int} pSpeed speed at which the game object must follow the path.
     */
    that.resumeFollowingPath = function () {
        if (waypoints.length > 0) {
            active = true;
            if (positionBeforeStopping.x !== spatial.position.x
                    || positionBeforeStopping.y !== spatial.position.y) {
                xReached = false;
                yReached = false;
                //Adjust speed so that the movement is linear
                var xDiff =  Math.abs((spatial.position.x + physic.offset.x + physic.width / 2) - waypoints[currentIndex].x),
                    yDiff =  Math.abs((spatial.position.y + physic.offset.y + physic.height / 2) - waypoints[currentIndex].y),
                    coeff;
                if (xDiff < yDiff) {
                    coeff = xDiff / yDiff;
                    actualSpeed.x = desiredSpeed * coeff;
                    actualSpeed.y = desiredSpeed;
                } else if (xDiff > yDiff) {
                    coeff = yDiff / xDiff;
                    actualSpeed.x = desiredSpeed;
                    actualSpeed.y = desiredSpeed * coeff;
                } else {
                    actualSpeed.x = desiredSpeed;
                    actualSpeed.y = desiredSpeed;
                }
            }
        } else if (FM.parameters.debug) {
            console.log("WARNING: path with no waypoints defined.");
        }
        if (!physic) {
            console.log("WARNING: path added to a game object with no physic component.");
        }
    };

    /**
     * Stop following the current path.
     */
    that.stopFollowingPath = function () {
        active = false;
        physic.velocity.x = 0;
        physic.velocity.y = 0;
        positionBeforeStopping = FM.vector(spatial.position.x, spatial.position.y);
    };

    /**
     * Erase every waypoints in the path.
     */
    that.clearPath = function () {
        waypoints = [];
    };

    /**
     * Update the component.
     * * @param {float} dt time in seconds since the last frame.
     */
    that.update = function (dt) {
        //Update the motion if the path is active
        if (active && physic) {
            //Update motion whether a physic component is present or not
            var xPos =  spatial.position.x + physic.offset.x + physic.width / 2,
                yPos =  spatial.position.y + physic.offset.y + physic.height / 2,
                xDiff,
                yDiff,
                coeff;
            //Update x position
            if (xPos < waypoints[currentIndex].x) {
                if (waypoints[currentIndex].x - xPos < actualSpeed.x * dt) {
                    physic.velocity.x = waypoints[currentIndex].x - xPos;
                    xReached = true;
                } else {
                    physic.velocity.x = actualSpeed.x;
                }
            } else if (xPos > waypoints[currentIndex].x) {
                if (xPos - waypoints[currentIndex].x < actualSpeed.x * dt) {
                    physic.velocity.x = xPos - waypoints[currentIndex].x;
                    xReached = true;
                } else {
                    physic.velocity.x = -actualSpeed.x;
                }
            } else {
                xReached = true;
                physic.velocity.x = 0;
            }
            //Update y position
            if (yPos < waypoints[currentIndex].y) {
                if (waypoints[currentIndex].y - yPos < actualSpeed.y * dt) {
                    physic.velocity.y = waypoints[currentIndex].y - yPos;
                    yReached = true;
                } else {
                    physic.velocity.y = actualSpeed.y;
                }
            } else if (yPos > waypoints[currentIndex].y) {
                if (yPos - waypoints[currentIndex].y < actualSpeed.y * dt) {
                    physic.velocity.y = yPos - waypoints[currentIndex].y;
                    yReached = true;
                } else {
                    physic.velocity.y = -actualSpeed.y;
                }
            } else {
                yReached = true;
                physic.velocity.y = 0;
            }
            //Select the next waypoint if the current has been reached
            if (xReached && yReached) {
                if (waypoints.length > currentIndex + 1) {
                    xReached = false;
                    yReached = false;
                    currentIndex = currentIndex + 1;
                    //Adjust speed so that the movement is linear
                    xDiff =  Math.abs(xPos - waypoints[currentIndex].x);
                    yDiff =  Math.abs(yPos - waypoints[currentIndex].y);
                    if (xDiff < yDiff) {
                        coeff = xDiff / yDiff;
                        actualSpeed.x = desiredSpeed * coeff;
                        actualSpeed.y = desiredSpeed;
                    } else if (xDiff > yDiff) {
                        coeff = yDiff / xDiff;
                        actualSpeed.x = desiredSpeed;
                        actualSpeed.y = desiredSpeed * coeff;
                    } else {
                        actualSpeed.x = desiredSpeed;
                        actualSpeed.y = desiredSpeed;
                    }
                } else {
                    active = false;
                    actualSpeed = FM.vector(0, 0);
                    desiredSpeed = 0;
                    physic.velocity = FM.vector(0, 0);
                }
            }
        }
    };

    /**
     * Add a waypoint to the path.
     * @param {int} pX x position.
     * @param {int} pY y position.
     * @param {int} index optional index at which adding the waypoint.
     */
    that.add = function (pX, pY, index) {
        if (index === undefined) {
            waypoints.push({x : pX, y : pY});
        } else {
            waypoints[index] = {x : pX, y : pY};
        }
    };

    /**
     * Remove a waypoint from the path.
     * @param {int} index index of the waypoint to remove.
     */
    that.remove = function (index) {
        waypoints.splice(index, 1);
    };

    /**
     * Return the waypoints of the path.
     * @returns {Array} waypoints of the path.
     */
    that.getWaypoints = function () {
        return waypoints;
    };

    /**
     * Return the current index of the waypoint to reach.
     * @returns {int} index of the waypoint to reach.
     */
    that.getCurrentIndex = function () {
        return currentIndex;
    };

    /**
     * Return the current waypoint to reach.
     * @returns {Waypoint} waypoint to reach.
     */
    that.getCurrentWaypoint = function () {
        return waypoints[currentIndex];
    };

    /**
     * Return the number of waypoints.
     * @returns {int} number of waypoints.
     */
    that.getLength = function () {
        return waypoints.length;
    };

    /**
     * Check if the last waypoint has been reached.
     * @returns {boolean} whether the last waypoint has been reached or not.
     */
    that.isLastWaypointReached = function () {
        return currentIndex === waypoints.length - 1 && !active;
    };

    /**
     * Check if the path is being followed.
     * @returns {boolean} whether the path is being followed.
     */
    that.isActive = function () {
        return active;
    };

    /**
     * Destroy the path.
     */
    that.destroy = function () {
        waypoints = null;
        spatial = null;
        physic = null;
        that.destroy();
        that = null;
    };

    return that;
};
/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {int} pWidth width of the aabb.
 * @param {int} pHeight height of the aabb.
 * @param {gameObject} The game object to which the component belongs.
 * @returns {aabbComponent} The axis aligned bounding box component itself.
 */
FM.aabbComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    /**
     * aabbComponent is based on physicComponent.
     */
    var that = FM.physicComponent(pWidth, pHeight, pOwner),
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    /**
     * Check if the needed components are present.
     */
    if (FM.parameters.debug) {
        if (!spatial) {
            console.log("ERROR: No spatial component was added and you need one for physics.");
        }
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Check if the current circle is overlapping with the specified type.
     */
    that.overlapsWithType = function (pType) {
        //TODO
        return null;
    };

    /**
     * Check if the current aabb is overlapping with the specified physic object.
     */
    that.overlapsWithObject = function (pPhysic) {
        var collision = pPhysic.overlapsWithAabb(that);
        if (collision) {
            return collision;
        }
        return null;
    };

    /**
     * Check if the current aabb is overlapping with the specified aabb.
     */
    that.overlapsWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
            max = FM.vector(min.x + that.width, min.y + that.height),
            otherMax = FM.vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
            center = FM.vector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FM.vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
            normal = FM.math.substractVectors(otherCenter, center),
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
                collision = FM.collision(that, aabb);
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
     */
    that.overlapsWithCircle = function (circle) {
        var otherSpatial = circle.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            max = FM.vector(min.x + that.width, min.y + that.height),
            center = FM.vector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FM.vector(otherMin.x + circle.radius, otherMin.y + circle.radius),
            normal = FM.math.substractVectors(otherCenter, center),
            distance,
            radius,
            closest = normal.clone(),
            xExtent = (max.x - min.x) / 2,
            yExtent = (max.y - min.y) / 2,
            inside = false,
            collision = null;
        closest.x = FM.math.clamp(closest.x, -xExtent, xExtent);
        closest.y = FM.math.clamp(closest.y, -yExtent, yExtent);
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
        collision = FM.collision();
        collision.a = that;
        collision.b = circle;
        collision.normal = FM.math.substractVectors(normal, closest);
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
     */
    that.drawDebug = function (bufferContext, newPosition) {
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(newPosition.x + that.offset.x - bufferContext.xOffset, newPosition.y + that.offset.y - bufferContext.yOffset, that.width,
                                that.height);
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        Object.getPrototypeOf(that).destroy();
        that = null;
    };

    return that;
};
/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {gameObject} The game object to which the component belongs.
 * @returns {circleComponent} The circle component itself.
 */
FM.circleComponent = function (pRadius, pOwner) {
    "use strict";
    /**
     * fmB2CircleComponent is based on physicComponent.
     */
    var that = FM.physicComponent(pRadius * 2, pRadius * 2, pOwner),
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    /**
     * Check if the needed components are present.
     */
    if (FM.parameters.debug) {
        if (!spatial) {
            console.log("ERROR: No spatial component was added and you need one for physics.");
        }
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);
    /**
     * Radius of the circle
     */
    that.radius = pRadius;

    /**
     * Check if the current circle is overlapping with the specified type.
     */
    that.overlapsWithType = function (pType) {
        //TODO
        return null;
    };

    /**
     * Check if the current circle is overlapping with the specified physic object.
     */
    that.overlapsWithObject = function (pPhysic) {
        var collision = pPhysic.overlapsWithCircle(that);
        if (collision) {
            return collision;
        }
        return null;
    };

    /**
     * Check if the current circle is overlapping with the specified aabb.
     */
    that.overlapsWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
            otherMax = FM.vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
            center = FM.vector(min.x + that.radius, min.y + that.radius),
            otherCenter = FM.vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
            normal = FM.math.substractVectors(otherCenter, center),
            distance,
            radius,
            closest = normal.clone(),
            xExtent = (otherMax.x - otherMin.x) / 2,
            yExtent = (otherMax.y - otherMin.y) / 2,
            inside = false,
            collision = null;
        closest.x = FM.math.clamp(closest.x, -xExtent, xExtent);
        closest.y = FM.math.clamp(closest.y, -yExtent, yExtent);
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
        collision = FM.collision();
        collision.a = that;
        collision.b = aabb;
        collision.normal = FM.math.substractVectors(normal, closest);
        distance = collision.normal.getLengthSquared();
        radius = that.radius;
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
     */
    that.overlapsWithCircle = function (circle) {
        var otherSpatial = circle.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            center = FM.vector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FM.vector(otherMin.x + circle.width / 2, otherMin.y + circle.height / 2),
            radius = that.radius + circle.radius,
            radius = radius * radius,
            normal = FM.math.substractVectors(otherCenter, center),
            distance = normal.getLength(),
            collision = null;
        if (normal.getLengthSquared() > radius) {
            return null;
        } else {
            collision = FM.collision();
            collision.a = that;
            collision.b = circle;
            if (distance !== 0) {
                collision.penetration = radius - distance;
                collision.normal = normal.reset(normal.x / distance, normal.y / distance);
            } else {
                collision.penetration = that.radius;
                collision.normal = normal.reset(1, 0);
            }
            return collision;
        }
        return null;
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext, newPosition) {
        var newCenter = FM.vector(newPosition.x + that.radius, newPosition.y + that.radius);
        bufferContext.beginPath();
        bufferContext.strokeStyle = '#f4f';
        bufferContext.arc((newCenter.x + that.offset.x) - bufferContext.xOffset, (newCenter.y + that.offset.y) - bufferContext.yOffset, that.radius, 0, 2 * Math.PI, false);
        bufferContext.stroke();
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        Object.getPrototypeOf(that).destroy();
        that = null;
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * Component of basic physics.
 * @param {int} pWidth width of the collider.
 * @param {int} pHeight height of the collider.
 * @param {fmObject} The object that owns this component.
 * @author Simon Chauvin
 */
FM.physicComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    /**
     * FM.physicComponent is based on component.
     */
    var that = FM.component(FM.componentTypes.PHYSIC, pOwner),
        /**
         * World of the game.
         */
        world = FM.game.getCurrentState().getWorld(),
        /**
        * Quad tree containing all game objects with a physic component.
         */
        quad = FM.game.getCurrentState().getQuad(),
        /**
         * The current direction of the object.
         */
        direction = 0,
        /**
         * Array storing the types of game objects that can collide with this one.
         */
        collidesWith = [],
        /**
         * Store the collisions that this object has.
         */
        collisions = [],
        /**
         * Store the types of tile map that this object collides with.
         */
        tilesCollisions = [],
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL],
        /**
         * Correct the position of the physic component.
         */
        correctPosition = function (collision) {
            //Position correction
            var correction = FM.vector(collision.penetration * collision.normal.x, collision.penetration * collision.normal.y),
                aSpatial = collision.a.owner.components[FM.componentTypes.SPATIAL],
                bSpatial = collision.b.owner.components[FM.componentTypes.SPATIAL],
                aPhysic = collision.a.owner.components[FM.componentTypes.PHYSIC],
                bPhysic = collision.b.owner.components[FM.componentTypes.PHYSIC],
                massSum = 0,
                invMass = 0,
                otherInvMass = 0;
            if (collision.a.mass === 0) {
                invMass = 0;
            } else {
                invMass = 1 / collision.a.mass;
            }
            if (collision.b.mass === 0) {
                otherInvMass = 0;
            } else {
                otherInvMass = 1 / collision.b.mass;
            }
            massSum = invMass + otherInvMass;

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
            aSpatial.position.x -= correction.x * (invMass / massSum);
            aSpatial.position.y -= correction.y * (invMass / massSum);
            bSpatial.position.x += correction.x * (otherInvMass / massSum);
            bSpatial.position.y += correction.y * (otherInvMass / massSum);
        },
        /**
         * Check collisions with a given array of tiles.
         * @param {tileMap} tiles tiles to test for collisions.
         */
        checkCollisionsWithTiles = function (tiles, tileWidth, tileHeight, xPos, yPos) {
            var i1 = Math.floor(yPos / tileHeight),
                j1 = Math.floor(xPos / tileWidth),
                i2 = Math.floor((yPos + that.height) / tileHeight),
                j2 = Math.floor((xPos + that.width) / tileWidth),
                i,
                j;
            for (i = i1; i <= i2; i = i + 1) {
                for (j = j1; j <= j2; j = j + 1) {
                    if (tiles[i] !== 0 && tiles[i][j] !== -1) {
                        if (j === j1 || j === j2 || i === i1 || i === i2) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        /**
         * 
         */
        tryToMove = function (tiles, tileWidth, tileHeight, xVel, yVel) {
            var spX = spatial.position.x + xVel,
                spY = spatial.position.y + yVel;
            if (!checkCollisionsWithTiles(tiles, tileWidth, tileHeight, spX + that.offset.x, spY + that.offset.y)) {
                spatial.position.x = spX;
                spatial.position.y = spY;
                return true;
            }
            return false;
        },
        /**
         * 
         */
        move = function (tileMap, xVel, yVel) {
            var tiles = tileMap.getData(),
                tileWidth = tileMap.getTileWidth(),
                tileHeight = tileMap.getTileHeight();
            if (Math.abs(xVel) >= tileWidth || Math.abs(yVel) >= tileHeight) {
                move(tileMap, xVel / 2, yVel / 2);
                move(tileMap, xVel - xVel / 2, yVel - yVel / 2);
                return;
            }

            var hor = tryToMove(tiles, tileWidth, tileHeight, xVel, 0),
                ver = tryToMove(tiles, tileWidth, tileHeight, 0, yVel),
                i,
                maxSpeed,
                vel;
            if (hor && ver) {
                return;
            }
            if (!hor) {
                that.velocity.x = 0;
                maxSpeed = Math.abs(xVel);
                for (i = 0; i < maxSpeed; i = i + 1) {
                    if (xVel === 0) {
                        vel = 0;
                    } else if (xVel > 0) {
                        vel = 1;
                    } else {
                        vel = -1;
                    }
                    if (!tryToMove(tiles, tileWidth, tileHeight, vel, 0)) {
                        break;
                    } else {
                        that.velocity.x += vel;
                    }
                }
            }
            if (!ver) {
                that.velocity.y = 0;
                maxSpeed = Math.abs(yVel);
                for (i = 0; i < maxSpeed; i = i + 1) {
                    if (yVel === 0) {
                        vel = 0;
                    } else if (yVel > 0) {
                        vel = 1;
                    } else {
                        vel = -1;
                    }
                    if (!tryToMove(tiles, tileWidth, tileHeight, 0, vel)) {
                        break;
                    } else {
                        that.velocity.y += vel;
                    }
                }
            }
        };
    /**
     * Offset of the bounding box or circle.
     */
    that.offset = FM.vector(0, 0);
    /**
     * Width of the collider.
     */
    that.width = pWidth;
    /**
     * Height of the collider.
     */
    that.height = pHeight;
    /**
     * Velocity of the physic component.
     */
    that.velocity = FM.vector(0, 0);
    /**
     * Acceleration applied to the physic object.
     */
    that.acceleration = FM.vector(0, 0);
    /**
     * How much the object's velocity is decreasing when acceleration is
     * equal to 0.
     */
    that.drag = FM.vector(0, 0);
    /**
     * Angular velocity.
     */
    that.angularVelocity = 0;
    /**
     * How much the object's velocity is decreasing when acceleration is
     * equal to 0.
     */
    that.angularDrag = FM.vector(0, 0);
    /**
     * Represent the mass of the physic game object, 0 means infinite mass.
     */
    that.mass = 1;
    /**
     * Represent the maximum absolute value of the velocity.
     */
    that.maxVelocity = FM.vector(1000, 1000);
    /**
     * Maximum angular velocity.
     */
    that.maxAngularVelocity = 10000;
    /**
     * Elasticity is a factor between 0 and 1 used for bouncing purposes.
     */
    that.elasticity = 0;
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for physics.");
    }

    /**
    * Update the component.
    */
    that.update = function (dt) {
        collisions = [];
        tilesCollisions = [];
        //Compute inverse mass
        var invMass = 1 / that.mass, currentVelocity, maxVelocity;
        if (that.mass === 0) {
            invMass = 0;
        }

        //Limit velocity to a max value
        currentVelocity = that.velocity.x + (invMass * that.acceleration.x) * dt;
        maxVelocity = that.maxVelocity.x + (invMass * that.acceleration.x) * dt;
        if (Math.abs(currentVelocity) <= maxVelocity) {
            that.velocity.x = currentVelocity;
        } else if (currentVelocity < 0) {
            that.velocity.x = -maxVelocity;
        } else if (currentVelocity > 0) {
            that.velocity.x = maxVelocity;
        }
        currentVelocity = that.velocity.y + (invMass * that.acceleration.y) * dt;
        maxVelocity = that.maxVelocity.y + (invMass * that.acceleration.y) * dt;
        if (Math.abs(currentVelocity) <= maxVelocity) {
            that.velocity.y = currentVelocity;
        } else if (currentVelocity < 0) {
            that.velocity.y = -maxVelocity;
        } else if (currentVelocity > 0) {
            that.velocity.y = maxVelocity;
        }

        //Apply drag
        if (that.acceleration.x === 0) {
            if (that.velocity.x > 0) {
                that.velocity.x -= that.drag.x;
            } else if (that.velocity.x < 0) {
                that.velocity.x += that.drag.x;
            }
        }
        if (that.acceleration.y === 0) {
            if (that.velocity.y > 0) {
                that.velocity.y -= that.drag.y;
            } else if (that.velocity.y < 0) {
                that.velocity.y += that.drag.y;
            }
        }

        var canMove = true, quad, tileMap, gameObjects, i, j, otherGameObject, otherPhysic, collision = null;
        if (collidesWith.length > 0) {
            if (world.hasTileCollisions()) {
                for (i = 0; i < collidesWith.length; i = i + 1) {
                    tileMap = world.getTileMapFromType(collidesWith[i]);
                    if (tileMap && tileMap.canCollide()) {
                        move(tileMap, that.velocity.x * dt, that.velocity.y * dt);
                        canMove = false;
                        tilesCollisions.push({a: that.owner, b: tileMap});
                    }
                }
            }
        }

        //Update position
        if (canMove) {
            spatial.position.x += that.velocity.x * dt;
            spatial.position.y += that.velocity.y * dt;
        }

        //If this game object collides with at least one type of game object
        if (collidesWith.length > 0) {
            quad = FM.game.getCurrentState().getQuad();
            gameObjects = quad.retrieve(pOwner);
            //If there are other game objects near this one
            for (i = 0; i < gameObjects.length; i = i + 1) {
                otherGameObject = gameObjects[i];
                otherPhysic = otherGameObject.components[FM.componentTypes.PHYSIC];
                //If a game object is found and is alive and is not the current one
                if (otherGameObject.isAlive() && pOwner.getId() !== otherGameObject.getId() && !otherPhysic.isCollidingWith(pOwner) && !that.isCollidingWith(otherGameObject)) {
                    for (j = 0; j < collidesWith.length; j = j + 1) {
                        if (otherGameObject.hasType(collidesWith[j])) {
                            collision = pOwner.components[FM.componentTypes.PHYSIC].overlapsWithObject(otherPhysic);
                            if (collision !== null) {
                                that.addCollision(collision);
                                otherPhysic.addCollision(collision);
                                that.resolveCollision(otherPhysic, collision);
                                otherPhysic.resolveCollision(that, collision);
                                correctPosition(collision);
                            }
                        }
                    }
                }
            }
        }

        //TODO add direction debug
        /*if (xVelocity_ != 0) {
            direction = Math.atan(yVelocity_ / xVelocity_) / (Math.PI / 180);
        } else {
            direction = 0;
        }*/
    };

    /**
     * Check collisions with the tiles.
     */
    that.checkTileCollisions = function (tiles, xPos, yPos) {
        var tileWidth,
            tileHeight,
            i1, j1,
            i2, j2,
            i, j;
        //If there are collisions with tiles
        if (tiles.length > 0) {
            tileWidth = tiles.getTileWidth();
            tileHeight = tiles.getTileHeight();
            i1 = Math.floor(yPos / tileHeight);
            j1 = Math.floor(xPos / tileWidth);
            i2 = Math.floor((yPos + that.height) / tileHeight);
            j2 = Math.floor((xPos + that.width) / tileWidth);
            for (i = i1; i <= i2; i = i + 1) {
                for (j = j1; j <= j2; j = j + 1) {
                    if (tiles[i] && tiles[i][j] === 1) {
                        if (j === j1 || j === j2 || i === i1 || i === i2) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    /**
     * Resolve collision between current game object and the specified one.
     */
    that.resolveCollision = function (otherPhysic, collision) {
        var relativeVelocity = FM.math.substractVectors(otherPhysic.velocity, that.velocity),
            velocityAlongNormal = relativeVelocity.dotProduct(collision.normal),
            //Compute restitution
            e = Math.min(that.elasticity, otherPhysic.elasticity),
            j = 0,
            invMass = 0,
            otherInvMass = 0,
            impulse = FM.vector(0, 0);
        //Do not resolve if velocities are separating.
        if (velocityAlongNormal > 0) {
            return;
        }
        //Compute inverse mass
        if (that.mass === 0) {
            invMass = 0;
        } else {
            invMass = 1 / that.mass;
        }
        if (otherPhysic.mass === 0) {
            otherInvMass = 0;
        } else {
            otherInvMass = 1 / otherPhysic.mass;
        }
        //Compute impulse scalar
        j = -(1 + e) * velocityAlongNormal;
        j /= invMass + otherInvMass;
        //Apply impulse
        impulse.reset(j * collision.normal.x, j * collision.normal.y);
        that.velocity.x -= invMass * impulse.x;
        that.velocity.y -= invMass * impulse.y;
        otherPhysic.velocity.x += otherInvMass * impulse.x;
        otherPhysic.velocity.y += otherInvMass * impulse.y;
    };

    /**
     * Ensure that a game object collides with a certain type of other game 
     * objects (with physic components of course).
     */
    that.addTypeToCollideWith = function (pType) {
        collidesWith.push(pType);
    };

    /**
     * Remove a type that was supposed to collide with this game object.
     */
    that.removeTypeToCollideWith = function (pType) {
        collidesWith.splice(collidesWith.indexOf(pType), 1);
    };
    /**
     * Add a collision object representing the collision to the list of current
     * collisions.
     * @param {collision} collision the collision object.
     */
    that.addCollision = function (collision) {
        collisions.push(collision);
    };

    /**
     * Get the velocity.
     */
    that.getLinearVelocity = function () {
        return that.velocity;
    };

    /**
     * Check if the current physic component is colliding a specified type of physic component.
     * @returns {boolean} whether there is already collision between the the current physic component and the specified type of physic component.
     */
    that.isCollidingWithType = function (pOtherType) {
        var i, collision;
        for (i = 0; i < collisions.length; i = i + 1) {
            collision = collisions[i];
            if ((collision.b && collision.b.owner.hasType(pOtherType))
                    || (collision.a && collision.a.owner.hasType(pOtherType))) {
                return true;
            }
        }
        for (i = 0; i < tilesCollisions.length; i = i + 1) {
            collision = tilesCollisions[i];
            if ((collision.b && collision.b.hasType(pOtherType))
                    || (collision.a && collision.a.hasType(pOtherType))) {
                return true;
            }
        }
        return false;
    };

    /**
     * Check if the current physic component is colliding with another one.
     * @returns {boolean} whether there is already collision between the physic components.
     */
    that.isCollidingWith = function (pOtherGameObject) {
        var i, collision;
        for (i = 0; i < collisions.length; i = i + 1) {
            collision = collisions[i];
            if ((collision.b && collision.b.owner.getId() === pOtherGameObject.getId())
                || (collision.a && collision.a.owner.getId() === pOtherGameObject.getId())) {
                return true;
            }
        }
        return false;
    };

    return that;
};
/**
 *
 * @author Simon Chauvin
 * @param {imageAsset} pImage image of the sprite sheet.
 * @param {int} pWidth width of a frame of the spritesheet.
 * @param {int} pHeight height of a frame of the spritesheet.
 * @param {gameObject} pOwner game object owner of the component.
 */
FM.animatedSpriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Image of the sprite.
         */
        image = pImage,
        /**
         * Width of the spritesheet.
         */
        imageWidth = image.width,
        /**
         * Height of the spritesheet.
         */
        imageHeight = image.height,
        /**
         * Width of a frame of the spritesheet.
         */
        frameWidth = pWidth,
        /**
         * Height of a frame of the spritesheet.
         */
        frameHeight = pHeight,
        /**
         * Width of a resized frame of the spritesheet.
         */
        changedWidth = pWidth,
        /**
         * Height of a resized frame of the spritesheet.
         */
        changedHeight = pHeight,
        /**
         * Transparency of the sprite.
         */
        alpha = 1,
        /**
         * Current animation being played.
         */
        currentAnim = "",
        /**
         * Whether there is a flipped version of the animation frames or not.
         */
        flipped = false,
        /**
         * Current horizontal offset of position on the spritesheet.
         */
        xOffset = 0,
        /**
         * Current vertical offset of position on the spritesheet.
         */
        yOffset = 0,
        /**
         * Frames constituing the animation.
         */
        frames = [],
        /**
         * Current frame being displayed.
         */
        currentFrame = 0,
        /**
         * Current time in seconds.
         */
        currentTime = 0,
        /**
         * Maximum delay between each frames.
         */
        delay = 0.1,
        /**
         * Current delay between frames.
         */
        currentDelay = 0.1,
        /**
         * Whether a specific animation should loop or not.
         */
        loop = [],
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);
    /**
     * Read-only attributes that specifies whether the current animation has
     * finished playing or not.
     */
    that.finished = false;

    /**
    * Add an animation.
    * @param {String} name name of the animation.
    * @param {Array} pFrames frames of the animation.
    * @param {int} frameRate speed of the animation.
    * @param {boolean} isLooped whether the animation should loop or not.
    */
    that.addAnimation = function (name, pFrames, frameRate, isLooped) {
        currentFrame = 0;
        currentAnim = name;
        frames[name] = pFrames;
        delay = 1 / frameRate;
        //TODO generate flipped version
        //flipped = isReversed;
        currentDelay = delay;
        loop[name] = isLooped;
    };

    /**
     * Play the given animation.
     * @param {String} animName name of the animation to be played.
     */
    that.play = function (animName) {
        //In case the width of the sprite have been modified
        //imageWidth = image.width;
        //imageHeight = image.height;
        currentAnim = animName;
        that.finished = false;
        currentFrame = 0;
        xOffset = frames[currentAnim][currentFrame] * frameWidth;
        yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
        if (xOffset >= imageWidth) {
            yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
            xOffset = (xOffset % imageWidth);
        }
    };

    /**
     * Stop the animation.
     */
    that.stop = function () {
        that.finished = true;
    };

    /**
    * Draw the sprite.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y,
            newTime = (new Date()).getTime() / 1000;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(frameWidth / 2, frameHeight / 2);
            bufferContext.rotate(spatial.angle);
            bufferContext.drawImage(image, xOffset, yOffset, frameWidth, frameHeight, -changedWidth / 2, -changedHeight / 2, changedWidth, changedHeight);
            bufferContext.restore();
        } else {
            bufferContext.drawImage(image, xOffset, yOffset, frameWidth, frameHeight, xPosition, yPosition, changedWidth, changedHeight);
        }
        bufferContext.globalAlpha = 1;
        //If the anim is not finished playing
        if (!that.finished) {
            if (currentDelay <= 0) {
                currentDelay = delay;
                if (frames[currentAnim]) {
                    if (frames[currentAnim].length > 1) {
                        currentFrame = currentFrame + 1;
                        //If the current anim exists and that the current frame is the last one
                        if (frames[currentAnim] && (currentFrame === frames[currentAnim].length - 1)) {
                            if (loop[currentAnim]) {
                                currentFrame = 0;
                            } else {
                                that.finished = true;
                            }
                        }
                    } else {
                        that.finished = true;
                    }
                    xOffset = frames[currentAnim][currentFrame] * frameWidth;
                    yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
                    if (xOffset >= imageWidth) {
                        yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
                        xOffset = (xOffset % imageWidth);
                    }
                }
            } else {
                currentDelay -= newTime - currentTime;
            }
        }
        currentTime = newTime;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        image.destroy();
        image = null;
        currentAnim = null;
        frames = null;
        loop = null;
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Get the current animation being played.
     */
    that.getCurrentAnim = function () {
        return currentAnim;
    };

    /**
     * Change the size of the sprite.
     * @param {float} pFactor factor by which the size will be changed.
     */
    that.changeSize = function (pFactor) {
        changedWidth = pFactor * frameWidth;
        changedHeight = pFactor * frameHeight;
    };

    /**
     * Set the transparency of the sprite.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the height of a frame of the spritesheet.
     */
    that.getWidth = function () {
        return changedWidth;
    };

    /**
     * Retrieve the height of a frame of the spritesheet.
     */
    that.getHeight = function () {
        return changedHeight;
    };

    /**
     * Retrieve the height of a frame before it was resized.
     */
    that.getOriginalWidth = function () {
        return frameWidth;
    };

    /**
     * Retrieve the height of a frame before it was resized.
     */
    that.getOriginalHeight = function () {
        return frameHeight;
    };

    /**
     * Retrieve the transparency value of the sprite.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
/**
 * 
 * @author Simon Chauvin
 */
FM.boxRendererComponent = function (pWidth, pHeight, pColor, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Width of the box.
         */
        width = pWidth,
        /**
         * Height of the box.
         */
        height = pHeight,
        /**
         * Color of the box.
         */
        color = pColor,
        /**
         * Transparency of the box.
         */
        alpha = 1,
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
    * Draw the box.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on which 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            bufferContext.beginPath();
            bufferContext.rect(xPosition, yPosition, width, height);
            bufferContext.restore();
        } else {
            bufferContext.beginPath();
            bufferContext.rect(xPosition, yPosition, width, height);
        }
        bufferContext.fillStyle = color;
        bufferContext.fill();
        bufferContext.globalAlpha = 1;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Set the width of the box.
     * @param {int} newWidth new width desired.
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
    };

    /**
     * Set the height of the box.
     * @param {int} newHeight new height desired.
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
    };

    /**
     * Set the color of the  box.
     * @param {string} newColor new color desired.
     */
    that.setColor = function (newColor) {
        color = newColor;
    };

    /**
     * Set the transparency of the box.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the box.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the box.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Retrieve the color of the box.
     */
    that.getColor = function () {
        return color;
    };

    /**
     * Retrieve the transparency value of the box.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
/**
 * 
 * @author Simon Chauvin
 */
FM.circleRendererComponent = function (pRadius, pColor, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Width of the circle.
         */
        width = pRadius * 2,
        /**
         * Height of the circle.
         */
        height = pRadius * 2,
        /**
         * Color of the circle.
         */
        color = pColor,
        /**
         * Transparency of the circle.
         */
        alpha = 1,
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
    * Draw the circle.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on which 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x - bufferContext.xOffset * pOwner.scrollFactor.x, 
                yPosition = newPosition.y - bufferContext.yOffset * pOwner.scrollFactor.y,
            newCenter = FM.vector(xPosition + width / 2, yPosition + height / 2);
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            bufferContext.beginPath();
            bufferContext.arc(newCenter.x, newCenter.y, width / 2, 0, 2 * Math.PI);
            bufferContext.restore();
        } else {
            bufferContext.beginPath();
            bufferContext.arc(newCenter.x, newCenter.y, width / 2, 0, 2 * Math.PI);
        }
        bufferContext.fillStyle = color;
        bufferContext.fill();
        bufferContext.globalAlpha = 1;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Set the width of the  circle.
     * @param {int} newWidth new width desired.
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
        height = newWidth;
    };

    /**
     * Set the height of the circle.
     * @param {int} newHeight new height desired.
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
        width = newHeight;
    };

    /**
     * Set the radius of the  circle.
     * @param {int} newRadius new radius desired.
     */
    that.setRadius = function (newRadius) {
        width = newRadius * 2;
        height = newRadius * 2;
    };

    /**
     * Set the color of the  circle.
     * @param {string} newColor new color desired.
     */
    that.setColor = function (newColor) {
        color = newColor;
    };

    /**
     * Set the transparency of the circle.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the circle.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the circle.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Retrieve the radius of the circle.
     */
    that.getRadius = function () {
        return width / 2;
    };

    /**
     * Retrieve the color of the circle.
     */
    that.getColor = function () {
        return color;
    };

    /**
     * Retrieve the transparency value of the circle.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
/**
 * 
 * @author Simon Chauvin
 */
FM.lineRendererComponent = function (pLineWidth, pLineStyle, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Points constituing the line.
         */
        points = [],
        /**
         * Width of the line.
         */
        width = 0,
        /**
         * Height of the line.
         */
        height = 0,
        /**
         * Width of the line.
         */
        lineWidth = pLineWidth,
        /**
         * Style of the line.
         */
        lineStyle = pLineStyle,
        /**
         * Transparency of the line.
         */
        alpha = 1,
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
    * Draw the line.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y, i;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            //TODO might not work since I freed the physics
            // Needs to interpolate the points
            if (points.length > 0) {
                bufferContext.beginPath();
                bufferContext.moveTo(points[0].x, points[0].y);
                for (i = 1; i < points.length; i = i + 1) {
                    bufferContext.lineTo(points[i].x, points[i].y);
                }
            }
            bufferContext.restore();
        } else {
            if (points.length > 0) {
                bufferContext.beginPath();
                bufferContext.moveTo(points[0].x, points[0].y);
                for (i = 1; i < points.length; i = i + 1) {
                    bufferContext.lineTo(points[i].x, points[i].y);
                }
            }
        }
        bufferContext.strokeStyle = lineStyle;
        bufferContext.lineWidth = lineWidth;
        bufferContext.stroke();
        bufferContext.globalAlpha = 1;
        bufferContext.lineWidth = 1;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        that.destroy();
        var i;
        for (i = 0; i < points.length; i = i + 1) {
            points[i].destroy();
        }
        points = null;
        that = null;
    };

    /**
     * Add a point to the line.
     * @param {vector} newPoint the new point to add.
     */
    that.addPoint = function (newPoint) {
        points.push(newPoint);
        var i, point, farthestRightX = 0, farthestLeftX = 0, farthestUpY = 0, farthestDownY = 0;
        for (i = 0; i < points.length; i = i + 1) {
            point = points[i];
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

        width = Math.abs(farthestRightX - farthestLeftX);
        height = Math.abs(farthestDownY - farthestUpY);
    };

    /**
     * Set the width of the  line.
     * @param {int} newLineWidth new line width desired.
     */
    that.setLineWidth = function (newLineWidth) {
        lineWidth = newLineWidth;
    };

    /**
     * Set the style of the  line.
     * @param {string} newLineStyle new line style desired.
     */
    that.setLineStyle = function (newLineStyle) {
        lineStyle = newLineStyle;
    };

    /**
     * Set the transparency of the line.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the line.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the line.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Retrieve the width of the line.
     */
    that.getLineWidth = function () {
        return lineWidth;
    };

    /**
     * Retrieve the style of the line.
     */
    that.getLineStyle = function () {
        return lineStyle;
    };

    /**
     * Retrieve the transparency value of the line.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
/**
 * 
 * @author Simon Chauvin
 */
FM.spriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Image of the sprite.
         */
        image = pImage,
        /**
         * 
         */
        imageData = null,
        /**
         * Width of the sprite.
         */
        width = pWidth,
        /**
         * Height of the sprite.
         */
        height = pHeight,
        /**
         * Transparency of the sprite.
         */
        alpha = 1,
        /**
         * Offset in case the image width is greater than the sprite.
         */
        offset = FM.vector(0, 0),
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Draw the sprite.
     * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
     * drawing is done.
     */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            //Draw the image or its data if the image is bigger than the sprite
            //to display
            if (imageData) {
                //TODO allow a sprite to be resized
                bufferContext.putImageData(imageData, -width / 2, -height / 2);
            } else {
                bufferContext.drawImage(image, -width / 2, -height / 2, width, height);
            }
            bufferContext.restore();
        } else {
            //Draw the image or its data if the image is bigger than the sprite
            //to display
            if (imageData) {
                bufferContext.putImageData(imageData, xPosition, yPosition);
            } else {
                bufferContext.drawImage(image, xPosition, yPosition, width, height);
            }
        }
        bufferContext.globalAlpha = 1;
    };

    /**
     * Specifies the offset at which the part of the image to display is. Useful
     * when using tilesets.
     */
    that.setOffset = function (pX, pY) {
        offset.reset(pX, pY);
        //Retrieve image data since the drawImage for slicing is not working properly
        var tmpCanvas = document.createElement("canvas"),
            tmpContext = tmpCanvas.getContext("2d");
        tmpCanvas.width = image.width;
        tmpCanvas.height = image.height;
        tmpContext.drawImage(image, 0, 0, image.width, image.height);
        imageData = tmpContext.getImageData(offset.x, offset.y, width, height);
        delete this.tmpContext;
        delete this.tmpCanvas;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        imageData = null;
        offset.destroy();
        offset = null;
        image.destroy();
        image = null;
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Set a new image.
     */
    that.setImage = function (pImage, pWidth, pHeight) {
        image = pImage;
        width = pWidth;
        height = pHeight;
    };

    /**
     * Set the width of the  sprite.
     * @param {int} newWidth new width desired.
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
    };

    /**
     * Set the height of the sprite.
     * @param {int} newHeight new height desired.
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
    };

    /**
     * Set the transparency of the sprite.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the sprite.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the sprite.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Retrieve the transparency value of the sprite.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.textRendererComponent = function (pTextToDisplay, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * The spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL],
        /**
         * With of the text container.
         */
        width = 50,
        /**
         * Height of the text container.
         */
        height = 50;
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    //Text to be displayed
    that.text = pTextToDisplay;

    // Default parameters
    that.fillStyle = '#fff';
    that.font = '30px sans-serif';
    that.textBaseline = 'middle';

    /**
    * Set the format of the text
    */
    that.setFormat = function (color, font, alignment) {
        that.fillStyle = color;
        that.font = font;
        that.textBaseline = alignment;
    };

    /**
    * Draw the text
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.fillStyle = that.fillStyle;
        bufferContext.font = that.font;
        bufferContext.textBaseline = that.textBaseline;
        bufferContext.fillText(that.text, xPosition, yPosition);
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function() {
        spatial = null;
        that.text = null;
        that.fillStyle = null;
        that.font = null;
        that.textBaseline = null;
        that.destroy();
        that = null;
    };

    /**
     * Retrieve the width of the text container.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the text container.
     */
    that.getHeight = function () {
        return height;
    };

    return that;
};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {audioComponent}
 */
FM.audioComponent = function (pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.SOUND, pOwner),
        /**
         * The list of sound objects.
         */
        sounds = [];
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Play the sound given a certain volume and whether the sound loop or not.
     */
    that.play = function (pSoundName, volume, loop) {
        var i, sound, soundFound = false;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                soundFound = true;
                sound.volume = volume;
                if (loop) {
                    sound.addEventListener('ended', function () {
                        if (window.chrome) { this.load(); }
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }
                if (window.chrome) { sound.load(); }
                sound.play();
            }
        }
        if (!soundFound) {
            if (FM.parameters.debug) {
                console.log("WARNING: you're trying to play a sound that does not exist.");
            }
        }
    };

    /**
     * Pause the sound.
     */
    that.pause = function (pSoundName) {
        var i, sound;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                sound.pause();
            }
        }
    };

    /**
     * Add a sound to the component.
     */
    that.addSound = function (pSound) {
        sounds.push(pSound);
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function () {
        var i;
        for (i = 0; i < sounds.length; i = i + 1) {
            sounds[i].destroy();
        }
        sounds = null;
        that.destroy();
        that = null;
    };

    /**
     * Retrieve the audio object.
     */
    that.getSoundByName = function (pSoundName) {
        var i, sound;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                return sound;
            }
        }
        return null;
    };

    return that;
};
/**
 * The spatial component allows positionning of the game object in the 2d space.
 * @author Simon Chauvin
 */
FM.spatialComponent = function (pX, pY, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.SPATIAL, pOwner);
    /**
     * Current position.
     */
    that.position = FM.vector(pX, pY);
    that.previous = FM.vector(pX, pY);
    /**
     * Angle of the object defined in radians.
     */
    that.angle = 0;
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        that.position = null;
        that.previous = null;
        that.destroy();
        that = null;
    };

    return that;
};
