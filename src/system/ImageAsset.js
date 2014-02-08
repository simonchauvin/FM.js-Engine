/*global FM*/
/**
 * An image asset is used to represent a sprite usable by the FM.js engine.
 * @class FM.ImageAsset
 * @param {string} pName The name of the asset.
 * @param {string} pPath The path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.ImageAsset = function (pName, pPath) {
    "use strict";
    /**
     * The HTML5 Image object.
     * @type Image
     * @private
     */
    this.image = new Image();
    /**
     * Name of the given to the asset.
     * @type string
     * @private
     */
    this.name = pName;
    /**
     * Path to the image file.
     * @type string
     * @private
     */
    this.path = pPath;
    /**
     * Specify the loading state of the image.
     * @type boolean
     * @private
     */
    this.loaded = false;
};
FM.ImageAsset.prototype.constructor = FM.ImageAsset;
/**
 * Fired when the image has finished loading.
 * @method FM.ImageAsset#loadComplete
 * @memberOf FM.ImageAsset
 * @param {Event} event Contains data about the event.
 * @private
 */
FM.ImageAsset.prototype.loadComplete = function (event) {
    "use strict";
    event.target.owner.setLoaded();
    FM.AssetManager.assetLoaded();
};
/**
 * Load the image.
 * @method FM.ImageAsset#load
 * @memberOf FM.ImageAsset
 */
FM.ImageAsset.prototype.load = function () {
    "use strict";
    this.image.src = this.path;
    this.image.addEventListener("load", FM.ImageAsset.prototype.loadComplete, false);
    this.image.owner = this;
};
/**
 * Check if this image has been loaded.
 * @method FM.ImageAsset#isLoaded
 * @memberOf FM.ImageAsset
 * @return {boolean} Whether the image is loaded or not.
 */
FM.ImageAsset.prototype.isLoaded = function () {
    "use strict";
    return this.loaded;
};
/**
 * Set the loaded boolean variable to true.
 * @method FM.ImageAsset#setLoaded
 * @memberOf FM.ImageAsset
 */
FM.ImageAsset.prototype.setLoaded = function () {
    "use strict";
    this.loaded = true;
};
/**
 * Get the HTML5 Image object.
 * @method FM.ImageAsset#getImage
 * @memberOf FM.ImageAsset
 * @return {Image} The HTML5 object.
 */
FM.ImageAsset.prototype.getImage = function () {
    "use strict";
    return this.image;
};
/**
 * Get the name of the asset.
 * @method FM.ImageAsset#getName
 * @memberOf FM.ImageAsset
 * @return {string} The name of the asset.
 */
FM.ImageAsset.prototype.getName = function () {
    "use strict";
    return this.name;
};
/**
 * Get the path to the image file.
 * @method FM.ImageAsset#getPath
 * @memberOf FM.ImageAsset
 * @return {string} The path to the asset.
 */
FM.ImageAsset.prototype.getPath = function () {
    "use strict";
    return this.path;
};
