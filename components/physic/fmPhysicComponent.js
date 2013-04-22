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
         * Array storing the type of game objects that collide with this one.
         */
        collidesWith = [],
        /**
         * The current direction of the object.
         */
        direction = 0,
	/**
        * Spatial component reference.
        */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];
    /**
     * Offset of the bounding box or circle.
     */
    that.offset = FMENGINE.fmPoint(0, 0);
    /**
     * Width of the collider.
     */
    that.width = pWidth;
    /**
     * Height of the collider.
     */
    that.height = pHeight;
    /**
     * 
     */
    that.velocity = FMENGINE.fmPoint(0, 0);
    /**
     * Angular velocity.
     */
    that.angularVelocity = 0;
    /**
     * Velocity on the x-axis at the previous frame.
     */
    that.previousXVelocity = 0;
    /**
     * Velocity on the y-axis at the previous frame.
     */
    that.previousYVelocity = 0;
    /**
     * Velocity on the x-axis to be used for drawing.
     */
    that.newXVelocity = 0;
    /**
     * Velocity on the y-axis to be used for drawing.
     */
    that.newYVelocity = 0;
    /**
     * Represent the mass of the game object
     */
    that.mass = 1;
    /**
     * Represent the maximum absolute value of the velocity.
     */
    that.maxVelocity = FMENGINE.fmPoint(10000, 10000);
    /**
     * Maximum angular velocity.
     */
    that.maxAngularVelocity = 10000;
    /**
     * The acceleration represent how fast the game object reach the maximum 
     * velocity.
     */
    that.acceleration = FMENGINE.fmPoint(0, 0);
    /**
     * Angular acceleration.
     */
    that.angularAcceleration = 0;
    /**
     * Friction is a factor between 0 and 1 diminishing the velocity.
     */
    that.friction = 0;
    /**
     * Elasticity is a factor between 0 and 1 used for bouncing purposes.
     */
    that.elasticity = 0;
    /**
     * 
     */
    that.thrust = FMENGINE.fmPoint(1, 1);

    /**
     *
     */
    that.preUpdate = function () {
        that.previousXVelocity = that.velocity.x;
        that.previousYVelocity = that.velocity.y;
    };

    /**
    * Update the component.
    */
    that.update = function (dt) {
        //Add x acceleration to x velocity
        var vel = that.velocity.x + that.acceleration.x * dt,
            //Retrieve the game objects near the owner of this physic component
            gameObjects = null;
        if (Math.abs(vel) <= that.maxVelocity.x) {
            that.velocity.x = vel;
        } else if (vel < 0) {
            that.velocity.x = -that.maxVelocity.x;
        } else if (vel > 0) {
            that.velocity.x = that.maxVelocity.x;
        }

        //Add y acceleration to y velocity
        vel = that.velocity.y + that.acceleration.y * dt;
        if (Math.abs(vel) <= that.maxVelocity.y) {
            that.velocity.y = vel;
	} else if (vel < 0) {
            that.velocity.y = -that.maxVelocity.y;
	} else if (vel > 0) {
            that.velocity.y = that.maxVelocity.y;
	}

        //Move the game object
        //move(world.getCollisions(), world.getBounds(), gameObjects, that.xVelocity * elapsedTime(), that.yVelocity * elapsedTime());

        //If this game object collides with at least one type of game object
        if (collidesWith.length > 0) {
            //If there are other game objects near this one
            gameObjects = quad.retrieve(pOwner);
            if (gameObjects.length > 0) {
                var i, j, otherGameObject, otherSpatial, otherCollider, otherPhysic;
                for (i = 0; i < gameObjects.length; i = i + 1) {
                    otherGameObject = gameObjects[i];
                    //If a game object is found and is not destroyed and is not the current one
                    if (pOwner.getId() !== otherGameObject.getId() && otherGameObject.isAlive()) {
                        for (j = 0; j < collidesWith.length; j = j + 1) {
                            if (otherGameObject.hasType(collidesWith[j])) {
                                //Retrieve components
                                otherSpatial = otherGameObject.components[FMENGINE.fmComponentTypes.SPATIAL];
                                otherPhysic = otherGameObject.components[FMENGINE.fmComponentTypes.PHYSIC];
                                console.log("collision");
                                if (otherCollider && otherPhysic && collidesWith.indexOf(otherPhysic) == -1 && otherPhysic.collidesWith.indexOf(that) == -1) {

                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        //Move the game object
        spatial.x += that.velocity.x * dt;
        spatial.y += that.velocity.y * dt;

        /*if (spatial.x > world.width - that.collider.getRadius() * 2) {
            spatial.x = world.width - that.collider.getRadius() * 2;
            that.xVelocity *= -1;
        } else if (spatial.x < 0) {
            spatial.x = 0;
            that.xVelocity *= -1;
        } else if (spatial.y > world.height - that.collider.getRadius() * 2) {
            spatial.y = world.height - that.collider.getRadius() * 2;
            that.yVelocity *= -1;
        } else if (spatial.y < 0) {
            spatial.y = 0;
            that.yVelocity *= -1;
        }*/

        
    //} else {
        //TODO What do we do in case there is no collider component?
        //Decrease the velocity according to the ground and air friction factor
        /*xVelocity_ *= 1 - that.airFriction;
        yVelocity_ *= 1 - that.airFriction;
        onGround = false;
        //Move the game object
        spatial.x += xVelocity_ * elapsedTime();
        spatial.y += yVelocity_ * elapsedTime();*/

        //TODO add direction debug
        /*if (xVelocity_ != 0) {
            direction = Math.atan(yVelocity_ / xVelocity_) / (Math.PI / 180);
        } else {
            direction = 0;
        }*/
    };

    /**
     * Update finalizing the physic component
     */
    that.postUpdate = function (alpha) {
        that.newXVelocity = that.velocity.x * alpha + that.previousXVelocity * (1.0 - alpha);
        that.newYVelocity = that.velocity.y * alpha + that.previousYVelocity * (1.0 - alpha);
    };

    /**
     * Ensure that a game object collides with a certain type of other game 
     * objects (with physic components of course).
     */
    that.addTypeToCollideWith = function (pType) {
        collidesWith.push(pType);
    };

    /**
     * Simulate a movement according to a given x and y velocity
     */
    var tryToMove = function (collisions, worldBounds, xVel, yVel) {
	//Update the position of the game object's collider according to the x and y velocities
        spatial.x += xVel;
        spatial.y += yVel;
	//If no collision is detected
        if (that.collider.checkWorldCollisions(collisions, worldBounds)) {
	    //Rollback to old collider positions
            spatial.x -= xVel;
            spatial.y -= yVel;
	    //Collision detected, impossible to move
            return false;
        }
        //No collision detected, let's move
        return true;
    };

    /**
     * Move from a given x and y velocity.
     */
    var move = function (collisions, worldBounds, gameObjects, xVel, yVel) {
	//If there are collision tiles and if the velocity is greater than the size of the tiles
        if (collisions.length > 0 && (Math.abs(xVel) >= collisions.getTileWidth() || Math.abs(yVel) >= collisions.getTileHeight())) {
	    move(collisions, worldBounds, gameObjects, xVel / 2, yVel / 2);
	    move(collisions, worldBounds, gameObjects, xVel - xVel / 2, yVel - yVel / 2);
	    return;
	}

	//Try to move the game object
	if (tryToMove(collisions, worldBounds, xVel, yVel))
	    return;

	//Try to move on the x axis
	var i, maxSpeed = Math.abs(xVel);
	for (i = 0; i < maxSpeed; i++) {
	    var vel;
	    if (xVel == 0)
		vel = 0;
	    else if (xVel > 0)
		vel = 1;
	    else
		vel = -1;
	    //If impossible to move the game object is as far as it can be
	    if (!tryToMove(collisions, worldBounds, vel, 0)) {
		//Bounce against aabb (tiles) or world bounds
		that.velocity.x = that.elasticity * -that.velocity.x;
		break;
	    }
	}
	//Try to move on the y axis
	maxSpeed = Math.abs(yVel);
	for (i = 0; i < maxSpeed; i++) {
	    var vel;
	    if (yVel == 0)
		vel = 0;
	    if (yVel > 0)
		vel = 1;
	    else
		vel = -1;
	    //If impossible to move the game object is as far as it can be
	    if (!tryToMove(collisions, worldBounds, 0, vel)) {
		//Bounce against aabb (tiles) or world bounds
		that.velocity.y = that.elasticity * -that.yelocity.y;
		break;
	    }
	}
    };

    /**
     * Get the velocity.
     */
    that.getLinearVelocity = function () {
        return that.velocity;
    };

    return that;
};