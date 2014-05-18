/*global FM*/
/**
 * The asset class represents an asset that can be used by the FM.js engine.
 * @class FM.Asset
 * @param {string} pName Name of the asset.
 * @param {string} pPath The path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.Asset = function (pName, pPath) {
    "use strict";
    /**
     * Name of the asset.
     * @type string
     */
    this.name = pName;
    /**
     * Path of the asset.
     * @type string
     */
    this.path = pPath;
    /**
     * Whether the asset is loaded or not.
     * @type boolean
     */
    this.loaded = false;
    /**
     * Tracks the loading of the asset from 0 (not loaded) to 1 
     * (fully loaded).
     * @type number
     */
    this.completionLevel = 0;
};
FM.Asset.prototype.constructor = FM.Asset;