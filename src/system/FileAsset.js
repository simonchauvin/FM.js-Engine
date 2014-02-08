/*global FM*/
/**
 * The file asset represents a file object that can be used by the FM.js engine.
 * @class FM.FileAsset
 * @param {string} pName Name of the asset.
 * @param {string} pPath The path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.FileAsset = function (pName, pPath) {
    "use strict";
    /**
     * The HTML5 XMLHttpRequest object.
     * @type XMLHttpRequest
     * @private
     */
    this.request = new XMLHttpRequest();
    /**
     * Name of the asset.
     * @type string
     * @private
     */
    this.name = pName;
    /**
     * Path of the file.
     * @type string
     * @private
     */
    this.path = pPath;
    /**
     * Content of the file.
     * @type string
     * @private
     */
    this.content = null;
    /**
     * Specify the loading state of the file.
     * @type boolean
     * @private
     */
    this.loaded = false;
};
FM.FileAsset.prototype.constructor = FM.FileAsset;
/**
 * Fired when the loading is complete.
 * @method FM.FileAsset#loadComplete
 * @memberOf FM.FileAsset
 * @param {Event} event Contains data about the event.
 * @private
 */
FM.FileAsset.prototype.loadComplete = function (event) {
    "use strict";
    event.target.owner.setLoaded();
    event.target.owner.setContent(this.responseText);
    FM.AssetManager.assetLoaded();
};
/**
 * Load the file.
 * @method FM.FileAsset#load
 * @memberOf FM.FileAsset
 */
FM.FileAsset.prototype.load = function () {
    "use strict";
    this.request.addEventListener("load", FM.FileAsset.prototype.loadComplete, false);
    this.request.owner = this;
    this.request.open("GET", this.path, false);
    this.request.send();
};
/**
 * Check if this file has been loaded.
 * @method FM.FileAsset#isLoaded
 * @memberOf FM.FileAsset
 * @return {boolean} Whether the asset is loaded.
 */
FM.FileAsset.prototype.isLoaded = function () {
    "use strict";
    return this.loaded;
};
/**
 * Set the loaded boolean variable to true.
 * @method FM.FileAsset#setLoaded
 * @memberOf FM.FileAsset
 */
FM.FileAsset.prototype.setLoaded = function () {
    "use strict";
    this.loaded = true;
};
/**
 * Get the HTML5 XMLHttpRequest object.
 * @method FM.FileAsset#getRequest
 * @memberOf FM.FileAsset
 * @return {XMLHttpRequest} The HTML5 object.
 */
FM.FileAsset.prototype.getRequest = function () {
    "use strict";
    return this.request;
};
/**
 * Get the name of the file.
 * @method FM.FileAsset#getName
 * @memberOf FM.FileAsset
 * @return {string} The name of the asset.
 */
FM.FileAsset.prototype.getName = function () {
    "use strict";
    return this.name;
};
/**
 * Get the path to the file.
 * @method FM.FileAsset#getPath
 * @memberOf FM.FileAsset
 * @return {string} The path of the asset.
 */
FM.FileAsset.prototype.getPath = function () {
    "use strict";
    return this.path;
};
/**
 * Get the content of the file.
 * @method FM.FileAsset#getContent
 * @memberOf FM.FileAsset
 * @return {string} The content of the asset.
 */
FM.FileAsset.prototype.getContent = function () {
    "use strict";
    return this.content;
};
/**
 * Set the content of the file.
 * @method FM.FileAsset#setContent
 * @memberOf FM.FileAsset
 * @param {string} pNewContent The new content of the file.
 */
FM.FileAsset.prototype.setContent = function (pNewContent) {
    "use strict";
    this.content = pNewContent;
};
