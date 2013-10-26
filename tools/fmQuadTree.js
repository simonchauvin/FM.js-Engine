/**
 * 
 * @author Simon Chauvin
 */
FMENGINE.fmQuadTree = function (pLevel, pBounds) {
    "use strict";
    var that = {},
        level = pLevel,
        objects = [],
        bounds = pBounds,
        nodes = [],
        /*
         * 
         */
        MAX_OBJECTS = 10,
        /*
         * 
         */
        MAX_LEVELS = 5,
        /*
         * Determine which node the object belongs to. -1 means
         * object cannot completely fit within a child node and is part
         * of the parent node.
         */
        getIndex = function (pObject) {
            var index = -1,
                spatial = pObject.components[FMENGINE.fmComponentTypes.SPATIAL],
                physic = pObject.components[FMENGINE.fmComponentTypes.PHYSIC],
                verticalMidpoint = bounds.x + (bounds.width / 2),
                horizontalMidpoint = bounds.y + (bounds.height / 2),
                // Object can completely fit within the top quadrants
                topQuadrant = (spatial.position.y < horizontalMidpoint && spatial.position.y + physic.height < horizontalMidpoint),
                // Object can completely fit within the bottom quadrants
                bottomQuadrant = (spatial.position.y > horizontalMidpoint);

            // Object can completely fit within the left quadrants
            if (spatial.position.x < verticalMidpoint && spatial.position.x + physic.width < verticalMidpoint) {
                if (topQuadrant) {
                    index = 1;
                } else if (bottomQuadrant) {
                    index = 2;
                }
            } else if (spatial.position.x > verticalMidpoint) {
                // Object can completely fit within the right quadrants
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
            nodes[0] = FMENGINE.fmQuadTree(level + 1, FMENGINE.fmRectangle(x + subWidth, y, subWidth, subHeight));
            nodes[1] = FMENGINE.fmQuadTree(level + 1, FMENGINE.fmRectangle(x, y, subWidth, subHeight));
            nodes[2] = FMENGINE.fmQuadTree(level + 1, FMENGINE.fmRectangle(x, y + subHeight, subWidth, subHeight));
            nodes[3] = FMENGINE.fmQuadTree(level + 1, FMENGINE.fmRectangle(x + subWidth, y + subHeight, subWidth, subHeight));
        };

    /*
     * Insert the object into the quadtree. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    that.insert = function (pObject) {
        var i, index;
        if (nodes[0]) {
            index = getIndex(pObject);

            if (index !== -1) {
                nodes[index].insert(pObject);
                return;
            }
        }

        objects.push(pObject);

        if (objects.length > MAX_OBJECTS && level < MAX_LEVELS) {
            if (!nodes[0]) {
                split();
            }

            i = 0;
            while (i < objects.length) {
                index = getIndex(objects[i]);
                if (index !== -1) {
                    nodes[index].insert(objects[i]);
                    objects.splice(i, 1);
                } else {
                    i = i + 1;
                }
            }
        }
    };

    /*
     * Return all objects that could collide with the given object.
     */
    that.retrieve = function (pObject) {
        var index = getIndex(pObject),
            i,
            returnObjects = [];
        if (index !== -1 && nodes[0]) {
            returnObjects = nodes[index].retrieve(pObject);
        }

        for (i = 0; i < objects.length; i = i + 1) {
            returnObjects.push(objects[i]);
        }

        return returnObjects;
    };

    /**
     * Clears the quadtree.
     */
    that.clear = function () {
        var i;
        for (i = 0; i < objects.length; i = i + 1) {
            objects[i].destroy();
        }
        for (i = 0; i < nodes.length; i = i + 1) {
            if (nodes[i]) {
                nodes[i].clear();
                nodes[i] = null;
            }
        }
    };

    /**
    * Destroy the quadtree and its objects.
    */
    that.destroy = function () {
        that.clear();
        that = null;
    };

    return that;
};