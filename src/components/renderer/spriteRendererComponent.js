/**
 * 
 * @author Simon Chauvin
 */
FM.spriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Image of the sprite.
         */
        image = pImage,
        /**
         * Width of the sprite to display.
         */
        width = pWidth,
        /**
         * Height of the sprite to display.
         */
        height = pHeight,
        /**
         * Width of the resized sprite.
         */
        changedWidth = pWidth,
        /**
         * Height of the resized sprite.
         */
        changedHeight = pHeight,
        /**
         * Transparency of the sprite.
         */
        alpha = 1,
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    if (!image && FM.parameters.debug) {
        console.log("ERROR: No image was provided and you need one for rendering a sprite.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);
    /**
     * Offset in case the image width is greater than the sprite.
     */
    that.offset = FM.vector(0, 0);

    /**
     * Draw the sprite.
     * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
     * drawing is done.
     */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x,
            yPosition = newPosition.y,
            offset = FM.vector(Math.round(that.offset.x), Math.round(that.offset.y));
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
            bufferContext.translate(Math.round(width / 2), Math.round(height / 2));
            bufferContext.rotate(spatial.angle);
            bufferContext.drawImage(image, offset.x, offset.y, width, height, Math.round(-changedWidth / 2), Math.round(-changedHeight / 2), changedWidth, changedHeight);
            bufferContext.restore();
        } else {
            bufferContext.drawImage(image, offset.x, offset.y, width, height, Math.round(xPosition), Math.round(yPosition), changedWidth, changedHeight);
        }
        bufferContext.globalAlpha = 1;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        that.offset.destroy();
        that.offset = null;
        image.destroy();
        image = null;
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Change the size of the sprite.
     * You will need to change the position of the spatial component of this
     * game object if you need a resize from the center.
     * @param {float} pFactor factor by which the size will be changed.
     */
    that.changeSize = function (pFactor) {
        changedWidth = pFactor * width;
        changedHeight = pFactor * height;
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
     * Set a new image.
     */
    that.setImage = function (pImage, pWidth, pHeight) {
        image = pImage;
        width = pWidth;
        height = pHeight;
    };

    /**
     * Set the transparency of the sprite.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the sprite.
     */
    that.getWidth = function () {
        return changedWidth;
    };

    /**
     * Retrieve the height of the sprite.
     */
    that.getHeight = function () {
        return changedHeight;
    };

    /**
     * Retrieve the height of a frame before it was resized.
     */
    that.getOriginalWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of a frame before it was resized.
     */
    that.getOriginalHeight = function () {
        return height;
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
