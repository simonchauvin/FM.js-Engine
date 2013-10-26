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
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];
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

        //Update position
        //TODO Add friction
        spatial.position.x += that.velocity.x * dt;
        spatial.position.y += that.velocity.y * dt;

        //If this game object collides with at least one type of game object
        var quad, gameObjects, i, j, otherGameObject, otherPhysic, collision;
        if (that.collidesWith.length > 0) {
            quad = FMENGINE.fmGame.getCurrentState().getQuad();
            gameObjects = quad.retrieve(pOwner);
            //gameObjects = FMENGINE.fmGame.getCurrentState().members;
            //If there are other game objects near this one
            for (i = 0; i < gameObjects.length; i = i + 1) {
                otherGameObject = gameObjects[i];
                otherPhysic = otherGameObject.components[FMENGINE.fmComponentTypes.PHYSIC];
                //If a game object is found and is alive and is not the current one
                if (otherPhysic && pOwner.getId() !== otherGameObject.getId() && otherGameObject.isAlive()) {
                    for (j = 0; j < that.collidesWith.length; j = j + 1) {
                        if (otherGameObject.hasType(that.collidesWith[j])) {
                            //TODO make it work for circles and obb
                            collision = otherPhysic.collidesWithAabb(that);
                            if (collision !== null) {
                                that.addCollision(collision);
                                otherPhysic.addCollision(collision);
                                that.resolveCollision(otherPhysic, collision);
                                otherPhysic.resolveCollision(that, collision);
                            }
                        }
                    }
                }
            }
        }
        
        force.x = 0;
        force.y = 0;

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
        //Do not resolve if velocities are separating.
        if (velocityAlongNormal > 0) {
            return;
        }
        //Compute impulse scalar
        j = -(1 + e) * velocityAlongNormal;
        j /= invMass + otherInvMass;
        //Apply impulse
        impulse.x = j * collision.normal.x;
        impulse.y = j * collision.normal.y;
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
     * Check if the physic component is colliding with a certain type right now.
     * @returns {boolean} whether collision between the type specified and the 
     * physic component.
     */
    that.isCollidingWith = function (pTypeToTest) {
        var i;
        for (i = 0; i < collisions.length; i = i + 1) {
            if (collisions[i].b.owner.hasType(pTypeToTest)
                || collisions[i].a.owner.hasType(pTypeToTest)) {
                return true;
            }
        }
        return false;
    };

    return that;
};