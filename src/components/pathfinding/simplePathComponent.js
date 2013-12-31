/**
 * The simple path component allows to affect a path to follow to any game 
 * object.
 * @class simplePathComponent
 * @author Simon Chauvin
 */
FM.simplePathComponent = function (pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.PATHFINDING, pOwner),
        /**
         * Waypoints constituing the path.
         */
        waypoints = [],
        /**
         * Current index of the waypoint to reach.
         */
        currentIndex = 0,
        /**
         * Speed at which the game object should follow the path if it is a
         * movement with a coefficient equals to 1.
         */
        desiredSpeed = FM.vector(0, 0),
        /**
         * Speed at which the game object follow the path.
         */
        actualSpeed = FM.vector(0, 0),
        /**
         * Whether the path is being followed or not.
         */
        active = false,
        /**
         * Whether the desired x position of the current waypoint was reached.
         * or not.
         */
        xReached = false,
        /**
         * Whether the desired y position of the current waypoint was reached.
         * or not.
         */
        yReached = false,
        /**
         * Position before stopping following the path, used to know if the game
         * object following the path has been moved during the stopping time.
         */
        positionBeforeStopping = FM.vector(0, 0),
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL],
        /**
         * Physic component reference.
         */
        physic = pOwner.components[FM.componentTypes.PHYSIC];
    /**
     * Check if the needed components are present.
     */
    if (FM.parameters.debug) {
        if (!spatial) {
            console.log("ERROR: No spatial component was added and you need one for using the path component.");
        }
        if (!physic) {
            console.log("ERROR: No physic component was added and you need one for using the path component.");
        }
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Follow the specified path.
     * @param {int} pSpeed speed at which the game object must follow the path.
     */
    that.startFollowingPath = function (pSpeed, pIndexToStartFrom) {
        if (waypoints.length > 0) {
            active = true;
            currentIndex = pIndexToStartFrom || 0;
            xReached = false;
            yReached = false;
            desiredSpeed = pSpeed;
            //Adjust speed so that the movement is linear
            var xDiff =  Math.abs((spatial.position.x + physic.offset.x + physic.width / 2) - waypoints[currentIndex].x),
                yDiff =  Math.abs((spatial.position.y + physic.offset.y + physic.height / 2) - waypoints[currentIndex].y),
                coeff;
            if (xDiff < yDiff) {
                coeff = xDiff / yDiff;
                actualSpeed.x = desiredSpeed * coeff;
                actualSpeed.y = desiredSpeed;
            } else if (xDiff > yDiff) {
                coeff = yDiff / xDiff;
                actualSpeed.x = desiredSpeed;
                actualSpeed.y = desiredSpeed * coeff;
            } else {
                actualSpeed.x = desiredSpeed;
                actualSpeed.y = desiredSpeed;
            }
        } else if (FM.parameters.debug) {
            console.log("WARNING: path with no waypoints defined.");
        }
        if (!physic) {
            console.log("WARNING: path added to a game object with no physic component.");
        }
    };

    /**
     * Continue following the current path where it had stopped.
     * @param {int} pSpeed speed at which the game object must follow the path.
     */
    that.resumeFollowingPath = function () {
        if (waypoints.length > 0) {
            active = true;
            if (positionBeforeStopping.x !== spatial.position.x
                    || positionBeforeStopping.y !== spatial.position.y) {
                xReached = false;
                yReached = false;
                //Adjust speed so that the movement is linear
                var xDiff =  Math.abs((spatial.position.x + physic.offset.x + physic.width / 2) - waypoints[currentIndex].x),
                    yDiff =  Math.abs((spatial.position.y + physic.offset.y + physic.height / 2) - waypoints[currentIndex].y),
                    coeff;
                if (xDiff < yDiff) {
                    coeff = xDiff / yDiff;
                    actualSpeed.x = desiredSpeed * coeff;
                    actualSpeed.y = desiredSpeed;
                } else if (xDiff > yDiff) {
                    coeff = yDiff / xDiff;
                    actualSpeed.x = desiredSpeed;
                    actualSpeed.y = desiredSpeed * coeff;
                } else {
                    actualSpeed.x = desiredSpeed;
                    actualSpeed.y = desiredSpeed;
                }
            }
        } else if (FM.parameters.debug) {
            console.log("WARNING: path with no waypoints defined.");
        }
        if (!physic) {
            console.log("WARNING: path added to a game object with no physic component.");
        }
    };

    /**
     * Stop following the current path.
     */
    that.stopFollowingPath = function () {
        active = false;
        physic.velocity.x = 0;
        physic.velocity.y = 0;
        positionBeforeStopping = FM.vector(spatial.position.x, spatial.position.y);
    };

    /**
     * Erase every waypoints in the path.
     */
    that.clearPath = function () {
        waypoints = [];
    };

    /**
     * Update the component.
     * * @param {float} dt time in seconds since the last frame.
     */
    that.update = function (dt) {
        //Update the motion if the path is active
        if (active && physic) {
            //Update motion whether a physic component is present or not
            var xPos =  spatial.position.x + physic.offset.x + physic.width / 2,
                yPos =  spatial.position.y + physic.offset.y + physic.height / 2,
                xDiff,
                yDiff,
                coeff;
            //Update x position
            if (xPos < waypoints[currentIndex].x) {
                if (waypoints[currentIndex].x - xPos < actualSpeed.x * dt) {
                    physic.velocity.x = waypoints[currentIndex].x - xPos;
                    xReached = true;
                } else {
                    physic.velocity.x = actualSpeed.x;
                }
            } else if (xPos > waypoints[currentIndex].x) {
                if (xPos - waypoints[currentIndex].x < actualSpeed.x * dt) {
                    physic.velocity.x = xPos - waypoints[currentIndex].x;
                    xReached = true;
                } else {
                    physic.velocity.x = -actualSpeed.x;
                }
            } else {
                xReached = true;
                physic.velocity.x = 0;
            }
            //Update y position
            if (yPos < waypoints[currentIndex].y) {
                if (waypoints[currentIndex].y - yPos < actualSpeed.y * dt) {
                    physic.velocity.y = waypoints[currentIndex].y - yPos;
                    yReached = true;
                } else {
                    physic.velocity.y = actualSpeed.y;
                }
            } else if (yPos > waypoints[currentIndex].y) {
                if (yPos - waypoints[currentIndex].y < actualSpeed.y * dt) {
                    physic.velocity.y = yPos - waypoints[currentIndex].y;
                    yReached = true;
                } else {
                    physic.velocity.y = -actualSpeed.y;
                }
            } else {
                yReached = true;
                physic.velocity.y = 0;
            }
            //Select the next waypoint if the current has been reached
            if (xReached && yReached) {
                if (waypoints.length > currentIndex + 1) {
                    //TODO call startfollowingpath ??
                    xReached = false;
                    yReached = false;
                    currentIndex = currentIndex + 1;
                    //Adjust speed so that the movement is linear
                    xDiff =  Math.abs(xPos - waypoints[currentIndex].x);
                    yDiff =  Math.abs(yPos - waypoints[currentIndex].y);
                    if (xDiff < yDiff) {
                        coeff = xDiff / yDiff;
                        actualSpeed.x = desiredSpeed * coeff;
                        actualSpeed.y = desiredSpeed;
                    } else if (xDiff > yDiff) {
                        coeff = yDiff / xDiff;
                        actualSpeed.x = desiredSpeed;
                        actualSpeed.y = desiredSpeed * coeff;
                    } else {
                        actualSpeed.x = desiredSpeed;
                        actualSpeed.y = desiredSpeed;
                    }
                } else {
                    active = false;
                    actualSpeed = FM.vector(0, 0);
                    desiredSpeed = 0;
                    physic.velocity = FM.vector(0, 0);
                }
            }
        }
    };

    /**
     * Add a waypoint to the path.
     * @param {int} pX x position.
     * @param {int} pY y position.
     * @param {int} index optional index at which adding the waypoint.
     */
    that.add = function (pX, pY, index) {
        if (index === undefined) {
            waypoints.push({x : pX, y : pY});
        } else {
            waypoints[index] = {x : pX, y : pY};
        }
    };

    /**
     * Remove a waypoint from the path.
     * @param {int} index index of the waypoint to remove.
     */
    that.remove = function (index) {
        waypoints.splice(index, 1);
    };

    /**
     * Return the waypoints of the path.
     * @returns {Array} waypoints of the path.
     */
    that.getWaypoints = function () {
        return waypoints;
    };

    /**
     * Return the current index of the waypoint to reach.
     * @returns {int} index of the waypoint to reach.
     */
    that.getCurrentIndex = function () {
        return currentIndex;
    };

    /**
     * Return the current waypoint to reach.
     * @returns {Waypoint} waypoint to reach.
     */
    that.getCurrentWaypoint = function () {
        return waypoints[currentIndex];
    };

    /**
     * Return the number of waypoints.
     * @returns {int} number of waypoints.
     */
    that.getLength = function () {
        return waypoints.length;
    };

    /**
     * Check if the last waypoint has been reached.
     * @returns {boolean} whether the last waypoint has been reached or not.
     */
    that.isLastWaypointReached = function () {
        return currentIndex === waypoints.length - 1 && !active;
    };

    /**
     * Check if the path is being followed.
     * @returns {boolean} whether the path is being followed.
     */
    that.isActive = function () {
        return active;
    };

    /**
     * Destroy the path.
     */
    that.destroy = function () {
        waypoints = null;
        spatial = null;
        physic = null;
        that.destroy();
        that = null;
    };

    return that;
};
