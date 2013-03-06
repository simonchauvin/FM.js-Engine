/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMPreloader is used to set the preload page
 * You can create a custom preloader extending this one and providing it to 
 * the init function of fmGame object.
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
        if (assetManager.assets.length === 0 || assetManager.areAllAssetsLoaded()) {
            FMENGINE.fmGame.switchState(pFirstState());
        }
    };

    /**
     * Draw on the preloader state.
     * @param {CanvasRenderingContext2D} bufferContext context (buffer) on wich 
     * drawing is done.
     * @param {float} dt time in seconds since the last frame.
     */
    that.draw = function (bufferContext, dt) {
        Object.getPrototypeOf(that).draw(bufferContext, dt);

        //Update the value of the loading text
        bufferContext.fillStyle = '#fff';
        bufferContext.font = '30px sans-serif';
        bufferContext.textBaseline = 'middle';
        bufferContext.fillText(Math.ceil(FMENGINE.fmAssetManager.loadingProgress) + "%", screenWidth / 2, screenHeight / 2);
    };

    return that;
}