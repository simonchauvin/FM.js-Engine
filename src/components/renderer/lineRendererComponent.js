/**
 * 
 * @author Simon Chauvin
 */
FM.lineRendererComponent = function (pLineWidth, pLineStyle, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.RENDERER, pOwner),
        /**
         * Points constituing the line.
         */
        points = [],
        /**
         * Width of the line.
         */
        width = 0,
        /**
         * Height of the line.
         */
        height = 0,
        /**
         * Width of the line.
         */
        lineWidth = pLineWidth,
        /**
         * Style of the line.
         */
        lineStyle = pLineStyle,
        /**
         * Transparency of the line.
         */
        alpha = 1,
        /**
         * Spatial component.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];

    /**
    * Draw the line.
    * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
    * drawing is done.
    */
    that.draw = function (bufferContext, newPosition) {
        var xPosition = newPosition.x, yPosition = newPosition.y, i;
        xPosition -= bufferContext.xOffset * pOwner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * pOwner.scrollFactor.y;
        bufferContext.globalAlpha = alpha;
        if (spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(xPosition, yPosition);
            bufferContext.translate(width / 2, height / 2);
            bufferContext.rotate(spatial.angle);
            //TODO might not work since I freed the physics
            // Needs to interpolate the points
            if (points.length > 0) {
                bufferContext.beginPath();
                bufferContext.moveTo(points[0].x, points[0].y);
                for (i = 1; i < points.length; i = i + 1) {
                    bufferContext.lineTo(points[i].x, points[i].y);
                }
            }
            bufferContext.restore();
        } else {
            if (points.length > 0) {
                bufferContext.beginPath();
                bufferContext.moveTo(points[0].x, points[0].y);
                for (i = 1; i < points.length; i = i + 1) {
                    bufferContext.lineTo(points[i].x, points[i].y);
                }
            }
        }
        bufferContext.strokeStyle = lineStyle;
        bufferContext.lineWidth = lineWidth;
        bufferContext.stroke();
        bufferContext.globalAlpha = 1;
        bufferContext.lineWidth = 1;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        that.destroy();
        var i;
        for (i = 0; i < points.length; i = i + 1) {
            points[i].destroy();
        }
        points = null;
        that = null;
    };

    /**
     * Add a point to the line.
     * @param {vector} newPoint the new point to add.
     */
    that.addPoint = function (newPoint) {
        points.push(newPoint);
        var i, point, farthestRightX = 0, farthestLeftX = 0, farthestUpY = 0, farthestDownY = 0;
        for (i = 0; i < points.length; i = i + 1) {
            point = points[i];
            if (point.x > farthestRightX) {
                farthestRightX = point.x;
            }
            if (point.x < farthestLeftX) {
                farthestLeftX = point.x;
            }
            if (point.y < farthestUpY) {
                farthestUpY = point.y;
            }
            if (point.y > farthestDownY) {
                farthestDownY = point.y;
            }
        }

        width = Math.abs(farthestRightX - farthestLeftX);
        height = Math.abs(farthestDownY - farthestUpY);
    };

    /**
     * Set the width of the  line.
     * @param {int} newLineWidth new line width desired.
     */
    that.setLineWidth = function (newLineWidth) {
        lineWidth = newLineWidth;
    };

    /**
     * Set the style of the  line.
     * @param {string} newLineStyle new line style desired.
     */
    that.setLineStyle = function (newLineStyle) {
        lineStyle = newLineStyle;
    };

    /**
     * Set the transparency of the line.
     * @param {float} newAlpha new transparency value desired.
     */
    that.setAlpha = function (newAlpha) {
        alpha = newAlpha;
    };

    /**
     * Retrieve the width of the line.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the line.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Retrieve the width of the line.
     */
    that.getLineWidth = function () {
        return lineWidth;
    };

    /**
     * Retrieve the style of the line.
     */
    that.getLineStyle = function () {
        return lineStyle;
    };

    /**
     * Retrieve the transparency value of the line.
     * @return {float} current transparency value.
     */
    that.getAlpha = function () {
        return alpha;
    };

    return that;
};
