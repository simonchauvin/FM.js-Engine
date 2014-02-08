/*global FM*/
/**
 * Object representing a layer of the tile map.
 * @class FM.TmxLayer
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxLayer = function () {
    "use strict";
    /**
     * The map that contains this layer.
     * @type FM.TmxMap
     * @public
     */
    this.map = null;
    /**
     * The name of the layer.
     * @type string
     * @public
     */
    this.name = null;
    /**
     * The x position of the layer.
     * @type int
     * @public
     */
    this.x = 0;
    /**
     * The y position of the layer.
     * @type int
     * @public
     */
    this.y = 0;
    /**
     * The width of the layer.
     * @type int
     * @public
     */
    this.width = 0;
    /**
     * The height of the layer.
     * @type int
     * @public
     */
    this.height = 0;
    /**
     * The opacity of the layer.
     * @type float
     * @public
     */
    this.opacity = 0;
    /**
     * Whether the layer is visible or not.
     * @type boolean
     * @public
     */
    this.visible = false;
    /**
     * The list of IDs of the tiles of the layer.
     * @type Array
     * @public
     */
    this.tileGids = [];
    /**
     * The properties of the layer.
     * @type FM.TmxPropertySet
     * @public
     */
    this.properties = null;
};
FM.TmxLayer.prototype.constructor = FM.TmxLayer;
/**
 * Load the layer.
 * @method FM.TmxLayer#load
 * @memberOf FM.TmxLayer
 * @param {Node} pLayerNode The node containing the layer.
 * @param {FM.TmxMap} pParent The tile map that contains the layer.
 */
FM.TmxLayer.prototype.load = function (pLayerNode, pParent) {
    "use strict";
    this.map = pParent;
    this.name = pLayerNode.getAttribute("name");
    this.x = parseInt(pLayerNode.getAttribute("x"));
    this.y = parseInt(pLayerNode.getAttribute("y"));
    this.width = parseInt(pLayerNode.getAttribute("width"));
    this.height = parseInt(pLayerNode.getAttribute("height"));
    this.visible = !pLayerNode.getAttribute("visible")
                    || (pLayerNode.getAttribute("visible") !== 0);
    this.opacity = parseInt(pLayerNode.getAttribute("opacity"));

    var properties = pLayerNode.getElementsByTagName("properties")[0],
        data = pLayerNode.getElementsByTagName("data")[0],
        tiles = data.getElementsByTagName("tile"),
        property,
        tile,
        i;
    //Load properties
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (this.properties) {
                        this.properties.add(property);
                    } else {
                        this.properties = new FM.TmxPropertySet();
                        this.properties.add(property);
                    }
                }
            }
        }
    }
    //Load tile GIDs
    if (data) {
        var chunk = "",
            lineWidth = this.width,
            rowIdx = -1,
            gid;
        if (!data.getAttribute("encoding") || (data.getAttribute("encoding") && data.getAttribute("encoding").length === 0)) {
            //Create a 2dimensional array
            for (i = 0; i < tiles.length; i = i + 1) {
                tile = tiles[i];
                //new line?
                if (++lineWidth >= this.width) {
                    this.tileGids[++rowIdx] = [];
                    lineWidth = 0;
                }
                gid = tile.getAttribute("gid");
                this.tileGids[rowIdx].push(gid);
            }
        } else if (data.getAttribute("encoding") === "csv") {
            chunk = data.childNodes[0].nodeValue;
            this.tileGids = this.csvToArray(chunk, this.width);
        } else if (data.getAttribute("encoding") === "base64") {
            console.log("ERROR: TmxLoader, use XML or CSV export.");
        }
    }
};
/**
 * Convert the layer into a csv string.
 * @method FM.TmxLayer#toCsv
 * @memberOf FM.TmxLayer
 * @param {FM.TmxTileSet} pTileSet The tile set corresponding to this layer.
 * @return {string} The csv data of the layer.
 */
FM.TmxLayer.prototype.toCsv = function (pTileSet) {
    "use strict";
    var max = 0xFFFFFF,
        offset = 0,
        result = "",
        row = null,
        chunk = "",
        id = 0,
        i,
        j;
    if (pTileSet) {
        offset = pTileSet.firstGID;
        max = pTileSet.numTiles - 1;
    }
    for (i = 0; i < this.tileGids.length; i = i + 1) {
        row = this.tileGids[i];
        chunk = "";
        id = 0;
        for (j = 0; j < row.length; j = j + 1) {
            id = row[j];
            id -= offset;
            if (id < 0 || id > max) {
                id = 0;
            }
            result += chunk;
            chunk = id + ",";
        }
        result += id + "\n";
    }
    return result;
};
/**
 * Convert a CSV string into an array.
 * @method FM.TmxLayer#csvToArray
 * @memberOf FM.TmxLayer
 * @param {string} pInput The csv data to convert.
 * @param {int} pLineWidth The number of tiles in a line.
 * @return {Array} The array containing the data of the layer.
 */
FM.TmxLayer.prototype.csvToArray = function (pInput, pLineWidth) {
    "use strict";
    var result = [],
        rows = pInput.split("\n"),
        row = null,
        resultRow = null,
        entries = null,
        i,
        j;
    for (i = 0; i < rows.length; i = i + 1) {
        row = rows[i];
        if (row) {
            resultRow = [];
            entries = row.split(",", pLineWidth);
            for (j = 0; j < entries.length; j = j + 1) {
                resultRow.push(entries[j]);
            }
            result.push(resultRow);
        }
    }
    return result;
};
