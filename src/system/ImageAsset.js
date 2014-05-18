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
    //Calling the constructor of FM.Asset
    FM.Asset.call(this, pName, pPath);
    /**
     * The HTML5 Image object.
     * @type Image
     */
    this.image = new Image();
};
FM.ImageAsset.prototype = Object.create(FM.Asset.prototype);
FM.ImageAsset.prototype.constructor = FM.ImageAsset;
/**
 * Load the image.
 * @method FM.ImageAsset#load
 * @memberOf FM.ImageAsset
 */
FM.ImageAsset.prototype.load = function () {
    "use strict";
    this.image.src = this.path;
    this.image.onload = function (e) {
        e.target.owner.loaded = true;
    };
    this.image.owner = this;
    var that = this,
        xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', this.path, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onprogress = function(e) {
        var oldCompletionRate = that.completionLevel;
        that.completionLevel = (e.loaded / e.total);
        FM.AssetManager.updateProgress(that.completionLevel - oldCompletionRate);
    };
    xmlHTTP.send();
};