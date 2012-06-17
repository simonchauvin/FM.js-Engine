/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmAudioAsset(assetName, assetPath) {
    "use strict";
    var that = Object.create(new Audio());

    var name = assetName;
    var path = assetPath;

    /**
     * 
     */
    that.init = function () {
        Object.getPrototypeOf(that).src = path;

        Object.getPrototypeOf(that).addEventListener("loadeddata", fmAssetManager.assetLoaded, false);
        Object.getPrototypeOf(that).load();
    };

    that.getName = function () {
        return name;
    };

    that.getPath = function () {
        return path;
    };

    return that;
}