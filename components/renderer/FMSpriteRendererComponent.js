/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that0}
 */
function fmSpriteRendererComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.renderer, owner));

    that.spatial = owner.components[fmComponentTypes.spatial];

    var image = new Image(), width = 50, height = 50, currentAnim = "", frameWidth = 50, frameHeight = 50, columnPosition = 0, linePosition = 0, frames = [], currentFrame = 0, delay = 0.1, currentDelay = 0.1, loop = [], animated = false;

    that.scrolled = true;
    that.finished = false;

    /**
    * Initialize the sprite
    * @param img
    */
    that.init = function (img) {
        image = img;
        frameWidth = img.width;
        frameHeight = img.height;
        width = frameWidth;
        height = frameHeight;
    };

    /**
    * Set the animated sprite
    * @param width
    * @param height
    * @param framesTab
    * @param frameRate
    * @param isLooped
    */
    that.setAnimation = function (name, fWidth, fHeight, framesTab, frameRate, isLooped) {
        animated = true;
        frameWidth = fWidth;
        frameHeight = fHeight;
        width = frameWidth;
        height = frameHeight;
        currentFrame = 0;
        frames[name] = framesTab;
        delay = 1 / frameRate;
        currentDelay = delay;
        loop[name] = isLooped;
    };

    that.play = function (animName) {
        currentAnim = animName;
        that.finished = false;
        currentFrame = 0;
        columnPosition = frames[currentAnim][currentFrame] * frameWidth;
        linePosition = Math.floor(columnPosition / image.width) * frameHeight;
        if (columnPosition >= image.width) {
            linePosition = Math.floor(columnPosition / image.width) * frameHeight;
            columnPosition = (columnPosition % image.width);
        }
    };

    that.stop = function () {
        that.finished = true;
    };

    /**
    * Draw the sprite, animated or not
    */
    that.draw = function (bufferContext) {
        var xPosition = that.spatial.x, yPosition = that.spatial.y;
        if (that.scrolled) {
            xPosition -= bufferContext.xOffset;
            yPosition -= bufferContext.yOffset;
        }
        bufferContext.drawImage(Object.getPrototypeOf(image), columnPosition, linePosition, frameWidth, frameHeight, xPosition, yPosition, width, height);

        //Debug
        if (fmParameters.debug) {
            bufferContext.fillStyle = '#fff';
            bufferContext.strokeRect(xPosition, yPosition, frameWidth, frameHeight);
        }

        if (!that.finished && animated) {
            if (currentDelay <= 0) {
                currentDelay = delay;
                currentFrame++;
                if (frames[currentAnim] && currentFrame == frames[currentAnim].length - 1) {
                    if (loop[currentAnim]) {
                        currentFrame = 0;
                    } else {
                        that.finished = true;
                    }
                }
                columnPosition = frames[currentAnim][currentFrame] * frameWidth;
                linePosition = Math.floor(columnPosition / image.width) * frameHeight;
                if (columnPosition >= image.width) {
                    linePosition = Math.floor(columnPosition / image.width) * frameHeight;
                    columnPosition = (columnPosition % image.width);
                }
            } else {
                currentDelay -= elapsedTime() / 1000;
            }
        }
    };

    that.getCurrentAnim = function () {
        return currentAnim;
    };

    that.setWidth = function (newWidth) {
        width = newWidth;
    };

    that.setHeight = function (newHeight) {
        height = newHeight;
    };

    that.getWidth = function () {
        return width;
    };

    that.getHeight = function () {
        return height;
    };

    return that;
}