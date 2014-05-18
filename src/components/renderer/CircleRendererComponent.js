/*global FM*/
/**
 * The circle renderer component is used to render a circle associated to a game
 * object.
 * @class FM.CircleRendererComponent
 * @extends FM.Component
 * @param {int} pRadius Radius of the circle to render.
 * @param {string} pColor The color of the circle to render.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.CircleRendererComponent = function (pRadius, pColor, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Width of the circle.
     * @type int
     * @private
     */
    this.width = pRadius * 2;
    /**
     * Height of the circle.
     * @type int
     * @private
     */
    this.height = pRadius * 2;
    /**
     * Color of the circle.
     * @type string
     * @private
     */
    this.color = pColor;
    /**
     * Transparency of the circle.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Used to specify the center of the rotation to apply.
     * @type FM.Vector
     * @private
     */
    this.rotationCenter = new FM.Vector(0, 0);
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
 * FM.CircleRendererComponent inherits from FM.Component.
 */
FM.CircleRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.CircleRendererComponent.prototype.constructor = FM.CircleRendererComponent;
/**
 * Draw the circle.
 * @method FM.CircleRendererComponent#draw
 * @memberOf FM.CircleRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition The position of the circle to draw.
 */
FM.CircleRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x - bufferContext.xOffset * this.owner.scrollFactor.x,
        yPosition = newPosition.y - bufferContext.yOffset * this.owner.scrollFactor.y,
        newCenter = new FM.Vector(xPosition + this.width / 2, yPosition + this.height / 2);
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
        bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.beginPath();
        bufferContext.arc(Math.round(this.rotationCenter.x), Math.round(this.rotationCenter.y), Math.round(this.width / 2), 0, 2 * Math.PI);
        bufferContext.restore();
    } else {
        bufferContext.beginPath();
        bufferContext.arc(Math.round(newCenter.x), Math.round(newCenter.y), Math.round(this.width / 2), 0, 2 * Math.PI);
    }
    bufferContext.fillStyle = this.color;
    bufferContext.fill();
    bufferContext.globalAlpha = 1;
};
/**
 * Set the width of the  circle.
 * @method FM.CircleRendererComponent#setWidth
 * @memberOf FM.CircleRendererComponent
 * @param {int} pNewWidth New width desired.
 */
FM.CircleRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.width = pNewWidth;
    this.height = pNewWidth;
};
/**
 * Set the height of the circle.
 * @method FM.CircleRendererComponent#setHeight
 * @memberOf FM.CircleRendererComponent
 * @param {int} pNewHeight New height desired.
 */
FM.CircleRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.height = pNewHeight;
    this.width = pNewHeight;
};
/**
 * Set the radius of the  circle.
 * @method FM.CircleRendererComponent#setRadius
 * @memberOf FM.CircleRendererComponent
 * @param {int} pNewRadius New radius desired.
 */
FM.CircleRendererComponent.prototype.setRadius = function (pNewRadius) {
    "use strict";
    this.width = pNewRadius * 2;
    this.height = pNewRadius * 2;
};
/**
 * Set the color of the  circle.
 * @method FM.CircleRendererComponent#setColor
 * @memberOf FM.CircleRendererComponent
 * @param {string} pNewColor New color desired.
 */
FM.CircleRendererComponent.prototype.setColor = function (pNewColor) {
    "use strict";
    this.color = pNewColor;
};
/**
 * Set the transparency of the circle.
 * @method FM.CircleRendererComponent#setAlpha
 * @memberOf FM.CircleRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.CircleRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the circle.
 * @method FM.CircleRendererComponent#getWidth
 * @memberOf FM.CircleRendererComponent
 * @return {int} The width of the circle.
 */
FM.CircleRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the circle.
 * @method FM.CircleRendererComponent#getHeight
 * @memberOf FM.CircleRendererComponent
 * @return {int} The height of the circle.
 */
FM.CircleRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the radius of the circle.
 * @method FM.CircleRendererComponent#getRadius
 * @memberOf FM.CircleRendererComponent
 * @return {int} The radius of the circle.
 */
FM.CircleRendererComponent.prototype.getRadius = function () {
    "use strict";
    return this.width / 2;
};
/**
 * Retrieve the color of the circle.
 * @method FM.CircleRendererComponent#getColor
 * @memberOf FM.CircleRendererComponent
 * @return {string} The color of the circle.
 */
FM.CircleRendererComponent.prototype.getColor = function () {
    "use strict";
    return this.color;
};
/**
 * Retrieve the transparency value of the circle.
 * @method FM.CircleRendererComponent#getAlpha
 * @memberOf FM.CircleRendererComponent
 * @return {float} Current transparency value.
 */
FM.CircleRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.CircleRendererComponent#destroy
 * @memberOf FM.CircleRendererComponent
 */
FM.CircleRendererComponent.prototype.destroy = function () {
    "use strict";
    this.width = null;
    this.height = null;
    this.color = null;
    this.alpha = null;
    this.spatial = null;
    FM.Component.prototype.destroy.call(this);
};
