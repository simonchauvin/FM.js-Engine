/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param x
 * @param y
 * @param text
 * @returns {FMText}
 */
function fmText(x, y, zIndex, textToDisplay) {
    "use strict";
    var that = Object.create(fmGameObject(x, y, zIndex));

    //Renderer of text
    var textRenderer = fmTextRendererComponent(that);
    textRenderer.text = textToDisplay;
    that.addComponent(textRenderer);

    /**
     * Set the format of the text
     */
    that.setFormat = function (color, font, alignment) {
        textRenderer.setFormat(color, font, alignment);
    };

    return that;
}