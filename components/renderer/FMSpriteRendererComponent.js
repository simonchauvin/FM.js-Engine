/**
 * 
 * @author Simon Chauvin
 * @param owner
 * @returns
 */
function FMSpriteRendererComponent(pImage, pWidth, pHeight, pOwner) {
    "use strict";
    var that = FMComponent(FMComponentTypes.renderer, pOwner),
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
         *
         */
        columnPosition = 0,
        /**
         *
         */
        linePosition = 0;

    /**
     * Specify if the image is scrolling or not.
     */
    that.scrolled = true;
    /**
     * Spatial component
     */
    that.spatial = pOwner.components[FMComponentTypes.spatial];

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        //TODO remove all postinit, have become useless
        that.spatial = pOwner.components[FMComponentTypes.spatial];
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
        bufferContext.drawImage(image, columnPosition, linePosition, width, height, xPosition, yPosition, width, height);
    };

    /**
     * Allow to specify a position in the image to display if the image is larger than the sprite.
     */
    that.setColumnPosition = function (pColumnPosition) {
        columnPosition = pColumnPosition;
    };

    /**
     * Allow to specify a position in the image to display if the image is higher than the sprite.
     */
    that.setLinePosition = function (pLinePosition) {
        linePosition = pLinePosition;
    };

    /**
     *
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
    };

    /**
     *
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
    };

    /**
     *
     */
    that.getWidth = function () {
        return width;
    };

    /**
     *
     */
    that.getHeight = function () {
        return height;
    };

    return that;
}