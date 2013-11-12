//var FMENGINE = FMENGINE || {};
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
    var that = Object.create(FMENGINE.fmPhysicComponent(pWidth, pHeight, pOwner)),
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];

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
     * Collides the current physic component with an other game object's physic component.
     */
    that.collides = function (pPhysic) {
        var collision = pPhysic.collidesWithAabb(that);
        if (collision) {
            return collision;
        }
        return null;
    };

    /**
     * Check if the current aabb component is colliding with another aabb collider
     */
    that.collidesWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            min = FMENGINE.fmVector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FMENGINE.fmVector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
            max = FMENGINE.fmVector(min.x + that.width, min.y + that.height),
            otherMax = FMENGINE.fmVector(otherMin.x + aabb.width, otherMin.y + aabb.height),
            center = FMENGINE.fmVector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FMENGINE.fmVector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
            normal = FMENGINE.fmMathUtils.substractVectors(otherCenter, center),
            extent = (max.x - min.x) / 2,
            otherExtent = (otherMax.x - otherMin.x) / 2,
            xOverlap = extent + otherExtent - Math.abs(normal.x),
            yOverlap,
            collision = null;
        // Exit with no intersection if found separated along an axis
        if (max.x < otherMin.x || min.x > otherMax.x) return null;
        if (max.y < otherMin.y || min.y > otherMax.y) return null;
        
        if (xOverlap > 0) {
            extent = (max.y - min.y) / 2;
            otherExtent = (otherMax.y - otherMin.y) / 2;
            yOverlap = extent + otherExtent - Math.abs(normal.y);
            if (yOverlap > 0) {
                collision = FMENGINE.fmCollision();
                collision.a = that;
                collision.b = aabb;
                // Find out which axis is the one of least penetration
                if (xOverlap < yOverlap) {
                    if (normal.x < 0) {
                        collision.normal = normal.reset(-1, 0);
                    } else {
                        collision.normal = normal.reset(1, 0);
                    }
                    collision.penetration = xOverlap;
                } else {
                    if (normal.y < 0) {
                        collision.normal = normal.reset(0, -1);
                    } else {
                        collision.normal = normal.reset(0, 1);
                    }
                    collision.penetration = yOverlap;
                }
                return collision;
            }
        }
        return null;
    };

    /**
     * Check if the current aabb component is colliding with a circle collider.
     */
    that.collidesWithCircle = function (circle) {
        var otherSpatial = circle.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            min = FMENGINE.fmVector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FMENGINE.fmVector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            max = FMENGINE.fmVector(min.x + that.width, min.y + that.height),
            otherMax = FMENGINE.fmVector(otherMin.x + circle.width, otherMin.y + circle.height),
            center = FMENGINE.fmVector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FMENGINE.fmVector(otherMin.x + circle.radius, otherMin.y + circle.radius),
            cornerDist = 0,
            normal = FMENGINE.fmMathUtils.substractVectors(otherCenter, center),
            newNormal,
            distance,
            radius,
            closest = normal.clone(),
            xExtent = (max.x - min.x) / 2,
            yExtent = (max.y - min.y) / 2,
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
        collision.b = circle;
        collision.normal = FMENGINE.fmMathUtils.substractVectors(normal, closest);
        distance = collision.normal.getLengthSquared();
        radius = circle.radius;
        if (distance > radius * radius && !inside) {
            return null;
        }
        distance = Math.sqrt(distance);
        collision.penetration = radius - distance;
        if (inside) {
            collision.normal.reset(-collision.normal.x, -collision.normal.y);
        }
        collision.normal.normalize();
        //collision.normal = normal;
        //console.log(collision);
        return collision;
        /*var sqDist = that.sqDistPointAABB(otherCenter);
        var r = circle.radius;
      
        if(sqDist <= r * r) {
            collision = FMENGINE.fmCollision();
            collision.a = that;
            collision.b = circle;
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
    
    that.sqDistPointAABB = function (circleCenter) {
        var sqDist = 0.0,
            v,
            // get the minX, maxX, minY and maxY points of the AABB
            minX = spatial.position.x + that.offset.x,
            maxX = minX + that.width,

            minY = spatial.position.y + that.offset.y,
            maxY = minY + that.height;

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
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext, newPosition) {
        Object.getPrototypeOf(that).drawDebug(bufferContext);
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(newPosition.x + that.offset.x - bufferContext.xOffset, newPosition.y + that.offset.y - bufferContext.yOffset, that.width,
                                that.height);
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        //TODO destroy parent attributes and objects
        that = null;
    };

    return that;
};