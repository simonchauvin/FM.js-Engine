/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmAabbComponent} The axis aligned bounding box component itself.
 */
FMENGINE.fmAabbComponent = function (pWidth, pHeight, pWorld, pOwner) {
    "use strict";
    /**
     * fmAabbComponent is based on fmPhysicComponent.
     */
    var that = FMENGINE.fmPhysicComponent(pWorld, pOwner),
        /**
         * Width of the aabb
         */
        width = pWidth,
        /**
         * Height of the aabb
         */
        height = pHeight,
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];

    /**
     * Check collisions with the world bounds and tiles.
     */
    that.checkWorldCollisions = function (collisions, worldBounds) {
        //If the world has solid bounds
        if (worldBounds.length > 0) {
            //If the game object is colliding with one of those bounds
            if ((worldBounds.length > 0 && spatial.x <= worldBounds[0])
                    || (worldBounds.length > 1 && spatial.x + width >= worldBounds[1])
                    || (worldBounds.length > 2 && spatial.y <= worldBounds[2])
                    || (worldBounds.length > 3 && spatial.y + height >= worldBounds[3])) {
                return true;
            }
        }
        //If there are collisions with tiles
        if (collisions.length > 0) {
            var tileWidth = collisions.getTileWidth(), tileHeight = collisions.getTileHeight(),
                i1 = Math.floor(spatial.y / tileHeight), j1 = Math.floor(spatial.x / tileWidth),
                i2 = Math.floor((spatial.y + height) / tileHeight), j2 = Math.floor((spatial.x + width) / tileWidth),
                i, j;
            for (i = i1; i <= i2; i = i + 1) {
                for (j = j1; j <= j2; j = j + 1) {
                    if (collisions[i] && collisions[i][j] === 1) {
                        if (j === j1 || j === j2 || i === i1 || i === i2) {
                            return true;
                        }
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
        if (collider.isCollidingWithAabb(that)) {
            return true;
        }
        return false;
    };

    /**
     * Check if the current aabb component is colliding with another aabb collider
     */
    that.isCollidingWithAabb = function (aabb) {
        if ((spatial.x >= aabb.spatial.x + aabb.getWidth())
                || (spatial.x + width <= aabb.spatial.x)
                || (spatial.y >= aabb.spatial.y + aabb.getHeight())
                || (spatial.y + height <= aabb.spatial.y)) {
            return false;
        } else {
            return true;
        }
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
        var spatialCircle = circle.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            cornerDist = 0,
            minX = spatial.x,
            maxX = spatial.x + width,
            minY = spatial.y,
            maxY = spatial.y + height,
            circleCenterX = spatialCircle.x + circle.getRadius(),
            circleCenterY = spatialCircle.y + circle.getRadius();

        if (circleCenterX < minX) {
            cornerDist += (minX - circleCenterX) * (minX - circleCenterX);
        } else if (circleCenterX > maxX) {
            cornerDist += (circleCenterX - maxX) * (circleCenterX - maxX);
        }

        if (circleCenterY < minY) {
            cornerDist += (minY - circleCenterY) * (minY - circleCenterY);
        } else if (circleCenterY > maxY) {
            cornerDist += (circleCenterY - maxY) * (circleCenterY - maxY);
        }

        //Return true if the dist to the corner is less than the radius of the circle collider
        return (cornerDist <= (circle.getRadius() * circle.getRadius()));
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(spatial.x - bufferContext.xOffset, spatial.y - bufferContext.yOffset, width,
                                height);
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        //TODO destroy parent attributes and objects
        allowCollisions = null;
        that = null;
    };

    /**
     * Get the width of the bounding box.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Get the height of the bounding box.
     */
    that.getHeight = function () {
        return height;
    };

    /**
     * Get the width of the bounding box.
     */
    that.setWidth = function (pWidth) {
        width = pWidth;
    };

    /**
     * Get the height of the bounding box.
     */
    that.setHeight = function (pHeight) {
        height = pHeight;
    };

    return that;
};