/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function FMButtonControllerComponent(pOwner) {
    "use strict";
    var that = fmComponent(fmComponentTypes.controller, pOwner);

    var x = 0;
    var y = 0;
    var width = 150;
    var height = 50;
    var clicked = false;

    that.init = function(xPosition, yPosition, buttonWidth, buttonHeight) {
        x = xPosition;
        y = yPosition;
        width = buttonWidth;
        height = buttonHeight;
    };

    /**
     * Post initialization to ensure that all components are initialized
     */
    that.postInit = function () {
        
    }

    that.update = function(game) {
        var mouseX = game.getMouseX();
        var mouseY = game.getMouseY();
        if (mouseX >= x && mouseX <= (x + width) && mouseY >= y
            && mouseY <= (y + height)) {
            if (game.isMousePressed()) {
                clicked = true;
            } else {
                onOver();
            }
        } else {
            onOut();
        }
    };

    var onOver = function() {

    };

    var onOut = function() {

    };

    that.destroy = function() {
        that = null
    };

    that.isClicked = function() {
        return clicked;
    };

    return that;
}