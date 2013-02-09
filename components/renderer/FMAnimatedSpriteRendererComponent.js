/**
 *
 * @author Simon Chauvin
 * @param owner
 * @returns 
 */
FMENGINE.fmAnimatedSpriteRendererComponent = function (pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.RENDERER, pOwner),
        /**
         *
         */
        image = new Image(),
        /**
         *
         */
        imageWidth = 50,
        /**
         *
         */
        imageHeight = 50,
        /**
         *
         */
        currentAnim = "",
        /**
         *
         */
        frameWidth = 50,
        /**
         *
         */
        frameHeight = 50,
        /**
         *
         */
        xOffset = 0,
        /**
         *
         */
        yOffset = 0,
        /**
         *
         */
        frames = [],
        /**
         *
         */
        currentFrame = 0,
        /**
         *
         */
        delay = 0.1,
        /**
         *
         */
        currentDelay = 0.1,
        /**
         *
         */
        loop = [],
        /**
         * 
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];
    /**
     * 
     */
    that.finished = false;

    /**
    * Initialize the sprite
    * @param img
    */
    that.init = function (img, width, height) {
        image = img;
        frameWidth = width;
        frameHeight = height;
        imageWidth = img.width;
        imageHeight = img.height;
    };

    /**
    * Set the animation
    * @param width
    * @param height
    * @param framesTab
    * @param frameRate
    * @param isLooped
    */
    that.setAnimation = function (name, framesTab, frameRate, isLooped) {
        currentFrame = 0;
        currentAnim = name;
        frames[name] = framesTab;
        delay = 1 / frameRate;
        currentDelay = delay;
        loop[name] = isLooped;
    };

    /**
     *
     */
    that.play = function (animName) {
        //In case the width of the sprite have been modified
        imageWidth = image.width;
        imageHeight = image.height;
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
     * Stop the animation
     */
    that.stop = function () {
        that.finished = true;
    };

    /**
    * Draw the sprite
    */
    that.draw = function (bufferContext) {
        var xPosition = spatial.x, yPosition = spatial.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(frameWidth / 2, frameHeight / 2);
            bufferContext.rotate(spatial.angle);
            bufferContext.drawImage(image, xOffset, yOffset, frameWidth, frameHeight, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
            bufferContext.restore();
        } else {
            bufferContext.drawImage(image, xOffset, yOffset, frameWidth, frameHeight, xPosition, yPosition, frameWidth, frameHeight);
        }

        if (!that.finished) {
            if (currentDelay <= 0) {
                currentDelay = delay;
                currentFrame = currentFrame + 1;
                if (frames[currentAnim] && currentFrame === frames[currentAnim].length - 1) {
                    if (loop[currentAnim]) {
                        currentFrame = 0;
                    } else {
                        that.finished = true;
                    }
                }
                xOffset = frames[currentAnim][currentFrame] * frameWidth;
                yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
                if (xOffset >= imageWidth) {
                    yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
                    xOffset = (xOffset % imageWidth);
                }
            } else {
                currentDelay -= elapsedTime();
            }
        }
    };

    /**
    * Destroy the component and its objects
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
     *
     */
    that.getCurrentAnim = function () {
        return currentAnim;
    };

    /**
     *
     */
    that.setWidth = function (newWidth) {
        frameWidth = newWidth;
    };

    /**
     *
     */
    that.setHeight = function (newHeight) {
        frameHeight = newHeight;
    };

    /**
     *
     */
    that.getWidth = function () {
        return frameWidth;
    };

    /**
     *
     */
    that.getHeight = function () {
        return frameHeight;
    };

    return that;
}