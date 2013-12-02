/**
 * Under Creative Commons Licence
 * No need to add the tilemap to the state, it's done when the tilemap is 
 * loaded.
 * By default a tilemap does not collide to anything.
 * @param {imageAsset} tileSet  Image of the tile set in the order of 
 * the data given
 * @author Simon Chauvin
 */
FM.tileMap = function (pTileSet, pWidth, pHeight, pTileWidth, pTileHeight, pTypes, pZIndex, pCollide) {
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
         * Types the tile map is associated to.
         */
        types = pTypes,
        /**
         * z-index of the tilemap.
         */
        zIndex = pZIndex,
        /**
         * Allow collisions or not with this tile map.
         */
        collide = pCollide;

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
            gid = null,
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
                    gid = parseInt(columns[j]);
                    if (gid > 0) {
                        tile = FM.gameObject(zIndex);
                        for (n = 0; n < pTypes.length; n = n + 1) {
                            tile.addType(pTypes[n]);
                        }
                        spatial = FM.spatialComponent(j * tileWidth, i * tileHeight, tile);
                        tile.addComponent(spatial);
                        renderer = FM.spriteRendererComponent(tileSet, tileWidth, tileHeight, tile);
                        //Select the right tile in the tile set
                        xOffset = gid * tileWidth;
                        yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                        if (xOffset >= tileSet.width) {
                            yOffset = Math.floor(xOffset / tileSet.width) * tileHeight;
                            xOffset = (xOffset % tileSet.width);
                        }
                        renderer.offset.reset(xOffset, yOffset);
                        tile.addComponent(renderer);
                        if (collide) {
                            //physic = FM.aabbComponent(tileWidth, tileHeight, tile);
                            //Object.getPrototypeOf(physic).mass = 0;
                            //tile.addComponent(physic);
                        }
                        state.add(tile);
                        resultRow.push(tile.getId());
                    } else {
                        resultRow.push(-1);
                    }
                }
                data.push(resultRow);
            }
        }
    };

    /**
     * Allow collisions for this tile map.
     */
    that.allowCollisions = function () {
        collide = true;
    };

    /**
     * Prevent collisions for this tile map.
     */
    that.preventCollisions = function () {
        collide = false;
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
     * Check if this tile map can collide.
     * @return {Boolean} whether this tile map can collide or not.
     */
    that.canCollide = function () {
        return collide;
    };

    /**
     * Check if this tile map has a specified type.
     * @return {Boolean} whether this tile map has the given type or not.
     */
    that.hasType = function (pType) {
        return types.indexOf(pType) !== -1;
    };

    /**
     * Retrive the 2D array of tile IDs.
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
