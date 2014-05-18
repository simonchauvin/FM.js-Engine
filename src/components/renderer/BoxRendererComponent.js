/*global FM*/
/**
 * The box renderer component is used to associate a box of a given color to a 
 * game object.
 * @class FM.BoxRendererComponent
 * @extends FM.Component
 * @param {int} pWidth The width of the box to render.
 * @param {int} pHeight The height of the box to render.
 * @param {string} pColor Color of the box to render.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.BoxRendererComponent = function (pWidth, pHeight, pColor, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Width of the box.
     * @type int
     * @private
     */
    this.width = pWidth;
    /**
     * Height of the box.
     * @type int
     * @private
     */
    this.height = pHeight;
    /**
     * Color of the box.
     * @type string
     * @private
     */
    this.color = pColor;
    /**
     * Transparency of the box.
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
 * FM.BoxRendererComponent inherits from FM.Component.
 */
FM.BoxRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.BoxRendererComponent.prototype.constructor = FM.BoxRendererComponent;
/**
 * Draw the box.
 * @method FM.BoxRendererComponent#draw
 * @memberOf FM.BoxRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition Position of the box to render.
 */
FM.BoxRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x, yPosition = newPosition.y;
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
        bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.beginPath();
        bufferContext.rect(this.rotationCenter.x, this.rotationCenter.y, this.width, this.height);
        bufferContext.restore();
    } else {
        bufferContext.beginPath();
        bufferContext.rect(xPosition, yPosition, this.width, this.height);
    }
    bufferContext.fillStyle = this.color;
    bufferContext.fill();
    bufferContext.globalAlpha = 1;
};
/**
 * Set the width of the box.
 * @method FM.BoxRendererComponent#setWidth
 * @memberOf FM.BoxRendererComponent
 * @param {int} pNewWidth New width desired.
 */
FM.BoxRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.width = pNewWidth;
};
/**
 * Set the height of the box.
 * @method FM.BoxRendererComponent#setHeight
 * @memberOf FM.BoxRendererComponent
 * @param {int} pNewHeight New height desired.
 */
FM.BoxRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.height = pNewHeight;
};
/**
 * Set the color of the  box.
 * @method FM.BoxRendererComponent#setColor
 * @memberOf FM.BoxRendererComponent
 * @param {string} pNewColor New color desired.
 */
FM.BoxRendererComponent.prototype.setColor = function (pNewColor) {
    "use strict";
    this.color = pNewColor;
};
/**
 * Set the transparency of the box.
 * @method FM.BoxRendererComponent#setAlpha
 * @memberOf FM.BoxRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.BoxRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the box.
 * @method FM.BoxRendererComponent#getWidth
 * @memberOf FM.BoxRendererComponent
 * @return {int} Width of the box.
 */
FM.BoxRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the box.
 * @method FM.BoxRendererComponent#getHeight
 * @memberOf FM.BoxRendererComponent
 * @return {int} Height of the box.
 */
FM.BoxRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the color of the box.
 * @method FM.BoxRendererComponent#getColor
 * @memberOf FM.BoxRendererComponent
 * @return {string} Color of the box.
 */
FM.BoxRendererComponent.prototype.getColor = function () {
    "use strict";
    return this.color;
};
/**
 * Retrieve the transparency value of the box.
 * @method FM.BoxRendererComponent#getAlpha
 * @memberOf FM.BoxRendererComponent
 * @return {float} Current transparency value.
 */
FM.BoxRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.BoxRendererComponent#destroy
 * @memberOf FM.BoxRendererComponent
 */
FM.BoxRendererComponent.prototype.destroy = function () {
    "use strict";
    this.width = null;
    this.height = null;
    this.spatial = null;
    this.color = null;
    FM.Component.prototype.destroy.call(this);
};
