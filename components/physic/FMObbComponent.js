/**
 * Under Creative Commons Licence.
 * 
 * @author Simon Chauvin.
 * @param {FMGameObject} The game object to which the component belong.
 * @returns {FMAabbComponent} The oriented bounding box component itself.
 */
function FMObbComponent(pOwner) {
    "use strict";
    var that = FMComponent(FMComponentTypes.PHYSIC, pOwner);
    /**
     * 
     */
    var ANY = 0;
    /**
     * 
     */
    var TOP = 1;
    /**
     * 
     */
    var BOTTOM = 2;
    /**
     * 
     */
    var LEFT = 3;
    /**
     * 
     */
    var RIGHT = 4;
    /**
     * The components necessary
     */
    var spatial = null;
    var renderer = null;
    var physic = null;

    /**
     * The actual axis aligned bounding box
     */
    var obb_ = null;

    /**
     * By default nothing touches the game object
     */
    var touching_ = [];

    /**
     * By default the bounding box allow collisions on every sides
     * TODO add param in init function
     */
    var allowCollisions_ = FMParameters.ANY;

    /**
     * Init the collider component
     */
    that.init = function (x, y, width, height) {
        that.x = x;
        that.y = y;
        obb_ = FMRectangle(x, y, width, height);
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        //Retrieve the components
        spatial = pOwner.components[FMComponentTypes.SPATIAL];
        renderer = pOwner.components[FMComponentTypes.RENDERER];
        physic = pOwner.components[FMComponentTypes.PHYSIC];
    };

    /**
     * Update the component
     */
    that.update = function (game) {
        //Update bounding box position
        that.x = spatial.x + ((renderer.getWidth() - obb_.getWidth()) / 2);
        that.y = spatial.y + ((renderer.getHeight() - obb_.getHeight()) / 2);

        //Make sure that the position of the bounding box is updated
        obb_.x = that.x;
        obb_.y = that.y;
    };

    /**
     * Check collisions and add the sides that collide to the touching array
     * @param {FMTileMap} Collision tiles map.
     */
    that.checkCollisions = function (collisions, xVelocity, yVelocity) {
        //TODO
        return false;
    }

    /**
     * Get the width of the bounding box
     */
    that.getWidth = function () {
        return obb_.getWidth();
    };

    /**
     * Get the height of the bounding box
     */
    that.getHeight = function () {
        return obb_.getHeight();
    };

    /**
     * Get the width of the bounding box
     */
    that.setWidth = function (width) {
        obb_.setWidth(width);
    };

    /**
     * Get the height of the bounding box
     */
    that.setHeight = function (height) {
        obb_.setHeight(height);
    };

    /**
     * Check if any side of the aabb is colliding.
     * @returns {Boolean} Whether a side side is colliding or not.
     */
    that.isColliding = function () {
        return touching_.length > 0;
    };

    /**
     * Check if the left side of the aabb is colliding.
     * @returns {Boolean} Whether the left side is colliding or not.
     */
    that.isLeftSideColliding = function () {
        return touching_.indexOf(LEFT) != -1;
    };

    /**
     * Check if the right side of the aabb is colliding.
     * @returns {Boolean} Whether the right side is colliding or not.
     */
    that.isRightSideColliding = function () {
        return touching_.indexOf(RIGHT) != -1;
    };

    /**
     * Check if the top side of the aabb is colliding.
     * @returns {Boolean} Whether the top side is colliding or not.
     */
    that.isTopSideColliding = function () {
        return touching_.indexOf(TOP) != -1;
    };

    /**
     * Check if the bottom side of the aabb is colliding.
     * @returns {Boolean} Whether the bottom side is colliding or not.
     */
    that.isBottomSideColliding = function () {
        return touching_.indexOf(BOTTOM) != -1;
    };

    return that;
}