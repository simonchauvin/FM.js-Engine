/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param x
 * @param y
 * @param buttonWidth
 * @param buttonHeight
 * @param buttonText
 * @returns {FMButton}
 */
function fmButton(x, y, width, height, text) {
    "use strict";
    var that = Object.create(fmGameObject(x, y, 0));

    var buttonController = fmButtonControllerComponent(that);
    buttonController.init(x, y, width, height);
    that.addComponent(buttonController);

    that.textRenderer = fmTextRendererComponent(that);
    that.textRenderer.text = text;
    that.addComponent(that.textRenderer);

    return that;
}