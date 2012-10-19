/**
 * 
 * @author Simon Chauvin
 * @param owner
 * @returns
 */
function FMSpriteRendererComponent(pImage, pWidth, pHeight, pOwner) {
    "use strict";
    var that = FMComponent(FMComponentTypes.RENDERER, pOwner),
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
        spatial = pOwner.components[FMComponentTypes.SPATIAL];

    /**
     * Specify if the image is scrolling or not.
     * //TODO should  be in the game object
     */
    that.scrolled = true;

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        //TODO remove all postinit, have become useless
        spatial = pOwner.components[FMComponentTypes.SPATIAL];
    };

    /**
    * Draw the sprite
    */
    that.draw = function (bufferContext) {
        var xPosition = spatial.x, yPosition = spatial.y;
        if (that.scrolled) {
            xPosition -= bufferContext.xOffset;
            yPosition -= bufferContext.yOffset;
        }
        if (spatial.angle != 0) {
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