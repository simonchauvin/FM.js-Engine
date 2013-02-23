/**
 * Under Creative Commons Licence
 * Component of basic physics.
 * @param {fmObject} The object that owns this component.
 * @author Simon Chauvin
 */
FMENGINE.fmPhysicComponent = function (pWorld, pOwner) {
    "use strict";
    /**
     * fmPhysicComponent is based on fmComponent.
     */
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.PHYSIC, pOwner),
	/**
         *
         */
        ANY = 0,
        /**
         *
         */
        TOP = 1,
        /**
         *
         */
        BOTTOM = 2,
        /**
         *
         */
        LEFT = 3,
        /**
         *
         */
        RIGHT = 4,
        /**
         * By default the bounding box allow collisions on every sides
         * TODO add param in init function and use that to know wich side should be colliding
         */
        allowCollisions = FMENGINE.fmParameters.ANY,
        /**
	 * World of the game.
	 */
	world = pWorld,
        /**
         * The world in which the game object is
         */
        world = null,
        /**
         * The current direction of the object
         */
        direction = 0,
        /**
         * To know if the object is on the ground or not
         */
        onGround = false,
	/**
        * Spatial component reference.
        */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];
    /**
     * Represent the velocity on the x-axis
     */
    that.xVelocity = 0;
    /**
     * Represent the velocity on the y-axis
     */
    that.yVelocity = 0;
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
     * Represent the maximum absolute value of the velocity on the x-axis
     */
    that.maxXVelocity = 10000;
    /**
     * Represent the maximum absolute value of the velocity on the y-axis
     */
    that.maxYVelocity = 10000;
    /**
     * The acceleration on the x-axis represent how fast the game object reach the maximum xVelocity
     */
    that.xAcceleration = 0;
    /**
     * The acceleration on the y-axis represent how fast the game object reach the maximum yVelocity
     */
    that.yAcceleration = 0;
    /**
     * Ground friction is a factor between 0 and 1
     */
    that.groundFriction = 0;
    /**
     * Air friction is a factor between 0 and 1
     */
    that.airFriction = 0;
    /**
     * Bouncing is a factor between 0 and 1
     */
    that.bouncing = 0;
    /**
     * Gravity represent how fast the game object is going toward the bottom
     * //TODO define an x and y gravity so that it can be a vector !
     */
    that.gravity = 0;
    /**
     * 
     */
    that.xThrust = 1;
    /**
     * 
     */
    that.yThrust = 1;
    /**
     * Store the collider with wich the collision have already been checked during the current frame.
     */
    that.collidesWith = [];

    /**
     *
     */
    that.preUpdate = function () {
        that.previousXVelocity = that.xVelocity;
        that.previousYVelocity = that.yVelocity;
    };

    /**
    * Update the component.
    */
    that.update = function (dt) {
	//Add x acceleration to x velocity
	//TODO multiply acceleration by elapsedTime (use flixel as example)
        var velocity = that.xVelocity + that.xAcceleration * dt;
        if (Math.abs(velocity) <= that.maxXVelocity) {
            that.xVelocity = velocity;
	} else if (velocity < 0) {
	    that.xVelocity = -that.maxXVelocity;
	} else if (velocity > 0) {
	    that.xVelocity = that.maxXVelocity;
	}

        //Add y acceleration to y velocity
        velocity = that.yVelocity + that.yAcceleration * dt;
        if (Math.abs(velocity) <= that.maxYVelocity) {
	    that.yVelocity = velocity;
	} else if (velocity < 0) {
	    that.yVelocity = -that.maxYVelocity;
	} else if (velocity > 0) {
	    that.yVelocity = that.maxYVelocity;
	}

	//Reset accelerations
	//that.xAcceleration = 0;
	//that.yAcceleration = 0;

	//Increase yVelocity_ because of gravity
        //TODO change so that a gravity from other side can be done
        //if (that.gravity != 0 && !onGround) {
            that.yVelocity += that.gravity;
        //}

        //If the object has a collider component
        //if (that.collider) {
	    //Retrieve game objects
	    var gameObjects = FMENGINE.fmGame.getCurrentState().gameObjects;

            //Decrease the velocity according to the ground and air friction factor
            //TODO define the ground as a vector so that it is not when the bottom is colliding that it touches the ground
            //but when the vector is 0 ? or something
	    //TODO do this somewhere else since isbottomsidecolling is going away
            /*if (collider.isBottomSideColliding()) {
                xVelocity_ *= 1 - that.groundFriction;
                onGround = true;
            } else {
		xVelocity_ *= 1 - that.airFriction;
                yVelocity_ *= 1 - that.airFriction;
                onGround = false;
            }*/

	    //Move the game object
	    //move(world.getCollisions(), world.getBounds(), gameObjects, that.xVelocity * elapsedTime(), that.yVelocity * elapsedTime());

	    if (that.collidesWith.length == 0) {
		spatial.x += that.xVelocity * dt;
		spatial.y += that.yVelocity * dt;
		//spatial.x += that.xVelocity;
		//spatial.y += that.yVelocity;
	    }

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

	    //If there are more than one game object
	    /*if (gameObjects.length > 1) {
		//TODO optimize with a quad tree for colliders (only test colliders in the same area)
		var i, otherGameObject, otherSpatial, otherCollider, otherPhysic;
		for (i = 0; i < gameObjects.length; i++) {
		    otherGameObject = gameObjects[i];
		    //If a game object is found and is not destroyed and is not the current one
		    if (pOwner.getId() != otherGameObject.getId() && !otherGameObject.destroyed) {
			//Retrieve components
			otherSpatial = otherGameObject.components[FMComponentTypes.SPATIAL];
			otherPhysic = otherGameObject.components[FMComponentTypes.PHYSIC];

			if (otherCollider && otherPhysic && that.collidesWith.indexOf(otherPhysic) == -1 && otherPhysic.collidesWith.indexOf(that) == -1) {
			    
			}
		    }
		}
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
	//}

        //TODO add direction debug
        /*if (xVelocity_ != 0) {
            direction = Math.atan(yVelocity_ / xVelocity_) / (Math.PI / 180);
        } else {
            direction = 0;
        }*/

	//Reset the collisions
	that.collidesWith = [];
    };

    /**
     * Update finalizing the physic component
     */
    that.postUpdate = function (alpha) {
	that.newXVelocity = that.xVelocity * alpha + that.previousXVelocity * (1.0 - alpha);
	that.newYVelocity = that.yVelocity * alpha + that.previousYVelocity * (1.0 - alpha);
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
		that.xVelocity = that.bouncing * -that.xVelocity;
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
		that.yVelocity = that.bouncing * -that.yVelocity;
		break;
	    }
	}
    };
    /**
     * Check if the game object is on the ground or not.
     * @returns {Boolean} True if the game object is on the ground, false otherwise.
     */
    that.isOnGround = function () {
       return onGround; 
    }

    return that;
}