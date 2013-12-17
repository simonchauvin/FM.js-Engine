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
         * 
         */
        imageData = null,
        /**
         * Width of the sprite.
         */
        width = pWidth,
        /**
         * Height of the sprite.
         */
        height = pHeight,
        /**
         * Transparency of the sprite.
         */
        alpha = 1,
        /**
         * Offset in case the image width is greater than the sprite.
         */
        offset = FM.vector(0, 0),
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    //Check if a spatial component is present
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Draw the sprite.
     * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
     * drawing is done.
     */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            //Draw the image or its data if the image is bigger than the sprite
            //to display
            if (imageData) {
                //TODO allow a sprite to be resized
                bufferContext.putImageData(imageData, -width / 2, -height / 2);
            } else {
                bufferContext.drawImage(image, -width / 2, -height / 2, width, height);
            }
            bufferContext.restore();
        } else {
            //Draw the image or its data if the image is bigger than the sprite
            //to display
            if (imageData) {
                bufferContext.putImageData(imageData, xPosition, yPosition);
            } else {
                bufferContext.drawImage(image, xPosition, yPosition, width, height);
            }
        }
        bufferContext.globalAlpha = 1;
    };

    /**
     * Specifies the offset at which the part of the image to display is. Useful
     * when using tilesets.
     */
    that.setOffset = function (pX, pY) {
        offset.reset(pX, pY);
        //Retrieve image data since the drawImage for slicing is not working properly
        var tmpCanvas = document.createElement("canvas"),
            tmpContext = tmpCanvas.getContext("2d");
        tmpCanvas.width = image.width;
        tmpCanvas.height = image.height;
        tmpContext.drawImage(image, 0, 0, image.width, image.height);
        imageData = tmpContext.getImageData(offset.x, offset.y, width, height);
        delete this.tmpContext;
        delete this.tmpCanvas;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        imageData = null;
        offset.destroy();
        offset = null;
        image.destroy();
        image = null;
        spatial = null;
        that.destroy();
        that = null;
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
     * Set the width of the  sprite.
     * @param {int} newWidth new width desired.
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
    };

    /**
     * Set the height of the sprite.
     * @param {int} newHeight new height desired.
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
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
        return width;
    };

    /**
     * Retrieve the height of the sprite.
     */
    that.getHeight = function () {
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
