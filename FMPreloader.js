/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * FMPreload is used to set the preload page
 * 
 */
function fmPreloader(firstState) {
    "use strict";
    var that = Object.create(fmState());

    var loadingIndicator = null;

    that.init = function () {
        Object.getPrototypeOf(that).init();

        loadingIndicator = fmText(fmParameters.screenWidth / 2, fmParameters.screenHeight / 2, 99, 100);
        loadingIndicator.setFormat('#fff', '30px sans-serif', 'middle');
        that.add(loadingIndicator);
    };

    that.update = function (game) {
        Object.getPrototypeOf(that).update(game);

        loadingIndicator.components[fmComponentTypes.renderer].text = fmAssetManager.loadingProgress;

        if (fmAssetManager.loadingProgress >= 100) {
            game.switchState(firstState());
        }
    };

    return that;
}