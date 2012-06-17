/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmPhysicComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.dynamic, owner));

    var spatial = owner.components[fmComponentTypes.spatial];
    var renderer = owner.components[fmComponentTypes.renderer];
    var collider = owner.components[fmComponentTypes.collider];
    var shape = renderer.shape;

    that.boundingBox = fmRectangle(renderer.getWidth(), renderer.getHeight());
    that.maxXVelocity = 0;
    that.maxYVelocity = 0;
    that.xVelocity = 0;
    that.yVelocity = 0;
    that.acceleration = 0;
    that.friction = 1;
    that.gravity = 0;
    that.thrust = 1;
    that.bouncing = false;
    that.idle = false;

    that.setBoundingBox = function (width, height) {
        that.boundingBox = fmRectangle(width, height);
    };

    /**
    * Update the component
    *
    * @param game
    */
    that.update = function (game) {
        that.boundingBox = fmRectangle(renderer.getWidth(), renderer.getHeight());
        that.xVelocity *= that.friction;
        that.yVelocity *= that.friction;
        that.yVelocity += that.gravity;
        var xVelocity = that.xVelocity, yVelocity = that.yVelocity;

        if (collider) {
            var newXPosition = spatial.x + xVelocity;
            var newYPosition = spatial.y + yVelocity;
            var worldBounds = game.getCurrentState().worldBounds;
            var worldPosition = worldBounds.spatial;
            var width = renderer.getWidth();
            var height = renderer.getHeight();
            if (that.bouncing) {
                var leftBorder = newXPosition;
                var bottomBorder = newYPosition;
                if (leftBorder <= worldPosition.x || newXPosition + width >= worldBounds.width) {
                    that.xVelocity = -that.xVelocity;
                }
                if (bottomBorder <= worldPosition.y || newYPosition + height >= worldBounds.height) {
                    that.yVelocity = -that.yVelocity;
                }
            }

            if (newXPosition >= worldPosition.x && newXPosition + width <= worldBounds.width && newYPosition >= worldPosition.y
                && newYPosition + height <= worldBounds.height) {
                spatial.x += xVelocity;
                spatial.y += yVelocity;
            }
        } else {
            spatial.x += xVelocity;
            spatial.y += yVelocity;
        }
    };

    that.moveUp = function () {
        var velocity = that.yVelocity - (that.acceleration * that.thrust);
        if (Math.abs(velocity) <= that.maxYVelocity) {
            that.yVelocity = velocity;
        }
    };

    that.moveDown = function () {
        var velocity = that.yVelocity + (that.acceleration * that.thrust);
        if (Math.abs(velocity) <= that.maxYVelocity) {
            that.yVelocity = velocity;
        }
    };

    that.moveLeft = function () {
        var velocity = that.xVelocity - that.acceleration;
        if (Math.abs(velocity) <= that.maxXVelocity) {
            that.xVelocity = velocity;
        }
    };

    that.moveRight = function () {
        var velocity = that.xVelocity + that.acceleration;
        if (Math.abs(velocity) <= that.maxXVelocity) {
            that.xVelocity = velocity;
        }
    };

    that.stop = function () {
        that.xVelocity = 0;
        that.yVelocity = 0;
    };

    return that;
}