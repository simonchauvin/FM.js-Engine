/**
 * The emitter component is used for the emission of particles. 
 * object.
 * @class emitterComponent
 * @author Simon Chauvin
 */
FM.emitterComponent = function (pOffset, pOwner) {
    "use strict";
    var that = FM.component(FM.componentTypes.FX, pOwner),
        /**
         * Particles belonging to this emitter.
         */
        particles = [],
        /**
         * Offset from the owner.
         */
        offset = pOffset,
        /**
         * Directions the particles can take.
         */
        directions = [FM.parameters.LEFT, FM.parameters.RIGHT, FM.parameters.UP, FM.parameters.DOWN],
        /**
         * Limit of particles that this emitter can bear.
         * 0 means an infinite number.
         */
        maxParticles = 0,
        /**
         * Frequency of particle emission.
         */
        frequency = 0.1,
        /**
         * Quantity of particles to emit.
         */
        quantity = 0,
        /**
         * Transparency of the particles.
         */
        alpha = 1,
        /**
         * Minimum velocity of all particles.
         */
        minParticleVelocity = FM.vector(-100, -100),
        /**
         * Maximum velocity of all particles.
         */
        maxParticleVelocity = FM.vector(100, 100),
        /**
         * Minimum angular velocity of all particles.
         */
        minParticleAngularVelocity = -100,
        /**
         * Maximum angular velocity of all particles.
         */
        maxParticleAngularVelocity = 100,
        /**
         * Whether the emitter is active or not.
         */
        active = false,
        /**
         * Timer for the emission at the right frequency.
         */
        timer = 0,
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FM.componentTypes.SPATIAL];
    /**
     * Check if a spatial component is present.
     */
    if (!spatial && FM.parameters.debug) {
        console.log("ERROR: No spatial component was added and you need one for rendering.");
    }
    /**
     * Add the component to the game object.
     */
    pOwner.addComponent(that);

    /**
     * Add a particle to this emitter.
     * @param {fmParticle} particle particle to add to the emitter.
     * @return {fmParticle} the particle added.
     */
    that.add = function (particle) {
        particles.push(particle);
        return particle;
    };

    /**
     * Add particles to this emitter.
     * @param {int} number number of particles to create.
     * @param {imageAsset} image image to use as a particle.
     * @param {int} width width of the particles.
     * @param {int} height height of the particles.
     * @param {float} pAlpha transparency of the particles.
     * @param {int} zIndex z depth of the particles.
     */
    that.createParticles = function (number, image, width, height, pAlpha, zIndex) {
        var i, particle, spatial, renderer, physic,
            state = FM.game.getCurrentState();
        alpha = pAlpha;
        for (i = 0; i < number; i = i + 1) {
            particle = FM.gameObject(zIndex);
            spatial = FM.spatialComponent(spatial.position.x + offset.x, spatial.position.y + offset.y, particle);
            renderer = FM.spriteRendererComponent(image, width, height, particle);
            renderer.setAlpha(alpha);
            physic = FM.aabbComponent(width, height, particle);
            particle.age = 0;
            particle.lifeSpan = 0;
            particle.hide();
            particle.kill();
            state.add(particle);
            particles.push(particle);
        }
    };

    /**
     * Start emitting particles.
     * @param {float} lifeSpan time to live for each particle
     * @param {float} pFrequency time between each emission
     * @param {int} pQuantity number of particles to emit at each emission
     */
    that.emit = function (lifeSpan, pFrequency, pQuantity) {
        active = true;
        timer = 0;
        frequency = pFrequency;
        quantity = pQuantity;
        var i;
        for (i = 0; i < particles.length; i = i + 1) {
            particles[i].lifeSpan = lifeSpan;
        }
    };

    /**
     * Update the component.
     * * @param {float} dt time in seconds since the last frame.
     */
    that.update = function (dt) {
        if (active) {
            //Update alive particles
            var i, j, count, particle, particleSpatial, physic, renderer, speed;
            for (i = 0; i < particles.length; i = i + 1) {
                particle = particles[i];
                if (particle.isAlive()) {
                    //Check the age of the particle
                    if (particle.age >= particle.lifeSpan) {
                        particle.hide();
                        particle.kill();
                    } else {
                        //The more the particle is aging the less it is visible
                        renderer = particle.getComponent(FM.componentTypes.RENDERER);
                        if (renderer.getAlpha() >= 1 - (particle.age / particle.lifeSpan)) {
                            renderer.setAlpha(1 - (particle.age / particle.lifeSpan));
                        }
                        //Aging of the particle
                        particle.age += dt;
                    }
                }
            }
            //Emit new particles
            timer += dt;
            if (frequency === 0 || timer >= frequency) {
                timer = 0;
                count = 0;
                j = 0;
                //Emit the number of particles given by quantity
                while (count < quantity && j < particles.length) {
                    particle = particles[j];
                    //Reinit the particle
                    if (particle && !particle.isAlive()) {
                        particleSpatial = particle.getComponent(FM.componentTypes.SPATIAL);
                        physic = particle.components[FM.componentTypes.PHYSIC];
                        particle.components[FM.componentTypes.RENDERER].setAlpha(alpha);
                        particleSpatial.position.x = spatial.position.x + offset.x;
                        particleSpatial.position.y = spatial.position.y + offset.y;
                        particle.age = 0;
                        speed = Math.random() * (maxParticleVelocity.x - minParticleVelocity.x) + minParticleVelocity.x;
                        if (directions.indexOf(FM.parameters.LEFT) !== -1) {
                            if (Math.random() > 0.5) {
                                speed = -speed;
                            }
                        }
                        physic.velocity.x = speed;
                        speed = Math.random() * (maxParticleVelocity.y - minParticleVelocity.y) + minParticleVelocity.y;
                        if (directions.indexOf(FM.parameters.UP) !== -1) {
                            if (Math.random() > 0.5) {
                                speed = -speed;
                            }
                        }
                        physic.velocity.y = speed;
                        speed = Math.random() * (maxParticleAngularVelocity - minParticleAngularVelocity) + minParticleAngularVelocity;
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
     * @param {Array} pDirections directions the particles can take.
     */
    that.setDirections = function (pDirections) {
        directions = pDirections;
    };

    /**
     * Set the transparency of the particles.
     * @param {float} pAlpha transparency of the particles.
     */
    that.setAlpha = function (pAlpha) {
        alpha = pAlpha;
        var i;
        for (i = 0; i < particles.length; i = i + 1) {
            particles[i].components[FM.componentTypes.RENDERER].setAlpha(alpha);
        }
    };

    /**
     * Set the horizontal velocity of all particles.
     * @param {int} min minimum horizontal velocity of a particle.
     * @param {int} max maximum horizontal velocity of a particle.
     */
    that.setXVelocity = function (min, max) {
        minParticleVelocity.x = min;
        maxParticleVelocity.x = max;
    };

    /**
     * Set the vertical velocity of all particles.
     * @param {int} min minimum vertical velocity of a particle.
     * @param {int} max maximum vertical velocity of a particle.
     */
    that.setYVelocity = function (min, max) {
        minParticleVelocity.y = min;
        maxParticleVelocity.y = max;
    };

    /**
     * Set the rotation's speed of all particles.
     * @param {int} min minimum angular velocity of a particle.
     * @param {int} max maximum angular velocity of a particle.
     */
    that.setAngularVelocity = function (min, max) {
        minParticleAngularVelocity = min;
        maxParticleAngularVelocity = max;
    };

    /**
     * Retrieve the transparency of the particles.
     * @returns {float} current transparency of the particles.
     */
    that.getAlpha = function () {
        return alpha;
    };

    /**
     * Destroy the emitter component.
     */
    that.destroy = function () {
        particles = null;
        that = null;
    };

    return that;
};
