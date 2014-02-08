/*global FM*/
/**
 * Represent an axis aligned bounding box to add to a game object for physics
 * behavior and collisions.
 * @class FM.AabbComponent
 * @extends FM.PhysicComponent
 * @param {int} pWidth Width of the aabb.
 * @param {int} pHeight Height of the aabb.
 * @param {FM.GameObject} pOwner The game object to which the component belongs.
 * @constructor
 * @author Simon Chauvin.
 */
FM.AabbComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    //Calling the constructor of the FM.PhysicComponent
    FM.PhysicComponent.call(this, pWidth, pHeight, pOwner);
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];
    /**
     * Check if the needed components are present.
     */
    if (FM.Parameters.debug) {
        if (!this.spatial) {
            console.log("ERROR: No spatial component was added and you need one for physics.");
        }
    }
};
/**
 * FM.AabbComponent inherits from FM.PhysicComponent.
 */
FM.AabbComponent.prototype = Object.create(FM.PhysicComponent.prototype);
FM.AabbComponent.prototype.constructor = FM.AabbComponent;
/**
 * Check if the current circle is overlapping with the specified type.
 * @method FM.AabbComponent#overlapsWithType
 * @memberOf FM.AabbComponent
 * @param {FM.ObjectType} pType The type to test for overlap with this 
 * aabb component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithType = function (pType) {
    "use strict";
    //TODO
    return null;
};
/**
 * Check if the current aabb is overlapping with the given physic 
 * object.
 * @method FM.AabbComponent#overlapsWithObject
 * @memberOf FM.AabbComponent
 * @param {FM.PhysicComponent} pPhysic The physic component to test for
 * overlap with the current one.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithObject = function (pPhysic) {
    "use strict";
    var collision = pPhysic.overlapsWithAabb(this);
    if (collision) {
        return collision;
    }
    return null;
};
/**
 * Check if the current aabb is overlapping with the specified aabb.
 * @method FM.AabbComponent#overlapsWithAabb
 * @memberOf FM.AabbComponent
 * @param {FM.AabbComponent} aabb The aabb component that needs to be tested
 * for overlap with the current aabb component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithAabb = function (aabb) {
    "use strict";
    var otherSpatial = aabb.owner.components[FM.ComponentTypes.SPATIAL],
        min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
        otherMin = new FM.Vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
        max = new FM.Vector(min.x + this.width, min.y + this.height),
        otherMax = new FM.Vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
        center = new FM.Vector(min.x + this.width / 2, min.y + this.height / 2),
        otherCenter = new FM.Vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
        normal = FM.Math.substractVectors(otherCenter, center),
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
            collision = new FM.Collision(this, aabb);
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
 * @method FM.AabbComponent#overlapsWithCircle
 * @memberOf FM.AabbComponent
 * @param {FM.CircleComponent} circle The circle component that needs to 
 * be tested for overlap with the current aabb component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.AabbComponent.prototype.overlapsWithCircle = function (circle) {
    "use strict";
    var otherSpatial = circle.owner.components[FM.ComponentTypes.SPATIAL],
        min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
        otherMin = new FM.Vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
        max = new FM.Vector(min.x + this.width, min.y + this.height),
        center = new FM.Vector(min.x + this.width / 2, min.y + this.height / 2),
        otherCenter = new FM.Vector(otherMin.x + circle.radius, otherMin.y + circle.radius),
        normal = FM.Math.substractVectors(otherCenter, center),
        distance,
        radius,
        closest = normal.clone(),
        xExtent = (max.x - min.x) / 2,
        yExtent = (max.y - min.y) / 2,
        inside = false,
        collision = null;
    closest.x = FM.Math.clamp(closest.x, -xExtent, xExtent);
    closest.y = FM.Math.clamp(closest.y, -yExtent, yExtent);
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
    collision = new FM.Collision();
    collision.a = this;
    collision.b = circle;
    collision.normal = FM.Math.substractVectors(normal, closest);
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
 * @method FM.AabbComponent#drawDebug
 * @memberOf FM.AabbComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on wich drawing 
 * is done.
 * @param {FM.Vector} newPosition Position of the sprite to render.
 */
FM.AabbComponent.prototype.drawDebug = function (bufferContext, newPosition) {
    "use strict";
    var newCenter = new FM.Vector(newPosition.x + this.width / 2, newPosition.y + this.height / 2),
        dir = new FM.Vector(Math.cos(this.spatial.angle), Math.sin(this.spatial.angle));
    bufferContext.strokeStyle = '#f4f';
    bufferContext.strokeRect(newPosition.x + this.offset.x - bufferContext.xOffset, newPosition.y + this.offset.y - bufferContext.yOffset, this.width,
                            this.height);
    bufferContext.beginPath();
    bufferContext.strokeStyle = "Blue";
    bufferContext.beginPath();
    bufferContext.moveTo(newCenter.x + this.offset.x - bufferContext.xOffset, newCenter.y + this.offset.y - bufferContext.yOffset);
    bufferContext.lineTo((newCenter.x + this.offset.x + dir.x * 50) - bufferContext.xOffset, (newCenter.y + this.offset.y  + dir.y * 50) - bufferContext.yOffset);
    bufferContext.stroke();
};
/**
 * Destroy the component and its objects.
 * @method FM.AabbComponent#destroy
 * @memberOf FM.AabbComponent
 */
FM.AabbComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    FM.PhysicComponent.prototype.destroy.call(this);
};
