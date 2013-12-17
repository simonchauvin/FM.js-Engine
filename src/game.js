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
