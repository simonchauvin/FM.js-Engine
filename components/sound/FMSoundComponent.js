/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that1}
 */
function fmSoundComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.sound, owner));

    var sound = new Audio();

    that.init = function (snd) {
        sound = snd;
    };

    that.play = function (volume, startingTime) {
        Object.getPrototypeOf(sound).volume = volume;
        //FIXME give current time
        //sound.currentTime = startingTime;
        Object.getPrototypeOf(sound).play();
    };

    that.pause = function () {
        sound.pause();
    };

    that.getSound = function () {
        return sound;
    };

    return that;
}