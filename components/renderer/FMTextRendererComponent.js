/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmTextRendererComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.renderer, owner));

    //Retrieve the spatial component
    that.spatial = owner.components[fmComponentTypes.spatial];

    var width = 50, height = 50;

    //Text to be displayed
    that.text = "";

    // Default parameters
    that.fillStyle = '#fff';
    that.font = '30px sans-serif';
    that.textBaseline = 'middle';
    that.scrolled = false;

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
    that.draw = function (bufferContext) {
        var xPosition = that.spatial.x, yPosition = that.spatial.y;
        if (that.scrolled) {
            xPosition -= bufferContext.xOffset;
            yPosition -= bufferContext.yOffset;
        }
        bufferContext.fillStyle = that.fillStyle;
        bufferContext.font = that.font;
        bufferContext.textBaseline = that.textBaseline;
        bufferContext.fillText(that.text, xPosition, yPosition);
    };

    that.getWidth = function () {
        return width;
    };

    that.getHeight = function () {
        return height;
    };

    return that;
}