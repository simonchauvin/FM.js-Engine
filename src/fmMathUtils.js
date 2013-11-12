/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
FMENGINE.fmMathUtils = {
    addVectors: function (vec1, vec2) {
        return FMENGINE.fmVector(vec1.x + vec2.x, vec1.y + vec2.y);
    },
    substractVectors: function (vec1, vec2) {
        return FMENGINE.fmVector(vec1.x - vec2.x, vec1.y - vec2.y);
    },
    multiplyVectors: function (vec1, vec2) {
        return FMENGINE.fmVector(vec1.x * vec2.x, vec1.y * vec2.y);
    },
    clamp: function(val, min, max) {
        return Math.min(max, Math.max(min, val));
    },
};