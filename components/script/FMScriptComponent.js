/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
*/
function fmScriptComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.script, owner));

    that.update = function (game) {
        owner.update(game);
    };

    return that;
}