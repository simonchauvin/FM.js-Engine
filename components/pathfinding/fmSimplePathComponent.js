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
        if (active) {
            var xPos, yPos;
            //Update motion whether a physic component is present or not
            if (physic) {
                xPos =  spatial.x + physic.getWidth() / 2;
                yPos =  spatial.y + physic.getHeight() / 2;
                //Update x position
                if (xPos < waypoints[currentIndex].x) {
                    if (waypoints[currentIndex].x - xPos < speed * dt) {
                        physic.xVelocity = waypoints[currentIndex].x - xPos;
                        xReached = true;
                    } else {
                        physic.xVelocity = speed;
                    }
                } else if (xPos > waypoints[currentIndex].x) {
                    if (xPos - waypoints[currentIndex].x < speed * dt) {
                        physic.xVelocity = xPos - waypoints[currentIndex].x;
                        xReached = true;
                    } else {
                        physic.xVelocity = -speed;
                    }
                } else {
                    xReached = true;
                    physic.xVelocity = 0;
                }
                //Update y position
                if (yPos < waypoints[currentIndex].y) {
                    if (waypoints[currentIndex].y - yPos < speed * dt) {
                        physic.yVelocity = waypoints[currentIndex].y - yPos;
                        yReached = true;
                    } else {
                        physic.yVelocity = speed;
                    }
                } else if (yPos > waypoints[currentIndex].y) {
                    if (yPos - waypoints[currentIndex].y < speed * dt) {
                        physic.yVelocity = yPos - waypoints[currentIndex].y;
                        yReached = true;
                    } else {
                        physic.yVelocity = -speed;
                    }
                } else {
                    yReached = true;
                    physic.yVelocity = 0;
                }
            } else {
                xPos =  spatial.x + renderer.getWidth() / 2;
                yPos =  spatial.y + renderer.getHeight() / 2;
                //Update x position
                if (xPos < waypoints[currentIndex].x) {
                    spatial.x += speed * dt;
                    if (spatial.x + renderer.getWidth() / 2 > waypoints[currentIndex].x) {
                        spatial.x = waypoints[currentIndex].x - renderer.getWidth() / 2;
                        xReached = true;
                    }
                } else if (xPos > waypoints[currentIndex].x) {
                    spatial.x -= speed * dt;
                    if (spatial.x + renderer.getWidth() / 2 < waypoints[currentIndex].x) {
                        spatial.x = waypoints[currentIndex].x - renderer.getWidth() / 2;
                        xReached = true;
                    }
                } else {
                    xReached = true;
                }
                //Update y position
                if (yPos < waypoints[currentIndex].y) {
                    spatial.y += speed * dt;
                    if (spatial.y + renderer.getHeight() / 2 > waypoints[currentIndex].y) {
                        spatial.y = waypoints[currentIndex].y - renderer.getHeight() / 2;
                        yReached = true;
                    }
                } else if (yPos > waypoints[currentIndex].y) {
                    spatial.y -= speed * dt;
                    if (spatial.y + renderer.getHeight() / 2 < waypoints[currentIndex].y) {
                        spatial.y = waypoints[currentIndex].y - renderer.getHeight() / 2;
                        yReached = true;
                    }
                } else {
                    yReached = true;
                }
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
                        physic.xVelocity = 0;
                        physic.yVelocity = 0;
                    }
                }
            }
        }
    };

    /**
     * Add a waypoint to the path.
     * @param {int} pX x position.
     * @param {int} pY y position.
     */
    that.add = function (pX, pY) {
        waypoints.push({x : pX, y : pY});
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