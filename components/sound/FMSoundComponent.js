/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that1}
 */
function FMSoundComponent(pSound, pOwner) {
    "use strict";
    var that = FMComponent(FMComponentTypes.SOUND, pOwner),
        /**
         * The actual sound object.
         */
        sound = pSound;

    /**
     * Play the sound with a given volume and starting time.
     */
    that.play = function (volume, startingTime) {
        sound.volume = volume;
        //FIXME give current time
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
    that.destroy = function() {
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