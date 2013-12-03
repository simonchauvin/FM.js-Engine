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
         * Tile maps of the world.
         */
        tileMaps = [];

    /**
     * Add a tile map to the current world.
     * @param {tileMap} pTileMap tile map to add.
     */
    that.addTileMap = function (pTileMap) {
        tileMaps.push(pTileMap);
    };

    /**
     * Retrieve the tile map from the given type.
     * @param {objectType} pType the type of the tile map to retrieve.
     * @return {tileMap} the tile map corresponding to the given type.
     */
    that.getTileMapFromType = function (pType) {
        var i, tileMap;
        for (i = 0; i < tileMaps.length; i = i + 1) {
            tileMap = tileMaps[i];
            if (tileMap.hasType(pType)) {
                return tileMap;
            }
        }
        return null;
    };

    /**
     * Check if a tile map allow collisions.
     * @return {Boolean} Whether there is a tile map with potential collisions.
     */
    that.hasTileCollisions = function () {
        var i;
        for (i = 0; i < tileMaps.length; i = i + 1) {
            if (tileMaps[i].canCollide()) {
                return true;
            }
        }
        return false;
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
