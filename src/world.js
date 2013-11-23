/**
 * World represent the concrete space of the game.
 * @author Simon Chauvin
 */
FM.world = function (pWidth, pHeight) {
    "use strict";
    var that = FM.rectangle(0, 0, pWidth, pHeight),
        /**
         * Current state.
         */
        state = FM.game.getCurrentState(),
        /**
         * The tile map for the collision (if any).
         */
        collisionTileMap;

    /**
     * Add a tile map for collisions.
     */
    that.addCollisionTileMap = function (pCollisionTileMap) {
        collisionTileMap = pCollisionTileMap;
    };

    /**
     * Retrieve the tile map for collisions.
     */
    that.getCollisionTileMap = function () {
        return collisionTileMap;
    };

    /**
    * Destroy the world and its objects
    */
    that.destroy = function () {
        state = null;
        that = null;
    };

    return that;
};
