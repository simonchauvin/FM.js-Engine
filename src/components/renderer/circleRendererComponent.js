/**
 * 
 * @author Simon Chauvin
 */
FM.circleRendererComponent = function (pRadius, pColor, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Width of the circle.
         */
        width = pRadius * 2,
        /**
         * Height of the circle.
         */
        height = pRadius * 2,
        /**
         * Color of the circle.
         */
        color = pColor,
        /**
         * Transparency of the circle.
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
    * Draw the circle.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on which 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x - bufferContext.xOffset * pOwner.scrollFactor.x, 
            yPosition = newPosition.y - bufferContext.yOffset * pOwner.scrollFactor.y,
            newCenter = FM.vector(xPosition + width / 2, yPosition + height / 2);
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
            bufferContext.translate(Math.round(width / 2), Math.round(height / 2));
            bufferContext.rotate(spatial.angle);
            bufferContext.beginPath();
            bufferContext.arc(Math.round(newCenter.x), Math.round(newCenter.y), Math.round(width / 2), 0, 2 * Math.PI);
            bufferContext.restore();
        } else {
            bufferContext.beginPath();
            bufferContext.arc(Math.round(newCenter.x), Math.round(newCenter.y), Math.round(width / 2), 0, 2 * Math.PI);
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
     * Set the width of the  circle.
     * @param {int} newWidth new width desired.
     */
    that.setWidth = function (newWidth) {
        width = newWidth;
        height = newWidth;
    };

    /**
     * Set the height of the circle.
     * @param {int} newHeight new height desired.
     */
    that.setHeight = function (newHeight) {
        height = newHeight;
        width = newHeight;
    };

    /**
     * Set the radius of the  circle.
     * @param {int} newRadius new radius desired.
     */
    that.setRadius = function (newRadius) {
        width = newRadius * 2;
        height = newRadius * 2;
    };

    /**
     * Set the color of the  circle.
     * @param {string} newColor new color desired.
     */
    that.setColor = function (newColor) {
        color = newColor;
    };

    /**
     * Set the transparency of the circle.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the circle.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the circle.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Retrieve the radius of the circle.
     */
    that.getRadius = function () {
        return width / 2;
    };

    /**
     * Retrieve the color of the circle.
     */
    that.getColor = function () {
        return color;
    };

    /**
     * Retrieve the transparency value of the circle.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
