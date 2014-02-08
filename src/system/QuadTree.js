/*global FM*/
/**
 * The quad tree is used to subdivide the game space to optimize the performance
 * for collisions testing.
 * @class FM.QuadTree
 * @param {int} pLevel The level of depth of the quad tree to create.
 * @param {FM.Rectangle} pBounds The rectangle delimiting the quad tree in the
 * screen space.
 * @constructor
 * @author Simon Chauvin
 */
FM.QuadTree = function (pLevel, pBounds) {
    "use strict";
    /**
     * Maximum number of objects per quad tree.
     * @constant
     * @type int
     * @private
     */
    this.MAX_OBJECTS = 10;
    /**
     * Maximum depth of the quad tree.
     * @constant
     * @type int
     * @private
     */
    this.MAX_LEVELS = 5;
    /**
     * Current depth level of the quad tree.
     * @type int
     * @private
     */
    this.level = pLevel;
    /**
     * Objects present in the quad tree.
     * @type Array
     * @private
     */
    this.objects = [];
    /**
     * Bounds delimiting the quad tree in the screen space.
     * @type FM.Rectangle
     * @private
     */
    this.bounds = pBounds;
    /**
     * The four nodes created when a quad tree is split.
     * @type Array
     * @private
     */
    this.nodes = [];
};
FM.QuadTree.prototype.constructor = FM.QuadTree;
/**
 * Determine which node the object belongs to. -1 means
 * object cannot completely fit within a child node and is part
 * of the parent node.
 * @method FM.QuadTree#getIndex
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to retrieve the
 * index from.
 * @return {int} The index of the node in which the given object is.
 * @private
 */
FM.QuadTree.prototype.getIndex = function (gameObject) {
    "use strict";
    var index = -1,
        spatial = gameObject.components[FM.ComponentTypes.SPATIAL],
        physic = gameObject.components[FM.ComponentTypes.PHYSIC],
        verticalMidpoint = this.bounds.x + (this.bounds.width / 2),
        horizontalMidpoint = this.bounds.y + (this.bounds.height / 2),
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
};
/*
 * Splits the node into 4 subnodes.
 * @method FM.QuadTree#split
 * @memberOf FM.QuadTree
 * @private
 */
FM.QuadTree.prototype.split = function () {
    "use strict";
    var subWidth = this.bounds.width / 2,
        subHeight = this.bounds.height / 2,
        x = this.bounds.x,
        y = this.bounds.y;
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x + subWidth, y, subWidth, subHeight)));
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x, y, subWidth, subHeight)));
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x, y + subHeight, subWidth, subHeight)));
    this.nodes.push(new FM.QuadTree(this.level + 1, new FM.Rectangle(x + subWidth, y + subHeight, subWidth, subHeight)));
};
/*
 * Insert the object into the quadtree. If the node
 * exceeds the capacity, it will split and add all
 * objects to their corresponding nodes.
 * @method FM.QuadTree#insert
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to insert in the quad
 * tree.
 */
FM.QuadTree.prototype.insert = function (gameObject) {
    "use strict";
    if (this.nodes.length > 0) {
        var index = this.getIndex(gameObject);
        if (index !== -1) {
            this.nodes[index].insert(gameObject);
            return;
        }
    }
    this.objects.push(gameObject);
    if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
        if (this.nodes.length === 0) {
            this.split();
        }
        var i = 0, index;
        while (i < this.objects.length) {
            index = this.getIndex(this.objects[i]);
            if (index !== -1) {
                this.nodes[index].insert(this.objects.splice(i, 1)[0]);
            } else {
                i = i + 1;
            }
        }
    }
};
/*
 * Remove the object from the quadtree.
 * @method FM.QuadTree#remove
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to insert in the quad
 * tree.
 */
FM.QuadTree.prototype.remove = function (gameObject) {
    "use strict";
    if (this.nodes.length > 0) {
        var index = this.getIndex(gameObject);
        if (index !== -1) {
            this.nodes[index].remove(gameObject);
            return;
        }
    }
    this.objects.splice(this.objects.indexOf(gameObject), 1);
};
/*
 * Return all objects that could collide with the given object.
 * @method FM.QuadTree#retrieve
 * @memberOf FM.QuadTree
 * @param {FM.GameObject} gameObject The game object to test if it can
 * collide with any other object.
 * @return {Array} The list of objects that can collide with the given one.
 */
FM.QuadTree.prototype.retrieve = function (gameObject) {
    "use strict";
    var returnObjects = [],
        index = this.getIndex(gameObject);
    if (index !== -1 && this.nodes.length > 0) {
        returnObjects = this.nodes[index].retrieve(gameObject);
    }
    var i;
    for (i = 0; i < this.objects.length; i = i + 1) {
        returnObjects.push(this.objects[i]);
    }
    return returnObjects;
};
/**
 * Clears the quadtree.
 * @method FM.QuadTree#clear
 * @memberOf FM.QuadTree
 */
FM.QuadTree.prototype.clear = function () {
    "use strict";
    this.objects = [];
    var i;
    for (i = 0; i < this.nodes.length; i = i + 1) {
        if (this.nodes[i]) {
            this.nodes[i].clear();
            this.nodes[i] = null;
        }
    }
    this.nodes = [];
};
/**
 * Destroy the quad tree.
 * @method FM.QuadTree#destroy
 * @memberOf FM.QuadTree
 */
FM.QuadTree.prototype.destroy = function () {
    "use strict";
    this.level = null;
    this.bounds = null;
    this.nodes = null;
    this.objects = null;
    this.MAX_LEVELS = null;
    this.MAX_OBJECTS = null;
};
