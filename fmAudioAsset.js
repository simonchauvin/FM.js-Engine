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
         * Extension of the audio file.
         */
        extension = path.substring(path.lastIndexOf('.') + 1),
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

    /**
     * Check if the audio format is supported by the browser.
     */
    that.isSupported = function () {
        var canPlayThisType = false;
        if (extension === "wav") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/wav; codecs="1"') !== "";
        } else if (extension === "ogg") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/ogg; codecs="vorbis"') !== "";
        } else if (extension === "mp3") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/mpeg;') !== "";
        } else if (extension === "aac") {
            canPlayThisType = !!that.canPlayType && that.canPlayType('audio/mp4; codecs="mp4a.40.2"') !== "";
        }
        return canPlayThisType;
    };

    return that;
}