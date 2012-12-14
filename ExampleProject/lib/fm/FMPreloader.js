/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMPreloader is used to set the preload page
 * 
 */
function FMPreloader(pFirstState) {
    "use strict";
    var that = Object.create(FMState()),
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
    that.init = function (game) {
        Object.getPrototypeOf(that).init(game);

        //Add the assets from the engine and load them all
        FMAssetManager.addAsset("fmPauseIcon", FMParameters.IMAGE, FMParameters.libFolder + "/fm/assets/gfx/fm_pause.png");
        FMAssetManager.addAsset("fmMuteIcon", FMParameters.IMAGE, FMParameters.libFolder + "/fm/assets/gfx/fm_mute.png");
        FMAssetManager.addAsset("fmSoundOnIcon", FMParameters.IMAGE, FMParameters.libFolder + "/fm/assets/gfx/fm_sound_on.png");
        FMAssetManager.addAsset("fmBackground", FMParameters.IMAGE, FMParameters.libFolder + "/fm/assets/gfx/fm_background.png");
        FMAssetManager.addAsset("fmLogo", FMParameters.IMAGE, FMParameters.libFolder + "/fm/assets/gfx/fm_logo.png");
        FMAssetManager.loadAssets();

        //Retrieve the screen width and height
        screenWidth = game.getScreenWidth();
        screenHeight = game.getScreenHeight();
    };

    /**
     * Update the preloader.
     */
    that.update = function (game, dt) {
        Object.getPrototypeOf(that).update(game, dt);

        //If all the assets are loaded then start the first state
        if (FMAssetManager.assets.length == 0 || FMAssetManager.areAllAssetsLoaded()) {
            game.switchState(pFirstState());
        }
    };

    /**
     * Draw on the preloader state.
     */
    that.draw = function (bufferContext) {
        Object.getPrototypeOf(that).draw(bufferContext);

        //Background
        var bg = FMAssetManager.getAssetByName("fmBackground");
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
        bufferContext.fillText(Math.ceil(FMAssetManager.loadingProgress), screenWidth / 2, screenHeight / 2);

        //Loading screen
        var logo = FMAssetManager.getAssetByName("fmLogo");
        if (logo.isLoaded())
            bufferContext.drawImage(logo, screenWidth / 2 - 250, screenHeight / 2 - 200);
    };

    return that;
}