/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMImageAsset(pName, pPath) {
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
        loaded = false;

    /**
     * Load the image.
     */
    that.load = function () {
        that.src = path;

        that.addEventListener("load", loadComplete, false);
    };

    /**
     * Fired when the image has finished loading.
     */
    var loadComplete = function () {
        loaded = true;
        FMAssetManager.assetLoaded();
    };

    /**
     * Check if this image has been loaded.
     */
    that.isLoaded = function () {
        return loaded;
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