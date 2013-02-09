/**
 * 
 * @author Simon Chauvin
 * @param owner
 * @returns
 */
FMENGINE.fmSpriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.RENDERER, pOwner),
        /**
         * Image of the sprite
         */
        image = pImage,
        /**
         * Width of the sprite
         */
        width = pWidth,
        /**
         * Height of the sprite
         */
        height = pHeight,
        /**
         * Offset on the x axis in case the image width is greater than the sprite width
         */
        xOffset = 0,
        /**
         * Offset on the y axis in case the image height is greater than the sprite height
         */
        yOffset = 0,
        /**
         * Spatial component
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];

    /**
    * Draw the sprite.
    */
    that.draw = function (bufferContext) {
        var xPosition = spatial.x, yPosition = spatial.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            bufferContext.drawImage(image, xOffset, yOffset, width, height, -width / 2, -height / 2, width, height);
            bufferContext.restore();
        } else {
            bufferContext.drawImage(image, xOffset, yOffset, width, height, xPosition, yPosition, width, height);
        }
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function() {
        image.destroy();
        image = null;
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Allow to specify a position in the image to display if the image is larger than the sprite.
     */
    that.setXOffset = function (pXOffset) {
        xOffset = pXOffset;
    };

    /**
     * Allow to specify a position in the image to display if the image is higher than the sprite.
     */
    that.setYOffset = function (pYOffset) {
        yOffset = pYOffset;
    };

    /**
     * Set the width of the  sprite.
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
    };

    /**
     * Set the height of the sprite.
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
    };

    /**
     * Retrieve the width of the sprite.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the sprite.
     */
    that.getHeight = function () {
        return height;
    };

    return that;
}