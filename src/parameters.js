/**
 * Under Creative Commons Licence
 * 
 * @author Simon Chauvin
 */
FM.parameters = {
    //FPS at which the game is running
    FPS: 60.0,

    //The name of the library directory
    libFolder: "lib",

    //Debug mode
    debug: false,

    //Minimum width and height of a collider, must be equal to the minimum
    //width a tile can have
    COLLIDER_MINIMUM_SIZE: 16,

    //Box2D body types
    STATIC: "static",
    KINEMATIC: "kinematic",
    DYNAMIC: "dynamic",

    //Used for Box2D conversion
    PIXELS_TO_METERS: 30,

    //System constants
    IMAGE: "image",
    AUDIO: "audio",
    FILE: "file",
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down"
};
