/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FM.math = {
    addVectors: function (vec1, vec2) {
        return FM.vector(vec1.x + vec2.x, vec1.y + vec2.y);
    },
    substractVectors: function (vec1, vec2) {
        return FM.vector(vec1.x - vec2.x, vec1.y - vec2.y);
    },
    multiplyVectors: function (vec1, vec2) {
        return FM.vector(vec1.x * vec2.x, vec1.y * vec2.y);
    },
    clamp: function(val, min, max) {
        return Math.min(max, Math.max(min, val));
    },
};
