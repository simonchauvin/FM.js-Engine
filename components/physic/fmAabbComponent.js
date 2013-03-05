/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {int} pWidth width of the aabb.
 * @param {int} pHeight height of the aabb.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmAabbComponent} The axis aligned bounding box component itself.
 */
FMENGINE.fmAabbComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    /**
     * fmAabbComponent is based on fmPhysicComponent.
     */
    var that = FMENGINE.fmPhysicComponent(pWidth, pHeight, pOwner),
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];

    /**
     * Check collisions with the world bounds and tiles.
     */
    that.checkWorldCollisions = function (collisions, worldBounds) {
        var xPos = spatial.x + that.offset.x,
            yPos = spatial.y + that.offset.y,
            tileWidth,
            tileHeight,
            i1,
            j1,
            i2,
            j2,
            i,
            j;
        //If the world has solid bounds
        if (worldBounds.length > 0) {
            //If the game object is colliding with one of those bounds
            if ((worldBounds.length > 0 && xPos <= worldBounds[0])
                    || (worldBounds.length > 1 && xPos + that.width >= worldBounds[1])
                    || (worldBounds.length > 2 && yPos <= worldBounds[2])
                    || (worldBounds.length > 3 && yPos + that.height >= worldBounds[3])) {
                return true;
            }
        }
        //If there are collisions with tiles
        if (collisions.length > 0) {
            tileWidth = collisions.getTileWidth();
            tileHeight = collisions.getTileHeight();
            i1 = Math.floor(yPos / tileHeight);
            j1 = Math.floor(xPos / tileWidth);
            i2 = Math.floor((yPos + that.height) / tileHeight);
            j2 = Math.floor((xPos + that.width) / tileWidth);
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
        var otherSpatial = aabb.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            xPos = spatial.x + that.offset.x,
            yPos = spatial.y + that.offset.y,
            otherXPos = otherSpatial.x + aabb.offset.x,
            otherYPos = otherSpatial.y + aabb.offset.y;
        if ((xPos >= otherXPos + aabb.width)
                || (xPos + that.width <= otherXPos)
                || (yPos >= otherYPos + aabb.height)
                || (yPos + that.height <= otherYPos)) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Check if the current aabb component is colliding with a circle collider
     */
    that.isCollidingWithCircle = function (circle) {
        var spatialCircle = circle.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            cornerDist = 0,
            minX = spatial.x + that.offset.x,
            maxX = minX + that.width,
            minY = spatial.y + that.offset.y,
            maxY = minY + that.height,
            circleCenterX = spatialCircle.x + circle.offset.x + circle.radius,
            circleCenterY = spatialCircle.y + circle.offset.y + circle.radius;

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
        return (cornerDist <= (circle.radius * circle.radius));
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(spatial.x + that.offset.x - bufferContext.xOffset, spatial.y + that.offset.y - bufferContext.yOffset, that.width,
                                that.height);
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

    return that;
};