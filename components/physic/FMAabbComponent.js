/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {FMGameObject} The game object to which the component belongs.
 * @returns {FMAabbComponent} The axis aligned bounding box component itself.
 */
function FMAabbComponent(pWidth, pHeight, pOwner) {
    "use strict";
    //TODO make it inherit from rectangle, useless to have components inherit fmcomponent ?????
    var that = FMComponent(FMComponentTypes.physic, pOwner),
    /**
     *
     */
    ANY = 0,
    /**
     *
     */
    TOP = 1,
    /**
     *
     */
    BOTTOM = 2,
    /**
     *
     */
    LEFT = 3,
    /**
     *
     */
    RIGHT = 4,
    /**
     * Width of the aabb
     */
    width = pWidth,
    /**
     * Height of the aabb
     */
    height = pHeight,
    /**
     * By default the bounding box allow collisions on every sides
     * TODO add param in init function and use that to know wich side should be colliding
     */
    allowCollisions = FMParameters.ANY;
    /**
     * Spatial component
     */
    that.spatial = owner.components[FMComponentTypes.spatial];

    /**
     * Post initialization
     */
    that.postInit = function () {
        
    };

    /**
     * Update the component
     */
    that.update = function (game) {
        that.spatial = owner.components[FMComponentTypes.spatial];
    };

    /**
     * Check collisions with the world bounds and tiles.
     */
    that.checkWorldCollisions = function (collisions, worldBounds) {
        //If the world has solid bounds
        if (worldBounds.length > 0) {
            //If the game object is colliding with one of those bounds
            if (worldBounds.length > 0 && that.spatial.x <= worldBounds[0]
                || worldBounds.length > 1 && that.spatial.x + width >= worldBounds[1]
                || worldBounds.length > 2 && that.spatial.y <= worldBounds[2]
                || worldBounds.length > 3 && that.spatial.y + height >= worldBounds[3])
                return true;
        }
        //If there are collisions with tiles
        if (collisions.length > 0) {
            var tileWidth = collisions.getTileWidth(), tileHeight = collisions.getTileHeight(),
            i1 = Math.floor(that.spatial.y / tileHeight), j1 = Math.floor(that.spatial.x / tileWidth),
            i2 = Math.floor((that.spatial.y + height) / tileHeight), j2 = Math.floor((that.spatial.x + width) / tileWidth);
            var i,j;
            for (i = i1; i <= i2; i++) {
                for (j = j1; j <= j2; j++) {
                    if (collisions[i] && collisions[i][j] == 1) {
                        if (j == j1 || j == j2 || i == i1 || i == i2)
                            return true;
                    }
                }
            }
        }
        return false;
    };

    /**
     * Check collisions with other game object's collider.
     */
    that.checkCollisions = function (collider) {
        if (collider.isCollidingWithAabb(that))
            return true;
        return false;
    };

    /**
     * Check if the current aabb component is colliding with another aabb collider
     */
    that.isCollidingWithAabb = function (aabb) {
        if((that.spatial.x >= aabb.spatial.x + aabb.getWidth())
            || (that.spatial.x + width <= aabb.spatial.x)
            || (that.spatial.y >= aabb.spatial.y + aabb.getHeight())
            || (that.spatial.y + height <= aabb.spatial.y))
            return false;
        else
            return true;
    };

    /**
     * Check if the current aabb component is colliding with a obb collider
     */
    that.isCollidingWithObb = function (obb) {
        //TODO aabb vs obb
    };

    /**
     * Check if the current aabb component is colliding with a circle collider
     */
    that.isCollidingWithCircle = function (circle) {
        var cornerDist = 0,
        minX = that.spatial.x,
        maxX = that.spatial.x + width,
        minY = that.spatial.y,
        maxY = that.spatial.y + height,
        circleCenterX = circle.spatial.x + circle.getRadius(),
        circleCenterY = circle.spatial.y + circle.getRadius();

        if (circleCenterX < minX)
            cornerDist += (minX - circleCenterX) * (minX - circleCenterX);
        else if (circleCenterX > maxX)
            cornerDist += (circleCenterX - maxX) * (circleCenterX - maxX);

        if (circleCenterY < minY)
            cornerDist += (minY - circleCenterY) * (minY - circleCenterY);
        else if (circleCenterY > maxY)
            cornerDist += (circleCenterY - maxY) * (circleCenterY - maxY);

        //Return true if the dist to the corner is less than the radius of the circle collider
        return (cornerDist <= (circle.getRadius() * circle.getRadius()));
    };

    /**
     * Draw debug information
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(that.spatial.x - bufferContext.xOffset, that.spatial.y - bufferContext.yOffset, width,
                                height);
    };

    /**
     * Get the width of the bounding box
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Get the height of the bounding box
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Get the width of the bounding box
     */
    that.setWidth = function (w) {
       width = w;
    };

    /**
     * Get the height of the bounding box
     */
    that.setHeight = function (h) {
        height = h;
    };

    return that;
}