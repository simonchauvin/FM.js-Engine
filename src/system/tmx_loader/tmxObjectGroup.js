/*global FM*/
/**
 * Object representing a group of objects of the tile map.
 * @class FM.TmxObjectGroup
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxObjectGroup = function () {
    "use strict";
    /**
     * The map that this group belongs to.
     * @type FM.TmxMap
     * @public
     */
    this.map = null;
    /**
     * The name of the group.
     * @type string
     * @public
     */
    this.name = null;
    /**
     * The x position of the objects of the group.
     * @type int
     * @public
     */
    this.x = 0;
    /**
     * The y position of the objects of the group.
     * @type int
     * @public
     */
    this.y = 0;
    /**
     * The width of the objects of the group.
     * @type int
     * @public
     */
    this.width = 0;
    /**
     * The height of the objects of the group.
     * @type int
     * @public
     */
    this.height = 0;
    /**
     * The level of opacity of the objects of the group.
     * @type float
     * @public
     */
    this.opacity = 0;
    /**
     * Whether the objects of the group are visible or not.
     * @type boolean
     * @public
     */
    this.visible = false;
    /**
     * The properties of the group.
     * @type FM.TmxPropertySet
     * @public
     */
    this.properties = null;
    /**
     * The list of objects of the group.
     * @type Array
     * @public
     */
    this.objects = [];
};
FM.TmxObjectGroup.prototype.constructor = FM.TmxObjectGroup;
/**
 * Load the group of objects.
 * @method FM.TmxObjectGroup#load
 * @memberOf FM.TmxObjectGroup
 * @param {FM.TmxObjectGroup} pObjectGroupNode The node of the group the load.
 * @param {FM.TmxMap} pParent The tile map this group belongs to.
 */
FM.TmxObjectGroup.prototype.load = function (pObjectGroupNode, pParent) {
    "use strict";
    this.map = pParent;
    this.name = pObjectGroupNode.getAttribute("name");
    this.x = parseInt(pObjectGroupNode.getAttribute("x"));
    this.y = parseInt(pObjectGroupNode.getAttribute("y"));
    this.width = parseInt(pObjectGroupNode.getAttribute("width"));
    this.height = parseInt(pObjectGroupNode.getAttribute("height"));
    this.visible = !pObjectGroupNode.getAttribute("visible")
        || (pObjectGroupNode.getAttribute("visible") !== 0);
    this.opacity = parseInt(pObjectGroupNode.getAttribute("opacity"));

    var properties = pObjectGroupNode.getElementsByTagName("properties")[0],
        objects = pObjectGroupNode.getElementsByTagName("object"),
        property,
        object,
        i;
    //Load properties
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (this.properties) {
                        this.properties.add(property);
                    } else {
                        this.properties = new FM.TmxPropertySet();
                        this.properties.add(property);
                    }
                }
            }
        }
    }
    //Load objects
    if (objects) {
        for (i = 0; i < objects.length; i = i + 1) {
            object = objects[i];
            this.objects.push(new FM.TmxObject(object, this));
        }
    }
};
