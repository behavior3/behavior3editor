/** @module b3e */

(function () {
  "use strict";

  /**
   * The Block is an instance of a Node that is drawn into the canvas.
   *
   * @class Block
   * @constructor
   * @param {Object} node A `b3e.Node` object.
   */
  var Block = function(node) {
    this.Container_constructor();

    var dict = node.prototype || node;
    this.id          = b3.createUUID();
    this.node        = node;
    this.name        = dict.name;
    this.title       = dict.title || this.name;
    this.category    = dict.category;
    this.description = dict.description || '';
    this.properties  = tine.merge({}, dict.properties);

    this._settings = null;
    this._inConnection = null;
    this._outConnections = [];
    this._isSelected = null;
    this._isDragging = null;
    this._dragOffsetX = null;
    this._dragOffsetY = null;
    this._width = null;
    this._height = null;
    this._displayShape = new createjs.Shape();
    this._displaySymbol = null;
    this._displayShadow = null;
  }
  var p = createjs.extend(Block, createjs.Container);
  
  /**
   * Apply the editor settings to this block.
   *
   * @method _applySettings
   * @param Object {b3e.SettingsManager} The settings object.
   * @protected
   */
  p._applySettings = function(settings) {
    this._settings = settings;

    var color = this._settings.get('selection_color');
    this._displayShadow = new createjs.Shadow(color, 0, 0, 5);
    this._redraw();
  }

  /**
   * Redraw the block.
   *
   * @method _redraw
   * @protected
   */
  p._redraw = function() {
    var name = this.name;
    var category = this.category.toLowerCase();
    var shape = b3e.draw.SHAPES[category];
    var symbol = b3e.draw.SYMBOLS[name] || b3e.draw.textSymbol;

    this._width = this._settings.get('block_'+category+'_width');
    this._height = this._settings.get('block_'+category+'_height');
    this.removeAllChildren();

    this._displaySymbol = symbol(this, this._settings);
    this._displayShape.graphics.clear();
    this._displayShape = shape(this, this._settings);

    this.addChild(this._displayShape);
    this.addChild(this._displaySymbol);
  }

  /**
   * Copy this block.
   *
   * @method _copy
   * @returns {b3e.Block} A copy of this block.
   * @protected
   */
  p._copy = function() {
    var block = new b3e.Block(this.node);

    block.category    = this.category;
    block.title       = this.title;
    block.description = this.description;
    block.properties  = tine.merge({}, this.properties);
    
    block._applySettings(this._settings);
    block.x           = this.x;
    block.y           = this.y;


    return block;
  }

  /**
   * Snap the block according to the snap settings.
   *
   * @method _snap
   * @protected
   */
  p._snap = function() {
    var snap_x = this._settings.get('snap_x');
    var snap_y = this._settings.get('snap_y');
    var dx = this.x%snap_x;
    var dy = this.y%snap_y;

    if (dx < 0) dx = snap_x+dx;
    if (dy < 0) dy = snap_y+dy;

    this.x -= dx;
    this.y -= dy;
  }

  /**
   * Returns the center position of the in anchor.
   *
   * @method _getInAnchorPosition
   * @returns {Object} An object {x, y}.
   * @protected
   */
  p._getInAnchorPosition = function() {
    return {
      x: this.x-this._width/2-this._settings.get('anchor_offset_x'),
      y: this.y-this._height/2-this._settings.get('anchor_offset_x')
    }
  }

  /**
   * Returns the center position of the out anchor.
   *
   * @method _getOutAnchorPosition
   * @returns {Object} An object {x, y}.
   * @protected
   */
  p._getOutAnchorPosition = function() {
    return {
      x: this.x+this._width/2+this._settings.get('anchor_offset_x'),
      y: this.y+this._height/2+this._settings.get('anchor_offset_x')
    }
  }

  /**
   * Select a block, adding a shadow effect to it.
   *
   * @method _select
   * @protected
   */
  p._select = function() {
    this._isSelected = true;
    this._displayShape.shadow = this._displayShadow;
  }

  /**
   * Deselect a block, removing the shadow effect.
   *
   * @method _deselect
   * @protected
   */
  p._deselect = function() {
    this._isSelected = false;
    this._displayShape.shadow = null;
  }

  p._collapse = function() {}
  p._expand = function() {}

  /**
   * Verifies if the position (x, y) hits any part of the block. This is 
   * equivalent to:
   *
   *     block._hitBody(x, y) || block._hitInAnchor(x, y) || block._hitOutAnchor(x, y)
   *
   * @method _hitTest
   * @param {Integer} x The x position.
   * @param {Integer} y The y position.
   * @returns {Boolean} Whether hit the block or not.
   * @protected
   */
  p._hitTest = function(x, y) {
    return this._displayShape.hitTest(x-this.x, y-this.y);
  }

  /**
   * Verifies if the position (x, y) hits the body of the block.
   * 
   * @method _hitBody
   * @param {Integer} x The x position.
   * @param {Integer} y The y position.
   * @returns {Boolean} Whether hit the block's body or not.
   * @protected
   */
  p._hitBody = function(x, y) {
    if (this._settings.get('layout') === 'horizontal') {
      return (Math.abs(x-this.x) < this._width/2);
    }
    return (Math.abs(y-this.y) < this._height/2);
  }

  /**
   * Verifies if the position (x, y) hits the in anchor of the block.
   * 
   * @method _hitInAnchor
   * @param {Integer} x The x position.
   * @param {Integer} y The y position.
   * @returns {Boolean} Whether hit the in anchor or not.
   * @protected
   */
  p._hitInAnchor = function(x, y) {
    if (this._settings.get('layout') === 'horizontal') {
      var dx = x-this.x;
      return (Math.abs(dx) > this._width/2 && dx < 0);
    }
    var dy = y-this.y;
    return (Math.abs(dy) > this._height/2 && dy < 0);
  }

  /**
   * Verifies if the position (x, y) hits the out anchor of the block.
   * 
   * @method _hitInAnchor
   * @param {Integer} x The x position.
   * @param {Integer} y The y position.
   * @returns {Boolean} Whether hit the out anchor or not.
   * @protected
   */
  p._hitOutAnchor = function(x, y) {
    if (this._settings.get('layout') === 'horizontal') {
      var dx = x-this.x;
      return (Math.abs(dx) > this._width/2 && dx > 0);
    }
    var dy = y-this.y;
    return (Math.abs(dy) > this._height/2 && dy > 0);
  }

  /**
   * Verifies if this block is contained inside a given rectangle.
   * 
   * @method _isContainedIn
   * @param {Integer} x1 The x position.
   * @param {Integer} y1 The y position.
   * @param {Integer} x2 The x+w position.
   * @param {Integer} y2 The y+h position.
   * @returns {Boolean} Whether the block is contained in the rectangle or not.
   * @protected
   */
  p._isContainedIn = function(x1, y1, x2, y2) {
    if (x1 < this.x-this._width/2 &&
        y1 < this.y-this._height/2 &&
        x2 > this.x+this._width/2 &&
        y2 > this.y+this._height/2) {
      return true;
    }

    return false;
  }


  /**
   * Get the compiled title of the block. You can use patterns like `<varname>`
   * in the block title and this method will look through block properties for 
   * the var name. For example.
   *
   *     block.title = 'A <thing> title';
   *     block.properties['thing'] = 'pretty';
   *     block.getTitle() === 'A pretty title';
   * 
   * @method getTitle
   * @returns {String} The compiled title.
   */
  p.getTitle = function() {
    var s = this.title || this.name;
    var this_ = this;
    return s.replace(/(<\w+>)/g, function(match, key) {
      var attr = key.substring(1, key.length-1);
      if (this_.properties.hasOwnProperty(attr))
        return this_.properties[attr];
      else
        return match;
    });
  }

  /**
   * Runs a traversal over the subtree which this block is root.
   *
   *     block.traversal(function(block) {
   *       console.log(block);
   *     })
   * 
   * @method traversal
   * @param {Function} callback The callback called for each block in the 
   *                            subtree. The current block will be passed as 
   *                            argument to the callback.
   * @param {Object} thisarg The object for `this` reference.
   */
  p.traversal = function(callback, thisarg) {
    var blocks = [this];
    while (blocks.length > 0) {
      var block = blocks.pop();
      if (callback.call(thisarg, block) === false) return;

      for (var i=block._outConnections.length-1; i>=0; i--) {
        var c = block._outConnections[i];
        if (c._outBlock) blocks.push(c._outBlock);
      }
    }
  }

  b3e.Block = createjs.promote(Block, 'Container');
})();