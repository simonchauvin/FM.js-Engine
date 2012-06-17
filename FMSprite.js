/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param x
 * @param y
 * @param zIndex
 * @returns {___that0}
 */
function fmSprite(x, y, zIndex, imageName) {
    "use strict";
    var that = Object.create(fmGameObject(x, y, zIndex));

    var spriteRenderer = fmSpriteRendererComponent(that);
    spriteRenderer.init(fmAssetManager.getAssetByName(imageName));
    that.addComponent(spriteRenderer);

    /**
    * Set the animated sprite
    * @param width
    * @param height
    * @param framesTab
    * @param frameRate
    * @param isLooped
    */
    that.setAnimation = function (name, width, height, framesTab, frameRate, isLooped) {
        spriteRenderer.setAnimation(name, width, height, framesTab, frameRate, isLooped);
    };

    /**
     * Play the given animation
     */
    that.play = function (animName) {
        spriteRenderer.play(animName);
    };


    return that;
}