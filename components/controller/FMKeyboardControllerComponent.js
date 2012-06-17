/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmKeyboardControllerComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.controller, owner));

    var dynamic = owner.components[fmComponentTypes.dynamic];

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

    that.update = function (game) {
        if (game.isKeyPressed(up)) {
            dynamic.moveUp();
        }

        if (game.isKeyPressed(down)) {
            dynamic.moveDown();
        }

        if (game.isKeyPressed(left)) {
            dynamic.moveLeft();
        }

        if (game.isKeyPressed(right)) {
            dynamic.moveRight();
        }

        if (!game.isKeyPressed(up) && !game.isKeyPressed(down)) {
            dynamic.yVelocity = 0;
        }

        if (!game.isKeyPressed(left) && !game.isKeyPressed(right)) {
            dynamic.xVelocity = 0;
        }

    };

    return that;
}