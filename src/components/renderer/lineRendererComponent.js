/*global FM*/
/**
 * The line renderer component is used to render a line associated to a game 
 * object.
 * @class FM.LineRendererComponent
 * @extends FM.Component
 * @param {int} pLineWidth Width of the line to render.
 * @param {string} pLineStyle The style of the line to draw.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.LineRendererComponent = function (pLineWidth, pLineStyle, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Points constituing the line.
     * @type Array
     * @private
     */
    this.points = [];
    /**
     * Width of the line.
     * @type int
     * @private
     */
    this.width = 0;
    /**
     * Height of the line.
     * @type int
     * @private
     */
    this.height = 0;
    /**
     * Width of the line.
     * @type int
     * @private
     */
    this.lineWidth = pLineWidth;
    /**
     * Style of the line.
     * @type string
     * @private
     */
    this.lineStyle = pLineStyle;
    /**
     * Transparency of the line.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Spatial component.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
};
/**
 * FM.LineRendererComponent inherits from FM.Component.
 */
FM.LineRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.LineRendererComponent.prototype.constructor = FM.LineRendererComponent;
/**
 * Draw the line.
 * @method FM.LineRendererComponent#draw
 * @memberOf FM.LineRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition Position of the line to render.
 */
FM.LineRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    if (this.points.length > 0) {
        var xPosition = newPosition.x, yPosition = newPosition.y, i;
        xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
        yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
        bufferContext.globalAlpha = this.alpha;
        if (this.spatial.angle !== 0) {
            bufferContext.save();
            bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
            bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
            bufferContext.rotate(this.spatial.angle);
            //TODO might not work since I freed the physics
            // Needs to interpolate the points
            bufferContext.beginPath();
            bufferContext.moveTo(Math.round(this.points[0].x), Math.round(this.points[0].y));
            for (i = 1; i < this.points.length; i = i + 1) {
                bufferContext.lineTo(Math.round(this.points[i].x), Math.round(this.points[i].y));
            }
            bufferContext.restore();
        } else {
            bufferContext.beginPath();
            bufferContext.moveTo(Math.round(this.points[0].x), Math.round(this.points[0].y));
            for (i = 1; i < this.points.length; i = i + 1) {
                bufferContext.lineTo(Math.round(this.points[i].x), Math.round(this.points[i].y));
            }
        }
        bufferContext.strokeStyle = this.lineStyle;
        bufferContext.lineWidth = this.lineWidth;
        bufferContext.stroke();
        bufferContext.globalAlpha = 1;
        bufferContext.lineWidth = 1;
    }
};
/**
 * Add a point to the line to be drawn.
 * @method FM.LineRendererComponent#addPoint
 * @memberOf FM.LineRendererComponent
 * @param {FM.Vector} pNewPoint The new point to add.
 */
FM.LineRendererComponent.prototype.addPoint = function (pNewPoint) {
    "use strict";
    this.points.push(pNewPoint);
    var i, point, farthestRightX = 0, farthestLeftX = 0, farthestUpY = 0, farthestDownY = 0;
    for (i = 0; i < this.points.length; i = i + 1) {
        point = this.points[i];
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

    this.width = Math.abs(farthestRightX - farthestLeftX);
    this.height = Math.abs(farthestDownY - farthestUpY);
};
/**
 * Reset the lines.
 * @method FM.LineRendererComponent#clear
 * @memberOf FM.LineRendererComponent
 */
FM.LineRendererComponent.prototype.clear = function () {
    "use strict";
    delete this.points;
    this.points = [];
};
/**
 * Set the width of the  line (weight).
 * @method FM.LineRendererComponent#setLineWidth
 * @memberOf FM.LineRendererComponent
 * @param {int} pNewLineWidth New line width desired.
 */
FM.LineRendererComponent.prototype.setLineWidth = function (pNewLineWidth) {
    "use strict";
    this.lineWidth = pNewLineWidth;
};
/**
 * Set the style of the  line.
 * @method FM.LineRendererComponent#setLineStyle
 * @memberOf FM.LineRendererComponent
 * @param {string} pNewLineStyle New line style desired.
 */
FM.LineRendererComponent.prototype.setLineStyle = function (pNewLineStyle) {
    "use strict";
    this.lineStyle = pNewLineStyle;
};
/**
 * Set the transparency of the line.
 * @method FM.LineRendererComponent#setAlpha
 * @memberOf FM.LineRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.LineRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the line (distance from start to end).
 * @method FM.LineRendererComponent#getWidth
 * @memberOf FM.LineRendererComponent
 * @return {int} The width of the line.
 */
FM.LineRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the line(distance from start to end).
 * @method FM.LineRendererComponent#getHeight
 * @memberOf FM.LineRendererComponent
 * @return {int} The height of the line.
 */
FM.LineRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the width of the line (weight).
 * @method FM.LineRendererComponent#getLineWidth
 * @memberOf FM.LineRendererComponent
 * @return {int} The width of the line.
 */
FM.LineRendererComponent.prototype.getLineWidth = function () {
    "use strict";
    return this.lineWidth;
};
/**
 * Retrieve the style of the line.
 * @method FM.LineRendererComponent#getLineStyle
 * @memberOf FM.LineRendererComponent
 * @return {string} The style of the line.
 */
FM.LineRendererComponent.prototype.getLineStyle = function () {
    "use strict";
    return this.lineStyle;
};
/**
 * Retrieve the transparency value of the line.
 * @method FM.LineRendererComponent#getAlpha
 * @memberOf FM.LineRendererComponent
 * @return {float} Current transparency value.
 */
FM.LineRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.LineRendererComponent#destroy
 * @memberOf FM.LineRendererComponent
 */
FM.LineRendererComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    this.width = null;
    this.height = null;
    this.lineWidth = null;
    this.lineHeight = null;
    this.alpha = null;
    var i;
    for (i = 0; i < this.points.length; i = i + 1) {
        this.points[i].destroy();
        this.points[i] = null;
    }
    this.points = null;
    FM.Component.prototype.destroy.call(this);
};
