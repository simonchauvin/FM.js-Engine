/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FMENGINE.fmAudioAsset = function (pName, pPath) {
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
        loaded = false,
        /**
         * Fired when the audio file has finished loading.
         */
        loadComplete = function () {
            loaded = true;
            FMENGINE.fmAssetManager.assetLoaded();
        };

    /**
     * Load the audio file.
     */
    that.load = function () {
        that.src = path;

        that.addEventListener("loadeddata", loadComplete, false);
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
     * Get the path to the audio file.
     */
    that.getPath = function () {
        return path;
    };

    return that;
}