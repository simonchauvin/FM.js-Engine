/**
 * Under Creative Commons Licence
 * Make sure pTileWidth and pTileHeight are int or float
 * @param {fmImageAsset} tileSet  Image of the tile set in the order of 
 * the data given
 * @author Simon Chauvin
 */
FMENGINE.fmTilemap = function (pTileSet, pWidth, pHeight, pTileWidth, pTileHeight, pZIndex) {
    "use strict";
    var that = {},
        /**
         * Array containing the IDs of tiles.
         */
        data = [],
        /**
         * Image of the tile set.
         */
        tileSet = pTileSet,
        /**
         * Width of the map, in columns.
         */
        width = pWidth,
        /**
         * Height of the map, in lines.
         */
        height = pHeight,
        /**
         * Width of a tile.
         */
        tileWidth = pTileWidth,
        /**
         * Height of a tile.
         */
        tileHeight = pTileHeight,
        /**
         * z-index of the tilemap.
         */
        zIndex = pZIndex;

    /**
     * Load the tilemap.
     * @param {Array} data  Comma and line return sparated string of numbers 
     * representing the position and type of tiles.
     */
    that.load = function (pData) {
        var rows = pData.split("\n"),
            row = null,
            resultRow = null,
            columns = null,
            tileId = null,
            tile = null,
            renderer,
            xOffset,
            yOffset,
            i,
            j;
        for (i = 0; i < rows.length; i = i + 1) {
            row = rows[i];
            if (row) {
                resultRow = [];
                columns = row.split(",", width);
                for (j = 0; j < columns.length; j = j + 1) {
                    tileId = columns[j];
                    if (tileId > 0) {
                        tile = FMENGINE.fmGameObject(zIndex);
                        FMENGINE.fmSpatialComponent(j * tileWidth, i * tileHeight, tile);
                        renderer = FMENGINE.fmSpriteRendererComponent(tileSet, tileWidth, tileHeight, tile);
                        //Select the right tile in the tile set
                        xOffset = tileId * tileWidth;
                        yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                        if (xOffset >= tileSet.width) {
                            yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                            xOffset = (xOffset % tileSet.width);
                        }
                        renderer.setXOffset(xOffset);
                        renderer.setYOffset(yOffset);
                        FMENGINE.fmAabbComponent(tileWidth, tileHeight, tile);
                        FMENGINE.fmGame.getCurrentState().add(tile);
                    }
                    resultRow.push(tileId);
                }
                data.push(resultRow);
            }
        }
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
     * Retrieve the tile ID associated to a given position.
     */
    that.getTileId = function (x, y) {
        return data[Math.floor(y / tileHeight)][Math.floor(x / tileWidth)];
    };

    /**
     * Get the width of the map.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Get the height of the map.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Get the width of a tile.
     */
    that.getTileWidth = function () {
        return tileWidth;
    };

    /**
     * Get the height of a tile.
     */
    that.getTileHeight = function () {
        return tileHeight;
    };

    /**
     * Get the z-index of the map.
     */
    that.getZIndex = function () {
        return zIndex;
    };

    return that;
}