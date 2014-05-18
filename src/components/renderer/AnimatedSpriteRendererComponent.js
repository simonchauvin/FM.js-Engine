/*global FM*/
/**
 * The animated sprite renderer component is used for drawing sprites with
 * animations, it requires a spritesheet.
 * @class FM.AnimatedSpriteRendererComponent
 * @extends FM.Component
 * @param {FM.ImageAsset} pImage Image of the spritesheet.
 * @param {int} pWidth Width of a frame of the spritesheet.
 * @param {int} pHeight Height of a frame of the spritesheet.
 * @param {FM.GameObject} pOwner Game object owner of the component.
 * @constructor
 * @author Simon Chauvin
 */
FM.AnimatedSpriteRendererComponent = function (pImage, pWidth, pHeight, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.RENDERER, pOwner);
    /**
     * Read-only attributes that specifies whether the current animation has
     * finished playing or not.
     * @type boolean
     * @public
     */
    this.finished = false;
    /**
     * Image of the sprite.
     * @type FM.ImageAsset
     * @private
     */
    this.image = pImage.image;
    /**
     * Width of the spritesheet.
     * @type int
     * @private
     */
    this.imageWidth = this.image.width;
    /**
     * Height of the spritesheet.
     * @type int
     * @private
     */
    this.imageHeight = this.image.height;
    /**
     * Width of a frame of the spritesheet.
     * @type int
     * @private
     */
    this.frameWidth = pWidth;
    /**
     * Height of a frame of the spritesheet.
     * @type int
     * @private
     */
    this.frameHeight = pHeight;
    /**
     * Width of a resized frame of the spritesheet.
     * @type int
     * @private
     */
    this.changedWidth = pWidth;
    /**
     * Height of a resized frame of the spritesheet.
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
     * Current animation being played.
     * @type string
     * @private
     */
    this.currentAnim = "";
    /**
     * Whether there is a flipped version of the animation frames or not.
     * @type boolean
     * @private
     */
    this.flipped = false;
    /**
     * Current horizontal offset of position on the spritesheet.
     * @type int
     * @private
     */
    this.xOffset = 0;
    /**
     * Current vertical offset of position on the spritesheet.
     * @type int
     * @private
     */
    this.yOffset = 0;
    /**
     * Frames constituing the animation.
     * @type Array
     * @private
     */
    this.frames = [];
    /**
     * Current frame being displayed.
     * @type int
     * @private
     */
    this.currentFrame = 0;
    /**
     * Current time in seconds.
     * @type float
     * @private
     */
    this.currentTime = 0;
    /**
     * Maximum delay between each frames.
     * @type float
     * @private
     */
    this.delay = 0.1;
    /**
     * Current delay between frames.
     * @type float
     * @private
     */
    this.currentDelay = 0.1;
    /**
     * Whether a specific animation should loop or not.
     * @type Array
     * @private
     */
    this.loop = [];
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
    if (!this.image && FM.Parameters.debug) {
        console.log("ERROR: No image was provided and you need one for rendering an animated sprite.");
    }
};
/**
 * FM.AnimatedSpriteRendererComponent inherits from FM.Component.
 */
FM.AnimatedSpriteRendererComponent.prototype = Object.create(FM.Component.prototype);
FM.AnimatedSpriteRendererComponent.prototype.constructor = FM.AnimatedSpriteRendererComponent;
/**
 * Add an animation.
 * @method FM.AnimatedSpriteRendererComponent#addAnimation
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {string} pName Name of the animation.
 * @param {Array} pFrames Frames of the animation.
 * @param {int} pFrameRate Speed of the animation.
 * @param {boolean} pIsLooped Whether the animation should loop or not.
 */
FM.AnimatedSpriteRendererComponent.prototype.addAnimation = function (pName, pFrames, pFrameRate, pIsLooped) {
    "use strict";
    this.currentFrame = 0;
    this.currentAnim = pName;
    this.frames[pName] = pFrames;
    this.delay = 1 / pFrameRate;
    //TODO generate flipped version
    //flipped = isReversed;
    this.currentDelay = this.delay;
    this.loop[pName] = pIsLooped;
};
/**
 * Play the given animation.
 * @method FM.AnimatedSpriteRendererComponent#play
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {string} pAnimName Name of the animation to be played.
 */
