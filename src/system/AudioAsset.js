/*global FM*/
/**
 * An audio asset represents an Audio object that is usable in the FM.js 
 * engine.
 * @class FM.AudioAsset
 * @param {string} pName Name of the asset.
 * @param {string} pPath Path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.AudioAsset = function (pName, pPath) {
    "use strict";
    /**
     * The HTML5 Audio object.
     * @type Audio
     * @private
     */
    this.audio = new Audio();
    /**
     * Name of the given to the asset.
     * @type string
     * @private
     */
    this.name = pName;
    /**
     * Path to the audio file.
     * @type string
     * @private
     */
    this.path = pPath;
    /**
     * Extension of the audio file.
     * @type string
     * @private
     */
    this.extension = this.path.substring(this.path.lastIndexOf('.') + 1);
    /**
     * Specify the loading state of the audio file.
     * @type boolean
     * @private
     */
    this.loaded = false;
};
FM.AudioAsset.prototype.constructor = FM.AudioAsset;
/**
 * Fired when the audio file has finished loading.
 * @method FM.AudioAsset#loadComplete
 * @memberOf FM.AudioAsset
 * @param {Event} event Contains data about the event.
 * @private
 */
FM.AudioAsset.prototype.loadComplete = function (event) {
    "use strict";
    if (event) {
        event.target.owner.loaded = true;
    }
    FM.AssetManager.assetLoaded();
};
/**
 * Load the audio file.
 * @method FM.AudioAsset#load
 * @memberOf FM.AudioAsset
 * @param {Function} pCallbackFunction The function that will be called when the
 * asset is loaded.
 */
FM.AudioAsset.prototype.load = function (pCallbackFunction) {
    "use strict";
    this.audio.src = this.path;
    this.loaded = false;
    if (!pCallbackFunction) {
        this.audio.addEventListener("loadeddata", FM.AudioAsset.prototype.loadComplete, false);
    } else {
        this.audio.addEventListener("loadeddata", function () {
            FM.AudioAsset.prototype.loadComplete();
            pCallbackFunction(this);
        }, false);
    }
    this.audio.owner = this;
};
/**
 * Check if this audio file has been loaded.
 * @method FM.AudioAsset#isLoaded
 * @memberOf FM.AudioAsset
 * @return {boolean} Whether the asset is loaded or not.
 */
FM.AudioAsset.prototype.isLoaded = function () {
    "use strict";
    return this.loaded;
};
/**
 * Get the HTML5 Audio object.
 * @method FM.AudioAsset#getAudio
 * @memberOf FM.AudioAsset
 * @return {Audio} The HTML5 object.
 */
FM.AudioAsset.prototype.getAudio = function () {
    "use strict";
    return this.audio;
};
/**
 * Get the name of the asset.
 * @method FM.AudioAsset#getName
 * @memberOf FM.AudioAsset
 * @return {string} The name of the asset.
 */
FM.AudioAsset.prototype.getName = function () {
    "use strict";
    return this.name;
};
/**
 * Get the path to the audio file.
 * @method FM.AudioAsset#getPath
 * @memberOf FM.AudioAsset
 * @return {string} The path to the asset.
 */
FM.AudioAsset.prototype.getPath = function () {
    "use strict";
    return this.path;
};
/**
 * Check if the audio format is supported by the browser.
 * @method FM.AudioAsset#isSupported
 * @memberOf FM.AudioAsset
 * @return {boolean} Whether the file type is supported by the browser.
 */
FM.AudioAsset.prototype.isSupported = function () {
    "use strict";
    var canPlayThisType = false;
    if (this.extension === "wav") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/wav; codecs="1"') !== "";
    } else if (this.extension === "ogg") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/ogg; codecs="vorbis"') !== "";
    } else if (this.extension === "mp3") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/mpeg;') !== "";
    } else if (this.extension === "aac") {
        canPlayThisType = !!this.audio.canPlayType && this.audio.canPlayType('audio/mp4; codecs="mp4a.40.2"') !== "";
    }
    return canPlayThisType;
};
