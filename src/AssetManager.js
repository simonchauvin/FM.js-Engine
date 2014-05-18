var FM = {};
/**
 * The asset manager is the unique object for storing and loading content (audio
 * , image, files).
 * @class FM.AssetManager
 * @static
 * @author Simon Chauvin
 */
FM.AssetManager = {
    /**
     * The list of assets stored by the asset manager.
     * @type Array
     * @field
     * @private
     */
    assets: [],
    /**
     * Keep tracks of the current progress in loading assets.
     * @type int
     * @field
     * @private
     */
    loadingProgress: 0,
    /**
     * Add an asset to the list.
     * As for sound the first to be found supported by the browser will be
     * the only one added. You have to provide at least one supported format
     * if you want the game to run.
     * @method FM.AssetManager#addAsset
     * @memberOf FM.AssetManager
     * @param {string] pName The name of the asset to load.
     * @param {FM.ObjectType] pType The type of the asset to load.
     * @param {string] pPath The path of the asset to load.
     */
    addAsset: function (pName, pType, pPath) {
        "use strict";
        var assetManager = FM.AssetManager,
            param = FM.Parameters,
            asset = assetManager.getAssetByName(pName),
            sound;
        if (pType === param.IMAGE) {
            if (!asset) {
                assetManager.assets.push(new FM.ImageAsset(pName, pPath));
            }
        } else if (pType === param.AUDIO) {
            if (!asset) {
                sound = new FM.AudioAsset(pName, pPath);
                //Add the asset only if it is supported by the browser
                if (sound.isSupported()) {
                    assetManager.assets.push(sound);
                } else {
                    console.log("ERROR: The " +
                            pPath.substring(pPath.lastIndexOf('.') + 1) +
                            " audio format is not supported by this browser.");
                    return false;
                }
            }
        } else if (pType === param.FILE) {
            if (!asset) {
                assetManager.assets.push(new FM.FileAsset(pName, pPath));
            }
        }
        return true;
    },
    /**
     * Load all assets.
     * @method FM.AssetManager#loadAssets
     * @memberOf FM.AssetManager
     */
    loadAssets: function () {
        "use strict";
        var i, assetManager = FM.AssetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            assetManager.assets[i].load();
        }
    },
    /**
     * Called when an asset is loading.
     * @method FM.AssetManager#updateProgress
     * @param {number} pAmount Amount of the file loaded (0 to 1; 1 meaning
     * fully loaded).
     * @memberOf FM.AssetManager
     */
    updateProgress: function (pAmount) {
        var assetManager = FM.AssetManager;
        assetManager.loadingProgress += (100 * pAmount) / assetManager.assets.length;
    },
    /**
     * Check if all assets have been loaded.
     * @method FM.AssetManager#areAllAssetsLoaded
     * @memberOf FM.AssetManager
     * @return {boolean} Whether all assets are loaded or not.
     */
    areAllAssetsLoaded: function () {
        "use strict";
        var assetManager = FM.AssetManager,
            i,
            allLoaded = true;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            if (!assetManager.assets[i].loaded) {
                allLoaded = false;
            }
        }
        return allLoaded || Math.round(FM.AssetManager.loadingProgress) >= 100;
    },
    /**
     * Get an asset by its name.
     * @method FM.AssetManager#getAssetByName
     * @memberOf FM.AssetManager
     * @param {String} name The name of the asset to retrieve.
     * @return {FM.Asset} The asset matching the given name. Can be an
     * FM.ImageAsset, a FM.AudioAsset or a FM.FileAsset.
     */
    getAssetByName: function (name) {
        "use strict";
        var asset = null, i = 0, assetManager = FM.AssetManager;
        for (i = 0; i < assetManager.assets.length; i = i + 1) {
            if (assetManager.assets[i].name === name) {
                asset = assetManager.assets[i];
            }
        }
        return asset;
    }
};
