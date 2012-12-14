/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMAudioAsset(pName, pPath) {
    "use strict";
    var that = new Audio(),

        /**
         * Name of the given to the asset.
         */
        name = pName,
        /**
         * Path to the audio file.
         */
        path = pPath,
        /**
         * Specify the loading state of the audio file.
         */
        loaded = false;

    /**
     * Load the audio file.
     */
    that.load = function () {
        that.src = path;

        that.addEventListener("loadeddata", loadComplete, false);
    };

    /**
     * Fired when the audio file has finished loading.
     */
    var loadComplete = function () {
        loaded = true;
        FMAssetManager.assetLoaded();
    };

    /**
     * Check if this audio file has been loaded.
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
        that = null;
    };

    /**
     * Get the name of the asset.
     */
    that.getName = function () {
        return name;
    };

    /**
     * Get the path to the audio file.
     */
    that.getPath = function () {
        return path;
    };

    return that;
}