/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 * @param owner
 * @returns {___that0}
 */
function fmColliderComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.collider, owner));

    var renderer = owner.components[fmComponentTypes.renderer];

    that.init = function () {

    };

    that.update = function (game) {

    };

    return that;
}