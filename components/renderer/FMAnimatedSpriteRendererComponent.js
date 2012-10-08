/**
 *
 * @author Simon Chauvin
 * @param owner
 * @returns 
 */
function FMAnimatedSpriteRendererComponent(pOwner) {
    "use strict";
    var that = FMComponent(FMComponentTypes.renderer, pOwner),

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
        columnPosition = 0,
        /**
         *
         */
        linePosition = 0,
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
        loop = [];

    /**
     * 
     */
    that.spatial = pOwner.components[FMComponentTypes.spatial];
    /**
     * 
     */
    that.scrolled = true;
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
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        
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
        columnPosition = frames[currentAnim][currentFrame] * frameWidth;
        linePosition = Math.floor(columnPosition / imageWidth) * frameHeight;
        if (columnPosition >= imageWidth) {
            linePosition = Math.floor(columnPosition / imageWidth) * frameHeight;
            columnPosition = (columnPosition % imageWidth);
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
        var xPosition = that.spatial.x, yPosition = that.spatial.y;
        if (that.scrolled) {
            xPosition -= bufferContext.xOffset;
            yPosition -= bufferContext.yOffset;
        }
        bufferContext.drawImage(image, columnPosition, linePosition, frameWidth, frameHeight, xPosition, yPosition, frameWidth, frameHeight);

        if (!that.finished) {
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
                linePosition = Math.floor(columnPosition / imageWidth) * frameHeight;
                if (columnPosition >= imageWidth) {
                    linePosition = Math.floor(columnPosition / imageWidth) * frameHeight;
                    columnPosition = (columnPosition % imageWidth);
                }
            } else {
                currentDelay -= elapsedTime();
            }
        }
    };

    that.getCurrentAnim = function () {
        return currentAnim;
    };

    that.setWidth = function (newWidth) {
        frameWidth = newWidth;
    };

    that.setHeight = function (newHeight) {
        frameHeight = newHeight;
    };

    that.getWidth = function () {
        return frameWidth;
    };

    that.getHeight = function () {
        return frameHeight;
    };

    return that;
}