/*global FM*/
/**
 * @class quadTree
 */
FM.quadTree = function (pLevel, pBounds) {
    "use strict";
    var that = {},
        /**
         * Maximum number of objects per quad tree.
         */
        MAX_OBJECTS = 10,
        /**
         * Maximum depth of the quad tree.
         */
        MAX_LEVELS = 5,
        /**
         * Current depth level of the quad tree.
         */
        level = pLevel,
        /**
         * Objects present in the quad tree.
         */
        objects = [],
        /**
         * Bounds delimiting the quad tree in the screen space.
         */
        bounds = pBounds,
        /**
         * The four nodes created when a quad tree is split.
         */
        nodes = [],
        /**
         * Determine which node the object belongs to. -1 means
         * object cannot completely fit within a child node and is part
         * of the parent node.
         */
        getIndex = function (gameObject) {
            var index = -1,
                spatial = gameObject.components[FM.componentTypes.SPATIAL],
                physic = gameObject.components[FM.componentTypes.PHYSIC],
                verticalMidpoint = bounds.x + (bounds.width / 2),
                horizontalMidpoint = bounds.y + (bounds.height / 2),
                topQuadrant = (spatial.position.y < horizontalMidpoint && spatial.position.y + physic.height < horizontalMidpoint),
                bottomQuadrant = (spatial.position.y > horizontalMidpoint);
            if (spatial.position.x < verticalMidpoint && spatial.position.x + physic.width < verticalMidpoint) {
                if (topQuadrant) {
                    index = 1;
                } else if (bottomQuadrant) {
                    index = 2;
                }
            } else if (spatial.position.x > verticalMidpoint) {
                if (topQuadrant) {
                    index = 0;
                } else if (bottomQuadrant) {
                    index = 3;
                }
            }
            return index;
        },
        /*
         * Splits the node into 4 subnodes.
         */
        split = function () {
            var subWidth = bounds.width / 2,
                subHeight = bounds.height / 2,
                x = bounds.x,
                y = bounds.y;
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x + subWidth, y, subWidth, subHeight)));
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x, y, subWidth, subHeight)));
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x, y + subHeight, subWidth, subHeight)));
            nodes.push(FM.quadTree(level + 1, FM.rectangle(x + subWidth, y + subHeight, subWidth, subHeight)));
        };

    /*
     * Insert the object into the quadtree. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    that.insert = function (gameObject) {
        if (nodes.length > 0) {
            var index = getIndex(gameObject);
            if (index !== -1) {
                nodes[index].insert(gameObject);
                return;
            }
        }
        objects.push(gameObject);
        if (objects.length > MAX_OBJECTS && level < MAX_LEVELS) {
            if (nodes.length === 0) {
                split();
            }
            var i = 0, index;
            while (i < objects.length) {
                index = getIndex(objects[i]);
                if (index !== -1) {
                    nodes[index].insert(objects.splice(i, 1)[0]);
                } else {
                    i = i + 1;
                }
            }
        }
    };

    /*
     * Return all objects that could collide with the given object.
     */
    that.retrieve = function (gameObject) {
        var returnObjects = [],
            index = getIndex(gameObject);
        if (index !== -1 && nodes.length > 0) {
            returnObjects = nodes[index].retrieve(gameObject);
        }
        var i;
        for (i = 0; i < objects.length; i = i + 1) {
            returnObjects.push(objects[i]);
        }
        return returnObjects;
    };

    /**
     * Clears the quadtree.
     */
    that.clear = function () {
        objects = [];
        var i;
        for (i = 0; i < nodes.length; i = i + 1) {
            if (nodes[i]) {
                nodes[i].clear();
                nodes[i] = null;
            }
        }
        nodes = [];
    };

    return that;
};
