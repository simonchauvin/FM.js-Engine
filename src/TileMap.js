/*global FM*/
/**
 * Represent a tile map for build tiled games.
 * No need to add the tilemap to the state, it's done when the tilemap is 
 * loaded.
 * By default a tilemap does not collide to anything.
 * @class FM.TileMap
 * @param {FM.ImageAsset} tileSet Image of the tile set in the order of 
 * the data given.
 * @param {int} pWidth The number of tiles constituing the width of the tile 
 * map.
 * @param {int} pHeight The number of tiles constituing the height of the tile
 * map.
 * @param {int} pTileWidth The width of a tile.
 * @param {int} pTileHeight The height of a tile.
 * @param {Array} pTypes The types to set the tiles of the tile map to.
 * @param {int} pZIndex The depth of the tiles of the tile map.
 * @param {boolean} pCollide Whether the tile map should collide or not.
 * @constructor
 * @author Simon Chauvin
 */
FM.TileMap = function (pTileSet, pWidth, pHeight, pTileWidth, pTileHeight, pTypes, pZIndex, pCollide) {
    "use strict";
    /**
     * Array containing the IDs of tiles.
     * @type Array
     * @private
     */
    this.data = [];
    /**
     * Image of the tile set.
     * @type Image
     * @private
     */
    this.tileSet = pTileSet;
    /**
     * Width of the map, in columns.
     * @type int
     * @private
     */
    this.width = pWidth;
    /**
     * Height of the map, in lines.
     * @type int
     * @private
     */
    this.height = pHeight;
    /**
     * Width of a tile.
     * @type int
     * @private
     */
    this.tileWidth = pTileWidth;
    /**
     * Height of a tile.
     * @type int
     * @private
     */
    this.tileHeight = pTileHeight;
    /**
     * Types the tile map is associated to.
     * @type Array
     * @private
     */
    this.types = pTypes;
    /**
     * Z-index of the tilemap.
     * @type int
     * @private
     */
    this.zIndex = pZIndex;
    /**
     * Allow collisions or not with this tile map.
     * @type boolean
     * @private
     */
    this.collide = pCollide;
};
FM.TileMap.prototype.constructor = FM.TileMap;
/**
 * Load the tilemap.
 * @method FM.TileMap#load
 * @memberOf FM.TileMap
 * @param {string} pData Comma and line return sparated string of numbers 
 * representing the position and type of tiles.
 */
FM.TileMap.prototype.load = function (pData) {
    "use strict";
    var rows = pData.split("\n"),
        row = null,
        resultRow = null,
        columns = null,
        gid = null,
        tile = null,
        state = FM.Game.getCurrentState(),
        renderer,
        xOffset,
        yOffset,
        image = this.tileSet.image,
        i,
        j,
        n;
    for (i = 0; i < rows.length; i = i + 1) {
        row = rows[i];
        if (row) {
            resultRow = [];
            columns = row.split(",", this.width);
            for (j = 0; j < columns.length; j = j + 1) {
                gid = parseInt(columns[j]);
                if (gid > 0) {
                    tile = new FM.GameObject(this.zIndex);
                    for (n = 0; n < this.types.length; n = n + 1) {
                        tile.addType(this.types[n]);
                    }
                    tile.addComponent(new FM.SpatialComponent(j * this.tileWidth, i * this.tileHeight, tile));
                    renderer = tile.addComponent(new FM.SpriteRendererComponent(this.tileSet, this.tileWidth, this.tileHeight, tile));
                    //Select the right tile in the tile set
                    xOffset = gid * this.tileWidth;
                    yOffset = Math.floor(xOffset / image.width) * this.tileHeight;
                    if (xOffset >= image.width) {
                        yOffset = Math.floor(xOffset / image.width) * this.tileHeight;
                        xOffset = (xOffset % image.width);
                    }
                    renderer.offset.reset(xOffset, yOffset);
                    //Add tile to the state
                    state.add(tile);
                    //Add the game object's ID
                    resultRow.push(tile.getId());
                } else {
                    //No tile
                    resultRow.push(-1);
                }
            }
            //New line
            this.data.push(resultRow);
        }
    }
};
/**
 * Allow collisions for this tile map.
 * @method FM.TileMap#allowCollisions
 * @memberOf FM.TileMap
 */
