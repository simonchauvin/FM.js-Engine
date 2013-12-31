/**
 * @class animatedSpriteRendererComponent
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
         * Width of a frame of the spritesheet.
         */
        frameWidth = pWidth,
        /**
         * Height of a frame of the spritesheet.
         */
        frameHeight = pHeight,
        /**
         * Width of a resized frame of the spritesheet.
         */
        changedWidth = pWidth,
        /**
         * Height of a resized frame of the spritesheet.
         */
        changedHeight = pHeight,
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
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    if (!image && FM.parameters.debug) {
        console.log("ERROR: No image was provided and you need one for rendering an animated sprite.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);
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
        //imageWidth = image.width;
        //imageHeight = image.height;
        currentAnim = animName;
        that.finished = false;
        currentFrame = 0;
        xOffset = frames[currentAnim][currentFrame] * frameWidth;
        yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
        if (xOffset >= imageWidth) {
            yOffset = Math.floor(xOffset / imageWidth) * frameHeight;
            xOffset = (xOffset % imageWidth);
            xOffset = Math.round(xOffset);
            yOffset = Math.round(yOffset);
        }
    };

    /**
     * Stop the animation.
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
        xPosition = Math.round(xPosition);
        yPosition = Math.round(yPosition);
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
            bufferContext.translate(Math.round(frameWidth / 2), Math.round(frameHeight / 2));
            bufferContext.rotate(spatial.angle);
            bufferContext.drawImage(image, Math.round(xOffset), Math.round(yOffset), frameWidth, frameHeight, Math.round(-changedWidth / 2), Math.round(-changedHeight / 2), changedWidth, changedHeight);
            bufferContext.restore();
        } else {
            bufferContext.drawImage(image, Math.round(xOffset), Math.round(yOffset), frameWidth, frameHeight, Math.round(xPosition), Math.round(yPosition), changedWidth, changedHeight);
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
                        xOffset = Math.round(xOffset);
                        yOffset = Math.round(yOffset);
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
     * Change the size of the sprite.
     * You will need to change the position of the spatial component of this
     * game object if you need a resize from the center.
     * @param {float} pFactor factor by which the size will be changed.
     */
    that.changeSize = function (pFactor) {
        changedWidth = pFactor * frameWidth;
        changedHeight = pFactor * frameHeight;
    };

    /**
     * Set the width of the sprite.
     * You will need to change the position of the spatial component of this
     * game object if you need a resize from the center.
     * @param {float} pNewWidth new width of the sprite.
     */
    that.setWidth = function (pNewWidth) {
        changedWidth = pNewWidth;
    };

    /**
     * Set the height of the sprite.
     * You will need to change the position of the spatial component of this
     * game object if you need a resize from the center.
     * @param {float} pNewHeight new height of the sprite.
     */
    that.setHeight = function (pNewHeight) {
        changedHeight = pNewHeight;
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
        return changedWidth;
    };

    /**
     * Retrieve the height of a frame of the spritesheet.
     */
    that.getHeight = function () {
        return changedHeight;
    };

    /**
     * Retrieve the height of a frame before it was resized.
     */
    that.getOriginalWidth = function () {
        return frameWidth;
    };

    /**
     * Retrieve the height of a frame before it was resized.
     */
    that.getOriginalHeight = function () {
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
