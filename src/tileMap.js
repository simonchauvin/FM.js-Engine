/**
 * Under Creative Commons Licence
 * No need to add the tilemap to the state, it's done when the tilemap is 
 * loaded.
 * By default a tilemap does not collide to anything.
 * @param {imageAsset} tileSet  Image of the tile set in the order of 
 * the data given
 * @author Simon Chauvin
 */
FM.tileMap = function (pTileSet, pWidth, pHeight, pTileWidth, pTileHeight, pTypes, pZIndex, pAllowCollisions) {
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
        zIndex = pZIndex,
        /**
         * Allow collisions or not with this tile map
         */
        allowCollisions = pAllowCollisions;

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
            state = FM.game.getCurrentState(),
            spatial,
            renderer,
            physic,
            xOffset,
            yOffset,
            i,
            j,
            n;
        for (i = 0; i < rows.length; i = i + 1) {
            row = rows[i];
            if (row) {
                resultRow = [];
                columns = row.split(",", width);
                for (j = 0; j < columns.length; j = j + 1) {
                    tileId = columns[j];
                    if (tileId > 0) {
                        tile = FM.gameObject(zIndex);
                        for (n = 0; n < pTypes.length; n = n + 1) {
                            tile.addType(pTypes[n]);
                        }
                        spatial = FM.spatialComponent(j * tileWidth, i * tileHeight, tile);
                        tile.addComponent(spatial);
                        renderer = FM.spriteRendererComponent(tileSet, tileWidth, tileHeight, tile);
                        //Select the right tile in the tile set
                        xOffset = tileId * tileWidth;
                        yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                        if (xOffset >= tileSet.width) {
                            yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                            xOffset = (xOffset % tileSet.width);
                        }
                        renderer.setXOffset(xOffset);
                        renderer.setYOffset(yOffset);
                        tile.addComponent(renderer);
                        if (allowCollisions) {
                            physic = FM.aabbComponent(tileWidth, tileHeight, tile);
                            Object.getPrototypeOf(physic).mass = 0;
                            tile.addComponent(physic);
                        }
                        state.add(tile);
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
        data = null;
        tileSet = null;
        that = null;
    };

    /**
     * Retrive the data.
     */
    that.getData = function () {
        return data;
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
};