FM.TileMap.prototype.allowCollisions = function () {
    "use strict";
    this.collide = true;
};
/**
 * Prevent collisions for this tile map.
 * @method FM.TileMap#preventCollisions
 * @memberOf FM.TileMap
 */
FM.TileMap.prototype.preventCollisions = function () {
    "use strict";
    this.collide = false;
};
/**
 * Check if this tile map can collide.
 * @method FM.TileMap#canCollide
 * @memberOf FM.TileMap
 * @return {boolean} Whether this tile map can collide or not.
 */
FM.TileMap.prototype.canCollide = function () {
    "use strict";
    return this.collide;
};
/**
 * Check if this tile map has a specified type.
 * @method FM.TileMap#hasType
 * @memberOf FM.TileMap
 * @return {boolean} Whether this tile map has the given type or not.
 */
FM.TileMap.prototype.hasType = function (pType) {
    "use strict";
    return this.types.indexOf(pType) !== -1;
};
/**
 * Retrive the 2D array of tile IDs.
 * @method FM.TileMap#getData
 * @memberOf FM.TileMap
 * @return {Array} The list of tile IDs of tile map.
 */
FM.TileMap.prototype.getData = function () {
    "use strict";
    return this.data;
};
/**
 * Retrive the tile set.
 * @method FM.TileMap#getTileSet
 * @memberOf FM.TileMap
 * @return {Image} The tile set.
 */
FM.TileMap.prototype.getTileSet = function () {
    "use strict";
    return this.tileSet;
};
/**
 * Retrieve the tile ID associated to a given position.
 * @method FM.TileMap#getTileId
 * @memberOf FM.TileMap
 * @param {int} pX The x position of the tile to retrieve.
 * @param {int} pY The y position of the tile to retrieve.
 * @return {int} The ID of the tile at the given position.
 */
FM.TileMap.prototype.getTileId = function (pX, pY) {
    "use strict";
    return this.data[Math.floor(pY / this.tileHeight)][Math.floor(pX / this.tileWidth)];
};
/**
 * Get the width of the map.
 * @method FM.TileMap#getWidth
 * @memberOf FM.TileMap
 * @return {int} The number of tiles constituing the width of the tile map.
 */
FM.TileMap.prototype.getWidth = function () {
    "use strict";
    return this.width;
};
/**
 * Get the height of the map.
 * @method FM.TileMap#getHeight
 * @memberOf FM.TileMap
 * @return {int} The number of tiles constituing the height of the tile map.
 */
FM.TileMap.prototype.getHeight = function () {
    "use strict";
    return this.height;
};
/**
 * Get the width of a tile.
 * @method FM.TileMap#getTileWidth
 * @memberOf FM.TileMap
 * @return {int} The width of a tile.
 */
FM.TileMap.prototype.getTileWidth = function () {
    "use strict";
    return this.tileWidth;
};
/**
 * Get the height of a tile.
 * @method FM.TileMap#getTileHeight
 * @memberOf FM.TileMap
 * @return {int} The height of a tile.
 */
FM.TileMap.prototype.getTileHeight = function () {
    "use strict";
    return this.tileHeight;
};
/**
 * Get the z-index of the map.
 * @method FM.TileMap#getZIndex
 * @memberOf FM.TileMap
 * @return {int} The depth of the tiles of the tile map.
 */
FM.TileMap.prototype.getZIndex = function () {
    "use strict";
    return this.zIndex;
};
/**
* Destroy the tile map and its objects.
* @method FM.TileMap#destroy
 * @memberOf FM.TileMap
*/
FM.TileMap.prototype.destroy = function () {
    "use strict";
    this.data = null;
    this.tileSet = null;
    this.width = null;
    this.height = null;
    this.tileWidth = null;
    this.tileHeight = null;
    this.types = null;
    this.zIndex = null;
    this.collide = null;
};
