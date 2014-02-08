/*global FM*/
/**
 * Represents an object extracted from the .tmx file.
 * @class FM.TmxObject
 * @param {Node} pObjectNode The node containing the object.
 * @param {FM.TmxObjectGroup} pParent The group this object belongs to.
 * @constructor
 * @author Simon Chauvin
 */
FM.TmxObject = function (pObjectNode, pParent) {
    "use strict";
    /**
     * The group this object belongs to.
     * @type FM.TmxObjectGroup
     * @public
     */
    this.group = pParent;
    /**
     * The name of the object.
     * @type string
     * @public
     */
    this.name = pObjectNode.getAttribute("name");
    /**
     * The type of the object.
     * @type string
     * @public
     */
    this.type = pObjectNode.getAttribute("type");
    /**
     * The x position of the object.
     * @type int
     * @public
     */
    this.x = parseInt(pObjectNode.getAttribute("x"));
    /**
     * The y position of the object.
     * @type int
     * @public
     */
    this.y = parseInt(pObjectNode.getAttribute("y"));
    /**
     * The width of the object.
     * @type int
     * @public
     */
    this.width = parseInt(pObjectNode.getAttribute("width"));
    /**
     * The height of the object.
     * @type int
     * @public
     */
    this.height = parseInt(pObjectNode.getAttribute("height"));
    /**
     * Resolve inheritance.
     * 
     */
    this.shared = null;
    /**
     * The ID of the object.
     * @type int
     * @public
     */
    this.gid = -1;
    //
    if (pObjectNode.getAttribute("gid") && pObjectNode.getAttribute("gid").length !== 0) {
        this.gid = parseInt(pObjectNode.getAttribute("gid"));
        var tileSets = this.group.map.tileSets,
            tileSet,
            i;
        if (tileSets) {
            for (i = 0; i < tileSets.length; i = i + 1) {
                tileSet = tileSets[i];
                this.shared = tileSet.getPropertiesByGid(this.gid);
                if (this.shared) {
                    break;
                }
            }
        }
    }
    //Load properties
    var properties = pObjectNode.getElementsByTagName("properties")[0],
        property,
        i;
    if (properties) {
        for (i = 0; i < properties.childNodes.length; i = i + 1) {
            if (properties.hasChildNodes() === true) {
                property = properties.childNodes[i];
                if (property.nodeType === 1) {
                    if (this.custom) {
                        this.custom.add(property);
                    } else {
                        this.custom = new FM.TmxPropertySet();
                        this.custom.add(property);
                    }
                }
            }
        }
    }
};
FM.TmxObject.prototype.constructor = FM.TmxObject;
