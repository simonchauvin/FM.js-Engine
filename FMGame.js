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
function fmGame(gameName, gameWidth, gameHeight, firstState) {
    "use strict";
    var that = Object.create({});

    /**
    * Name of the game
    */
    var name = gameName;

    /**
    * Specifications of the current game
    */
    fmParameters.screenWidth = gameWidth;
    fmParameters.screenHeight = gameHeight;

    /**
    * State of the game
    */
    var currentState = fmPreloader(firstState);

    /**
    * HTML5 canvas
    */
    var canvas = document.getElementById("canvas");
    var context = null;
    var bufferCanvas = null;
    var bufferContext = null;

    //Create canvas context if it exists and use double buffering
    if (canvas && canvas.getContext) {
        context = canvas.getContext("2d");

        if (context) {
            canvas.width = fmParameters.screenWidth;
            canvas.height = fmParameters.screenHeight;
            bufferCanvas = document.createElement("canvas");
            bufferCanvas.width = fmParameters.screenWidth;
            bufferCanvas.height = fmParameters.screenHeight;
            bufferContext = bufferCanvas.getContext("2d");
            bufferContext.xOffset = 0;
            bufferContext.yOffset = 0;
        }
    }

    /**
    * Input management
    */
    var currentPressedKeys = [];
    var currentReleasedKeys = [];
    var mouseHasBeenClickedSince = -1;
    var mousePressed = false;
    var mouseReleased = false;
    var mouseX = 0;
    var mouseY = 0;

    /**
    * Main game loop Calling update and draw on game objects
    */
    var gameLoop = function () {
        setTimeout(function () {
            if (mouseHasBeenClickedSince != -1) {
                mouseHasBeenClickedSince += elapsedTime() / 1000;
                if (mouseHasBeenClickedSince > 1) {
                    mouseHasBeenClickedSince = -1;
                }
            }
            var releasedTime = 0, key;
            for (key in currentReleasedKeys) {
                releasedTime = currentReleasedKeys[key];
                if (releasedTime > 1) {
                    delete currentReleasedKeys[key];
                } else {
                    currentReleasedKeys[key] += elapsedTime();
                }
            }

            for (key in currentPressedKeys) {
                currentPressedKeys[key] += elapsedTime();
            }

            context.clearRect(0, 0, fmParameters.screenWidth, fmParameters.screenHeight);
            context.fillStyle = '#000';
            context.fillRect(0, 0, currentState.worldBounds.width, currentState.worldBounds.height);

            currentState.update(that);
            currentState.draw(bufferContext);

            context.drawImage(bufferCanvas, 0, 0);
            lastUpdate = new Date();

            gameLoop();
        }, 1 / fmParameters.FPS * 1000);
    };

    /**
    * Start running the game
    */
    that.run = function () {
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

            currentState.initBounds();
            currentState.init();

            gameLoop();
        }
    };

    /**
    * Switch between two states
    */
    that.switchState = function (newState) {
        currentState.destroy();
        newState.init();
        newState.initBounds();
        currentState = newState;
    };

    /**
    * Handle keys pressed
    */
    var onKeyPressed = function (event) {
        currentPressedKeys[event.keyCode] = 0;
    };

    /**
    * Handle keys released
    */
    var onKeyReleased = function (event) {
        var key = event.keyCode;
        if (currentPressedKeys[key] != undefined) {
            currentReleasedKeys[key] = 0;
            delete currentPressedKeys[key];
        }
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
        mouseHasBeenClickedSince = 0;
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
    * Check if the mouse has been clicked
    * @returns {Boolean}
    */
    that.isMouseClicked = function () {
        if (mouseHasBeenClickedSince != -1) {
            mouseHasBeenClickedSince = -1;
            return true;
        } else {
            return false;
        }
    };

    /**
    * Check if a key is pressed
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
    * Check if a key has been released
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