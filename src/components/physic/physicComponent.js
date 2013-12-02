/**
 * Under Creative Commons Licence
 * Component of basic physics.
 * @param {int} pWidth width of the collider.
 * @param {int} pHeight height of the collider.
 * @param {fmObject} The object that owns this component.
 * @author Simon Chauvin
 */
FM.physicComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    /**
     * physicComponent is based on component.
     */
    var that = FM.component(FM.componentTypes.PHYSIC, pOwner),
        /**
         * World of the game.
         */
        world = FM.game.getCurrentState().getWorld(),
        /**
        * Quad tree containing all game objects with a physic component.
         */
        quad = FM.game.getCurrentState().getQuad(),
        /**
         * The current direction of the object.
         */
        direction = 0,
        /**
         * Array storing the types of game objects that can collide with this one.
         */
        collidesWith = [],
        /**
         * Store the collisions that this object has.
         */
        collisions = [],
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL],
        /**
         * Correct the position of the physic component.
         */
        correctPosition = function (collision) {
            //Position correction
            var correction = FM.vector(collision.penetration * collision.normal.x, collision.penetration * collision.normal.y),
                aSpatial = collision.a.owner.components[FM.componentTypes.SPATIAL],
                bSpatial = collision.b.owner.components[FM.componentTypes.SPATIAL],
                aPhysic = collision.a.owner.components[FM.componentTypes.PHYSIC],
                bPhysic = collision.b.owner.components[FM.componentTypes.PHYSIC],
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

            //TODO this is here that it goes wrong, need to add offset ?
            aSpatial.position.x -= correction.x * (invMass / massSum);
            aSpatial.position.y -= correction.y * (invMass / massSum);
            bSpatial.position.x += correction.x * (otherInvMass / massSum);
            bSpatial.position.y += correction.y * (otherInvMass / massSum);
        },
        /**
         * 
         */
        tryToMove = function (tiles, xVel, yVel) {
            var spX = spatial.position.x + that.offset.x + xVel,
                spY = spatial.position.y + that.offset.y + yVel;
            if (!that.checkCollisions(tiles, spX, spY)) {
                spatial.position.x = spX;
                spatial.position.y = spY;
                return true;
            }
            return false;
        },
        /**
         * 
         */
        move = function (tiles, xVel, yVel) {
            if (Math.abs(xVel) >= tiles.getTileWidth() || Math.abs(yVel) >= tiles.getTileHeight()) {
                move(tiles, xVel / 2, yVel / 2);
                move(tiles, xVel - xVel / 2, yVel - yVel / 2);
                return;
            }

            var hor = tryToMove(tiles, xVel, 0),
                ver = tryToMove(tiles, 0, yVel);
            if (hor && ver)
                return;

            if (!hor) {
                that.velocity.x = 0;
                var i;
                var maxSpeed = Math.abs(xVel);
                for (i = 0; i < maxSpeed; i++) {
                    var vel;
                    if (xVel === 0)
                        vel = 0;
                    else if (xVel > 0)
                        vel = 1;
                    else
                        vel = -1;
                    if (!tryToMove(tiles, vel, 0))
                        break;
                    else
                        that.velocity.x += vel;
                }
            }
            if (!ver) {
                that.velocity.y = 0;
                maxSpeed = Math.abs(yVel);
                for (i = 0; i < maxSpeed; i++) {
                    var vel;
                    if (yVel === 0)
                        vel = 0;
                    if (yVel > 0)
                        vel = 1;
                    else
                        vel = -1;
                    if (!tryToMove(tiles, 0, vel))
                        break;
                    else
                        that.velocity.y += vel;
                }
            }
        };
    /**
     * Offset of the bounding box or circle.
     */
    that.offset = FM.vector(0, 0);
    /**
     * Width of the collider.
     */
    that.width = pWidth;
    /**
     * Height of the collider.
     */
    that.height = pHeight;
    /**
     * Velocity of the physic component.
     */
    that.velocity = FM.vector(0, 0);
    /**
     * Acceleration applied to the physic object.
     */
    that.acceleration = FM.vector(0, 0);
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
    that.maxVelocity = FM.vector(1000, 1000);
    /**
     * Maximum angular velocity.
     */
    that.maxAngularVelocity = 10000;
    /**
     * Elasticity is a factor between 0 and 1 used for bouncing purposes.
     */
    that.elasticity = 0;

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
        currentVelocity = that.velocity.x + (invMass * that.acceleration.x) * dt;
        maxVelocity = that.maxVelocity.x + (invMass * that.acceleration.x) * dt;
        if (Math.abs(currentVelocity) <= maxVelocity) {
            that.velocity.x = currentVelocity;
        } else if (currentVelocity < 0) {
            that.velocity.x = -maxVelocity;
        } else if (currentVelocity > 0) {
            that.velocity.x = maxVelocity;
        }
        currentVelocity = that.velocity.y + (invMass * that.acceleration.y) * dt;
        maxVelocity = that.maxVelocity.y + (invMass * that.acceleration.y) * dt;
        if (Math.abs(currentVelocity) <= maxVelocity) {
            that.velocity.y = currentVelocity;
        } else if (currentVelocity < 0) {
            that.velocity.y = -maxVelocity;
        } else if (currentVelocity > 0) {
            that.velocity.y = maxVelocity;
	}

        //Update position
        spatial.position.x += that.velocity.x * dt;
        spatial.position.y += that.velocity.y * dt;

        //Reset the acceleration applied to the physic component
        that.acceleration.x = 0;
        that.acceleration.y = 0;

        //If this game object collides with at least one type of game object
        if (collidesWith.length > 0) {
            var quad, tileMap, gameObjects, i, j, otherGameObject, otherPhysic, collision = null;
            if (world.hasTileCollisions()) {
                for (i = 0; i < collidesWith.length; i = i + 1) {
                    tileMap = world.getTileMapFromType(collidesWith[i]);
                    if (tileMap.canCollide()) {
                        move(tileMap, that.velocity.x * dt, that.velocity.y * dt);
                    }
                }
            }
            quad = FM.game.getCurrentState().getQuad();
            gameObjects = quad.retrieve(pOwner);
            //If there are other game objects near this one
            for (i = 0; i < gameObjects.length; i = i + 1) {
                otherGameObject = gameObjects[i];
                otherPhysic = otherGameObject.components[FM.componentTypes.PHYSIC];
                //If a game object is found and is alive and is not the current one
                if (otherGameObject.isAlive() && pOwner.getId() !== otherGameObject.getId() && !otherPhysic.isCollidingWith(pOwner) && !that.isCollidingWith(otherGameObject)) {
                    for (j = 0; j < collidesWith.length; j = j + 1) {
                        if (otherGameObject.hasType(collidesWith[j])) {
                            collision = pOwner.components[FM.componentTypes.PHYSIC].overlapsWithObject(otherPhysic);
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
     * Check collisions with the tiles.
     */
    that.checkTileCollisions = function (tiles, xPos, yPos) {
        var tileWidth,
            tileHeight,
            i1, j1,
            i2, j2,
            i, j;
        //If there are collisions with tiles
        if (tiles.length > 0) {
            tileWidth = tiles.getTileWidth();
            tileHeight = tiles.getTileHeight();
            i1 = Math.floor(yPos / tileHeight);
            j1 = Math.floor(xPos / tileWidth);
            i2 = Math.floor((yPos + that.height) / tileHeight);
            j2 = Math.floor((xPos + that.width) / tileWidth);
            for (i = i1; i <= i2; i = i + 1) {
                for (j = j1; j <= j2; j = j + 1) {
                    if (tiles[i] && tiles[i][j] === 1) {
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
     * Resolve collision between current game object and the specified one.
     */
    that.resolveCollision = function (otherPhysic, collision) {
        var relativeVelocity = FM.math.substractVectors(otherPhysic.velocity, that.velocity),
            velocityAlongNormal = relativeVelocity.dotProduct(collision.normal),
            //Compute restitution
            e = Math.min(that.elasticity, otherPhysic.elasticity),
            j = 0,
            invMass = 0,
            otherInvMass = 0,
            impulse = FM.vector(0, 0);
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
        collidesWith.push(pType);
    };

    /**
     * Remove a type that was supposed to collide with this game object.
     */
    that.removeTypeToCollideWith = function (pType) {
        collidesWith.splice(collidesWith.indexOf(pType), 1);
    };
    /**
     * Add a collision object representing the collision to the list of current
     * collisions.
     * @param {collision} collision the collision object.
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
        var i, collision;
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
