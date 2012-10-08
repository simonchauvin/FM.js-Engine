/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that1}
 */
function FMSoundComponent(pOwner) {
    "use strict";
    var that_ = fmComponent(fmComponentTypes.sound, pOwner),

        /**
         *
         */
        sound = new Audio();

    /**
     *
     */
    that_.init = function (snd) {
        sound = snd;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that_.postInit = function () {
        
    }

    /**
     *
     */
    that_.play = function (volume, startingTime) {
        sound.volume = volume;
        //FIXME give current time
        //sound.currentTime = startingTime;
        sound.play();
    };

    /**
     *
     */
    that_.pause = function () {
        sound.pause();
    };

    /**
     *
     */
    that_.getSound = function () {
        return sound;
    };

    return that_;
}