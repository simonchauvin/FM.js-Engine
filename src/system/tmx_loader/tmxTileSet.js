/**
 * 
 */
FM.tmxTileSet = function () {
    "use strict";
    var that = {},
        tileProperties = [],
        image = null;

    that.firstGID = 0;
    that.map;
    that.name;
    that.tileWidth;
    that.tileHeight;
    that.spacing;
    that.margin;
    that.imageSource;

    //available only after immage has been assigned:
    that.numTiles = 0xFFFFFF;
    that.numRows = 1;
    that.numCols = 1;

    /**
     * 
     * @param {type} tileSetNode
     * @param {type} parent
     */
    that.load = function (tileSetNode, parent) {
        that.map = parent;
        that.firstGID = parseInt(tileSetNode.getAttribute("firstgid"));
        that.imageSource = tileSetNode.getElementsByTagName("image")[0].getAttribute("source");
        that.name = tileSetNode.getAttribute("name");
        that.tileWidth = parseInt(tileSetNode.getAttribute("tilewidth"));
        that.tileHeight = parseInt(tileSetNode.getAttribute("tileheight"));
        that.spacing = parseInt(tileSetNode.getAttribute("spacing"));
        that.margin = parseInt(tileSetNode.getAttribute("margin"));

        //Load properties
        var tiles = tileSetNode.getElementsByTagName("tile"),
            tile,
            properties,
            property,
            i,
            j;
        if (tiles) {
            for (i = 0; i < tiles.length; i++) {
                tile = tiles[i];
                properties = tile.getElementsByTagName("properties")[0];
                if (properties) {
                    for (j = 0; j < properties.childNodes.length; j++) {
                        if (properties.hasChildNodes() === true) {
                            property = properties.childNodes[j];
                            if (property.nodeType === 1) {
                                tileProperties[tile.getAttribute("id")] = FM.tmxPropertySet();
                                tileProperties[tile.getAttribute("id")].add(property);
                            }
                        }
                    }
                }
            }
        }
    };

    that.getImage = function () {
        return image;
    };

    that.setImage = function (pImage) {
        image = pImage;
        //TODO: consider spacing & margin
        that.numCols = Math.floor(image.width / that.tileWidth);
        that.numRows = Math.floor(image.height / that.tileHeight);
        that.numTiles = that.numRows * that.numCols;
    };

    that.hasGid = function (gid) {
        return (gid >= that.firstGID) && (gid < that.firstGID + that.numTiles);
    };

    that.fromGid = function (gid) {
        return gid - that.firstGID;
    };

    that.toGid = function (id) {
        return that.firstGID + id;
    };

    that.getPropertiesByGid = function (gid) {
        return tileProperties[gid - that.firstGID];
    };

    that.getProperties = function (id) {
        return tileProperties[id];
    };

    that.getRect = function (id) {
        //TODO: consider spacing & margin
        return new FM.rectangle(0, 0, (id % that.numCols) * that.tileWidth, (id / that.numCols) * that.tileHeight);
    };

    return that;
};