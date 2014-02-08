/*global FM*/
/**
 * Audio component to add to a game object for playing sounds.
 * @class FM.AudioComponent
 * @extends FM.Component
 * @param {FM.GameObject} pOwner Game object owner of this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.AudioComponent = function (pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.SOUND, pOwner);
    /**
     * The list of sound objects.
     * @type Array
     * @private
     */
    this.sounds = [];
};
/**
 * FM.AudioComponent inherits from FM.Component.
 */
FM.AudioComponent.prototype = Object.create(FM.Component.prototype);
FM.AudioComponent.prototype.constructor = FM.AudioComponent;
/**
 * Replay a sound from the beginning.
 * @method FM.AudioComponent#replay
 * @memberOf FM.AudioComponent
 * @param {Audio} pSound The sound to be replayed.
 * @private
 */
FM.AudioComponent.prototype.replay = function (pSound) {
    "use strict";
    pSound.currentTime = 0;
    pSound.play();
};
/**
 * Play the sound given a certain volume and whether the sound loops or not.
 * @method FM.AudioComponent#play
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to play.
 * @param {float} pVolume The volume at which playing the sound (0 to 1).
 * @param {boolean} pLoop Whether the sound should loop or not.
 */
FM.AudioComponent.prototype.play = function (pSoundName, pVolume, pLoop) {
    "use strict";
    var i, sound, soundFound = false;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound && sound.getName() === pSoundName) {
            soundFound = true;
            sound.getAudio().volume = pVolume;
            if (pLoop) {
                sound.getAudio().addEventListener('ended', function () {
                    if (window.chrome) {
                        this.load(FM.AudioComponent.prototype.replay);
                    } else {
                        this.currentTime = 0;
                        this.play();
                    }
                }, false);
            }
            if (window.chrome) {
                sound.load(FM.AudioComponent.prototype.replay);
            } else {
                sound.getAudio().play();
            }
        }
    }
    if (!soundFound) {
        if (FM.Parameters.debug) {
            console.log("WARNING: you're trying to play a sound that does not exist.");
        }
    }
};
/**
 * Pause the sound.
 * @method FM.AudioComponent#pause
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to pause.
 */
FM.AudioComponent.prototype.pause = function (pSoundName) {
    "use strict";
    var i, sound;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound.getName() === pSoundName) {
            sound.getAudio().pause();
        }
    }
};
/**
 * Add a sound to the component.
 * @method FM.AudioComponent#addSound
 * @memberOf FM.AudioComponent
 * @param {FM.AudioAsset} pSound The sound to add to this component.
 */
FM.AudioComponent.prototype.addSound = function (pSound) {
    "use strict";
    this.sounds.push(pSound);
};
/**
 * Check if a sound is currently playing.
 * @method FM.AudioComponent#isPlaying
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to check.
 * @return {boolean} Whether the sound is playing or not.
 */
FM.AudioComponent.prototype.isPlaying = function (pSoundName) {
    "use strict";
    var i, sound;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound.getName() === pSoundName) {
            return !sound.getAudio().paused;
        }
    }
};
/**
 * Retrieve the audio object.
 * @method FM.AudioComponent#getSoundByName
 * @memberOf FM.AudioComponent
 * @param {string} pSoundName The name of the sound to retrieve.
 * @return {FM.AudioAsset} The sound found or null if not.
 */
FM.AudioComponent.prototype.getSoundByName = function (pSoundName) {
    "use strict";
    var i, sound;
    for (i = 0; i < this.sounds.length; i = i + 1) {
        sound = this.sounds[i];
        if (sound.getName() === pSoundName) {
            return sound;
        }
    }
    return null;
};
/**
 * Destroy the sound component and its objects.
 * @method FM.AudioComponent#destroy
 * @memberOf FM.AudioComponent
 */
FM.AudioComponent.prototype.destroy = function () {
    "use strict";
    this.sounds = null;
    FM.Component.prototype.destroy.call(this);
};
