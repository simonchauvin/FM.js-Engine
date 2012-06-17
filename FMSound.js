/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmSound(x, y, soundName) {
    "use strict";
    var that = Object.create(fmGameObject(x, y, 0));

    var soundComponent = fmSoundComponent(that);
    soundComponent.init(fmAssetManager.getAssetByName(soundName));
    that.addComponent(soundComponent);

    that.play = function (volume, startingTime) {
        soundComponent.play(volume, startingTime);
    };

    that.pause = function () {
        soundComponent.pause();
    };

    return that;
}