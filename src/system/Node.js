/*global FM*/
/**
 * The node is used to subdivide the game space to optimize the performance
 * for collisions testing.
 * @class FM.Node
 * @param {int} pLevel The level of depth of the quad tree to create.
 * @param {FM.Rectangle} pBounds The rectangle delimiting the quad tree in the
 * screen space.
 * @constructor
 * @author Simon Chauvin
 */
FM.Node = function (pLevel, pBounds) {
    "use strict";
    /**
     * Maximum number of objects per node.
     * @constant
     * @type int
     * @private
     */
    this.MAX_OBJECTS = 10;
    /**
     * Maximum depth of the node.
     * @constant
     * @type int
     * @private
     */
    this.MAX_LEVELS = 5;
    /**
     * Current depth level of the node.
     * @type int
     * @private
     */
    this.level = pLevel;
    /**
     * Objects present in the node.
     * @type Array
     * @private
     */
    this.objects = [];
    /**
     * Objects present in between nodes.
     * @type Array
     * @private
     */
    this._stuckObjects = [];
    /**
     * Bounds delimiting the node in the screen space.
     * @type FM.Rectangle
     * @private
     */
    this.bounds = pBounds;
    /**
     * The four nodes created when a node is split.
     * @type Array
     * @private
     */
    this.nodes = [];
};
FM.Node.prototype.constructor = FM.Node;
/**
 * Determine the nodes the given object belongs to. Can return multiple indices
 * if the object is overlapping more than one node.
 * @method FM.Node#_getIndices
 * @memberOf FM.Node
 * @param {FM.GameObject} gameObject The game object to retrieve the
 * index from.
 * @return {Array} The indices of nodes in which the given object is.
 * @private
 */
FM.Node.prototype._getIndices = function (gameObject) {
    "use strict";
    var indices = [],
        spatial = gameObject.spatial,
        physic = gameObject.physic,
        rightQuadrant = this.bounds.x + this.bounds.width / 2,
        bottomQuadrant = this.bounds.y + this.bounds.height / 2,
        isLeft = spatial.position.x < rightQuadrant,
        isRight = spatial.position.x > rightQuadrant || spatial.position.x + physic.width > rightQuadrant,
        isTop = spatial.position.y < bottomQuadrant,
        isBottom = spatial.position.y > bottomQuadrant || spatial.position.y + physic.height > bottomQuadrant;
    if (isTop) {
        if (isLeft) {
            indices.push(0);
        }
        if (isRight) {
            indices.push(1);
        }
        
    }
    if (isBottom) {
        if (isLeft) {
            indices.push(2);
        }
        if (isRight) {
            indices.push(3);
        }
    }
    return indices;
};
/**
 * Determine which node the object belongs to. Returns only one index.
 * @method FM.Node#_getIndex
 * @memberOf FM.Node
 * @param {FM.GameObject} gameObject The game object to retrieve the
 * index from.
 * @return {Array} The indices of nodes in which the given object is.
 * @private
 */
FM.Node.prototype._getIndex = function (gameObject) {
    "use strict";
    	var index = 0,
            position = gameObject.spatial.position,
            left = (position.x > this.bounds.x + this.bounds.width / 2)? false : true,
            top = (position.y > this.bounds.y + this.bounds.height / 2)? false : true;
        if (left) {
            if(!top) {
                index = 2;
            }
        }
        else {
            if (top) {
                index = 1;
            }
            else {
                index = 3;
            }
        }
        return index;
};
/*
 * Splits the node into 4 subnodes.
 * @method FM.Node#split
 * @memberOf FM.Node
 * @private
 */
