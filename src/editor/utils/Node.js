/** @module b3e */
(function() {
  'use strict';

  /**
   * A node specification.
   *
   * @class Node
   * @param {Boolean} isDefault Whether the node is provided by default or not.
   * @constructor
   */
  b3e.Node = function(isDefault) {
    this.spec = null;
    this.name = null;
    this.title = null;
    this.category = null;
    this.description = null;
    this.properties = {};
    this.isDefault = !!isDefault;

    /**
     * Copy this node.
     *
     * @method copy
     * @returns {b3e.Node} A copy of this node
     */
    this.copy = function() {
      var n         = new b3e.Node(this.isDefault);
      n.spec        = this.spec;
      n.name        = this.name;
      n.title       = this.title;
      n.category    = this.category;
      n.description = this.description;
      n.properties  = this.properties;
      
      return n;
    }
  }
})()