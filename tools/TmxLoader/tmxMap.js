/**
 * 
 */
var tmxMap = function () {
    var that = {},
        /**
         * 
         */
        map = null;
    /**
     * 
     */
    that.version = "unknown";
    /**
     * 
     */
    that.orientation = "orthogonal";
    /**
     * 
     */
    that.width = 0;
    /**
     * 
     */
    that.height = 0;
    /**
     * 
     */
    that.tileWidth = 0;
    /**
     * 
     */
    that.tileHeight = 0;
    /**
     * 
     */
    that.properties = null;
    /**
     * 
     */
    that.layers = [];
    /**
     * 
     */
    that.tileSets = [];
    /**
     * 
     */
    that.objectGroups = [];

    /**
     * 
     */
    that.load = function (source) {
        var xmlDoc, parser;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(source, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(source); 
        }

        map = xmlDoc.getElementsByTagName("map")[0];
        that.version = map.getAttribute("version") || "unknown";
        that.orientation = map.getAttribute("orientation") || "orthogonal";
        that.width = map.getAttribute("width");
        that.height = map.getAttribute("height");
        that.tileWidth = map.getAttribute("tilewidth");
        that.tileHeight = map.getAttribute("tileheight");

        //Read properties
        var properties = map.getElementsByTagName("properties")[0],
            tileSets = map.getElementsByTagName("tileset"),
            layers = map.getElementsByTagName("layer"),
            objectGroups = map.getElementsByTagName("objectGroup"),
            property,
            tileSet,
            layer,
            objectGroup,
            i;
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
        //Load tilesets
        for (i = 0; i < tileSets.length; i++) {
            tileSet = tileSets[i];
            that.tileSets[tileSet.getAttribute("name")] = tmxTileSet();
            that.tileSets[tileSet.getAttribute("name")].load(tileSet, that);
        }
        //Load layer
        for (i = 0; i < layers.length; i++) {
            layer = layers[i];
            that.layers[layer.getAttribute("name")] = tmxLayer();
            that.layers[layer.getAttribute("name")].load(layer, that);
        }
        //Load object group
        for (i = 0; i < objectGroups.length; i++) {
            objectGroup = objectGroups[i];
            that.objectGroups[objectGroup.getAttribute("name")] = tmxObjectGroup();
            that.objectGroups[objectGroup.getAttribute("name")].load(objectGroup, that);
        }
    };

    /**
     * 
     */
    that.getTileSet = function (name) {
        return tileSets[name];
    };

    /**
     * 
     */
    that.getLayer = function (name) {
            return layers[name];
    };

    /**
     * 
     */
    that.getObjectGroup = function (name) {
        return objectGroups[name];	
    };			

    /**
     * works only after TmxTileSet has been initialized with an image...
     */
    that.getGidOwner = function (gid) {
        var last = null;
        for (var tileSet in tileSets)
        {
                if(tileSet.hasGid(gid))
                        return tileSet;
        }
        return null;
    };

    return that;
}