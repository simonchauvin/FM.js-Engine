//var FMENGINE = FMENGINE || {};
/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmCircleComponent} The circle component itself.
 */
FMENGINE.fmCircleComponent = function (pRadius, pOwner) {
    "use strict";
    /**
     * fmB2CircleComponent is based on fmPhysicComponent.
     */
    var that = Object.create(FMENGINE.fmPhysicComponent(pRadius * 2, pRadius * 2, pOwner)),
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
     * Collides the current physic component with an other game object's physic component.
     */
    that.collides = function (pPhysic) {
        var collision = pPhysic.collidesWithCircle(that);
        if (collision) {
            return collision;
        }
        return null;
    };

    /**
     * Check if the current circle component is colliding with an aabb collider
     */
    that.collidesWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            min = FMENGINE.fmVector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FMENGINE.fmVector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
            max = FMENGINE.fmVector(min.x + that.width, min.y + that.height),
            otherMax = FMENGINE.fmVector(otherMin.x + aabb.width, otherMin.y + aabb.height),
            center = FMENGINE.fmVector(min.x + that.radius, min.y + that.radius),
            otherCenter = FMENGINE.fmVector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
            cornerDist = 0,
            normal = FMENGINE.fmMathUtils.substractVectors(otherCenter, center),
            newNormal,
            distance,
            radius,
            closest = normal.clone(),
            xExtent = (otherMax.x - otherMin.x) / 2,
            yExtent = (otherMax.y - otherMin.y) / 2,
            inside = false,
            collision = null;
        closest.x = FMENGINE.fmMathUtils.clamp(closest.x, -xExtent, xExtent);
        closest.y = FMENGINE.fmMathUtils.clamp(closest.y, -yExtent, yExtent);
        if (normal.isEquals(closest)) {
            inside = true;
            if (Math.abs(normal.x) > Math.abs(normal.y)) {
                if (closest.x > 0) {
                    closest.x = xExtent;
                } else {
                    closest.x = -xExtent;
                }
            } else {
                if (closest.y > 0) {
                    closest.y = yExtent;
                } else {
                    closest.y = -yExtent;
                }
            }
        }
        collision = FMENGINE.fmCollision();
        collision.a = that;
        collision.b = aabb;
        collision.normal = FMENGINE.fmMathUtils.substractVectors(normal, closest);
        distance = collision.normal.getLengthSquared();
        radius = that.radius;
        if (distance > (radius * radius) && !inside) {
            return null;
        }
        distance = Math.sqrt(distance);
        collision.penetration = radius - distance;
        if (inside) {
            collision.normal.reset(-collision.normal.x, -collision.normal.y);
        }
        collision.normal.normalize();
        //collision.normal = normal;
        return collision;
        /*var sqDist = that.sqDistPointAABB(aabb);
        var r = that.radius;
      
        if (sqDist <= r * r) {
            collision = FMENGINE.fmCollision();
            collision.a = that;
            collision.b = aabb;
            collision.normal = FMENGINE.fmMathUtils.substractVectors(normal, closest);
            distance = Math.sqrt(sqDist);
            collision.penetration = r + distance;
            if (inside) {
                collision.normal.reset(-collision.normal.x, -collision.normal.y);
            }
            collision.normal.normalize();
            //collision.normal = normal;
            return collision;
        }*/
    };

    that.sqDistPointAABB = function (aabb) {
        var sqDist = 0.0,
            v,
            otherSpatial = aabb.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            min = FMENGINE.fmVector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            circleCenter = FMENGINE.fmVector(min.x + that.radius, min.y + that.radius),
            // get the minX, maxX, minY and maxY points of the AABB
            minX = otherSpatial.position.x + aabb.offset.x,
            maxX = minX + aabb.width,

            minY = otherSpatial.position.y + aabb.offset.y,
            maxY = minY + aabb.height;

        // test the bounds against the points X axis
        v = circleCenter.x;

        if (v < minX) sqDist += (minX - v) * (minX - v);
        if (v > maxX) sqDist += (v - maxX) * (v - maxX);

        // test the bounds against the points Y axis
        v = circleCenter.y;

        if (v < minY) sqDist += (minY - v) * (minY - v);
        if (v > maxY) sqDist += (v - maxY) * (v - maxY);

        return sqDist;
     };

    /**
     * Check if the current circle component is colliding with another circle collider
     */
    that.collidesWithCircle = function (circle) {
        var otherSpatial = circle.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            min = FMENGINE.fmVector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FMENGINE.fmVector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            center = FMENGINE.fmVector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FMENGINE.fmVector(otherMin.x + circle.width / 2, otherMin.y + circle.height / 2),
            radius = that.radius + circle.radius,
            radius = radius * radius,
            normal = FMENGINE.fmMathUtils.substractVectors(otherCenter, center),
            distance = normal.getLength(),
            collision = null;
        if (normal.getLengthSquared() > radius) {
            return null;
        } else {
            collision = FMENGINE.fmCollision();
            collision.a = that;
            collision.b = circle;
            if (distance !== 0) {
                collision.penetration = radius - distance;
                collision.normal = normal.reset(normal.x / distance, normal.y / distance);
            } else {
                collision.penetration = that.radius;
                collision.normal = normal.reset(1, 0);
            }
            return collision;
        }
        return null;
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext, newPosition) {
        Object.getPrototypeOf(that).drawDebug(bufferContext);
        var newCenter = FMENGINE.fmVector(newPosition.x + that.radius, newPosition.y + that.radius);
        bufferContext.beginPath();
        bufferContext.strokeStyle = '#f4f';
        bufferContext.arc((newCenter.x + that.offset.x) - bufferContext.xOffset, (newCenter.y + that.offset.y) - bufferContext.yOffset, that.radius, 0, 2 * Math.PI, false);
        bufferContext.stroke();
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