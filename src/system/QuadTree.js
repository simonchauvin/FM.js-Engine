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
     * The root node (top level).
     * @type FM.Node
     * @private
     */
    this.root = new FM.Node(pLevel, pBounds);
};
FM.QuadTree.prototype.constructor = FM.QuadTree;
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
    this.root.insert(gameObject);
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
    this.root.remove(gameObject);
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
    return this.root.retrieve(gameObject);
};
/**
 * Clears the quadtree.
 * @method FM.QuadTree#clear
 * @memberOf FM.QuadTree
 */
FM.QuadTree.prototype.clear = function () {
    "use strict";
    this.root.clear();
};
/**
 * Destroy the quad tree.
 * @method FM.QuadTree#destroy
 * @memberOf FM.QuadTree
 */
FM.QuadTree.prototype.destroy = function () {
    "use strict";
    this.root.destroy();
    this.root = null;
};
