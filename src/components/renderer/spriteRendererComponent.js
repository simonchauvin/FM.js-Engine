/*global FM*/
/**
 * The sprite renderer component is used to associate an image to a game object.
 * @class FM.SpriteRendererComponent
 * @extends FM.Component
 * @param {FM.ImageAsset} pImage Image to use for rendering.
 * @param {int} pWidth Width of the sprite.
 * @param {int} pHeight Height of the sprite.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.SpriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Offset in case the image width is greater than the sprite.
     * @type FM.Vector
     * @public
     */
    this.offset = new FM.Vector(0, 0);
    /**
     * Image of the sprite.
     * @type FM.ImageAsset
     * @private
     */
    this.image = pImage.getImage();
    /**
     * Width of the sprite to display.
     * @type int
     * @private
     */
    this.width = pWidth;
    /**
     * Height of the sprite to display.
     * @type int
     * @private
     */
    this.height = pHeight;
    /**
     * Width of the resized sprite.
     * @type int
     * @private
     */
    this.changedWidth = pWidth;
    /**
     * Height of the resized sprite.
     * @type int
     * @private
     */
    this.changedHeight = pHeight;
    /**
     * Transparency of the sprite.
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
    //Check if an image was provided
    if (!this.image && FM.Parameters.debug) {
        console.log("ERROR: No image was provided and you need one for rendering a sprite.");
    }
};
/**
 * FM.SpriteRendererComponent inherits from FM.Component.
 */
FM.SpriteRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.SpriteRendererComponent.prototype.constructor = FM.SpriteRendererComponent;
/**
 * Draw the sprite.
 * @method FM.SpriteRendererComponent#draw
 * @memberOf FM.SpriteRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition Position of the sprite to render.
 */
FM.SpriteRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x,
        yPosition = newPosition.y,
        offset = new FM.Vector(Math.round(this.offset.x), Math.round(this.offset.y));
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
        bufferContext.translate(Math.round(this.width / 2), Math.round(this.height / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.drawImage(this.image, offset.x, offset.y, this.width, this.height, Math.round(-this.changedWidth / 2), Math.round(-this.changedHeight / 2), this.changedWidth, this.changedHeight);
        bufferContext.restore();
    } else {
        bufferContext.drawImage(this.image, offset.x, offset.y, this.width, this.height, Math.round(xPosition), Math.round(yPosition), this.changedWidth, this.changedHeight);
    }
    bufferContext.globalAlpha = 1;
};
/**
 * Change the size of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.SpriteRendererComponent#changeSize
 * @memberOf FM.SpriteRendererComponent
 * @param {float} pFactor Factor by which the size will be changed.
 */
FM.SpriteRendererComponent.prototype.changeSize = function (pFactor) {
    "use strict";
    this.changedWidth = pFactor * this.width;
    this.changedHeight = pFactor * this.height;
};
/**
 * Set the width of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.SpriteRendererComponent#setWidth
 * @memberOf FM.SpriteRendererComponent
 * @param {int} pNewWidth New width of the sprite.
 */
FM.SpriteRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.changedWidth = pNewWidth;
};
/**
 * Set the height of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.SpriteRendererComponent#setHeight
 * @memberOf FM.SpriteRendererComponent
 * @param {float} pNewHeight New height of the sprite.
 */
FM.SpriteRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.changedHeight = pNewHeight;
};
/**
 * Set a new image.
 * @method FM.SpriteRendererComponent#setImage
 * @memberOf FM.SpriteRendererComponent
 * @param {FM.ImageAsset} pImage The new image of the sprite.
 * @param {int} pWidth The width of the sprite.
 * @param {int} pHeight The height of the sprite.
 */
FM.SpriteRendererComponent.prototype.setImage = function (pImage, pWidth, pHeight) {
    "use strict";
    this.image = pImage.getImage();
    this.width = pWidth;
    this.height = pHeight;
};
/**
 * Set the transparency of the sprite.
 * @method FM.SpriteRendererComponent#setAlpha
 * @memberOf FM.SpriteRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.SpriteRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the width of the sprite.
 * @method FM.SpriteRendererComponent#getWidth
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The actual width of the sprite.
 */
FM.SpriteRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.changedWidth;
};
/**
 * Retrieve the height of the sprite.
 * @method FM.SpriteRendererComponent#getHeight
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The actual height of the sprite.
 */
FM.SpriteRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.changedHeight;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.SpriteRendererComponent#getOriginalWidth
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The width of the sprite before resizing.
 */
FM.SpriteRendererComponent.prototype.getOriginalWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.SpriteRendererComponent#getOriginalHeight
 * @memberOf FM.SpriteRendererComponent
 * @return {int} The height of the sprite before resizing.
 */
FM.SpriteRendererComponent.prototype.getOriginalHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Retrieve the transparency value of the sprite.
 * @method FM.SpriteRendererComponent#getAlpha
 * @memberOf FM.SpriteRendererComponent
 * @return {float} Current transparency value.
 */
FM.SpriteRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.SpriteRendererComponent#destroy
 * @memberOf FM.SpriteRendererComponent
 */
FM.SpriteRendererComponent.prototype.destroy = function () {
    "use strict";
    this.offset.destroy();
    this.offset = null;
    this.image = null;
    this.spatial = null;
    this.width = null;
    this.height = null;
    this.changedWidth = null;
    this.changedHeight = null;
    this.alpha = null;
    FM.Component.prototype.destroy.call(this);
};
