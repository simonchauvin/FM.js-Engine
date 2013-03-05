/**
 * Under Creative Commons Licence
 * Make sure pTileWidth and pTileHeight are int or float
 * @author Simon Chauvin
 */
FMENGINE.fmTilemap = function (pTileSet, pTileWidth, pTileHeight, pZIndex) {
    "use strict";
    var that = [],
        /**
         * Image of the tile set.
         */
        tileSet = pTileSet,
        /**
         * Width of the map, in pixels.
         */
        width = 0,
        /**
         * Height of the map, in pixels.
         */
        height = 0,
        /**
         * Width of a tile.
         */
        tileWidth = pTileWidth,
        /**
         * Height of a tile.
         */
        tileHeight = pTileHeight,
        /**
         * Number of the lines of tiles of the map.
         */
        linesNumber = 0,
        /**
         * Number of the columns of tiles of the map.
         */
        columnsNumber = 0,
        /**
         * Z index of this tile map.
         */
        zIndex = pZIndex;

    /**
     * Load the map of tiles.
     * @param {Array} data  Comma and line return sparated string of numbers representing the position and type of tiles.
     * @param {fmImageAsset} tileSet  Image of the tile set in the order of the data given
     */
    that.load = function (data) {
        var i, idxI = 0, idxJ = 0;
        for (i = 0; i < data.length; i = i + 1) {
            if (data[i] != "\n") {
                that.push(data[i]);
                idxJ++;
            } else {
                that.push([]);
                idxI++;
                idxJ = 0;
            }
        }
        linesNumber = that.length;
        columnsNumber = that[0].length;
        width = tileWidth * columnsNumber;
        height = tileHeight * linesNumber;
    };

    /**
    * Destroy the tile map and its objects.
    */
    that.destroy = function () {
        tileSet = null;
        that = null;
    };

    /**
     * Retrive the tile set.
     */
    that.getTileSet = function () {
        return tileSet;
    };

    /**
     * Retrieve the tile associated to the specified position
     */
    that.getTile = function (x, y) {
        return that[Math.floor(y / tileHeight)][Math.floor(x / tileWidth)];
    };

    /**
     * Get the width of the map
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Get the height of the map
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Get the width of a tile
     */
    that.getTileWidth = function () {
        return tileWidth;
    };

    /**
     * Get the height of a tile
     */
    that.getTileHeight = function () {
        return tileHeight;
    };

    /**
     * Get the number of columns of the map
     */
    that.getColumnsNumber = function () {
        return columnsNumber;
    };

    /**
     * Get the number of lines of the map
     */
    that.getLinesNumber = function () {
        return linesNumber;
    };

    /**
     * Get the z index of the map
     */
    that.getZIndex = function () {
        return zIndex;
    };

    return that;
}