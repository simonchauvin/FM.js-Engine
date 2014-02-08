/*global FM*/
/**
 * List of constants of the FM.js engine.
 * @class FM.Parameters
 * @static
 * @readonly
 * @author Simon Chauvin
 */
FM.Parameters = {
    /**
     * FPS at which the game is running.
     * @type Number
     */
    FPS: 60.0,
    /**
     * Debug mode.
     * @type Boolean
     */
    debug: false,
    /**
     * Minimum width and height of a collider, must be equal to the minimum
     * width a tile can have.
     * @type Number
     */
    COLLIDER_MINIMUM_SIZE: 16,
    /**
     * Box2D body type.
     * @type String
     */
    STATIC: "static",
    /**
     * Box2D body type.
     * @type String
     */
    KINEMATIC: "kinematic",
    /**
     * Box2D body type.
     * @type String
     */
    DYNAMIC: "dynamic",
    /**
     * Used for Box2D conversion.
     * @type Number
     */
    PIXELS_TO_METERS: 30,
    /**
     * Identify an image asset.
     * @type String
     */
    IMAGE: "image",
    /**
     * Identify an audio asset.
     * @type String
     */
    AUDIO: "audio",
    /**
     * Identify a file asset.
     * @type String
     */
    FILE: "file",
    /**
     * Identify the left.
     * @type String
     */
    LEFT: "left",
    /**
     * Identify the right.
     * @type String
     */
    RIGHT: "right",
    /**
     * Identify the up.
     * @type String
     */
    UP: "up",
    /**
     * Identify the down.
     * @type String
     */
    DOWN: "down"
};
