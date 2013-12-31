var FM = FM || {};
/**
 * @class assetManager
 * @author Simon Chauvin
 */
FM.assetManager = {
    //List of assets
    assets: [],

    /**
     * Keep tracks of the current progress in loading assets.
     */
    loadingProgress: 0,

    /**
     * Add an asset to the list.
     * As for sound the first to be found supported by the browser will be
     * the only one added. You have to provide at least one supported format
     * if you want the game to run.
     */
    addAsset: function (name, type, path) {
        "use strict";
        var assetManager = FM.assetManager,
            param = FM.parameters,
            asset = assetManager.getAssetByName(name),
            sound;
        if (type === param.IMAGE) {
            if (!asset) {
                assetManager.assets.push(FM.imageAsset(name, path));
            }
        } else if (type === param.AUDIO) {
            if (!asset) {
                sound = FM.audioAsset(name, path);
                //Add the asset only if it is supported by the browser
                if (sound.isSupported()) {
                    assetManager.assets.push(sound);
                } else if (FM.parameters.debug) {
                    console.log("ERROR: The " + 
                            path.substring(path.lastIndexOf('.') + 1) + 
                            " audio format is not supported by this browser.");
                    return false;
                }
            }
        } else if (type === param.FILE) {
            if (!asset) {
                assetManager.assets.push(FM.fileAsset(name, path));
            }
        }
        return true;
    },

    /**
     * Load all assets.
     */
    loadAssets: function () {
        "use strict";
        var i, assetManager = FM.assetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            assetManager.assets[i].load();
        }
    },

    /**
     * Fired when an asset has been loaded.
     */
    assetLoaded: function () {
        "use strict";
        var assetManager = FM.assetManager;
        assetManager.loadingProgress += 100 / assetManager.assets.length;
    },

    /**
     * Check if all assets have been loaded.
     */
    areAllAssetsLoaded: function () {
        "use strict";
        return Math.round(FM.assetManager.loadingProgress) >= 100;
    },

    /**
     * Get an asset by its name.
     */
    getAssetByName: function (name) {
        "use strict";
        var asset = null, i = 0, assetManager = FM.assetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            if (assetManager.assets[i].getName() === name) {
                asset = assetManager.assets[i];
            }
        }
        return asset;
    }
};
