/*global FM*/
/**
 * An audio asset represents an audio file that is usable in the FM.js 
 * engine.
 * @class FM.AudioAsset
 * @extends FM.Asset
 * @param {string} pName Name of the asset.
 * @param {string} pPath Path of the asset.
 * @constructor
 * @author Simon Chauvin
 */
FM.AudioAsset = function (pName, pPath) {
    "use strict";
    //Calling the constructor of FM.Asset
    FM.Asset.call(this, pName, pPath);
    /**
     * The HTML5 Audio object.
     * @type Audio
     */
    this.audio = new Audio();
    /**
     * Extension of the audio file.
     * @type string
     */
    this.extension = this.path.substring(this.path.lastIndexOf('.') + 1);
};
/**
 * FM.AudioAsset inherits from FM.Asset.
 */
FM.AudioAsset.prototype = Object.create(FM.Asset.prototype);
FM.AudioAsset.prototype.constructor = FM.AudioAsset;
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
        this.audio.onloadeddata = function (e) {
            if (e) {
                e.target.owner.loaded = true;
            }
        }
    } else {
        this.audio.onloadeddata = function (e) {
            if (e) {
                e.target.owner.loaded = true;
            }
            pCallbackFunction(this);
        };
    }
    this.audio.owner = this;
    var that = this,
        xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', this.path, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onprogress = function(e) {
        var oldCompletionRate = that.completionLevel;
        that.completionLevel = (e.loaded / e.total);
        FM.AssetManager.updateProgress(that.completionLevel - oldCompletionRate);
    };
    xmlHTTP.send();
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
