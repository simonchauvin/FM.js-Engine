/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmCircleComponent} The circle component itself.
 */
FMENGINE.fmB2CircleComponent = function (pRadius, pWorld, pOwner) {
    "use strict";
    /**
     * fmB2CircleComponent is based on fmComponent.
     */
    var that = FMENGINE.fmComponent(FMENGINE.fmComponentTypes.PHYSIC, pOwner),
        /**
         * Imports.
         */
         parameters = FMENGINE.fmParameters,
         componentTypes = FMENGINE.fmComponentTypes,
	/**
	 * Box2D imports.
	 */
	b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	/**
	 * Box2D world.
	 */
	world = pWorld,
	/**
	 * Body of the circle.
	 */
	body = null,
	/**
	 * Radius of the circle body.
	 */
	radius = pRadius,
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[componentTypes.SPATIAL];

    /**
     * Initialization of the Box2D circle body.
     */
    that.init = function (pType, pDensity, pFriction, pRestitution) {
	//Definition of the shape and its position
	var fixDef = new b2FixtureDef, bodyDef = new b2BodyDef;
	fixDef.shape = new b2CircleShape(radius / parameters.PIXELS_TO_METERS);
	bodyDef.position.x = spatial.x / parameters.PIXELS_TO_METERS;
	bodyDef.position.y = spatial.y / parameters.PIXELS_TO_METERS;
	bodyDef.angle = spatial.angle;
	//Type of body
	switch (pType) {
	    case parameters.STATIC:
		bodyDef.type = b2Body.b2_staticBody;
		break;
	    case parameters.KINEMATIC:
		bodyDef.type = b2Body.b2_kinematicBody;
		break;
	    case parameters.DYNAMIC:
		bodyDef.type = b2Body.b2_dynamicBody;
		break;
	    default:
		bodyDef.type = b2Body.b2_staticBody;
	}
	//Fixture behaviour
	fixDef.density = pDensity;
	fixDef.friction = pFriction;
	fixDef.restitution = pRestitution;
	//Add body to the world of Box2D
	body = world.box2DWorld.CreateBody(bodyDef);
	body.CreateFixture(fixDef);
    };

    /**
     * Update the component
     */
    that.update = function (dt) {
        //Retrieve components
        spatial = pOwner.components[componentTypes.SPATIAL];

        //If the body is not static
	if (body.m_type !== b2Body.b2_staticBody) {
	    //Update spatial component based on the body's position
	    spatial.x = body.GetPosition().x * parameters.PIXELS_TO_METERS - radius;
            spatial.y = body.GetPosition().y * parameters.PIXELS_TO_METERS - radius;
            spatial.angle = body.GetAngle();
	} else {
	    //Otherwise the body's position based on the spatial component
	    body.SetPosition(new b2Vec2((spatial.x + radius / 2) / parameters.PIXELS_TO_METERS, (spatial.y + radius / 2) / parameters.PIXELS_TO_METERS));
	    body.SetAngle(spatial.angle);
	}
    };

    /**
     * Draw debug information
     */
    that.drawDebug = function (bufferContext) {
        //Draw the circle
        bufferContext.beginPath();
        bufferContext.strokeStyle = "#f4f";
        bufferContext.arc((spatial.x + radius) - bufferContext.xOffset, (spatial.y + radius) - bufferContext.yOffset, radius, 0, 2 * Math.PI, false);
        bufferContext.stroke();

        //Rotate the line
        bufferContext.save();
        bufferContext.translate(spatial.x + radius - bufferContext.xOffset, spatial.y + radius - bufferContext.yOffset);
        bufferContext.rotate(spatial.angle);
        bufferContext.translate(-(spatial.x + radius - bufferContext.xOffset), -(spatial.y + radius - bufferContext.yOffset));

        //Draw the line
        bufferContext.beginPath();
        bufferContext.strokeStyle = "#f4f";
        bufferContext.moveTo(spatial.x + radius - bufferContext.xOffset, spatial.y + radius - bufferContext.yOffset);
        bufferContext.lineTo(spatial.x - bufferContext.xOffset, spatial.y - bufferContext.yOffset);
        bufferContext.stroke();
        bufferContext.restore();
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function() {
        b2Vec2 = null;
	b2FixtureDef = null;
	b2BodyDef = null;
	b2Body = null;
	b2CircleShape = null;
        world = null;
        body = null;
        spatial = null;
        that.destroy();
        that = null;
    };

    /**
     * Apply a certain force to a point.
     */
    that.applyForce = function (pForce, pPoint) {
	body.ApplyForce(new b2Vec2(pForce.x / parameters.PIXELS_TO_METERS, pForce.y / parameters.PIXELS_TO_METERS), new b2Vec2(pPoint.x / parameters.PIXELS_TO_METERS, pPoint.y / parameters.PIXELS_TO_METERS));
    };

    /**
     * Apply a certain impulse to a point.
     */
    that.applyImpulse = function (pImpulse, pPoint) {
	body.ApplyImpulse(new b2Vec2(pImpulse.x / parameters.PIXELS_TO_METERS, pImpulse.y / parameters.PIXELS_TO_METERS), new b2Vec2(pPoint.x / parameters.PIXELS_TO_METERS, pPoint.y / parameters.PIXELS_TO_METERS));
    };

    /**
     * Get the linear velocity of the Box2D circle body.
     */
    that.getLinearVelocity = function () {
        var linearVelocity = body.GetLinearVelocity();
        return FMENGINE.fmPoint(linearVelocity.x * parameters.PIXELS_TO_METERS, linearVelocity.y * parameters.PIXELS_TO_METERS);
    };

    /**
     * Set the linear velocity of the Box2D circle body.
     */
    that.setLinearVelocity = function (pLinearVelocity) {
        //Imports
        var param = FMENGINE.fmParameters;
	body.SetAwake(true);
        body.SetLinearVelocity(new b2Vec2(pLinearVelocity.x / parameters.PIXELS_TO_METERS, pLinearVelocity.y / parameters.PIXELS_TO_METERS));
    };

    /**
     * Get the angular velocity of the Box2D circle body.
     */
    that.getAngularVelocity = function () {
        return body.GetAngularVelocity();
    };

    /**
     * Set the angular velocity of the Box2D circle body.
     */
    that.setAngularVelocity = function (pAngularVelocity) {
	body.SetAwake(true);
        body.SetAngularVelocity(pAngularVelocity);
    };

    /**
     * Get the angular damping of the Box2D circle body.
     */
    that.getAngularDamping = function () {
        return body.GetAngularDamping();
    };

    /**
     * Set the angular damping of the Box2D circle body.
     */
    that.setAngularDamping = function (pAngularDamping) {
	body.SetAwake(true);
        body.SetAngularDamping(pAngularDamping);
    };

    /**
     * Retrieve the radius of the Box2D circle body.
     */
    that.getRadius = function () {
        return radius;
    };

    /**
     * Retrieve the width of the Box2D circle body.
     */
    that.getWidth = function () {
        return radius * 2;
    };

    /**
     * Retrieve the height of the Box2D circle body.
     */
    that.getHeight = function () {
        return radius * 2;
    };

    return that;
}