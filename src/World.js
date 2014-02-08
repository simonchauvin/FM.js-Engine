/*global FM*/
/**
 * World represent the concrete space of the game.
 * @class FM.World
 * @extends FM.Rectangle
 * @param {int} pWidth Width of the tile map in pixels
 * @param {int} pHeight Height of the tile map in pixels
 * @constructor
 * @author Simon Chauvin
 */
FM.World = function (pWidth, pHeight) {
    "use strict";
    //Calling the constructor of the FM.Rectangle
    FM.Rectangle.call(this, 0, 0, pWidth, pHeight);
    /**
     * Tile maps of the world.
     * @type Array
     * @private
     */
    this.tileMaps = [];
};
/**
 * FM.World inherits from FM.Rectangle.
 */
FM.World.prototype = Object.create(FM.Rectangle.prototype);
FM.World.prototype.constructor = FM.World;
/**
 * Add a tile map to the current world.
 * @method FM.World#loadTileMap
 * @memberOf FM.World
 * @param {FM.TileMap} pTileMap Tile map to add.
 * @param {FM.TmxMap} pMap TmxMap containing the tile map data.
 * @param {string} pLayerName Name of the layer of the tile map.
 * @param {string} pTileSetName Name of the tile set to use.
 */
FM.World.prototype.loadTileMap = function (pTileMap, pMap, pLayerName, pTileSetName) {
    "use strict";
    pTileMap.load(pMap.getLayer(pLayerName).toCsv(pMap.getTileSet(pTileSetName)));
    this.tileMaps.push(pTileMap);
};
/**
 * Retrieve the tile map from the given type.
 * @method FM.World#getTileMapFromType
 * @memberOf FM.World
 * @param {FM.ObjectType} pType The type of the tile map to retrieve.
 * @return {FM.TileMap} The tile map corresponding to the given type or null if none is found.
 */
FM.World.prototype.getTileMapFromType = function (pType) {
    "use strict";
    var i, tileMap;
    for (i = 0; i < this.tileMaps.length; i = i + 1) {
        tileMap = this.tileMaps[i];
        if (tileMap.hasType(pType)) {
            return tileMap;
        }
    }
    return null;
};
/**
 * Check if a tile map allow collisions.
 * @method FM.World#hasTileCollisions
 * @memberOf FM.World
 * @return {boolean} Whether there is a tile map with potential collisions or not.
 */
FM.World.prototype.hasTileCollisions = function () {
    "use strict";
    var i;
    for (i = 0; i < this.tileMaps.length; i = i + 1) {
        if (this.tileMaps[i].canCollide()) {
            return true;
        }
    }
    return false;
};
/**
 * Destroy the world and its objects.
 * @method FM.World#destroy
 * @memberOf FM.World
 */
FM.World.prototype.destroy = function () {
    "use strict";
    this.tileMaps = null;
    FM.Rectangle.prototype.destroy.call(this);
};
