/*global FM*/
/**
 * The file asset represents a file that can be used by the FM.js engine.
 * @class FM.FileAsset
 * @param {string} pName Name of the asset.
 * @param {string} pPath The path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.FileAsset = function (pName, pPath) {
    "use strict";
    //Calling the constructor of FM.Asset
    FM.Asset.call(this, pName, pPath);
    /**
     * The HTML5 XMLHttpRequest object.
     * @type XMLHttpRequest
     * @private
     */
    this.request = new XMLHttpRequest();
    /**
     * Content of the file.
     * @type string
     */
    this.content = null;
};
FM.FileAsset.prototype = Object.create(FM.Asset.prototype);
FM.FileAsset.prototype.constructor = FM.FileAsset;
/**
 * Load the file.
 * @method FM.FileAsset#load
 * @memberOf FM.FileAsset
 */
FM.FileAsset.prototype.load = function () {
    "use strict";
    var that = this;
    this.request.onload = function (e) {
        e.target.owner.loaded = true;
        e.target.owner.content = this.responseText;
    };
    this.request.owner = this;
    this.request.open("GET", this.path, true);
    this.request.onprogress = function(e) {
        var oldCompletionRate = that.completionLevel;
        that.completionLevel = (e.loaded / e.total);
        FM.AssetManager.updateProgress(that.completionLevel - oldCompletionRate);
    };
    this.request.send();
};