//var FMENGINE = FMENGINE || {};
/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmCircleComponent} The circle component itself.
 */
FMENGINE.fmCircleComponent = function (pCenter, pRadius, pOwner) {
    "use strict";
    /**
     * fmB2CircleComponent is based on fmPhysicComponent.
     */
    var that = FMENGINE.fmPhysicComponent(pRadius * 2, pRadius * 2, pOwner),
        /**
         * Center of the circle.
         */
        center = pCenter,
	/**
         * Spatial component reference.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];
    /**
     * Radius of the circle
     */
    that.radius = pRadius;

    /**
    * Update the component.
    */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);
    };

    /**
     * Check collisions with the world bounds and tiles.
     */
    that.checkWorldCollisions = function (collisions, worldBounds) {
        var xPos = spatial.position.x + that.offset.x,
            yPos = spatial.position.y + that.offset.y,
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
                    || (worldBounds.length > 1 && xPos + that.radius * 2 >= worldBounds[1])
                    || (worldBounds.length > 2 && yPos <= worldBounds[2])
                    || (worldBounds.length > 3 && yPos + that.radius * 2 >= worldBounds[3])) {
                return true;
            }
        }
        //If there are collisions in the static world
        if (collisions.length > 0) {
            //TODO change so that it is a circle vs aabb collision
            tileWidth = collisions.getTileWidth();
            tileHeight = collisions.getTileHeight();
            i1 = Math.floor(yPos / tileHeight);
            j1 = Math.floor(xPos / tileWidth);
            i2 = Math.floor((yPos + that.radius * 2) / tileHeight);
            j2 = Math.floor((xPos + that.radius * 2) / tileWidth);
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
        if (collider.isCollidingWithCircle(that)) {
            return true;
        }
        return false;
    };

    /**
     * Check if the current circle component is colliding with an aabb collider
     */
    that.collidesWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            cornerDist = 0,
            minX = otherSpatial.position.x + aabb.offset.x,
            maxX = minX + aabb.getWidth(),
            minY = otherSpatial.position.y + aabb.offset.y,
            maxY = minY + aabb.getHeight(),
            circleCenterX = spatial.position.x + that.offset.x + that.radius,
            circleCenterY = spatial.position.y + that.offset.y + that.radius;

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
        return cornerDist <= (that.radius * that.radius);
    };

    /**
     * Check if the current circle component is colliding with another circle collider
     */
    that.collidesWithCircle = function (circle) {
        var otherSpatial = circle.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            min = FMENGINE.fmVector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FMENGINE.fmVector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            max = FMENGINE.fmVector(min.x + that.width, min.y + that.height),
            otherMax = FMENGINE.fmVector(otherMin.x + circle.width, otherMin.y + circle.height),
            center = FMENGINE.fmVector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FMENGINE.fmVector(otherMin.x + circle.width / 2, otherMin.y + circle.height / 2),
            dX = center.x - otherCenter.x,
            dY = center.y - otherCenter.y,
            sqrD = (dX * dX) + (dY * dY),
            normal = FMENGINE.fmMathUtils.substractVectors(otherCenter, center),
            distance = normal.length(),
            collision = null;
        if (sqrD > (that.radius + circle.radius) * (that.radius + circle.radius)) {
            return null;
        } else {
            collision = FMENGINE.fmCollision();
            collision.a = that;
            collision.b = circle;
            if (distance !== 0) {
                collision.penetration = (that.radius + circle.radius) - distance;
                collision.normal = normal / distance;
            } else {
                collision.penetration = that.radius;
                collision.normal = FMENGINE.fmVector(1, 0);
            }
            return collision;
        }
        return null;
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext, newPosition) {
        var newCenter = FMENGINE.fmVector(newPosition.x + that.radius, newPosition.y + that.radius);
        bufferContext.beginPath();
        bufferContext.globalAlpha = 0.3;
        bufferContext.arc((newCenter.x + that.offset.x) - bufferContext.xOffset, (newCenter.y + that.offset.y) - bufferContext.yOffset, that.radius, 0, 2 * Math.PI, false);
        bufferContext.fill();
        bufferContext.globalAlpha = 1;
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
     * Retrieve the center of the circle.
     * @returns {fmVector} center of the circle.
     */
    that.getCenter = function () {
        return center;
    };

    return that;
};