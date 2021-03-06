/*global FM*/
/**
 * The simple path component can make a game object follow a predefined path.
 * @class FM.SimplePathComponent
 * @extends FM.Component
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.SimplePathComponent = function (pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.PATHFINDING, pOwner);
    /**
     * Waypoints constituing the path.
     * @type Array
     * @private
     */
    this.waypoints = [];
    /**
     * Current index of the waypoint to reach.
     * @type int
     * @private
     */
    this.currentIndex = 0;
    /**
     * Speed at which the game object should follow the path if it is a
     * movement with a coefficient equals to 1.
     * @type FM.Vector
     * @private
     */
    this.desiredSpeed = 0;
    /**
     * Speed at which the game object follow the path.
     * @type FM.Vector
     * @private
     */
    this.actualSpeed = new FM.Vector(0, 0);
    /**
     * Whether the path is being followed or not.
     * @type boolean
     * @private
     */
    this.active = false;
    /**
     * Whether the desired x position of the current waypoint was reached.
     * or not.
     * @type boolean
     * @private
     */
    this.xReached = false;
    /**
     * Whether the desired y position of the current waypoint was reached.
     * or not.
     * @type boolean
     * @private
     */
    this.yReached = false;
    /**
     * Position before stopping following the path, used to know if the game
     * object following the path has been moved during the stopping time.
     * @type FM.Vector
     * @private
     */
    this.positionBeforeStopping = new FM.Vector(0, 0);
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];
    /**
     * Physic component reference.
     * @type FM.PhysicComponent
     * @private
     */
    this.physic = pOwner.components[FM.ComponentTypes.PHYSIC];

    //Check if the needed components are present.
    if (FM.Parameters.debug) {
        if (!this.spatial) {
            console.log("ERROR: No spatial component was added and you need one for using the path component.");
        }
        if (!this.physic) {
            console.log("ERROR: No physic component was added and you need one for using the path component.");
        }
    }
};
/**
 * FM.SimplePathComponent inherits from FM.Component.
 */
FM.SimplePathComponent.prototype = Object.create(FM.Component.prototype);
FM.SimplePathComponent.prototype.constructor = FM.SimplePathComponent;
/**
 * Follow the specified path.
 * @method FM.SimplePathComponent#startFollowingPath
 * @memberOf FM.SimplePathComponent
 * @param {int} pSpeed Speed at which the game object must follow the path.
 * @param {int} pIndexToStartFrom The index at which the game object should start
 * following the path.
 */
FM.SimplePathComponent.prototype.startFollowingPath = function (pSpeed, pIndexToStartFrom) {
    "use strict";
    if (this.waypoints.length > 0) {
        this.active = true;
        this.currentIndex = pIndexToStartFrom || 0;
        this.xReached = false;
        this.yReached = false;
        this.desiredSpeed = pSpeed;
        //Adjust speed so that the movement is linear
        var xDiff =  Math.abs((this.spatial.position.x + this.physic.offset.x + this.physic.width / 2) - this.waypoints[this.currentIndex].x),
            yDiff =  Math.abs((this.spatial.position.y + this.physic.offset.y + this.physic.height / 2) - this.waypoints[this.currentIndex].y),
            coeff;
        if (xDiff < yDiff) {
            coeff = xDiff / yDiff;
            this.actualSpeed.x = this.desiredSpeed * coeff;
            this.actualSpeed.y = this.desiredSpeed;
        } else if (xDiff > yDiff) {
            coeff = yDiff / xDiff;
            this.actualSpeed.x = this.desiredSpeed;
            this.actualSpeed.y = this.desiredSpeed * coeff;
        } else {
            this.actualSpeed.x = this.desiredSpeed;
            this.actualSpeed.y = this.desiredSpeed;
        }
    } else if (FM.Parameters.debug) {
        console.log("WARNING: path with no waypoints defined.");
    }
    if (!this.physic) {
        console.log("WARNING: path added to a game object with no physic component.");
    }
};
/**
 * Continue following the current path where it had stopped.
 * @method FM.SimplePathComponent#resumeFollowingPath
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.resumeFollowingPath = function () {
    "use strict";
    if (this.waypoints.length > 0) {
        this.active = true;
        if (this.positionBeforeStopping.x !== this.spatial.position.x
                || this.positionBeforeStopping.y !== this.spatial.position.y) {
            this.xReached = false;
            this.yReached = false;
            //Adjust speed so that the movement is linear
            var xDiff =  Math.abs((this.spatial.position.x + this.physic.offset.x + this.physic.width / 2) - this.waypoints[this.currentIndex].x),
                yDiff =  Math.abs((this.spatial.position.y + this.physic.offset.y + this.physic.height / 2) - this.waypoints[this.currentIndex].y),
                coeff;
            if (xDiff < yDiff) {
                coeff = xDiff / yDiff;
                this.actualSpeed.x = this.desiredSpeed * coeff;
                this.actualSpeed.y = this.desiredSpeed;
            } else if (xDiff > yDiff) {
                coeff = yDiff / xDiff;
                this.actualSpeed.x = this.desiredSpeed;
                this.actualSpeed.y = this.desiredSpeed * coeff;
            } else {
                this.actualSpeed.x = this.desiredSpeed;
                this.actualSpeed.y = this.desiredSpeed;
            }
        }
    } else if (FM.Parameters.debug) {
        console.log("WARNING: path with no waypoints defined.");
    }
    if (!this.physic) {
        console.log("WARNING: path added to a game object with no physic component.");
    }
};
/**
 * Stop following the current path.
 * @method FM.SimplePathComponent#stopFollowingPath
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.stopFollowingPath = function () {
    "use strict";
    this.active = false;
    this.physic.velocity.x = 0;
    this.physic.velocity.y = 0;
    this.positionBeforeStopping = new FM.Vector(this.spatial.position.x, this.spatial.position.y);
};
/**
 * Erase every waypoints in the path.
 * @method FM.SimplePathComponent#clearPath
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.clearPath = function () {
    "use strict";
    this.waypoints = [];
};
/**
 * Update the component.
 * @method FM.SimplePathComponent#update
 * @memberOf FM.SimplePathComponent
 * @param {float} dt Fixed delta time in seconds since the last frame.
 */
