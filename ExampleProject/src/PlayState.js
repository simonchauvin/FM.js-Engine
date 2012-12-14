/**
 * Start play state
 * @returns {___that0}
 */
function playState() {
    "use strict";
    var that = Object.create(FMState());

    /**
    * Initialize the play state
    */
    that.init = function (game) {
        Object.getPrototypeOf(that).init(game);

        //Debug mode
        FMParameters.debug = true;

        //Background color
        FMParameters.backgroundColor = 'rgb(0,0,0)';

        //Setting the bounds of the world
        that.world.width = 800;
        that.world.height = 600;
    };

    /**
    * Update the play state
    */
    that.update = function(game, dt) {
        Object.getPrototypeOf(that).update(game, dt);

        
    };

    return that;
}