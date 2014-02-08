/*global FM*/
/**
 * 
 * @author Simon Chauvin
 */
(function () {
    "use strict";
    /**
     * Create a new object inheriting from the specified one.
     * @param {Object} o The object to inherit from.
     * @return {Object} The new created object.
     */
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    /**
     * Retrieve the prototype of an object.
     * @param {Object} object The object to retrieve the prototype from.
     * @return {Object} The prototype of the given object.
     */
    if (typeof Object.getPrototypeOf !== "function") {
        if (typeof "test".__proto__ === "object") {
            Object.getPrototypeOf = function(object) {
                return object.__proto__;
            };
        } else {
            Object.getPrototypeOf = function(object) {
                "use strict";
                // May break if the constructor has been tampered with
                return object.constructor.prototype;
            };
        }
    }
    /**
     * Hack to get the requestAnimationFrame work on every browser.
     */
    var x, lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
    /**
     * Include a javascript file to the game.
     * @param {string} filename The name and path of the file to include.
     */
    FM.includeJsFile = function (filename) {
        "use strict";
        var head = document.getElementsByTagName("head")[0],
            script = document.createElement("script");
        script = document.createElement("script");
        script.src = filename;
        script.type = "text/javascript";

        head.appendChild(script);
    };
}());
