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
         * Width of a frame the spritesheet.
         */
        frameWidth = pWidth,
        /**
         * height of a frame the spritesheet.
         */
        frameHeight = pHeight,
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
            bufferContext.drawImage(image, xOffset, yOffset, frameWidth, frameHeight, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
            bufferContext.restore();
        } else {
            bufferContext.drawImage(image, xOffset, yOffset, frameWidth, frameHeight, xPosition, yPosition, frameWidth, frameHeight);
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
     * Set the width of a frame of the spritesheet.
     * @param {int} newWidth new width desired.
     */
    that.setWidth = function (newWidth) {
        frameWidth = newWidth;
    };

    /**
     * Set the height of a frame of the spritesheet.
     * @param {int} newHeight new height desired.
     */
    that.setHeight = function (newHeight) {
        frameHeight = newHeight;
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
        return frameWidth;
    };

    /**
     * Retrieve the height of a frame of the spritesheet.
     */
    that.getHeight = function () {
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
