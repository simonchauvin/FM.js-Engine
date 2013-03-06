/**
 * 
 */
var tmxTileSet = function () {
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
        map = parent;
        that.firstGID = tileSetNode.getAttribute("firstgid");
        that.imageSource = tileSetNode.getElementsByTagName("image")[0].getAttribute("source");
        that.name = tileSetNode.getAttribute("name");
        that.tileWidth = tileSetNode.getAttribute("tilewidth");
        that.tileHeight = tileSetNode.getAttribute("tileheight");
        that.spacing = tileSetNode.getAttribute("spacing");
        that.margin = tileSetNode.getAttribute("margin");

        //Read properties
        var tiles = tileSetNode.getElementsByTagName("tile"),
            tile,
            properties,
            property,
            i,
            j;
        for (i = 0; i < tiles.length; i++) {
            tile = tiles[i];
            properties = tile.getElementsByTagName("properties")[0];
            for (j = 0; j < properties.childNodes.length; j++) {
                if (properties.hasChildNodes() === true) {
                    property = properties.childNodes[j];
                    if (property.nodeType === 1) {
                        tileProperties[tile.getAttribute("id")] = tmxPropertySet();
                        tileProperties[tile.getAttribute("id")].add(property);
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
        return new Rectangle((id % that.numCols) * that.tileWidth, (id / that.numCols) * that.tileHeight);
    };

    return that;
};