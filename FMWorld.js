/**
 * World represent the concrete space of the game.
 * @author Simon Chauvin
 */
FMENGINE.fmWorld = function (pState, pWidth, pHeight) {
    "use strict";
    var that = FMENGINE.fmRectangle(0, 0, pWidth, pHeight),
        /**
         * State featuring this particular world.
         */
        state = pState;

    /**
     * Add a tile map to the world.
     */
    that.createTiles = function (tileMap) {
        var i, j, k, lines = tileMap.length, col, tileSet = tileMap.getTileSet(), tileWidth = tileMap.getTileWidth(), tileHeight = tileMap.getTileHeight();
        for (i = 0; i < lines; i = i + 1) {
            col = tileMap[i].length;
            for (j = 0; j < col; j = j + 1) {
                var tile = tileMap[i][j], tileSetWidth = tileSet.width, tileSetHeight = tileSet.height, xOffset, yOffset;
                //TODO select the tile in the tileset
                //for (k = 0; k < size; k = k + 1) {
                    if (tile > 0) {
                        tileMap[i][j] = FMENGINE.fmGameObject(tileMap.getZIndex());
                        FMENGINE.fmSpatialComponent(j * tileWidth, i * tileHeight, tileMap[i][j]);
                        var renderer = FMENGINE.fmSpriteRendererComponent(tileSet, tileWidth, tileHeight, tileMap[i][j]);
                        //Select the right tile in the tile set
                        xOffset = (tile - 1) * tileWidth;
                        yOffset = Math.floor(xOffset / tileSetWidth) * tileHeight;
                        if (xOffset >= tileSetWidth) {
                            yOffset = Math.floor(xOffset / tileSetWidth) * tileHeight;
                            xOffset = (xOffset % tileSetWidth);
                        }
                        renderer.setXOffset(xOffset);
                        renderer.setYOffset(yOffset);
                        var physicComponent = FMENGINE.fmAabbComponent(tileWidth, tileHeight, that, tileMap[i][j]);
                        physicComponent.init(FMENGINE.fmParameters.STATIC, 1, 1, 1);
                        //TODO Remove tiles from the game objects list
                        //It shoult have its own list
                        state.add(tileMap[i][j]);
                    }
                //}
            }
        }
    };

    /**
     * Add game objects from a tile map.
     */
    var addGameObjects = function (rootName) {
        //TODO ask for a new tilemap
        //Retrieve root element
        var root = parseXml(data).getElementsByTagName(rootName)[0];
        //Retriebe objects node
        var objects = root.getElementsByTagName("objects")[0].childNodes;

        //Retrieve all the objects
        var i;
        for (i = 0; i < objects.length; i++) {
            //If the node is a dom element
            var object;
            if (objects[i].nodeType == 1) {
                //TODO do something about loading new game objects instead of object custom type (precise the type of the object ?)
                object = {id: 0, name: "", x: 0, y: 0};
                object.id = objects[i].getAttribute("id");
                object.name = objects[i].tagName;
                object.x = parseInt(objects[i].getAttribute("x"));
                object.y = parseInt(objects[i].getAttribute("y"));
                objects.push(object);
            }
        }
    };

    /**
     * Retrieve the object whose name is specified.
     * @param {String} Name of the object to retrieve.
     * @returns {object} Object whose is the one specified, null otherwise.
     */
    that.getObjectByName = function (name) {
        var i = 0;
        for (i = 0; i < objects.length; i = i + 1) {
            if (objects[i].name == name) {
                return objects[i];
            }
        }
        return null;
    };

    /**
    * Destroy the world and its objects
    */
    that.destroy = function () {
        state = null;
        that = null;
    };

    return that;
};