/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {
            "use strict";
        };
        F.prototype = o;
        return new F();
    };
}

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

function include (filename) {
    "use strict";
    var head = document.getElementsByTagName("head")[0];

    script = document.createElement("script");
    script.src = filename;
    script.type = "text/javascript";

    head.appendChild(script);
}

/**
 * Time management
 */
var lastUpdate = new Date();

/**
 * Retrieve the time that has passed since the last frame
 */
function elapsedTime () {
    "use strict";
    return (new Date() - lastUpdate);
};