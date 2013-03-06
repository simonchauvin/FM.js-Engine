/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmCircleComponent} The circle component itself.
 */
FMENGINE.fmB2BoxComponent = function (pWidth, pHeight, pWorld, pOwner) {
    "use strict";
    /**
     * fmB2BoxComponent is based on fmComponent.
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
	height = pHeight,
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[componentTypes.SPATIAL];

    /**
     * Initialization of the Box2D box body.
     */
    that.init = function (pType, pDensity, pFriction, pRestitution) {
	//Definition of the shape and its position
	var fixDef = new b2FixtureDef, bodyDef = new b2BodyDef;
	fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox((width / 2) / parameters.PIXELS_TO_METERS, (height / 2) / parameters.PIXELS_TO_METERS);
	bodyDef.position.x = spatial.x / parameters.PIXELS_TO_METERS +(width / 2) / parameters.PIXELS_TO_METERS;
	bodyDef.position.y = spatial.y / parameters.PIXELS_TO_METERS + (height / 2) / parameters.PIXELS_TO_METERS;
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
     * Pre update taking place before the main update.
     */
    that.preUpdate = function () {
	
    };

    /**
     * Update the component.
     */
    that.update = function () {
        //Retrieve components
	spatial = pOwner.components[componentTypes.SPATIAL];

	//If the body is not static
	if (body.m_type != b2Body.b2_staticBody) {
	    //Update spatial component based on the body's position
	    spatial.x = body.GetPosition().x * parameters.PIXELS_TO_METERS - width / 2;
	    spatial.y = body.GetPosition().y * parameters.PIXELS_TO_METERS - height / 2;
	    spatial.angle = body.GetAngle();
	} else {
	    //Otherwise the body's position based on the spatial component
	    body.SetPosition(new b2Vec2((spatial.x + width / 2) / parameters.PIXELS_TO_METERS, (spatial.y + height / 2) / parameters.PIXELS_TO_METERS));
	    body.SetAngle(spatial.angle);
	}
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
        bufferContext.strokeRect(spatial.x - bufferContext.xOffset, spatial.y - bufferContext.yOffset, width, height);
    };

    /**
    * Destroy the component and its objects
    */
    that.destroy = function() {
        b2Vec2 = null;
	b2FixtureDef = null;
	b2BodyDef = null;
	b2Body = null;
	b2PolygonShape = null;
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
     * Get the velocity of the Box2D box body.
     */
    that.getLinearVelocity = function () {
        var linearVelocity = body.GetLinearVelocity();
	return FMPoint(linearVelocity.x * parameters.PIXELS_TO_METERS, linearVelocity.y * parameters.PIXELS_TO_METERS);
    };

    /**
     * Set the velocity of the Box2D box body.
     */
    that.setLinearVelocity = function (pLinearVelocity) {
	body.SetAwake(true);
        body.SetLinearVelocity(new b2Vec2(pLinearVelocity.x / parameters.PIXELS_TO_METERS, pLinearVelocity.y / parameters.PIXELS_TO_METERS));
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
     * Get the angular damping of the Box2D box body.
     */
    that.getAngularDamping = function () {
        return body.GetAngularDamping();
    };

    /**
     * Set the angular damping of the Box2D box body.
     */
    that.setAngularDamping = function (pAngularDamping) {
	body.SetAwake(true);
        body.SetAngularDamping(pAngularDamping);
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