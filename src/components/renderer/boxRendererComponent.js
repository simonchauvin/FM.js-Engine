/**
 * 
 * @author Simon Chauvin
 */
FM.boxRendererComponent = function (pWidth, pHeight, pColor, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Width of the box.
         */
        width = pWidth,
        /**
         * Height of the box.
         */
        height = pHeight,
        /**
         * Color of the box.
         */
        color = pColor,
        /**
         * Transparency of the box.
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
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
    * Draw the box.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on which 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        xPosition = Math.round(xPosition);
        yPosition = Math.round(yPosition);
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(Math.round(width / 2), Math.round(height / 2));
            bufferContext.rotate(spatial.angle);
            bufferContext.beginPath();
            bufferContext.rect(xPosition, yPosition, width, height);
            bufferContext.restore();
        } else {
            bufferContext.beginPath();
            bufferContext.rect(xPosition, yPosition, width, height);
        }
        bufferContext.fillStyle = color;
        bufferContext.fill();
        bufferContext.globalAlpha = 1;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Set the width of the box.
     * @param {int} newWidth new width desired.
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
    };

    /**
     * Set the height of the box.
     * @param {int} newHeight new height desired.
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
    };

    /**
     * Set the color of the  box.
     * @param {string} newColor new color desired.
     */
    that.setColor = function (newColor) {
        color = newColor;
    };

    /**
     * Set the transparency of the box.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the box.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the box.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Retrieve the color of the box.
     */
    that.getColor = function () {
        return color;
    };

    /**
     * Retrieve the transparency value of the box.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
