/**
 * 
 * @class audioComponent
 * @author Simon Chauvin
 * @param owner
 * @returns {audioComponent}
 */
FM.audioComponent = function (pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.SOUND, pOwner),
        /**
         * The list of sound objects.
         */
        sounds = [],
        /**
         * Replay a sound from the beginning.
         */
        replay = function (pSound) {
            pSound.currentTime = 0;
            pSound.play();
        };
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Play the sound given a certain volume and whether the sound loops or not.
     */
    that.play = function (pSoundName, volume, loop) {
        var i, sound, soundFound = false;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                soundFound = true;
                sound.volume = volume;
                if (loop) {
                    sound.addEventListener('ended', function () {
                        if (window.chrome) {
                            this.load(replay);
                        } else {
                            this.currentTime = 0;
                            this.play();
                        }
                    }, false);
                }
                if (window.chrome) {
                    sound.load(replay);
                } else {
                    sound.play();
                }
            }
        }
        if (!soundFound) {
            if (FM.parameters.debug) {
                console.log("WARNING: you're trying to play a sound that does not exist.");
            }
        }
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
     * Check if a sound is currently playing.
     */
    that.isPlaying = function (pSoundName) {
        var i, sound;
        for (i = 0; i < sounds.length; i = i + 1) {
            sound = sounds[i];
            if (sound.getName() === pSoundName) {
                return !sound.paused;
            }
        }
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
