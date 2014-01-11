/*global FM*/
/**
 * @class math
 * @author Simon Chauvin
 */
FM.math = {
    addVectors: function (vec1, vec2) {
        "use strict";
        return FM.vector(vec1.x + vec2.x, vec1.y + vec2.y);
    },
    substractVectors: function (vec1, vec2) {
        "use strict";
        return FM.vector(vec1.x - vec2.x, vec1.y - vec2.y);
    },
    multiplyVectors: function (vec1, vec2) {
        "use strict";
        return FM.vector(vec1.x * vec2.x, vec1.y * vec2.y);
    },
    clamp: function (val, min, max) {
        "use strict";
        return Math.min(max, Math.max(min, val));
    },
};
