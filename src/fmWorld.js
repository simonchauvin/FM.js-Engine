/**
 * World represent the concrete space of the game.
 * @author Simon Chauvin
 */
FMENGINE.fmWorld = function (pWidth, pHeight) {
    "use strict";
    var that = FMENGINE.fmRectangle(0, 0, pWidth, pHeight),
        /**
         * Current state.
         */
        state = FMENGINE.fmGame.getCurrentState();

    /**
    * Destroy the world and its objects
    */
    that.destroy = function () {
        state = null;
        that = null;
    };

    return that;
};