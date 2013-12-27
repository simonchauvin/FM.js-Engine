/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {gameObject} The game object to which the component belongs.
 * @returns {circleComponent} The circle component itself.
 */
FM.circleComponent = function (pRadius, pOwner) {
    "use strict";
    /**
     * fmB2CircleComponent is based on physicComponent.
     */
    var that = FM.physicComponent(pRadius * 2, pRadius * 2, pOwner),
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
     * Radius of the circle
     */
    that.radius = pRadius;

    /**
     * Check if the current circle is overlapping with the specified type.
     */
    that.overlapsWithType = function (pType) {
        //TODO
        return null;
    };

    /**
     * Check if the current circle is overlapping with the specified physic object.
     */
    that.overlapsWithObject = function (pPhysic) {
        var collision = pPhysic.overlapsWithCircle(that);
        if (collision) {
            return collision;
        }
        return null;
    };

    /**
     * Check if the current circle is overlapping with the specified aabb.
     */
    that.overlapsWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
            otherMax = FM.vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
            center = FM.vector(min.x + that.radius, min.y + that.radius),
            otherCenter = FM.vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
            normal = FM.math.substractVectors(otherCenter, center),
            distance,
            radius,
            closest = normal.clone(),
            xExtent = (otherMax.x - otherMin.x) / 2,
            yExtent = (otherMax.y - otherMin.y) / 2,
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
        collision.b = aabb;
        collision.normal = FM.math.substractVectors(normal, closest);
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
        return collision;
    };

    /**
     * Check if the current circle is overlapping with the specified circle.
     */
    that.overlapsWithCircle = function (circle) {
        var otherSpatial = circle.owner.components[FM.componentTypes.SPATIAL],
            min = FM.vector(spatial.position.x + that.offset.x, spatial.position.y + that.offset.y),
            otherMin = FM.vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            center = FM.vector(min.x + that.width / 2, min.y + that.height / 2),
            otherCenter = FM.vector(otherMin.x + circle.width / 2, otherMin.y + circle.height / 2),
            radius = that.radius + circle.radius,
            radius = radius * radius,
            normal = FM.math.substractVectors(otherCenter, center),
            distance = normal.getLength(),
            collision = null;
        if (normal.getLengthSquared() > radius) {
            return null;
        } else {
            collision = FM.collision();
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
        var newCenter = FM.vector(newPosition.x + that.radius, newPosition.y + that.radius),
            dir = FM.vector(Math.cos(spatial.angle), Math.sin(spatial.angle));
        bufferContext.beginPath();
        bufferContext.strokeStyle = '#f4f';
        bufferContext.arc((newCenter.x + that.offset.x) - bufferContext.xOffset, (newCenter.y + that.offset.y) - bufferContext.yOffset, that.radius, 0, 2 * Math.PI, false);
        bufferContext.stroke();
        bufferContext.beginPath();
        bufferContext.strokeStyle = "Blue";
        bufferContext.beginPath();
        bufferContext.moveTo(newCenter.x + that.offset.x - bufferContext.xOffset, newCenter.y + that.offset.y - bufferContext.yOffset);
        bufferContext.lineTo((newCenter.x + that.offset.x + dir.x * 50) - bufferContext.xOffset, (newCenter.y + that.offset.y  + dir.y * 50) - bufferContext.yOffset);
        bufferContext.stroke();
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
