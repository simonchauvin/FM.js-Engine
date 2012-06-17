/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
var fmAssetManager = {
    //List of assets
    assets: [],

    //Current progress
    loadingProgress: 0,

    /**
     *
     */
    addAsset: function (name, type, path) {
        "use strict";
        if (type == fmParameters.IMAGE) {
            if (!fmAssetManager.getAssetByName(name)) {
                fmAssetManager.assets.push(fmImageAsset(name, path));
            }
        } else if (type == fmParameters.AUDIO) {
            if (!fmAssetManager.getAssetByName(name)) {
                fmAssetManager.assets.push(fmAudioAsset(name, path));
            }
        }
    },

    /**
     *
     */
    loadAssets: function () {
        "use strict";
        var i;
        for (i = 0; i < fmAssetManager.assets.length; i++) {
            fmAssetManager.assets[i].init();
        }
    },

    /**
     *
     */
    assetLoaded: function () {
        "use strict";
        fmAssetManager.loadingProgress += Math.ceil(100 / fmAssetManager.assets.length);
    },

    /**
     *
     */
    areAllAssetsLoaded: function () {
        "use strict";
        return fmAssetManager.loadingProgress >= 100;
    },

    /**
     *
     */
    getAssetByName: function (name) {
        "use strict";
        var asset = null, i = 0;
        for (i = 0; i < fmAssetManager.assets.length; i++) {
            if (fmAssetManager.assets[i].getName() == name) {
                asset = fmAssetManager.assets[i];
            }
        }
        return asset;
    }
};