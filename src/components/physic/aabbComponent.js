/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {int} pWidth width of the aabb.
 * @param {int} pHeight height of the aabb.
 * @param {gameObject} The game object to which the component belongs.
 * @returns {aabbComponent} The axis aligned bounding box component itself.
 */
FM.aabbComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    /**
     * aabbComponent is based on physicComponent.
     */
    var that = FM.physicComponent(pWidth, pHeight, pOwner),
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    /**
     * Check if the needed components are present.
     */
    if (FM.parameters.debug) {
        if (!spatial) {
            console.log("ERROR: No spatial component was added and you need one for physics.");
        }
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Check if the current circle is overlapping with the specified type.
     */
    that.overlapsWithType = function (pType) {
        //TODO
        return null;
    };

    /**
     * Check if the current aabb is overlapping with the specified physic object.
     */
    that.overlapsWithObject = function (pPhysic) {
        var collision = pPhysic.overlapsWithAabb(that);
        if (collision) {
            return collision;
        }
        return null;
    };

    /**
     * Check if the current aabb is overlapping with the specified aabb.
     */
    that.overlapsWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
            max = FM.vector(min.x + that.width, min.y + that.height),
            otherMax = FM.vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
            center = FM.vector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FM.vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
            normal = FM.math.substractVectors(otherCenter, center),
            extent = (max.x - min.x) / 2,
            otherExtent = (otherMax.x - otherMin.x) / 2,
            xOverlap = extent + otherExtent - Math.abs(normal.x),
            yOverlap,
            collision = null;
        // Exit with no intersection if found separated along an axis
        if (max.x < otherMin.x || min.x > otherMax.x) { return null; }
        if (max.y < otherMin.y || min.y > otherMax.y) { return null; }

        if (xOverlap > 0) {
            extent = (max.y - min.y) / 2;
            otherExtent = (otherMax.y - otherMin.y) / 2;
            yOverlap = extent + otherExtent - Math.abs(normal.y);
            if (yOverlap > 0) {
                collision = FM.collision(that, aabb);
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
     * Check if the current aabb is overlapping with the specified circle.
     */
    that.overlapsWithCircle = function (circle) {
        var otherSpatial = circle.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            max = FM.vector(min.x + that.width, min.y + that.height),
            center = FM.vector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FM.vector(otherMin.x + circle.radius, otherMin.y + circle.radius),
            normal = FM.math.substractVectors(otherCenter, center),
            distance,
            radius,
            closest = normal.clone(),
            xExtent = (max.x - min.x) / 2,
            yExtent = (max.y - min.y) / 2,
            inside = false,
            collision = null;
        closest.x = FM.math.clamp(closest.x, -xExtent, xExtent);
        closest.y = FM.math.clamp(closest.y, -yExtent, yExtent);
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
        collision = FM.collision();
        collision.a = that;
        collision.b = circle;
        collision.normal = FM.math.substractVectors(normal, closest);
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
        return collision;
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext, newPosition) {
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(newPosition.x + that.offset.x - bufferContext.xOffset, newPosition.y + that.offset.y - bufferContext.yOffset, that.width,
                                that.height);
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        Object.getPrototypeOf(that).destroy();
        that = null;
    };

    return that;
};