FM.Node.prototype.split = function () {
    "use strict";
    var subWidth = this.bounds.width / 2,
        subHeight = this.bounds.height / 2,
        x = this.bounds.x,
        y = this.bounds.y;
    this.nodes.push(new FM.Node(this.level + 1, new FM.Rectangle(x, y, subWidth, subHeight)));
    this.nodes.push(new FM.Node(this.level + 1, new FM.Rectangle(x + subWidth, y, subWidth, subHeight)));
    this.nodes.push(new FM.Node(this.level + 1, new FM.Rectangle(x, y + subHeight, subWidth, subHeight)));
    this.nodes.push(new FM.Node(this.level + 1, new FM.Rectangle(x + subWidth, y + subHeight, subWidth, subHeight)));
};
/*
 * Insert the object into the node. If the node
 * exceeds the capacity, it will split and add all
 * objects to their corresponding nodes.
 * @method FM.Node#insert
 * @memberOf FM.Node
 * @param {FM.GameObject} gameObject The game object to insert in the node.
 */
FM.Node.prototype.insert = function (gameObject) {
    "use strict";
    var index = this._getIndex(gameObject),
        position = gameObject.spatial.position,
        physic = gameObject.physic,
        node = this.nodes[index],
        i;
    if (this.nodes.length > 0) {
        if (position.x >= node.bounds.x &&
            position.x + physic.width <= node.bounds.x + node.bounds.width &&
            position.y >= node.bounds.y &&
            position.y + physic.height <= node.bounds.y + node.bounds.height)
        {
            node.insert(gameObject);
        } else {
            this._stuckObjects.push(gameObject);
        }
        return;
    }
    this.objects.push(gameObject);
    if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
        if (this.nodes.length === 0) {
            this.split();
            for (i = 0; i < this.objects.length; i++) {
                this.insert(this.objects[i]);
            }
            this.objects.length = 0;
        }
    }
};
/*
 * Remove the object from the node.
 * @method FM.Node#remove
 * @memberOf FM.Node
 * @param {FM.GameObject} gameObject The game object to insert in the node.
 */
FM.Node.prototype.remove = function (gameObject) {
    "use strict";
    if (this.nodes.length > 0) {
        this.nodes[this._getIndex(gameObject)].remove(gameObject);
        return;
    }
    this.objects.splice(this.objects.indexOf(gameObject), 1);
};
/*
 * Return all objects that could collide with the given object.
 * @method FM.Node#retrieve
 * @memberOf FM.Node
 * @param {FM.GameObject} gameObject The game object to test if it can
 * collide with any other object.
 * @return {Array} The list of objects that can collide with the given one.
 */
FM.Node.prototype.retrieve = function (gameObject) {
    "use strict";
    var returnObjects = [],
        indices = this._getIndices(gameObject),
        i;
    for (i = 0; i < indices.length; i++) {
        if (this.nodes.length > 0) {
            returnObjects = returnObjects.concat(this.nodes[indices[i]].retrieve(gameObject));
        }
    }
    for (i = 0; i < this._stuckObjects.length; i = i + 1) {
        if (gameObject.getId() !== this._stuckObjects[i].getId()) {
            returnObjects.push(this._stuckObjects[i]);
        }
    }
    for (i = 0; i < this.objects.length; i = i + 1) {
        if (gameObject.getId() !== this.objects[i].getId()) {
            returnObjects.push(this.objects[i]);
        }
    }
    return returnObjects;
};
/**
 * Clears the node.
 * @method FM.Node#clear
 * @memberOf FM.Node
 */
FM.Node.prototype.clear = function () {
    "use strict";
    this.objects.length = 0;
    this._stuckObjects.length = 0;
    for (var i = 0; i < this.nodes.length; i = i + 1) {
        if (this.nodes[i]) {
            this.nodes[i].clear();
            this.nodes[i] = null;
        }
    }
    this.nodes.length = 0;
};
/**
 * Destroy the node.
 * @method FM.Node#destroy
 * @memberOf FM.Node
 */
FM.Node.prototype.destroy = function () {
    "use strict";
    this.level = null;
    this.bounds = null;
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i]) {
            this.nodes[i].destroy();
            this.nodes[i] = null;
        }
    }
    this.nodes = null;
    this.objects = null;
    this._stuckObjects = null;
    this.MAX_LEVELS = null;
    this.MAX_OBJECTS = null;
};
