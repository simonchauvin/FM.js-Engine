/**
 * 
 */
var tmxLayer = function () {
    "use strict";
    var that = {};
    that.map;
    that.name;
    that.x;
    that.y;
    that.width;
    that.height;
    that.opacity;
    that.visible;
    that.tileGids = [];
    that.properties = null;

    /**
     * 
     */
    that.load = function (layerNode, parent) {
        that.map = parent;
        that.name = layerNode.getAttribute("name");
        that.x = parseInt(layerNode.getAttribute("x")); 
        that.y = parseInt(layerNode.getAttribute("y")); 
        that.width = parseInt(layerNode.getAttribute("width")); 
        that.height = parseInt(layerNode.getAttribute("height")); 
        that.visible = !layerNode.getAttribute("visible") 
                        || (layerNode.getAttribute("visible") !== 0);
        that.opacity = parseInt(layerNode.getAttribute("opacity"));

        var properties = layerNode.getElementsByTagName("properties")[0],
            data = layerNode.getElementsByTagName("data")[0],
            tiles = data.getElementsByTagName("tile"),
            property,
            tile,
            i;
        //Load properties
        if (properties) {
            for (i = 0; i < properties.childNodes.length; i++) {
                if (properties.hasChildNodes() === true) {
                    property = properties.childNodes[i];
                    if (property.nodeType === 1) {
                        if (that.properties) {
                            that.properties.add(property);
                        } else {
                            that.properties = tmxPropertySet();
                            that.properties.add(property);
                        }
                    }
                }
            }
        }
        //Load tile GIDs
        if (data) {
            var chunk = "",
                lineWidth = that.width,
                rowIdx = -1,
                gid;
            if (!data.getAttribute("encoding") || (data.getAttribute("encoding") && data.getAttribute("encoding").length === 0)) {
                //Create a 2dimensional array
                for (i = 0; i < tiles.length; i = i + 1) {
                    tile = tiles[i];
                    //new line?
                    if (++lineWidth >= that.width) {
                        that.tileGids[++rowIdx] = [];
                        lineWidth = 0;
                    }
                    gid = tile.getAttribute("gid");
                    that.tileGids[rowIdx].push(gid);
                }
            } else if (data.getAttribute("encoding") === "csv") {
                chunk = data.childNodes[0].nodeValue;
                that.tileGids = that.csvToArray(chunk, that.width);
            } else if (data.getAttribute("encoding") === "base64") {
                console.log("ERROR: TmxLoader, use XML or CSV export.");
            }
        }
    };

    /**
     * 
     */
    that.toCsv = function (tileSet) {
        var max = 0xFFFFFF,
            offset = 0,
            result = "",
            row = null,
            chunk = "",
            id = 0,
            i,
            j;
        if (tileSet) {
            offset = tileSet.firstGID;
            max = tileSet.numTiles - 1;
        }
        for (i = 0; i < that.tileGids.length; i = i + 1) {
            row = that.tileGids[i];
            chunk = "";
            id = 0;
            for (j = 0; j < row.length; j = j + 1) {
                id = row[j];
                id -= offset;
                if(id < 0 || id > max) {
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
     * 
     */
    that.csvToArray = function (input, lineWidth) {
        var result = [],
            rows = input.split("\n"),
            row = null,
            resultRow = null,
            entries = null,
            i,
            j;
        for (i = 0; i < rows.length; i = i + 1) {
            row = rows[i];
            if (row) {
                resultRow = [];
                entries = row.split(",", lineWidth);
                for (j = 0; j < entries.length; j = j + 1) {
                    resultRow.push(entries[j]);
                }
                result.push(resultRow);
            }
        }
        return result;
    };

    return that;
};