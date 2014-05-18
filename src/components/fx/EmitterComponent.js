/*global FM*/
/**
 * The emitter component is used for the emission of particles.
 * @class FM.EmitterComponent
 * @extends FM.Component
 * @param {FM.Vector} pOffset The vector specifying the offset from the upper 
 * left corner of the game object at which the particles should spawn.
 * @param {FM.GameObject} pOwner The game object that owns this component.
 * @constructor
 * @author Simon Chauvin
 */
FM.EmitterComponent = function (pOffset, pOwner) {
    "use strict";
    //Calling the constructor of FM.Component
    FM.Component.call(this, FM.ComponentTypes.FX, pOwner);
    /**
     * Particles belonging to this emitter.
     * @type Array
     * @private
     */
    this.particles = [];
    /**
     * Offset from the owner.
     * @type FM.Vector
     * @private
     */
    this.offset = pOffset;
    /**
     * Directions the particles can take.
     * @type Array
     * @private
     */
    this.directions = [FM.Parameters.LEFT, FM.Parameters.RIGHT, FM.Parameters.UP, FM.Parameters.DOWN];
    /**
     * Limit of particles that this emitter can bear.
     * 0 means an infinite number.
     * @type int
     * @private
     */
    this.maxParticles = 0;
    /**
     * Frequency of particle emission.
     * @type float
     * @private
     */
    this.frequency = 0.1;
    /**
     * Quantity of particles to emit.
     * @type int
     * @private
     */
    this.quantity = 0;
    /**
     * Transparency of the particles.
     * @type float
     * @private
     */
    this.alpha = 1;
    /**
     * Minimum velocity of all particles.
     * @type FM.Vector
     * @private
     */
    this.minParticleVelocity = new FM.Vector(-100, -100);
    /**
     * Maximum velocity of all particles.
     * @type FM.Vector
     * @private
     */
    this.maxParticleVelocity = new FM.Vector(100, 100);
    /**
     * Minimum angular velocity of all particles.
     * @type int
     * @private
     */
    this.minParticleAngularVelocity = -100;
    /**
     * Maximum angular velocity of all particles.
     * @type int
     * @private
     */
    this.maxParticleAngularVelocity = 100;
    /**
     * Whether the emitter is active or not.
     * @type boolean
     * @private
     */
    this.active = false;
    /**
     * Timer for the emission at the right frequency.
     * @type float
     * @private
     */
    this.timer = 0;
    /**
     * Spatial component reference.
     * @type FM.SpatialComponent
     * @private
     */
    this.spatial = pOwner.components[FM.ComponentTypes.SPATIAL];

    //Check if a spatial component is present.
    if (!this.spatial && FM.Parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
};
/**
 * FM.EmitterComponent inherits from FM.Component.
 */
FM.EmitterComponent.prototype = Object.create(FM.Component.prototype);
FM.EmitterComponent.prototype.constructor = FM.EmitterComponent;
/**
 * Add a particle to this emitter.
 * @method FM.EmitterComponent#add
 * @memberOf FM.EmitterComponent
 * @param {FM.GameObject} pParticle Particle to add to the emitter.
 * @return {FM.GameObject} The particle added.
 */
FM.EmitterComponent.prototype.add = function (pParticle) {
    "use strict";
    this.particles.push(pParticle);
    return pParticle;
};
/**
 * Add particles to this emitter.
 * @method FM.EmitterComponent#createParticles
 * @memberOf FM.EmitterComponent
 * @param {int} pNumber Number of particles to create.
 * @param {FM.ImageAsset} pImage Image to use as a particle.
 * @param {int} pWidth Width of the particles.
 * @param {int} pHeight Height of the particles.
 * @param {float} pAlpha Transparency of the particles.
 * @param {int} pZIndex Z depth of the particles.
 */
FM.EmitterComponent.prototype.createParticles = function (pNumber, pImage, pWidth, pHeight, pAlpha, pZIndex) {
    "use strict";
    var i, particle, renderer,
        state = FM.Game.getCurrentState();
    this.alpha = pAlpha;
    for (i = 0; i < pNumber; i = i + 1) {
        particle = new FM.GameObject(pZIndex);
        particle.addComponent(new FM.SpatialComponent(this.spatial.position.x + this.offset.x, this.spatial.position.y + this.offset.y, particle));
        renderer = particle.addComponent(new FM.SpriteRendererComponent(pImage, pWidth, pHeight, particle));
        renderer.setAlpha(this.alpha);
        particle.addComponent(new FM.AabbComponent(pWidth, pHeight, particle));
        particle.age = 0;
        particle.lifeSpan = 0;
        particle.hide();
        particle.kill();
        state.add(particle);
        this.particles.push(particle);
    }
};
/**
 * Start emitting particles.
 * @method FM.EmitterComponent#emit
 * @memberOf FM.EmitterComponent
 * @param {float} pLifeSpan Time to live for each particle.
 * @param {float} pFrequency Time between each emission (-1 for only one 
 * emission).
 * @param {int} pQuantity Number of particles to emit at each emission.
 */
FM.EmitterComponent.prototype.emit = function (pLifeSpan, pFrequency, pQuantity) {
    "use strict";
    this.active = true;
    this.timer = 0;
    this.frequency = pFrequency;
    this.quantity = pQuantity;
    var i;
    for (i = 0; i < this.particles.length; i = i + 1) {
        this.particles[i].lifeSpan = pLifeSpan;
    }
};
/**
 * Update the component.
 * @method FM.EmitterComponent#update
 * @memberOf FM.EmitterComponent
 * @param {float} dt Fixed delta time in seconds since the last frame.
 */
FM.EmitterComponent.prototype.update = function (dt) {
    "use strict";
    if (this.active) {
        //Update alive particles
        var i, j, count, particle, particleSpatial, physic, renderer, speed;
        for (i = 0; i < this.particles.length; i = i + 1) {
            particle = this.particles[i];
            if (particle.isAlive()) {
                //Check the age of the particle
                if (particle.age >= particle.lifeSpan) {
                    particle.hide();
                    particle.kill();
                } else {
                    //The more the particle is aging the less it is visible
                    renderer = particle.getComponent(FM.ComponentTypes.RENDERER);
                    if (renderer.getAlpha() >= 1 - (particle.age / particle.lifeSpan)) {
                        renderer.setAlpha(1 - (particle.age / particle.lifeSpan));
                    }
                    //Aging of the particle
                    particle.age += dt;
                }
            }
        }
        //Emit new particles
        this.timer += dt;
        if (this.frequency !== -2 && (this.frequency === 0 || this.timer >= this.frequency)) {
            if (this.frequency === -1) {
                this.frequency = -2;
            }
            this.timer = 0;
            count = 0;
            j = 0;
            //Emit the number of particles given by quantity
            while (count < this.quantity && j < this.particles.length) {
                particle = this.particles[j];
                //Reinit the particle
                if (particle && !particle.isAlive()) {
                    particleSpatial = particle.getComponent(FM.ComponentTypes.SPATIAL);
                    physic = particle.components[FM.ComponentTypes.PHYSIC];
                    particle.components[FM.ComponentTypes.RENDERER].setAlpha(this.alpha);
                    particleSpatial.position.x = this.spatial.position.x + this.offset.x;
                    particleSpatial.position.y = this.spatial.position.y + this.offset.y;
                    particle.age = 0;
                    speed = Math.random() * (this.maxParticleVelocity.x - this.minParticleVelocity.x) + this.minParticleVelocity.x;
                    if (this.directions.indexOf(FM.Parameters.LEFT) !== -1) {
                        if (Math.random() > 0.5) {
                            speed = -speed;
                        }
                    }
                    physic.velocity.x = speed;
                    speed = Math.random() * (this.maxParticleVelocity.y - this.minParticleVelocity.y) + this.minParticleVelocity.y;
                    if (this.directions.indexOf(FM.Parameters.UP) !== -1) {
                        if (Math.random() > 0.5) {
                            speed = -speed;
                        }
                    }
                    physic.velocity.y = speed;
                    speed = Math.random() * (this.maxParticleAngularVelocity - this.minParticleAngularVelocity) + this.minParticleAngularVelocity;
                    physic.angularVelocity = speed;
                    particle.show();
                    particle.revive();
                    count = count + 1;
                }
                j = j + 1;
            }
        }
    }
};
/**
 * Set the directions the particles can take.
 * @method FM.EmitterComponent#setDirections
 * @memberOf FM.EmitterComponent
 * @param {Array} pDirections Directions the particles can take.
 */
FM.EmitterComponent.prototype.setDirections = function (pDirections) {
    "use strict";
    this.directions = pDirections;
};
/**
 * Set the transparency of the particles.
 * @method FM.EmitterComponent#setAlpha
 * @memberOf FM.EmitterComponent
 * @param {float} pAlpha Transparency of the particles.
 */
FM.EmitterComponent.prototype.setAlpha = function (pAlpha) {
    "use strict";
    this.alpha = pAlpha;
    var i;
    for (i = 0; i < this.particles.length; i = i + 1) {
        this.particles[i].components[FM.ComponentTypes.RENDERER].setAlpha(this.alpha);
    }
};
/**
 * Set the horizontal velocity of all particles.
 * @method FM.EmitterComponent#setXVelocity
 * @memberOf FM.EmitterComponent
 * @param {int} pMin Minimum horizontal velocity of a particle.
 * @param {int} pMax Maximum horizontal velocity of a particle.
 */
FM.EmitterComponent.prototype.setXVelocity = function (pMin, pMax) {
    "use strict";
    this.minParticleVelocity.x = pMin;
    this.maxParticleVelocity.x = pMax;
};
/**
 * Set the vertical velocity of all particles.
 * @method FM.EmitterComponent#setYVelocity
 * @memberOf FM.EmitterComponent
 * @param {int} pMin Minimum vertical velocity of a particle.
 * @param {int} pMax Maximum vertical velocity of a particle.
 */
FM.EmitterComponent.prototype.setYVelocity = function (pMin, pMax) {
    "use strict";
    this.minParticleVelocity.y = pMin;
    this.maxParticleVelocity.y = pMax;
};
/**
 * Set the rotation's speed of all particles.
 * @method FM.EmitterComponent#setAngularVelocity
 * @memberOf FM.EmitterComponent
 * @param {int} pMin Minimum angular velocity of a particle.
 * @param {int} pMax Maximum angular velocity of a particle.
 */
FM.EmitterComponent.prototype.setAngularVelocity = function (pMin, pMax) {
    "use strict";
    this.minParticleAngularVelocity = pMin;
    this.maxParticleAngularVelocity = pMax;
};
/**
 * Retrieve the transparency of the particles.
 * @method FM.EmitterComponent#getAlpha
 * @memberOf FM.EmitterComponent
 * @return {float} Current transparency of the particles.
 */
FM.EmitterComponent.prototype.getAlpha = function () {
    "use strict";
    return this.alpha;
};
/**
 * Destroy the emitter component.
 * @method FM.EmitterComponent#destroy
 * @memberOf FM.EmitterComponent
 */
FM.EmitterComponent.prototype.destroy = function () {
    "use strict";
    this.particles = null;
    this.active = null;
    this.alpha = null;
    this.directions = null;
    this.frequency = null;
    this.timer = null;
    this.quantity = null;
    this.maxParticleAngularVelocity = null;
    this.minParticleAngularVelocity = null;
    this.maxParticles = null;
    this.offset = null;
    this.minParticleVelocity.destroy();
    this.minParticleVelocity = null;
    this.maxParticleVelocity.destroy();
    this.maxParticleVelocity = null;
    this.spatial = null;
    FM.Component.prototype.destroy.call(this);
};
