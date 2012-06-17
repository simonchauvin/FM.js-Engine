/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmImageAsset(assetName, assetPath) {
    "use strict";
    var that = Object.create(new Image());

    var name = assetName;
    var path = assetPath;

    /**
     * 
     */
    that.init = function () {
        Object.getPrototypeOf(that).src = path;

        Object.getPrototypeOf(that).addEventListener("load", fmAssetManager.assetLoaded, false);
    };

    that.getName = function () {
        return name;
    };

    that.getPath = function () {
        return path;
    };

    return that;
};