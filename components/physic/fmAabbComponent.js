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
                        //TODO wrong way because not the right game object there is two collision normal the good one is the one from the object that is moving
                        //TODO aabb is the object i should consider the first, object a !!!!
                        collision.normal = FMENGINE.fmVector(-1, 0);
                    } else {
                        collision.normal = FMENGINE.fmVector(1, 0);
                    }
                    collision.penetration = xOverlap;
                } else {
                    if (normal.y < 0) {
                        collision.normal = FMENGINE.fmVector(0, -1);
                    } else {
                        collision.normal = FMENGINE.fmVector(0, 1);
                    }
                    collision.penetration = yOverlap;
                }
                
                //Position correction
                var correction = FMENGINE.fmVector(collision.penetration * collision.normal.x, collision.penetration * collision.normal.y),
                    massSum = 0,
                    invMass = 0,
                    otherInvMass = 0;
                if (that.mass === 0) {
                    invMass = 0;
                } else {
                    invMass = 1 / that.mass;
                }
                if (aabb.mass === 0) {
                    otherInvMass = 0;
                } else {
                    otherInvMass = 1 / aabb.mass;
                }
                massSum = invMass + otherInvMass;
                spatial.position.x -= correction.x * (invMass / massSum);
                spatial.position.y -= correction.y * (invMass / massSum);
                otherSpatial.position.x += correction.x * (otherInvMass / massSum);
                otherSpatial.position.y += correction.y * (otherInvMass / massSum);
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
            otherCenter = FMENGINE.fmVector(otherMin.x + circle.width / 2, otherMin.y + circle.height / 2),
            cornerDist = 0,
            normal = FMENGINE.fmMathUtils.substractVectors(otherCenter, center),
            newNormal,
            distance,
            radius,
            closest = normal,
            xExtent = (max.x - min.x) / 2,
            yExtent = (max.y - min.y) / 2,
            inside = false,
            collision = null;
        closest.x = Math.min(Math.max(-xExtent, xExtent), closest.x);
        closest.y = Math.min(Math.max(-yExtent, yExtent), closest.y);
        if (normal.equals(closest)) {
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
        newNormal = FMENGINE.fmMathUtils.substractVectors(normal, closest);
        distance = newNormal.getLengthSquared();
        radius = circle.radius;
        if (distance > radius * radius && !inside) {
            return null;
        }
        distance = Math.sqrt(distance);
        collision = FMENGINE.fmCollision();
        collision.a = that;
        collision.b = circle;
        collision.penetration = radius + distance;
        if (inside) {
            collision.normal = FMENGINE.fmVector(-normal.x, -normal.y);
        } else {
            collision.normal = normal;
        }
        return collision;
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