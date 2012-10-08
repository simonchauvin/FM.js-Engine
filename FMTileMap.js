/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMTileMap(pData, pTileSet, pTileWidth, pTileHeight, pZIndex) {
    "use strict";
    var that = [],
        /**
         * Comma and line return sparated string of numbers representing the position and type of tiles.
         */
        data = pData,
        /**
         * Image representing all tiles by order of the numbers used in data.
         */
        tileSet = pTileSet,
        /**
         * Width of a tile.
         */
        tileWidth = pTileWidth,
        /**
         * Height of a tile.
         */
        tileHeight = pTileHeight,
        /**
         * Width of the map, in pixels.
         */
        width = 0,
        /**
         * Height of the map, in pixels.
         */
        height = 0,
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
     */
    that.load = function () {
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
     * Retrieve the tile associated to the specified position
     */
    that.getTile = function (x, y) {
        return that[Math.floor(y / tileheight)][Math.floor(x / tilewidth)];
    };

    /**
     * Retrieve the tile set.
     */
    that.getTileSet = function () {
        return tileSet;
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