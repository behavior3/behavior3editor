/** @module b3e */

(function () {
  "use strict";

  /**
   * Represents a connection between two blocks.
   *
   * @class Connection
   * @constructor
   */
  var Connection = function() {
    this.Shape_constructor();

    this._settings = null;
    this._inBlock = null;
    this._outBlock = null;
  }
  var p = createjs.extend(Connection, createjs.Shape);
 
  /**
   * Apply the editor settings to this connection.
   *
   * @method _applySettings
   * @param Object {b3e.SettingsManager} The settings object.
   * @protected
   */
  p._applySettings = function(settings) {
    this._settings = settings;
    this._redraw();
  }

  /**
   * Redraw the connection.
   *
   * @method _redraw
   * @protected
   */
  p._redraw = function(x1, y1, x2, y2) {
    if (!this._inBlock && (x1==null&&y1==null) ||
        !this._outBlock && (x2==null&&y2==null)) {
      return;
    }

    var s          = this._settings;
    var graphics   = this.graphics;
    var width      = s.get('connection_width');
    var color      = s.get('connection_color');
    var diff       = s.get('anchor_radius') + s.get('anchor_border_width');
    var arrowWidth = s.get('anchor_radius')/2;
    var layout     = s.get('layout');

    var dx=0; var dy=0; var angle=0; var ax=0; var ay=0;
    // var inAnchor = this._outBlock._getInAnchorPosition();
    // var outAnchor = this._inBlock._getOutAnchorPosition();

    if (!(x1 == 0||x1)) {
      var outAnchor = this._inBlock._getOutAnchorPosition();
      if (layout === 'horizontal') {
        x1 = outAnchor.x;
        y1 = this._inBlock.y
      } else {
        x1 = this._inBlock.x;
        y1 = outAnchor.y;
      }
    }

    if (!(x2 == 0||x2)) {
      var inAnchor = this._outBlock._getInAnchorPosition();
      if (layout === 'horizontal') {
        x2 = inAnchor.x - diff;
        y2 = this._outBlock.y
      } else {
        x2 = this._outBlock.x;
        y2 = inAnchor.y - diff;
      }
    }

    if (layout === 'horizontal') {
      dx = 2.5*(x2 - x1)/4;
      ax = -arrowWidth;
    } else {
      dy = 2.5*(y2 - y1)/4;
      ay = -arrowWidth;
      angle = 90;
    }

    graphics.clear();
    graphics.setStrokeStyle(width, 'round');
    graphics.beginStroke(color);
    graphics.moveTo(x1, y1);
    graphics.bezierCurveTo(x1+dx, y1+dy, x2-dx, y2-dy, x2, y2);
    graphics.beginFill(color);
    graphics.drawPolyStar(x2+ax, y2+ay, arrowWidth, 3, 0, angle);
    graphics.endFill();
    graphics.endStroke();
  }

  b3e.Connection = createjs.promote(Connection, 'Shape');
})();