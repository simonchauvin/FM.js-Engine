/*global FM*/
/**
 * World represent the concrete space of the game.
 * @class world
 * @param {int} pWidth width of the tile map in pixels
 * @param {int} pHeight height of the tile map in pixels
 * @author Simon Chauvin
 */
FM.world = function (pWidth, pHeight) {
    "use strict";
    var that = FM.rectangle(0, 0, pWidth, pHeight),
        /**
         * Tile maps of the world.
         * @private
         * @type Array
         * @name world#tileMaps
         * @field
         */
        tileMaps = [];

    /**
     * Add a tile map to the current world.
     * @public
     * @name world#loadTileMap
     * @function
     * @param {tileMap} pTileMap tile map to add.
     * @param {tmxMap} pMap tmxMap containing the tile map data.
     * @param {string} pLayerName name of the layer of the tile map.
     * @param {string} pTileSetName name of the tile set to use.
     */
    that.loadTileMap = function (pTileMap, pMap, pLayerName, pTileSetName) {
        pTileMap.load(pMap.getLayer(pLayerName).toCsv(pMap.getTileSet(pTileSetName)));
        tileMaps.push(pTileMap);
    };

    /**
     * Retrieve the tile map from the given type.
     * @public
     * @name world#getTileMapFromType
     * @function
     * @param {objectType} pType the type of the tile map to retrieve.
     * @return {tileMap} the tile map corresponding to the given type or null if none is found.
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
     * @public
     * @name world#hasTileCollisions
     * @function
     * @return {Boolean} Whether there is a tile map with potential collisions or not.
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
    * Destroy the world and its objects.
    * @public
    * @name world#destroy
    * @function
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};
