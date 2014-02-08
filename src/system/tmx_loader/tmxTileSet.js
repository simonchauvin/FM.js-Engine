/*global FM*/
/**
 * Object representing a tile set from a tile map.
 * @class FM.TmxTileSet
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxTileSet = function () {
    "use strict";
    /**
     * The custom properties of the tile set.
     * @type Array
     * @private
     */
    this.tileProperties = [];
    /**
     * The image associated to this tile set.
     * @type Image
     * @private
     */
    this.image = null;
    /**
     * First ID of the tile of this tile set.
     * @type int
     * @public
     */
    this.firstGID = 0;
    /**
     * Tile map that owns this tile set.
     * @type FM.TmxMap
     * @public
     */
    this.map = null;
    /**
     * Name of the tile set.
     * @type string
     * @public
     */
    this.name = null;
    /**
     * The width of a tile.
     * @type int
     * @public
     */
    this.tileWidth = 0;
    /**
     * The height of a tile.
     * @type int
     * @public
     */
    this.tileHeight = 0;
    /**
     * Spacing between tiles.
     * @type int
     * @public
     */
    this.spacing = 0;
    /**
     * Margin before tiles.
     * @type int
     * @public
     */
    this.margin = 0;
    /**
     * The image of the tile set.
     * @type Image
     * @public
     */
    this.imageSource = null;
    /**
     * Number of tiles in the tile set.
     * @type int
     * @public
     */
    this.numTiles = 0xFFFFFF;
    /**
     * Number of rows in the tile set
     * @type int
     * @public
     */
    this.numRows = 1;
    /**
     * Number of columns in the tile set.
     * @type int
     * @public
     */
    this.numCols = 1;
};
FM.TmxTileSet.prototype.constructor = FM.TmxTileSet;
/**
 * Load the tile set.
 * @method FM.TmxTileSet#load
 * @memberOf FM.TmxTileSet
 * @param {string} pTileSetNode The xml node containing the data to load.
 * @param {FM.TmxMap} pParent The tile map containing this tile set.
 */
FM.TmxTileSet.prototype.load = function (pTileSetNode, pParent) {
    "use strict";
    this.map = pParent;
    this.firstGID = parseInt(pTileSetNode.getAttribute("firstgid"));
    this.imageSource = pTileSetNode.getElementsByTagName("image")[0].getAttribute("source");
    this.name = pTileSetNode.getAttribute("name");
    this.tileWidth = parseInt(pTileSetNode.getAttribute("tilewidth"));
    this.tileHeight = parseInt(pTileSetNode.getAttribute("tileheight"));
    this.spacing = parseInt(pTileSetNode.getAttribute("spacing"));
    this.margin = parseInt(pTileSetNode.getAttribute("margin"));

    //Load properties
    var tiles = pTileSetNode.getElementsByTagName("tile"),
        tile,
        properties,
        property,
        i,
        j;
    if (tiles) {
        for (i = 0; i < tiles.length; i = i + 1) {
            tile = tiles[i];
            properties = tile.getElementsByTagName("properties")[0];
            if (properties) {
                for (j = 0; j < properties.childNodes.length; j = j + 1) {
                    if (properties.hasChildNodes() === true) {
                        property = properties.childNodes[j];
                        if (property.nodeType === 1) {
                            this.tileProperties[tile.getAttribute("id")] = new FM.TmxPropertySet();
                            this.tileProperties[tile.getAttribute("id")].add(property);
                        }
                    }
                }
            }
        }
    }
};
/**
 * Retrieve the image associated to this tile set.
 * @method FM.TmxTileSet#getImage
 * @memberOf FM.TmxTileSet
 * @return {Image} The image associated to the tile set.
 */
FM.TmxTileSet.prototype.getImage = function () {
    "use strict";
    return this.image;
};
/**
 * Provide the image of the tile set.
 * @method FM.TmxTileSet#setImage
 * @memberOf FM.TmxTileSet
 * @param {Image} pImage The image to use as tile set.
 */
FM.TmxTileSet.prototype.setImage = function (pImage) {
    "use strict";
    this.image = pImage;
    //TODO: consider spacing & margin
    this.numCols = Math.floor(this.image.width / this.tileWidth);
    this.numRows = Math.floor(this.image.height / this.tileHeight);
    this.numTiles = this.numRows * this.numCols;
};
/**
 * Check if this tile set contains a given id of tile.
 * @method FM.TmxTileSet#hasGid
 * @memberOf FM.TmxTileSet
 * @param {int} pGid The id of the tile to check the presence of in this tile set.
 * @return {boolean} Whether this tile set owns the given ID of tile.
 */
FM.TmxTileSet.prototype.hasGid = function (pGid) {
    "use strict";
    return (pGid >= this.firstGID) && (pGid < this.firstGID + this.numTiles);
};
/**
 * Retrieve the ID of a tile in the tile set from its global ID.
 * @method FM.TmxTileSet#fromGid
 * @memberOf FM.TmxTileSet
 * @param {int} pGid The global ID of the tile.
 * @return {int} The ID of the tile in the tile set.
 */
FM.TmxTileSet.prototype.fromGid = function (pGid) {
    "use strict";
    return pGid - this.firstGID;
};
/**
 * Retrieve the global ID of a tile.
 * @method FM.TmxTileSet#toGid
 * @memberOf FM.TmxTileSet
 * @param {int} pId The ID of the tile to retrieve the global ID from.
 * @return {int} The global ID of the tile.
 */
FM.TmxTileSet.prototype.toGid = function (pId) {
    "use strict";
    return this.firstGID + pId;
};
/**
 * Retrieve the properties of a particular tile by specifying the global ID of
 * the tile.
 * @method FM.TmxTileSet#getPropertiesByGid
 * @memberOf FM.TmxTileSet
 * @param {int} pGid The global ID of the tile to retrieve the properties from.
 * @return {FM.PropertySet} The property set of the tile.
 */
FM.TmxTileSet.prototype.getPropertiesByGid = function (pGid) {
    "use strict";
    return this.tileProperties[pGid - this.firstGID];
};
/**
 * Retrieve the properties of a given tile's ID.
 * @method FM.TmxTileSet#getProperties
 * @memberOf FM.TmxTileSet
 * @param {int} pId The ID of the tile to retrieve the properties from.
 * @return {FM.TmxPropertySet} The property set of the tile.
 */
FM.TmxTileSet.prototype.getProperties = function (pId) {
    "use strict";
    return this.tileProperties[pId];
};
/**
 * Retieve the rectangle of the given tile's ID.
 * @method FM.TmxTileSet#getRect
 * @memberOf FM.TmxTileSet
 * @param {int} pId The ID of the tile to retrieve the rectangle from.
 * @return {FM.Rectangle} The rectangle of the tile.
 */
FM.TmxTileSet.prototype.getRect = function (pId) {
    "use strict";
    //TODO: consider spacing & margin
    return new FM.Rectangle(0, 0, (pId % this.numCols) * this.tileWidth, (pId / this.numCols) * this.tileHeight);
};
