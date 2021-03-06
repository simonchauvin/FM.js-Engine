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
     * The next state to start once the current one is destroyed.
     * @field
     * @type FM.State
     * @private
     */
    nextState: null,
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
        if (FM.Game.nextState) {
            FM.Game.currentState.destroy();
            FM.Game.currentState = FM.Game.nextState;
            FM.Game.nextState = null;
            FM.Game.currentState.init();
        }
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
        FM.Game.nextState = newState;
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
