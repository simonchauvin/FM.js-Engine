/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FMENGINE.fmTextRendererComponent = function (pTextToDisplay, pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.RENDERER, pOwner),
        /**
         * The spatial component.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL],
        /**
         * With of the text container.
         */
        width = 50,
        /**
         * Height of the text container.
         */
        height = 50;

    //Text to be displayed
    that.text = pTextToDisplay;

    // Default parameters
    that.fillStyle = '#fff';
    that.font = '30px sans-serif';
    that.textBaseline = 'middle';

    /**
    * Set the format of the text
    */
    that.setFormat = function (color, font, alignment) {
        that.fillStyle = color;
        that.font = font;
        that.textBaseline = alignment;
    };

    /**
    * Draw the text
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.fillStyle = that.fillStyle;
        bufferContext.font = that.font;
        bufferContext.textBaseline = that.textBaseline;
        bufferContext.fillText(that.text, xPosition, yPosition);
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function() {
        spatial = null;
        that.text = null;
        that.fillStyle = null;
        that.font = null;
        that.textBaseline = null;
        that.destroy();
        that = null;
    };

    /**
     * Retrieve the width of the text container.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the text container.
     */
    that.getHeight = function () {
        return height;
    };

    return that;
}