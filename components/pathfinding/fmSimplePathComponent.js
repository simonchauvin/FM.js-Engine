/**
 * The simple path component allows to affect a path to follow to any game 
 * object.
 * @author Simon Chauvin
 */
FMENGINE.fmSimplePathComponent = function (pOwner) {
    "use strict";
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.PATHFINDING, pOwner),
        /**
         * Waypoints constituing the path.
         */
        waypoints = [],
        /**
         * Current index of the waypoint to reach.
         */
        currentIndex = 0,
        /**
         * Speed at which the game object follow the path.
         */
        speed = 0,
        /**
         * Whether the path is being followed or not.
         */
        active = false,
        /**
         * Whether the desired x position of the current waypoint was reached 
         * or not.
         */
        xReached = false,
        /**
         * Whether the desired y position of the current waypoint was reached 
         * or not.
         */
        yReached = false,
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL],
        /**
         * Renderer component reference.
         */
        renderer = pOwner.components[FMENGINE.fmComponentTypes.RENDERER],
        /**
         * Physic component reference.
         */
        physic = pOwner.components[FMENGINE.fmComponentTypes.PHYSIC];

    /**
     * Follow the specified path.
     * @param {int} pSpeed speed at which the game object must follow the path.
     */
    that.startFollowingPath = function (pSpeed) {
        if (waypoints.length > 0) {
            active = true;
            speed = pSpeed;
            xReached = false;
            yReached = false;
        } else if (FMENGINE.fmParameters.debug) {
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
        } else if (FMENGINE.fmParameters.debug) {
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
    };

    /**
     * Update the component.
     * * @param {float} dt time in seconds since the last frame.
     */
    that.update = function (dt) {
        //Update the motion if the path is active
        if (active && physic) {
            //Update motion whether a physic component is present or not
            var xPos =  spatial.x + physic.offset.x + physic.width / 2,
                yPos =  spatial.y + physic.offset.y + physic.height / 2;
            //Update x position
            if (xPos < waypoints[currentIndex].x) {
                if (waypoints[currentIndex].x - xPos < speed * dt) {
                    physic.velocity.x = waypoints[currentIndex].x - xPos;
                    xReached = true;
                } else {
                    physic.velocity.x = speed;
                }
            } else if (xPos > waypoints[currentIndex].x) {
                if (xPos - waypoints[currentIndex].x < speed * dt) {
                    physic.velocity.x = xPos - waypoints[currentIndex].x;
                    xReached = true;
                } else {
                    physic.velocity.x = -speed;
                }
            } else {
                xReached = true;
                physic.velocity.x = 0;
            }
            //Update y position
            if (yPos < waypoints[currentIndex].y) {
                if (waypoints[currentIndex].y - yPos < speed * dt) {
                    physic.velocity.y = waypoints[currentIndex].y - yPos;
                    yReached = true;
                } else {
                    physic.velocity.y = speed;
                }
            } else if (yPos > waypoints[currentIndex].y) {
                if (yPos - waypoints[currentIndex].y < speed * dt) {
                    physic.velocity.y = yPos - waypoints[currentIndex].y;
                    yReached = true;
                } else {
                    physic.velocity.y = -speed;
                }
            } else {
                yReached = true;
                physic.velocity.y = 0;
            }
            //Select the next waypoint if the current has been reached
            if (xReached && yReached) {
                if (waypoints.length > currentIndex + 1) {
                    xReached = false;
                    yReached = false;
                    currentIndex = currentIndex + 1;
                } else {
                    active = false;
                    speed = 0;
                    if (physic) {
                        physic.velocity = FMENGINE.fmPoint(0, 0);
                    }
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
     * Destroy the path.
     */
    that.destroy = function () {
        waypoints = null;
        spatial = null;
        renderer = null;
        physic = null;
        that.destroy();
        that = null;
    };

    return that;
};