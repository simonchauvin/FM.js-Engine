/**
 * @class imageAsset
 * @author Simon Chauvin
 */
FM.imageAsset = function (pName, pPath) {
    "use strict";
    var that = new Image(),

        /**
         * Name of the given to the asset.
         */
        name = pName,
        /**
         * Path to the image file.
         */
        path = pPath,
        /**
         * Specify the loading state of the image.
         */
        loaded = false,
        /**
         * Fired when the image has finished loading.
         */
        loadComplete = function () {
            loaded = true;
            FM.assetManager.assetLoaded();
        };

    /**
     * Load the image.
     */
    that.load = function () {
        that.src = path;

        that.addEventListener("load", loadComplete, false);
    };

    /**
     * Check if this image has been loaded.
     */
    that.isLoaded = function () {
        return loaded;
    };

    /**
    * Destroy the asset and its objects
    */
    that.destroy = function () {
        name = null;
        path = null;
        that = null;
    };

    /**
     * Get the name of the asset.
     */
    that.getName = function () {
        return name;
    };

    /**
     * Get the path to the image file.
     */
    that.getPath = function () {
        return path;
    };

    return that;
};
