/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
var FMAssetManager = {
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
        if (type === FMParameters.IMAGE) {
            if (!FMAssetManager.getAssetByName(name)) {
                FMAssetManager.assets.push(FMImageAsset(name, path));
            }
        } else if (type === FMParameters.AUDIO) {
            if (!FMAssetManager.getAssetByName(name)) {
                FMAssetManager.assets.push(FMAudioAsset(name, path));
            }
        } else if (type === FMParameters.FILE) {
            if (!FMAssetManager.getAssetByName(name)) {
                FMAssetManager.assets.push(FMFileAsset(name, path));
            }
        }
    },

    /**
     * Load all assets.
     */
    loadAssets: function () {
        "use strict";
        var i;
        for (i = 0; i < FMAssetManager.assets.length; i = i + 1) {
            FMAssetManager.assets[i].load();
        }
    },

    /**
     * Fired when an asset has been loaded.
     */
    assetLoaded: function () {
        "use strict";
        FMAssetManager.loadingProgress += 100 / FMAssetManager.assets.length;
    },

    /**
     * Check if all assets have been loaded.
     */
    areAllAssetsLoaded: function () {
        "use strict";
        return Math.round(FMAssetManager.loadingProgress) >= 100;
    },

    /**
     * Get an asset by its name.
     */
    getAssetByName: function (name) {
        "use strict";
        var asset = null, i = 0;
        for (i = 0; i < FMAssetManager.assets.length; i = i + 1) {
            if (FMAssetManager.assets[i].getName() === name) {
                asset = FMAssetManager.assets[i];
            }
        }
        return asset;
    }
};