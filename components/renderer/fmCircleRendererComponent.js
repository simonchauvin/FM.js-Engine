/**
 * 
 * @author Simon Chauvin
 */
FMENGINE.fmCircleRendererComponent = function (pCenter, pRadius, pColor, pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.RENDERER, pOwner),
        /**
         * Center position of the circle. Is not modified if the radius is
         * changed.
         */
        center = pCenter,
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
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];

    /**
    * Draw the circle.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y,
                newCenter = FMENGINE.fmVector(xPosition + width / 2, yPosition + height / 2);
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            bufferContext.beginPath();
            bufferContext.arc(newCenter.x, newCenter.y, width / 2, 0, 2 * Math.PI);
            bufferContext.restore();
        } else {
            bufferContext.beginPath();
            bufferContext.arc(newCenter.x, newCenter.y, width / 2, 0, 2 * Math.PI);
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