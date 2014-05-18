/*global FM*/
/**
 * A circle component is a physic component to add to a game object for
 * for collisions and physics behaviors as a circle.
 * @class FM.CircleComponent
 * @extends FM.PhysicComponent
 * @param {int} pRadius The radius of the circle component.
 * @param {FM.GameObject} pOwner The game object to which the component belongs.
 * @constructor
 * @author Simon Chauvin.
 */
FM.CircleComponent = function (pRadius, pOwner) {
    "use strict";
    //Calling the constructor of the FM.PhysicComponent
    FM.PhysicComponent.call(this, pRadius * 2, pRadius * 2, pOwner);
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
    /**
     * Radius of the circle.
     * @type int
     * @public
     */
    this.radius = pRadius;
};
/**
 * FM.CircleComponent inherits from FM.PhysicComponent.
 */
FM.CircleComponent.prototype = Object.create(FM.PhysicComponent.prototype);
FM.CircleComponent.prototype.constructor = FM.CircleComponent;
/**
 * Check if the current circle is overlapping with the specified type.
 * @method FM.CircleComponent#overlapsWithType
 * @memberOf FM.CircleComponent
 * @param {FM.ObjectType} pType The type to test for overlap with this 
 * circle component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithType = function (pType) {
    "use strict";
    var gameObjects,
        i,
        otherGameObject,
        otherPhysic,
        collision = null,
        collisionTemp = null;
    if (this.owner.isAlive()) {
        gameObjects = FM.Game.getCurrentState().getQuad().retrieve(this.owner);
        for (i = 0; i < gameObjects.length; i = i + 1) {
            otherGameObject = gameObjects[i];
            otherPhysic = otherGameObject.physic;
            if (otherGameObject.isAlive() && otherPhysic && otherGameObject.hasType(pType)) {
                collisionTemp = otherPhysic.overlapsWithCircle(this);
                if (collisionTemp) {
                    collision = collisionTemp;
                }
            }
        }
    }
    return collision;
};
/**
 * Check if the current circle is overlapping with the specified physic object.
 * @method FM.CircleComponent#overlapsWithObject
 * @memberOf FM.CircleComponent
 * @param {FM.PhysicComponent} pPhysic The physic component to test for
 * overlap with the current one.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithObject = function (pPhysic) {
    "use strict";
    var collision = pPhysic.overlapsWithCircle(this);
    if (collision) {
        return collision;
    }
    return null;
};
/**
 * Check if the current circle is overlapping with the specified aabb.
 * @method FM.CircleComponent#overlapsWithAabb
 * @memberOf FM.CircleComponent
 * @param {FM.AabbComponent} aabb The aabb component that needs to be tested
 * for overlap with the current circle component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithAabb = function (aabb) {
    "use strict";
    var collision = null;
    if (this.owner.isAlive() && aabb.owner.isAlive()) {
        var otherSpatial = aabb.owner.components[FM.ComponentTypes.SPATIAL],
            min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
            otherMin = new FM.Vector(otherSpatial.position.x + aabb.offset.x, otherSpatial.position.y + aabb.offset.y),
            otherMax = new FM.Vector(otherMin.x + aabb.width, otherMin.y + aabb.height),
            center = new FM.Vector(min.x + this.radius, min.y + this.radius),
            otherCenter = new FM.Vector(otherMin.x + aabb.width / 2, otherMin.y + aabb.height / 2),
            normal = FM.Math.substractVectors(otherCenter, center),
            distance,
            radius,
            closest = normal.clone(),
            xExtent = (otherMax.x - otherMin.x) / 2,
            yExtent = (otherMax.y - otherMin.y) / 2,
            inside = false;
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
        collision.b = aabb;
        collision.normal = FM.Math.substractVectors(normal, closest);
        distance = collision.normal.getLengthSquared();
        radius = this.radius;
        if (distance > (radius * radius) && !inside) {
            return null;
        }
        distance = Math.sqrt(distance);
        collision.penetration = radius - distance;
        if (inside) {
            collision.normal.reset(-collision.normal.x, -collision.normal.y);
        }
        collision.normal.normalize();
    }
    return collision;
};

/**
 * Check if the current circle is overlapping with the specified circle.
 * @method FM.CircleComponent#overlapsWithCircle
 * @memberOf FM.CircleComponent
 * @param {FM.CircleComponent} circle The circle component that needs to 
 * be tested for overlap with the current circle component.
 * @return {FM.Collision} The collision object that contains the data of 
 * the collision if there is one, null otherwise.
 */
FM.CircleComponent.prototype.overlapsWithCircle = function (circle) {
    "use strict";
    if (this.owner.isAlive() && circle.owner.isAlive()) {
        var otherSpatial = circle.owner.components[FM.ComponentTypes.SPATIAL],
            min = new FM.Vector(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y),
            otherMin = new FM.Vector(otherSpatial.position.x + circle.offset.x, otherSpatial.position.y + circle.offset.y),
            center = new FM.Vector(min.x + this.radius, min.y + this.radius),
            otherCenter = new FM.Vector(otherMin.x + circle.radius, otherMin.y + circle.radius),
            radius = this.radius + circle.radius,
            radius = radius * radius,
            normal = FM.Math.substractVectors(otherCenter, center),
            distance = normal.getLength(),
            collision = null;
        if (normal.getLengthSquared() > radius) {
            return null;
        } else {
            collision = new FM.Collision();
            collision.a = this;
            collision.b = circle;
            if (distance !== 0) {
                collision.penetration = radius - distance;
                collision.normal = normal.reset(normal.x / distance, normal.y / distance);
            } else {
                collision.penetration = this.radius;
                collision.normal = normal.reset(1, 0);
            }
            return collision;
        }
    }
    return null;
};
/**
 * Draw debug information.
 * @method FM.CircleComponent#drawDebug
 * @memberOf FM.CircleComponent
 * @param {CanvasRenderingContext2D} bufferContext Context on wich drawing 
 * is done.
 * @param {FM.Vector} newPosition Position of the sprite to render.
 */
FM.CircleComponent.prototype.drawDebug = function (bufferContext, newPosition) {
    "use strict";
    var newCenter = new FM.Vector(newPosition.x + this.radius, newPosition.y + this.radius),
        direction = new FM.Vector(newCenter.x + this.offset.x + Math.cos(this.spatial.angle) * 50, newCenter.y + this.offset.y  + Math.sin(this.spatial.angle) * 50);
    bufferContext.beginPath();
    bufferContext.strokeStyle = '#f4f';
    bufferContext.arc((newCenter.x + this.offset.x) - bufferContext.xOffset, (newCenter.y + this.offset.y) - bufferContext.yOffset, this.radius, 0, 2 * Math.PI, false);
    bufferContext.stroke();
    bufferContext.beginPath();
    bufferContext.strokeStyle = "Blue";
    bufferContext.beginPath();
    bufferContext.moveTo(newCenter.x + this.offset.x - bufferContext.xOffset, newCenter.y + this.offset.y - bufferContext.yOffset);
    bufferContext.lineTo(direction.x - bufferContext.xOffset, direction.y - bufferContext.yOffset);
    bufferContext.stroke();
};
/**
 * Destroy the component and its objects.
 * @method FM.CircleComponent#destroy
 * @memberOf FM.CircleComponent
 */
FM.CircleComponent.prototype.destroy = function () {
    "use strict";
    this.spatial = null;
    this.radius = null;
    FM.PhysicComponent.prototype.destroy.call(this);
};
