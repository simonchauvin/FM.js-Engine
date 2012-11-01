/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMFileAsset(pName, pPath) {
    "use strict";
    var that = new XMLHttpRequest(),
        /**
         * Name of the asset.
         */
        name = pName,
        /**
         * Path of the file.
         */
        path = pPath,
        /**
         * Content of the file.
         */
        content = null,
        /**
         * Specify the loading state of the file.
         */
        loaded = false;

    /**
     * Load the file.
     */
    that.load = function () {
        that.addEventListener("load", loadComplete, false);
        that.open("GET", path, false);
        that.send();
    };

    /**
     * Fired when the loading is complete.
     */
    var loadComplete = function () {
        loaded = true;
        content = that.responseText;
        FMAssetManager.assetLoaded();
    };

    /**
     * Check if this file has been loaded.
     */
    that.isLoaded = function () {
        return loaded;
    };

    /**
    * Destroy the asset and its objects
    */
    that.destroy = function() {
        name = null;
        path = null;
        content = null;
        that = null;
    };

    /**
     * Get the name of the file.
     */
    that.getName = function () {
        return name;
    };

    /**
     * Get the path to the file.
     */
    that.getPath = function () {
        return path;
    };

    /**
     * Get the content of the file.
     */
    that.getContent = function () {
        return content;
    };

    return that;
};