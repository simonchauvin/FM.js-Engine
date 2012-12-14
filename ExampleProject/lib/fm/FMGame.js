/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMGame represents the game application and contains all the necessary
 * information to handle its execution
 * 
 * @param name
 * @param width
 * @param height
 * @param firstState
 * @returns {FMGame}
 */
function FMGame(pCanvasId, pName, pWidth, pHeight, pFirstState) {
    "use strict";
    var that = {},
        /**
        * Name of the game
        */
        name = pName,
        /**
        * Specifications of the current game
        */
        screenWidth = pWidth,
        screenHeight = pHeight,
        /**
        * State of the game
        */
        currentState = FMPreloader(pFirstState),
        /**
        * Canvas elements
        */
        canvas = document.getElementById(pCanvasId),
        /**
         * Context on which the game will be drawn
         */
        context = null,
        /**
         * Buffer used for double buffering
         */
        bufferCanvas = null,
        /**
         * Buffer context that will be drawn onto the displayed context
         */
        bufferContext = null,
        /**
         * Number of frames since the start of the game
         */
        totalFrames = 0,
        /**
         * Total time elapsed since the start of the game
         */
        totalTimeElapsed = 0,
        /**
         * Actual FPS at which the game is running
         */
        actualFps = 0,
        /**
         * Current time
         */
        currentTime = (new Date()).getTime() / 1000,
        /**
        * Currently pressed keys
        */
        currentPressedKeys = [],
        /**
        * Currently released keys
        */
        currentReleasedKeys = [],
        /**
        * Keeps tracks of the mouse click
        */
        mouseClicked = false,
        /**
        * Keeps tracks of whether the mouse is pressed or not
        */
        mousePressed = false,
        /**
        * Keeps tracks of whether the mouse is released or not
        */
        mouseReleased = false,
        /**
         * Mouse x position
         */
        mouseX = 0,
        /**
         * Mouse y position
         */
        mouseY = 0,

        /**
        * Main game loop Calling update and draw on game objects.
        */
        gameLoop = function () {
            //Reset the screen
            context.clearRect(0, 0, screenWidth, screenHeight);
            context.fillStyle = FMParameters.backgroundColor;
            context.fillRect(0, 0, screenWidth, screenHeight);
    
            //Retrieve the current time
            var newTime = (new Date()).getTime() / 1000,
            //Compute the time since last frame
            frameTime = newTime - currentTime;
            currentTime = newTime;
    
            //Calculate the actual FPS at which the game is running
            totalFrames++;
            totalTimeElapsed += frameTime;
            actualFps = Math.round(totalFrames / totalTimeElapsed);
    
            //Update the current state of the game
            currentState.update(that, frameTime);
            //Draw the current state of the game
            currentState.draw(bufferContext);
    
            // If debug mode if active
            if (FMParameters.debug) {
                //Draw the number of frames per seconds
                bufferContext.fillStyle = '#fcd116';
                bufferContext.font = '30px sans-serif';
                bufferContext.textBaseline = 'middle';
                bufferContext.fillText(actualFps, 10, 20);
            }
    
            //Draw the buffer onto the screen
            context.drawImage(bufferCanvas, 0, 0);
    
            //Reset keyboard and mouse inputs
            mouseClicked = false;
            currentReleasedKeys = [];
    
            //Main loop call
            requestAnimationFrame(gameLoop);
        };

    /**
    * Start running the game.
    */
    that.run = function () {
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
    (function() {
        var x, lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
        for(x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    /**
    * Switch between two states
    */
    that.switchState = function (newState) {
        currentState.destroy();
        newState.init(that);
        currentState = newState;
    };

    /**
    * Handle keys pressed
    */
    var onKeyPressed = function (event) {
        currentPressedKeys[event.keyCode] = 1;
    };

    /**
    * Handle keys released
    */
    var onKeyReleased = function (event) {
        var key = event.keyCode;
        currentReleasedKeys[key] = 1;
        delete currentPressedKeys[key];
    };

    /**
    * Handle mouse moves
    */
    var onMouseMove = function (event) {
        mouseX = event.clientX - event.target.offsetLeft;
        mouseY = event.clientY - event.target.offsetTop;
    };

    /**
    * Handle mouse click
    */
    var onClick = function (event) {
        mouseClicked = true;
    };

    /**
    * Handle mouse pressed
    */
    var onMousePressed = function (event) {
        mousePressed = true;
        mouseReleased = false;
    };

    /**
    * Handle mouse pressed
    */
    var onMouseReleased = function (event) {
        mouseReleased = true;
        mousePressed = false;
    };

    /**
    * Handle canvas's retrieve of focus
    */
    var onFocus = function (event) {
        currentState.restart(bufferContext);
    };

    /**
    * Handle canvas's lost of focus
    */
    var onOutOfFocus = function (event) {
        currentState.pause(bufferContext);
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

    that.getName = function () {
        return name;
    };

    /**
    * Retrieve the mouse x position
    * @returns {Number}
    */
    that.getMouseX = function () {
        return mouseX;
    };

    /**
    * Retrieve the mouse y position
    * @returns {Number}
    */
    that.getMouseY = function () {
        return mouseY;
    };

    /**
    * Retrieve the mouse x position
    * @returns {Number}
    */
    that.getMouseWorldX = function () {
        return mouseX + currentState.camera.x;
    };

    /**
    * Retrieve the mouse y position
    * @returns {Number}
    */
    that.getMouseWorldY = function () {
        return mouseY + currentState.camera.y;
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
}