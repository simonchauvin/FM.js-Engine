/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {FMGameObject} The game object to which the component belongs.
 * @returns {FmCircleComponent} The circle component itself.
 */
function FMB2CircleComponent(pRadius, pWorld, pOwner) {
    "use strict";
    /**
     * FmCircleComponent is based on FmComponent.
     */
    var that = FMComponent(FMComponentTypes.physic, pOwner),
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
	radius = pRadius;

    /**
     * Spatial component reference.
     */
    that.spatial = pOwner.components[FMComponentTypes.spatial];

    /**
     * Initialization of the Box2D circle body.
     */
    that.init = function (pType, pDensity, pFriction, pRestitution) {
	//Definition of the shape and its position
	var fixDef = new b2FixtureDef, bodyDef = new b2BodyDef;
	fixDef.shape = new b2CircleShape(radius / FMParameters.PIXELS_TO_METRE);
	bodyDef.position.x = that.spatial.x / FMParameters.PIXELS_TO_METRE;
	bodyDef.position.y = that.spatial.y / FMParameters.PIXELS_TO_METRE;
	//Type of body
	switch (pType) {
	    case FMParameters.STATIC:
		bodyDef.type = b2Body.b2_staticBody;
		break;
	    case FMParameters.KINEMATIC:
		bodyDef.type = b2Body.b2_kinematicBody;
		break;
	    case FMParameters.DYNAMIC:
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
     * Post initialization
     */
    that.postInit = function () {
        
    };

    /**
     * Update the component
     */
    that.update = function (game) {
        //Retrieve components
        that.spatial = pOwner.components[FMComponentTypes.spatial];

	//Update spatial component based on the body's position
	that.spatial.x = body.GetPosition().x * FMParameters.PIXELS_TO_METRE - radius;
	that.spatial.y = body.GetPosition().y * FMParameters.PIXELS_TO_METRE - radius;
    };

    /**
     * Draw debug information
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.beginPath();
        bufferContext.strokeStyle = "#f4f";
        bufferContext.arc((that.spatial.x + radius) - bufferContext.xOffset, (that.spatial.y + radius) - bufferContext.yOffset, radius, 0, 2 * Math.PI, false);
        bufferContext.stroke();
    };

    /**
     * Apply a certain force to a point.
     */
    that.applyForce = function (pForce, pPoint) {
	body.ApplyForce(new b2Vec2(pForce.x, pForce.y), new b2Vec2(pPoint.x, pPoint.y));
    };

    /**
     * Apply a certain impulse to a point.
     */
    that.applyImpulse = function (pImpulse, pPoint) {
	body.ApplyImpulse(new b2Vec2(pImpulse.x, pImpulse.y), new b2Vec2(pPoint.x, pPoint.y));
    };

    /**
     * Get the linear velocity of the Box2D circle body.
     */
    that.getLinearVelocity = function () {
        var linearVelocity = body.GetLinearVelocity();
        return FMVector(linearVelocity.x * FMParameters.PIXELS_TO_METRE, linearVelocity.y * FMParameters.PIXELS_TO_METRE);
    };

    /**
     * Set the linear velocity of the Box2D circle body.
     */
    that.setLinearVelocity = function (pLinearVelocity) {
	body.SetAwake(true);
        body.SetLinearVelocity(new b2Vec2(pLinearVelocity.x / FMParameters.PIXELS_TO_METRE, pLinearVelocity.y / FMParameters.PIXELS_TO_METRE));
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