FM.AnimatedSpriteRendererComponent.prototype.play = function (pAnimName) {
    "use strict";
    //In case the width of the sprite have been modified
    //imageWidth = image.width;
    //imageHeight = image.height;
    this.currentAnim = pAnimName;
    this.finished = false;
    this.currentFrame = 0;
    this.xOffset = this.frames[this.currentAnim][this.currentFrame] * this.frameWidth;
    this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
    if (this.xOffset >= this.imageWidth) {
        this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
        this.xOffset = (this.xOffset % this.imageWidth);
        this.xOffset = Math.round(this.xOffset);
        this.yOffset = Math.round(this.yOffset);
    }
};
/**
 * Stop the animation.
 * @method FM.AnimatedSpriteRendererComponent#stop
 * @memberOf FM.AnimatedSpriteRendererComponent
 */
FM.AnimatedSpriteRendererComponent.prototype.stop = function () {
    "use strict";
    this.finished = true;
};
/**
 * Draw the sprite.
 * @method FM.AnimatedSpriteRendererComponent#draw
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on which drawing is 
 * done.
 * @param {FM.Vector} newPosition The position of the object to draw.
 */
FM.AnimatedSpriteRendererComponent.prototype.draw = function (bufferContext, newPosition) {
    "use strict";
    var xPosition = newPosition.x, yPosition = newPosition.y,
        newTime = (new Date()).getTime() / 1000;
    xPosition -= bufferContext.xOffset * this.owner.scrollFactor.x;
    yPosition -= bufferContext.yOffset * this.owner.scrollFactor.y;
    bufferContext.globalAlpha = this.alpha;
    if (this.spatial.angle !== 0) {
        bufferContext.save();
        bufferContext.translate(Math.round(xPosition), Math.round(yPosition));
        bufferContext.translate(Math.round(this.frameWidth / 2), Math.round(this.frameHeight / 2));
        bufferContext.rotate(this.spatial.angle);
        bufferContext.drawImage(this.image, Math.round(this.xOffset), Math.round(this.yOffset), this.frameWidth, this.frameHeight, Math.round((this.rotationCenter.x - this.changedWidth) / 2), Math.round((this.rotationCenter.y - this.changedHeight) / 2), this.changedWidth, this.changedHeight);
        bufferContext.restore();
    } else {
        bufferContext.drawImage(this.image, Math.round(this.xOffset), Math.round(this.yOffset), this.frameWidth, this.frameHeight, Math.round(xPosition), Math.round(yPosition), this.changedWidth, this.changedHeight);
    }
    bufferContext.globalAlpha = 1;
    //If the anim is not finished playing
    if (!this.finished) {
        if (this.currentDelay <= 0) {
            this.currentDelay = this.delay;
            if (this.frames[this.currentAnim]) {
                if (this.frames[this.currentAnim].length > 1) {
                    this.currentFrame = this.currentFrame + 1;
                    //If the current anim exists and that the current frame is the last one
                    if (this.frames[this.currentAnim] && (this.currentFrame === this.frames[this.currentAnim].length - 1)) {
                        if (this.loop[this.currentAnim]) {
                            this.currentFrame = 0;
                        } else {
                            this.finished = true;
                        }
                    }
                } else {
                    this.finished = true;
                }
                this.xOffset = this.frames[this.currentAnim][this.currentFrame] * this.frameWidth;
                this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
                if (this.xOffset >= this.imageWidth) {
                    this.yOffset = Math.floor(this.xOffset / this.imageWidth) * this.frameHeight;
                    this.xOffset = (this.xOffset % this.imageWidth);
                    this.xOffset = Math.round(this.xOffset);
                    this.yOffset = Math.round(this.yOffset);
                }
            }
        } else {
            this.currentDelay -= newTime - this.currentTime;
        }
    }
    this.currentTime = newTime;
};
/**
 * Get the current animation being played.
 * @method FM.AnimatedSpriteRendererComponent#getCurrentAnim
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {string} The name of the current animation.
 */
