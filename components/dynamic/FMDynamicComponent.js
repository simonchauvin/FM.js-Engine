/**
 * Under Creative Commons Licence
 * @author Simon Chauvin
 */
function fmPhysicComponent(owner) {
    "use strict";
    var that = Object.create(fmComponent(fmComponentTypes.dynamic, owner));

    //TODO list the comunication thing interface commons for using dynamic components

    return that;
};