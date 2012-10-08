/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMKeyboardControllerComponent(pOwner) {
    "use strict";
    var that = fmComponent(fmComponentTypes.controller, pOwner);

    var physic = pOwner.components[fmComponentTypes.physic];

    var up = 0;
    var down = 0;
    var left = 0;
    var right = 0;

    that.init = function (keyUp, keyDown, keyLeft, keyRight) {
        up = keyUp;
        down = keyDown;
        left = keyLeft;
        right = keyRight;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        
    }

    that.update = function (game) {
        if (game.isKeyPressed(up)) {
            physic.moveUp();
        }

        if (game.isKeyPressed(down)) {
            physic.moveDown();
        }

        if (game.isKeyPressed(left)) {
            physic.moveLeft();
        }

        if (game.isKeyPressed(right)) {
            physic.moveRight();
        }

        if (!game.isKeyPressed(up) && !game.isKeyPressed(down)) {
            physic.yVelocity = 0;
        }

        if (!game.isKeyPressed(left) && !game.isKeyPressed(right)) {
            physic.xVelocity = 0;
        }

    };

    return that;
}