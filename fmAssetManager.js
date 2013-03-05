var FMENGINE = FMENGINE || {};
/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FMENGINE.fmAssetManager = {
    //List of assets
    assets: [],

    /**
     * Keep tracks of the current progress in loading assets.
     */
    loadingProgress: 0,

    /**
     * Add an asset to the list.
     */
    addAsset: function (name, type, path) {
        "use strict";
        var assetManager = FMENGINE.fmAssetManager,
            param = FMENGINE.fmParameters;
        if (type === param.IMAGE) {
            if (!assetManager.getAssetByName(name)) {
                assetManager.assets.push(FMENGINE.fmImageAsset(name, path));
            }
        } else if (type === param.AUDIO) {
            if (!assetManager.getAssetByName(name)) {
                assetManager.assets.push(FMENGINE.fmAudioAsset(name, path));
            }
        } else if (type === param.FILE) {
            if (!assetManager.getAssetByName(name)) {
                assetManager.assets.push(FMENGINE.fmFileAsset(name, path));
            }
        }
    },

    /**
     * Load all assets.
     */
    loadAssets: function () {
        "use strict";
        var i, assetManager = FMENGINE.fmAssetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            assetManager.assets[i].load();
        }
    },

    /**
     * Fired when an asset has been loaded.
     */
    assetLoaded: function () {
        "use strict";
        var assetManager = FMENGINE.fmAssetManager;
        assetManager.loadingProgress += 100 / assetManager.assets.length;
    },

    /**
     * Check if all assets have been loaded.
     */
    areAllAssetsLoaded: function () {
        "use strict";
        return Math.round(FMENGINE.fmAssetManager.loadingProgress) >= 100;
    },

    /**
     * Get an asset by its name.
     */
    getAssetByName: function (name) {
        "use strict";
        var asset = null, i = 0, assetManager = FMENGINE.fmAssetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            if (assetManager.assets[i].getName() === name) {
                asset = assetManager.assets[i];
            }
        }
        return asset;
    }
};