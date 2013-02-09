/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMPreloader is used to set the preload page
 * 
 */
FMENGINE.fmPreloader = function (pFirstState) {
    "use strict";
    var that = Object.create(FMENGINE.fmState()),
    /**
     * Screen width
     */
    screenWidth,
    /**
     * Screen height
     */
    screenHeight;

    /**
     * Init the preloader.
     */
    that.init = function () {
        Object.getPrototypeOf(that).init();

        //Add the assets from the engine and load them all
        var assetManager = FMENGINE.fmAssetManager;
        var param = FMENGINE.fmParameters;
        assetManager.addAsset("fmPauseIcon", param.IMAGE, param.libFolder + "/fm/assets/gfx/fm_pause.png");
        assetManager.addAsset("fmMuteIcon", param.IMAGE, param.libFolder + "/fm/assets/gfx/fm_mute.png");
        assetManager.addAsset("fmSoundOnIcon", param.IMAGE, param.libFolder + "/fm/assets/gfx/fm_sound_on.png");
        assetManager.addAsset("fmBackground", param.IMAGE, param.libFolder + "/fm/assets/gfx/fm_background.png");
        assetManager.addAsset("fmLogo", param.IMAGE, param.libFolder + "/fm/assets/gfx/fm_logo.png");
        assetManager.loadAssets();

        //Retrieve the screen width and height
        screenWidth = FMENGINE.fmGame.getScreenWidth();
        screenHeight = FMENGINE.fmGame.getScreenHeight();
    };

    /**
     * Update the preloader.
     */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

        //If all the assets are loaded then start the first state
        var assetManager = FMENGINE.fmAssetManager;
        if (assetManager.assets.length == 0 || assetManager.areAllAssetsLoaded()) {
            FMENGINE.fmGame.switchState(pFirstState());
        }
    };

    /**
     * Draw on the preloader state.
     */
    that.draw = function (bufferContext) {
        Object.getPrototypeOf(that).draw(bufferContext);

        //Background
        var assetManager = FMENGINE.fmAssetManager;
        var bg = assetManager.getAssetByName("fmBackground");
        if (bg.isLoaded()) {
            var maxHor = screenWidth / bg.width;
            var maxVer = screenHeight / bg.height;
            for (var i = 0; i < maxVer; i++){
                for (var j = 0; j < maxHor; j++){
                    bufferContext.drawImage(bg, j * bg.width, i * bg.height, bg.width, bg.height);
                }
            }
        }

        //Update the value of the loading text
        bufferContext.fillStyle = '#fff';
        bufferContext.font = '30px sans-serif';
        bufferContext.textBaseline = 'middle';
        bufferContext.fillText(Math.ceil(assetManager.loadingProgress), screenWidth / 2, screenHeight / 2);

        //Loading screen
        var logo = assetManager.getAssetByName("fmLogo");
        if (logo.isLoaded())
            bufferContext.drawImage(logo, screenWidth / 2 - 250, screenHeight / 2 - 200);
    };

    return that;
}