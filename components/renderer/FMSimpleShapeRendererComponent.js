/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that0}
 */
function FMSimpleShapeRendererComponent(pOwner) {
    "use strict";
    var that = FMComponent(fmComponentTypes.renderer, pOwner);

    that.spatial = pOwner.components[FMComponentTypes.spatial];

    var width = 50, height = 50, isCircle = false;
    that.scrolled = true;

    that.initRectangle = function (rectWidth, rectHeight) {
        width = rectWidth;
        height = rectHeight;
    };

    that.initCircle = function (radius) {
        width = radius;
        height = radius;
        isCircle = true;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        
    }

    that.draw = function (bufferContext) {
        var xPosition = that.spatial.x, yPosition = that.spatial.y;
        if (that.scrolled) {
            xPosition -= bufferContext.xOffset;
            yPosition -= bufferContext.yOffset;
        }

        //FIXME x and y origin is on the center of the circle, abstract that behavior so that the center is considered at the top left
        bufferContext.fillStyle = '#fff';
        if (isCircle) {
            bufferContext.beginPath();
            bufferContext.arc(xPosition + width / 2, yPosition + height / 2, width, 0, Math.PI * 2, false);
            bufferContext.closePath();
            bufferContext.fill();
        } else {
            bufferContext.fillRect(xPosition, yPosition, width, height);
        }
    };

    that.getWidth = function () {
        return width;
    };

    that.getHeight = function () {
        return height;
    };

    return that;
}