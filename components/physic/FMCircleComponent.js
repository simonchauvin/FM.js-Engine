/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {FMGameObject} The game object to which the component belongs.
 * @returns {FmCircleComponent} The circle component itself.
 */
function FMCircleComponent(pRadius, pOwner) {
    "use strict";
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
     * Radius of the circle
     */
    radius = pRadius;
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
        //Retrieve components
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
                || worldBounds.length > 1 && that.spatial.x + radius * 2 >= worldBounds[1]
                || worldBounds.length > 2 && that.spatial.y <= worldBounds[2]
                || worldBounds.length > 3 && that.spatial.y + radius * 2 >= worldBounds[3])
                return true;
        }
        //If there are collisions in the static world
        if (collisions.length > 0) {
            //TODO change so that it is a circle vs aabb collision
            var tileWidth = collisions.getTileWidth(), tileHeight = collisions.getTileHeight(),
            i1 = Math.floor(that.spatial.y / tileHeight), j1 = Math.floor(that.spatial.x / tileWidth),
            i2 = Math.floor((that.spatial.y + radius * 2) / tileHeight), j2 = Math.floor((that.spatial.x + radius * 2) / tileWidth);
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
        if (collider.isCollidingWithCircle(that)) {
            return true;
        }
        return false;
    };

    /**
     * Check if the current circle component is colliding with an aabb collider
     */
    that.isCollidingWithAabb = function (aabb) {
        var cornerDist = 0,
        minX = aabb.spatial.x,
        maxX = aabb.spatial.x + aabb.getWidth(),
        minY = aabb.spatial.y,
        maxY = aabb.spatial.y + aabb.getHeight(),
        circleCenterX = that.spatial.x + radius,
        circleCenterY = that.spatial.y + radius;

        if (circleCenterX < minX)
            cornerDist += (minX - circleCenterX) * (minX - circleCenterX);
        else if (circleCenterX > maxX)
            cornerDist += (circleCenterX - maxX) * (circleCenterX - maxX);

        if (circleCenterY < minY)
            cornerDist += (minY - circleCenterY) * (minY - circleCenterY);
        else if (circleCenterY > maxY)
            cornerDist += (circleCenterY - maxY) * (circleCenterY - maxY);

        //Return true if the dist to the corner is less than the radius of the circle collider
        return cornerDist <= (radius * radius);
    };

    /**
     * Check if the current circle component is colliding with a obb collider
     */
    that.isCollidingWithObb = function (obb) {
        //TODO circle vs obb
    };

    /**
     * Check if the current circle component is colliding with another circle collider
     */
    that.isCollidingWithCircle = function (circle) {
        var dX = (that.spatial.x + radius) - (circle.spatial.x + circle.getRadius());
        var dY = (that.spatial.y + radius) - (circle.spatial.y + circle.getRadius());
        var sqrD = (dX * dX) + (dY * dY);
        if (sqrD > (radius + circle.getRadius()) * (radius + circle.getRadius())) {
            return false;
        }
        else {
            return true;
        }
    };

    /**
     * Draw debug information
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.beginPath();
        bufferContext.strokeStyle = "#f4f";
        bufferContext.arc((that.spatial.x + radius) - bufferContext.xOffset, (that.spatial.y + radius) - bufferContext.yOffset, radius, 0, 2 * Math.PI, false);
        bufferContext.stroke();
    };

    /**
     * Get the height of the bounding box
     */
    that.getRadius = function () {
        return radius;
    };

    /**
     * Get the width of the bounding box
     */
    that.getWidth = function () {
        return radius * 2;
    };

    /**
     * Get the height of the bounding box
     */
    that.getHeight = function () {
        return radius * 2;
    };

    /**
     * Get the width of the bounding box
     */
    that.setRadius = function (r) {
       radius = r;
    };

    return that;
}