/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {fmSoundComponent}
 */
FMENGINE.fmSoundComponent = function (pSound, pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.SOUND, pOwner),
        /**
         * The actual sound object.
         */
        sound = pSound;

    /**
     * Play the sound with a given volume and starting time.
     */
    that.play = function (volume, startingTime) {
        sound.volume = volume;
        //TODO give current time
        //sound.currentTime = startingTime;
        sound.play();
    };

    /**
     * Pause the sound.
     */
    that.pause = function () {
        sound.pause();
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function () {
        sound.destroy();
        sound = null;
        that.destroy();
        that = null;
    };

    /**
     * Retrieve the audio object.
     */
    that.getSound = function () {
        return sound;
    };

    return that;
}