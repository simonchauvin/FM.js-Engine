/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {fmSoundComponent}
 */
FMENGINE.fmSoundComponent = function (pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.SOUND, pOwner),
        /**
         * The list of sound objects.
         */
        sounds = [];

    /**
     * Play the sound given a certain volume and whether the sound loop or not.
     */
    that.play = function (pSoundName, volume, loop) {
        var i, sound;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                sound.volume = volume;
                if (loop) {
                    sound.addEventListener('ended', function () {
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }
                sound.play();
            }
        }
        //TODO display warning if sound not existing
    };

    /**
     * Pause the sound.
     */
    that.pause = function (pSoundName) {
        var i, sound;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                sound.pause();
            }
        }
    };

    /**
     * Add a sound to the component.
     */
    that.addSound = function (pSound) {
        sounds.push(pSound);
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function () {
        var i;
        for (i = 0; i < sounds.length; i = i + 1) {
            sounds[i].destroy();
        }
        sounds = null;
        that.destroy();
        that = null;
    };

    /**
     * Retrieve the audio object.
     */
    that.getSoundByName = function (pSoundName) {
        var i, sound;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                return sound;
            }
        }
        return null;
    };

    return that;
};