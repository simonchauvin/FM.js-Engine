/*global FM*/
/**
 * A component for rendering text.
 * @class FM.TextRendererComponent
 * @extends FM.Component
 * @param {string} pTextToDisplay The text to be rendered.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.TextRendererComponent = function (pTextToDisplay, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Text to be displayed.
     * @type string
     * @public
     */
    this.text = pTextToDisplay;
    /**
     * With of the text container.
     * @type int
     * @public
     */
    this.width = 50;
    /**
     * Height of the text container.
     * @type int
     * @public
     */
    this.height = 50;
    /**
     * The color of the font.
     * @type string
     * @public
     */
    this.fillStyle = '#fff';
    /**
     * The font size and font name to use.
     * @type string
     * @public
     */
    this.font = '30px sans-serif';
    /**
     * Alignment of the text.
     * @type string
     * @public
     */
    this.textBaseline = 'middle';
    /**
     * The spatial component.
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
 * FM.TextRendererComponent inherits from FM.Component.
 */
FM.TextRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.TextRendererComponent.prototype.constructor = FM.TextRendererComponent;
/**
 * Format the text.
 * @method FM.TextRendererComponent#setFormat
 * @memberOf FM.TextRendererComponent
 * @param {string} pColor The color of the text.
 * @param {string} pFont The font size and name of the text.
 * @param {string} pAlignment Alignment of the text.
 */
FM.TextRendererComponent.prototype.setFormat = function (pColor, pFont, pAlignment) {
    "use strict";
    this.fillStyle = pColor;
    this.font = pFont;
    this.textBaseline = pAlignment;
};
/**
 * Draw the text.
 * @method FM.TextRendererComponent#draw
 * @memberOf FM.TextRendererComponent
 * @param {CanvasRenderingContext2D} bufferCanvas The context on which to draw.
 * @param {FM.Vector} newPosition The position to draw the text.
 * 
 */
FM.TextRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x, yPosition = newPosition.y;
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    bufferContext.fillStyle = this.fillStyle;
    bufferContext.font = this.font;
    bufferContext.textBaseline = this.textBaseline;
    bufferContext.fillText(this.text, Math.round(xPosition), Math.round(yPosition));
};
/**
 * Retrieve the width of the text container.
 * @method FM.TextRendererComponent#getWidth
 * @memberOf FM.TextRendererComponent
 * @return {int} The width of the text container.
 */
FM.TextRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of the text container.
 * @method FM.TextRendererComponent#getHeight
 * @memberOf FM.TextRendererComponent
 * @return {int} The height of the text container.
 */
FM.TextRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Destroy the component and its objects.
 * @method FM.TextRendererComponent#destroy
 * @memberOf FM.TextRendererComponent
 */
FM.TextRendererComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    this.text = null;
    this.width = null;
    this.height = null;
    this.fillStyle = null;
    this.font = null;
    this.textBaseline = null;
    FM.Component.prototype.destroy.call(this);
};