FM.SimplePathComponent.prototype.update = function (dt) {
    "use strict";
    //Update the motion if the path is active
    if (this.active && this.physic) {
        //Update motion whether a physic component is present or not
        var xPos =  this.spatial.position.x + this.physic.offset.x + this.physic.width / 2,
            yPos =  this.spatial.position.y + this.physic.offset.y + this.physic.height / 2,
            xDiff,
            yDiff,
            coeff;
        //Update x position
        if (xPos < this.waypoints[this.currentIndex].x) {
            if (this.waypoints[this.currentIndex].x - xPos < this.actualSpeed.x * dt) {
                this.physic.velocity.x = this.waypoints[this.currentIndex].x - xPos;
                this.xReached = true;
            } else {
                this.physic.velocity.x = this.actualSpeed.x;
            }
        } else if (xPos > this.waypoints[this.currentIndex].x) {
            if (xPos - this.waypoints[this.currentIndex].x < this.actualSpeed.x * dt) {
                this.physic.velocity.x = xPos - this.waypoints[this.currentIndex].x;
                this.xReached = true;
            } else {
                this.physic.velocity.x = -this.actualSpeed.x;
            }
        } else {
            this.xReached = true;
            this.physic.velocity.x = 0;
        }
        //Update y position
        if (yPos < this.waypoints[this.currentIndex].y) {
            if (this.waypoints[this.currentIndex].y - yPos < this.actualSpeed.y * dt) {
                this.physic.velocity.y = this.waypoints[this.currentIndex].y - yPos;
                this.yReached = true;
            } else {
                this.physic.velocity.y = this.actualSpeed.y;
            }
        } else if (yPos > this.waypoints[this.currentIndex].y) {
            if (yPos - this.waypoints[this.currentIndex].y < this.actualSpeed.y * dt) {
                this.physic.velocity.y = yPos - this.waypoints[this.currentIndex].y;
                this.yReached = true;
            } else {
                this.physic.velocity.y = -this.actualSpeed.y;
            }
        } else {
            this.yReached = true;
            this.physic.velocity.y = 0;
        }
        //Select the next waypoint if the current has been reached
        if (this.xReached && this.yReached) {
            if (this.waypoints.length > this.currentIndex + 1) {
                //TODO call startfollowingpath ??
                this.xReached = false;
                this.yReached = false;
                this.currentIndex = this.currentIndex + 1;
                //Adjust speed so that the movement is linear
                xDiff =  Math.abs(xPos - this.waypoints[this.currentIndex].x);
                yDiff =  Math.abs(yPos - this.waypoints[this.currentIndex].y);
                if (xDiff < yDiff) {
                    coeff = xDiff / yDiff;
                    this.actualSpeed.x = this.desiredSpeed * coeff;
                    this.actualSpeed.y = this.desiredSpeed;
                } else if (xDiff > yDiff) {
                    coeff = yDiff / xDiff;
                    this.actualSpeed.x = this.desiredSpeed;
                    this.actualSpeed.y = this.desiredSpeed * coeff;
                } else {
                    this.actualSpeed.x = this.desiredSpeed;
                    this.actualSpeed.y = this.desiredSpeed;
                }
            } else {
                this.active = false;
                this.actualSpeed = new FM.Vector(0, 0);
                this.desiredSpeed = 0;
                this.physic.velocity = new FM.Vector(0, 0);
            }
        }
    }
};
/**
 * Add a waypoint to the path.
 * @method FM.SimplePathComponent#add
 * @memberOf FM.SimplePathComponent
 * @param {int} pX X position.
 * @param {int} pY Y position.
 * @param {int} index Optional index at which adding the waypoint.
 */
