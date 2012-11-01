/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMWorld(pState, pWidth, pHeight) {
    "use strict";
    var that = FMRectangle(0, 0, pWidth, pHeight),
        /**
         * State featuring this particular world
         */
        state = pState;
    /**
     * Box2D world
     */
    that.box2DWorld = null;

    /**
     * Init the Box2D world.
     */
    that.initBox2DWorld = function (gravity, sleep) {
        var b2World = Box2D.Dynamics.b2World,
        b2Vec2 = Box2D.Common.Math.b2Vec2;
        that.box2DWorld = new b2World(new b2Vec2(gravity.x / FMParameters.PIXELS_TO_METERS, gravity.y / FMParameters.PIXELS_TO_METERS), sleep);
    };

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
                        tileMap[i][j] = FMGameObject(tileMap.getZIndex());
                        FMSpatialComponent(j * tileWidth, i * tileHeight, tileMap[i][j]);
                        var renderer = FMSpriteRendererComponent(tileSet, tileWidth, tileHeight, tileMap[i][j]);
                        //Select the right tile in the tile set
                        xOffset = (tile - 1) * tileWidth;
                        yOffset = Math.floor(xOffset / tileSetWidth) * tileHeight;
                        if (xOffset >= tileSetWidth) {
                            yOffset = Math.floor(xOffset / tileSetWidth) * tileHeight;
                            xOffset = (xOffset % tileSetWidth);
                        }
                        renderer.setXOffset(xOffset);
                        renderer.setYOffset(yOffset);
                        var physicComponent = FMAabbComponent(tileWidth, tileHeight, that, tileMap[i][j]);
                        physicComponent.init(FMParameters.STATIC, 1, 1, 1);
                        //TODO Remove tiles from the game objects list
                        //It shoult have its own list
                        state.add(tileMap[i][j]);
                    }
                //}
            }
        }
    };

    /**
     * Add a tile map to the Box2D world.
     */
    that.createBox2DTiles = function (tileMap) {
        var i, j, k, lines = tileMap.length, col, tileSet = tileMap.getTileSet(), tileWidth = tileMap.getTileWidth(), tileHeight = tileMap.getTileHeight();
        for (i = 0; i < lines; i = i + 1) {
            col = tileMap[i].length;
            for (j = 0; j < col; j = j + 1) {
                var tile = tileMap[i][j], tileSetWidth = tileSet.width, tileSetHeight = tileSet.height, xOffset, yOffset;
                if (tile > 0) {
                    //Create Box2D tile
                    tileMap[i][j] = FMGameObject(tileMap.getZIndex());
                    FMSpatialComponent(j * tileWidth, i * tileHeight, tileMap[i][j]);
                    var renderer = FMSpriteRendererComponent(tileSet, tileWidth, tileHeight, tileMap[i][j]);
                    //Select the right tile in the tile set
                    xOffset = (tile - 1) * tileWidth;
                    yOffset = Math.floor(xOffset / tileSetWidth) * tileHeight;
                    if (xOffset >= tileSetWidth) {
                        yOffset = Math.floor(xOffset / tileSetWidth) * tileHeight;
                        xOffset = (xOffset % tileSetWidth);
                    }
                    renderer.setXOffset(xOffset);
                    renderer.setYOffset(yOffset);

                    var physicComponent = FMB2BoxComponent(tileWidth, tileHeight, that, tileMap[i][j]);
                    physicComponent.init(FMParameters.STATIC, 1, 0, 0);
                    //TODO Remove tiles from the game objects list
                    //It shoult have its own list
                    state.add(tileMap[i][j]);
                }
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
    that.destroy = function() {
        state = null;
        that.box2DWorld = null;
        that = null;
    };

    /**
     * Get the collisions array.
     * @returns {Array} Tiles of collisions.
     */
    that.getCollisions = function () {
        return collisions;
    };

    /**
     * @returns {boolean} True if the world has collisions, false otherwise.
     */
    that.hasCollisions = function () {
        return collisions.length > 0;
    };

    /**
     * @returns {Array} The array specifying the solidity of the world bounds
     */
    that.getBounds = function () {
        return bounds;
    };

    /**
     * Set the borders
     */
    that.setBounds = function (pBounds) {
        bounds = pBounds;
    };

    return that;
}