FM.AnimatedSpriteRendererComponent.prototype.getCurrentAnim = function () {
    "use strict";
    return this.currentAnim;
};
/**
 * Change the size of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.AnimatedSpriteRendererComponent#changeSize
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pFactor Factor by which the size will be changed.
 */
FM.AnimatedSpriteRendererComponent.prototype.changeSize = function (pFactor) {
    "use strict";
    this.changedWidth = pFactor * this.frameWidth;
    this.changedHeight = pFactor * this.frameHeight;
};
/**
 * Set the width of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.AnimatedSpriteRendererComponent#setWidth
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pNewWidth New width of the sprite.
 */
FM.AnimatedSpriteRendererComponent.prototype.setWidth = function (pNewWidth) {
    "use strict";
    this.changedWidth = pNewWidth;
};
/**
 * Set the height of the sprite.
 * You will need to change the position of the spatial component of this
 * game object if you need a resize from the center.
 * @method FM.AnimatedSpriteRendererComponent#setHeight
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pNewHeight New height of the sprite.
 */
FM.AnimatedSpriteRendererComponent.prototype.setHeight = function (pNewHeight) {
    "use strict";
    this.changedHeight = pNewHeight;
};
/**
 * Set the transparency of the sprite.
 * @method FM.AnimatedSpriteRendererComponent#setAlpha
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @param {float} pNewAlpha New transparency value desired.
 */
FM.AnimatedSpriteRendererComponent.prototype.setAlpha = function (pNewAlpha) {
    "use strict";
    this.alpha = pNewAlpha;
};
/**
 * Retrieve the height of a frame of the spritesheet.
 * @method FM.AnimatedSpriteRendererComponent#getWidth
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The actual width of a frame.
 */
FM.AnimatedSpriteRendererComponent.prototype.getWidth = function () {
    "use strict";
    return this.changedWidth;
};
/**
 * Retrieve the height of a frame of the spritesheet.
 * @method FM.AnimatedSpriteRendererComponent#getHeight
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The actual height of a frame.
 */
FM.AnimatedSpriteRendererComponent.prototype.getHeight = function () {
    "use strict";
    return this.changedHeight;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.AnimatedSpriteRendererComponent#getOriginalWidth
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The width of a frame before resizing.
 */
FM.AnimatedSpriteRendererComponent.prototype.getOriginalWidth = function () {
    "use strict";
    return this.frameWidth;
};
/**
 * Retrieve the height of a frame before it was resized.
 * @method FM.AnimatedSpriteRendererComponent#getOriginalHeight
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {int} The height of a frame before resizing.
 */
FM.AnimatedSpriteRendererComponent.prototype.getOriginalHeight = function () {
    "use strict";
    return this.frameHeight;
};
/**
 * Retrieve the transparency value of the sprite.
 * @method FM.AnimatedSpriteRendererComponent#getAlpha
 * @memberOf FM.AnimatedSpriteRendererComponent
 * @return {float} Current transparency value.
 */
FM.AnimatedSpriteRendererComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the component and its objects.
 * @method FM.AnimatedSpriteRendererComponent#destroy
 * @memberOf FM.AnimatedSpriteRendererComponent
 */
FM.AnimatedSpriteRendererComponent.prototype.destroy = function () {
    "use strict";
    this.image = null;
    this.currentAnim = null;
    this.frames = null;
    this.loop = null;
    this.spatial = null;
    this.flipped = null;
    this.changedWidth = null;
    this.changedHeight = null;
    this.delay = null;
    this.currentDelay = null;
    this.currentFrame = null;
    this.finished = null;
    this.xOffset = null;
    this.yOffset = null;
    this.alpha = null;
    this.frameWidth = null;
    this.frameHeight = null;
    this.imageWidth = null;
    this.imageHeight = null;
    FM.Component.prototype.destroy.call(this);
};
