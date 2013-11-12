//var FMENGINE = FMENGINE || {};
/**
 * Under Creative Commons Licence
 * Component of basic physics.
 * @param {int} pWidth width of the collider.
 * @param {int} pHeight height of the collider.
 * @param {fmObject} The object that owns this component.
 * @author Simon Chauvin
 */
FMENGINE.fmPhysicComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    /**
     * fmPhysicComponent is based on fmComponent.
     */
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.PHYSIC, pOwner),
        /**
	 * World of the game.
	 */
        world = FMENGINE.fmGame.getCurrentState().getWorld(),
        /**
	 * Quad tree containing all game objects with a physic component.
	 */
        quad = FMENGINE.fmGame.getCurrentState().getQuad(),
        /**
         * Forces applied to the physic object.
         */
        force = FMENGINE.fmVector(0, 0),
        /**
         * The current direction of the object.
         */
        direction = 0,
        /**
         * Store the collisions that this object has.
         */
        collisions = [],
	/**
        * Spatial component reference.
        */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL],
        /**
         * Correct the position of the physic component.
         */
        correctPosition = function (collision) {
        //Position correction
        var correction = FMENGINE.fmVector(collision.penetration * collision.normal.x, collision.penetration * collision.normal.y),
            aSpatial = collision.a.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            bSpatial = collision.b.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            massSum = 0,
            invMass = 0,
            otherInvMass = 0;
        if (collision.a.mass === 0) {
            invMass = 0;
        } else {
            invMass = 1 / collision.a.mass;
        }
        if (collision.b.mass === 0) {
            otherInvMass = 0;
        } else {
            otherInvMass = 1 / collision.b.mass;
        }
        massSum = invMass + otherInvMass;

        //TODO make it work instead of the other below
        /*var percent = 0.2; // usually 20% to 80%
        var slop = 0.01; // usually 0.01 to 0.1
        correction.x = (Math.max(collision.penetration - slop, 0) / (massSum)) * percent * collision.normal.x;
        correction.y = (Math.max(collision.penetration - slop, 0) / (massSum)) * percent * collision.normal.y;
        aSpatial.position.x -= invMass * correction.x;
        aSpatial.position.y -= invMass * correction.y;
        bSpatial.position.x += otherInvMass * correction.x;
        bSpatial.position.y += otherInvMass * correction.y;*/

        //TODO this is here that it goes wrong
        aSpatial.position.x -= correction.x * (invMass / massSum);
        aSpatial.position.y -= correction.y * (invMass / massSum);
        bSpatial.position.x += correction.x * (otherInvMass / massSum);
        bSpatial.position.y += correction.y * (otherInvMass / massSum);
    };

    /**
     * Offset of the bounding box or circle.
     */
    that.offset = FMENGINE.fmVector(0, 0);
    /**
     * Width of the collider.
     */
    that.width = pWidth;
    /**
     * Height of the collider.
     */
    that.height = pHeight;
    /**
     * Array storing the types of game objects that can collide with this one.
     */
    that.collidesWith = [];
    /**
     * Velocity of the physic component.
     */
    that.velocity = FMENGINE.fmVector(0, 0);
    /**
     * Angular velocity.
     */
    that.angularVelocity = 0;
    /**
     * Represent the mass of the physic game object, 0 means infinite mass.
     */
    that.mass = 1;
    /**
     * Represent the maximum absolute value of the velocity.
     */
    that.maxVelocity = FMENGINE.fmVector(10000, 10000);
    /**
     * Maximum angular velocity.
     */
    that.maxAngularVelocity = 10000;
    /**
     * Friction is a factor between 0 and 1 diminishing the velocity.
     */
    that.friction = 0;
    /**
     * Elasticity is a factor between 0 and 1 used for bouncing purposes.
     */
    that.elasticity = 0;

    /**
     * Apply a force to the physic object.
     */
    that.applyForce = function (horizontalForce, verticalForce) {
        force.x += horizontalForce;
        force.y += verticalForce;
    };

    /**
    * Update the component.
    */
    that.update = function (dt) {
        collisions = [];
        //Compute inverse mass
        var invMass = 1 / that.mass, currentVelocity, maxVelocity;
        if (that.mass === 0) {
            invMass = 0;
        }
        
        //TODO use acceleration instead of force, just  like flixel
        
        //Limit velocity to a max value
        currentVelocity = that.velocity.x + (invMass * force.x) * dt;
        maxVelocity = that.maxVelocity.x + (invMass * force.x) * dt;
        if (Math.abs(currentVelocity) <= maxVelocity) {
            that.velocity.x = currentVelocity;
        } else if (currentVelocity < 0) {
            that.velocity.x = -maxVelocity;
        } else if (currentVelocity > 0) {
            that.velocity.x = maxVelocity;
        }
        currentVelocity = that.velocity.y + (invMass * force.y) * dt;
        maxVelocity = that.maxVelocity.y + (invMass * force.y) * dt;
        if (Math.abs(currentVelocity) <= maxVelocity) {
            that.velocity.y = currentVelocity;
        } else if (currentVelocity < 0) {
            that.velocity.y = -maxVelocity;
        } else if (currentVelocity > 0) {
            that.velocity.y = maxVelocity;
	}

        //TODO elasticity
        //that.velocity.x = -that.velocity.x * that.elasticity;
        //that.velocity.y = -that.velocity.y * that.elasticity;

        //Update position
        //TODO Add friction
        spatial.position.x += that.velocity.x * dt;
        spatial.position.y += that.velocity.y * dt;

        //Reset the forces applied to the physic component
        force.x = 0;
        force.y = 0;

        //If this game object collides with at least one type of game object
        var quad, gameObjects, i, j, otherGameObject, otherPhysic, collision = null;
        if (that.collidesWith.length > 0) {
            quad = FMENGINE.fmGame.getCurrentState().getQuad();
            gameObjects = [];
            quad.retrieve(gameObjects, pOwner);
            //If there are other game objects near this one
            for (i = 0; i < gameObjects.length; i = i + 1) {
                otherGameObject = gameObjects[i];
                otherPhysic = otherGameObject.components[FMENGINE.fmComponentTypes.PHYSIC];
                //If a game object is found and is alive and is not the current one
                //TODO remove the test on otherphysic when the quadtree work because it only has physic objects in it
                if (otherGameObject.isAlive() && otherPhysic && pOwner.getId() !== otherGameObject.getId() && !otherPhysic.isCollidingWith(pOwner) && !that.isCollidingWith(otherGameObject)) {
                    for (j = 0; j < that.collidesWith.length; j = j + 1) {
                        if (otherGameObject.hasType(that.collidesWith[j])) {
                            //TODO make it work for circles and obb too
                            collision = pOwner.components[FMENGINE.fmComponentTypes.PHYSIC].collides(otherPhysic);
                            if (collision !== null) {
                                that.addCollision(collision);
                                otherPhysic.addCollision(collision);
                                that.resolveCollision(otherPhysic, collision);
                                otherPhysic.resolveCollision(that, collision);
                                correctPosition(collision);
                            }
                        }
                    }
                }
            }
        }

        //TODO add direction debug
        /*if (xVelocity_ != 0) {
            direction = Math.atan(yVelocity_ / xVelocity_) / (Math.PI / 180);
        } else {
            direction = 0;
        }*/
    };

    /**
     * Resolve collision between current game object and the specified one.
     */
    that.resolveCollision = function (otherPhysic, collision) {
        var relativeVelocity = FMENGINE.fmMathUtils.substractVectors(otherPhysic.velocity, that.velocity),
            velocityAlongNormal = relativeVelocity.dotProduct(collision.normal),
            //Compute restitution
            e = Math.min(that.elasticity, otherPhysic.elasticity),
            j = 0,
            invMass = 0,
            otherInvMass = 0,
            impulse = FMENGINE.fmVector(0, 0);
        //Do not resolve if velocities are separating.
        if (velocityAlongNormal > 0) {
            return;
        }
        //Compute inverse mass
        if (that.mass === 0) {
            invMass = 0;
        } else {
            invMass = 1 / that.mass;
        }
        if (otherPhysic.mass === 0) {
            otherInvMass = 0;
        } else {
            otherInvMass = 1 / otherPhysic.mass;
        }
        //Compute impulse scalar
        j = -(1 + e) * velocityAlongNormal;
        j /= invMass + otherInvMass;
        //Apply impulse
        impulse.reset(j * collision.normal.x, j * collision.normal.y);
        that.velocity.x -= invMass * impulse.x;
        that.velocity.y -= invMass * impulse.y;
        otherPhysic.velocity.x += otherInvMass * impulse.x;
        otherPhysic.velocity.y += otherInvMass * impulse.y;
    };

    /**
     * Ensure that a game object collides with a certain type of other game 
     * objects (with physic components of course).
     */
    that.addTypeToCollideWith = function (pType) {
        that.collidesWith.push(pType);
    };

    /**
     * Remove a type that was supposed to collide with this game object.
     */
    that.removeTypeToCollideWith = function (pType) {
        that.collidesWith.splice(that.collidesWith.indexOf(pType), 1);
    };
    /**
     * Add a collision object representing the collision to the list of current
     * collisions.
     * @param {fmCollision} collision the collision object.
     */
    that.addCollision = function (collision) {
        collisions.push(collision);
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext, newPosition) {
        
    };

    /**
     * Get the velocity.
     */
    that.getLinearVelocity = function () {
        return that.velocity;
    };

    /**
     * Check if the current physic component is colliding a specified type of physic component.
     * @returns {boolean} whether there is already collision between the the current physic component and the specified type of physic component.
     */
    that.isCollidingWithType = function (pOtherType) {
        var i, collision;
        for (i = 0; i < collisions.length; i = i + 1) {
            collision = collisions[i];
            if ((collision.b && collision.b.owner.hasType(pOtherType))
                || (collision.a && collision.a.owner.hasType(pOtherType))) {
                return true;
            }
        }
        return false;
    };

    /**
     * Check if the current physic component is colliding with another one.
     * @returns {boolean} whether there is already collision between the physic components.
     */
    that.isCollidingWith = function (pOtherGameObject) {
        var i, collision, gameObject = pOwner;
        for (i = 0; i < collisions.length; i = i + 1) {
            collision = collisions[i];
            if ((collision.b && collision.b.owner.getId() === pOtherGameObject.getId())
                || (collision.a && collision.a.owner.getId() === pOtherGameObject.getId())) {
                return true;
            }
        }
        return false;
    };

    return that;
};