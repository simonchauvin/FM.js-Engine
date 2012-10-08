/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {FMGameObject} The game object to which the component belongs.
 * @returns {FmCircleComponent} The circle component itself.
 */
function FMB2BoxComponent(pWidth, pHeight, pWorld, pOwner) {
    "use strict";
    /**
     * FmAabbComponent is based on FmComponent.
     */
    var that = FMComponent(FMComponentTypes.physic, pOwner),
	/**
	 * Box2D imports.
	 */
	b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	/**
	 * Box2D world.
	 */
	world = pWorld,
	/**
	 * Body of the box.
	 */
	body = null,
	/**
	 * Width of the box body.
	 */
	width = pWidth,
	/**
	 * Height of the box body.
	 */
	height = pHeight;

    /**
     * Spatial component reference.
     */
    that.spatial = pOwner.components[FMComponentTypes.spatial];

    /**
     * Initialization of the Box2D box body.
     */
    that.init = function (pType, pDensity, pFriction, pRestitution) {
	//Definition of the shape and its position
	var fixDef = new b2FixtureDef, bodyDef = new b2BodyDef;
	fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox((width / 2) / FMParameters.PIXELS_TO_METRE, (height / 2) / FMParameters.PIXELS_TO_METRE);
	bodyDef.position.x = that.spatial.x / FMParameters.PIXELS_TO_METRE +(width / 2) / FMParameters.PIXELS_TO_METRE;
	bodyDef.position.y = that.spatial.y / FMParameters.PIXELS_TO_METRE + (height / 2) / FMParameters.PIXELS_TO_METRE;
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
     * Post initialization.
     */
    that.postInit = function () {
	
    };

    /**
     * Pre update taking place before the main update.
     */
    that.preUpdate = function () {
	
    };

    /**
     * Update the component.
     */
    that.update = function (game) {
        //Retrieve components
	that.spatial = pOwner.components[FMComponentTypes.spatial];

	//Update spatial component based on the body's position
	that.spatial.x = body.GetPosition().x * FMParameters.PIXELS_TO_METRE - width / 2;
	that.spatial.y = body.GetPosition().y * FMParameters.PIXELS_TO_METRE - height / 2;
    };

    /**
     * Post update taking place after the main update.
     */
    that.postUpdate = function () {
	
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(that.spatial.x - bufferContext.xOffset, that.spatial.y - bufferContext.yOffset, width, height);
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
     * Get the velocity of the Box2D box body.
     */
    that.getLinearVelocity = function () {
        var linearVelocity = body.GetLinearVelocity();
	return FMVector(linearVelocity.x * FMParameters.PIXELS_TO_METRE, linearVelocity.y * FMParameters.PIXELS_TO_METRE);
    };

    /**
     * Set the velocity of the Box2D box body.
     */
    that.setLinearVelocity = function (pLinearVelocity) {
	body.SetAwake(true);
        body.SetLinearVelocity(new b2Vec2(pLinearVelocity.x / FMParameters.PIXELS_TO_METRE, pLinearVelocity.y / FMParameters.PIXELS_TO_METRE));
    };

    /**
     * Get the angular velocity of the Box2D box body.
     */
    that.getAngularVelocity = function () {
        return body.GetAngularVelocity();
    };

    /**
     * Set the angular velocity of the Box2D box body.
     */
    that.setAngularVelocity = function (pAngularVelocity) {
	body.SetAwake(true);
        body.SetAngularVelocity(pAngularVelocity);
    };

    /**
     * Retrieve the width of the body.
     */
    that.getWidth = function () {
        return width;
    };

    /**
     * Retrieve the height of the body.
     */
    that.getHeight = function () {
        return height;
    };

    return that;
}