FM.SimplePathComponent.prototype.add = function (pX, pY, index) {
    "use strict";
    if (!index) {
        this.waypoints.push({x : pX, y : pY});
    } else {
        this.waypoints[index] = {x : pX, y : pY};
    }
};

/**
 * Remove a waypoint from the path.
 * @method FM.SimplePathComponent#remove
 * @memberOf FM.SimplePathComponent
 * @param {int} pIndex Index of the waypoint to remove.
 */
FM.SimplePathComponent.prototype.remove = function (pIndex) {
    "use strict";
    this.waypoints.splice(pIndex, 1);
};
/**
 * Return the waypoints of the path.
 * @method FM.SimplePathComponent#getWaypoints
 * @memberOf FM.SimplePathComponent
 * @return {Array} Waypoints of the path.
 */
FM.SimplePathComponent.prototype.getWaypoints = function () {
    "use strict";
    return this.waypoints;
};
/**
 * Return the current index of the waypoint to reach.
 * @method FM.SimplePathComponent#getCurrentIndex
 * @memberOf FM.SimplePathComponent
 * @return {int} Index of the waypoint to reach.
 */
FM.SimplePathComponent.prototype.getCurrentIndex = function () {
    "use strict";
    return this.currentIndex;
};
/**
 * Return the current waypoint to reach.
 * @method FM.SimplePathComponent#getCurrentWaypoint
 * @memberOf FM.SimplePathComponent
 * @return {Object} Waypoint to reach, a literal with a x and y property.
 */
FM.SimplePathComponent.prototype.getCurrentWaypoint = function () {
    "use strict";
    return this.waypoints[this.currentIndex];
};
/**
 * Return the number of waypoints.
 * @method FM.SimplePathComponent#getLength
 * @memberOf FM.SimplePathComponent
 * @return {int} Number of waypoints.
 */
FM.SimplePathComponent.prototype.getLength = function () {
    "use strict";
    return this.waypoints.length;
};
/**
 * Check if the last waypoint has been reached.
 * @method FM.SimplePathComponent#isLastWaypointReached
 * @memberOf FM.SimplePathComponent
 * @return {boolean} Whether the last waypoint has been reached or not.
 */
FM.SimplePathComponent.prototype.isLastWaypointReached = function () {
    "use strict";
    return this.currentIndex === this.waypoints.length - 1 && !this.active;
};
/**
 * Check if the path is being followed.
 * @method FM.SimplePathComponent#isActive
 * @memberOf FM.SimplePathComponent
 * @return {boolean} Whether the path is being followed.
 */
FM.SimplePathComponent.prototype.isActive = function () {
    "use strict";
    return this.active;
};
/**
 * Destroy the path.
 * @method FM.SimplePathComponent#destroy
 * @memberOf FM.SimplePathComponent
 */
FM.SimplePathComponent.prototype.destroy = function () {
    "use strict";
    this.waypoints = null;
    this.active = null;
    this.positionBeforeStopping.destroy();
    this.positionBeforeStopping = null;
    this.currentIndex = null;
    this.actualSpeed.destroy();
    this.actualSpeed = null;
    this.desiredSpeed = null;
    this.xReached = null;
    this.yReached = null;
    this.spatial = null;
    this.physic = null;
    FM.Component.prototype.destroy.call(this);
};
