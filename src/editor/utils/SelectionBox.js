(function () {
  "use strict";

  /**
   * A selecion box in the screen.
   *
   * @class SelectionBox
   * @constructor
   */
  var SelectionBox = function() {
    this.Shape_constructor();

    this._settings = null;
    this.alpha = 0.3;
    this.visible = false;
  }
  var p = createjs.extend(SelectionBox, createjs.Shape);

  /**
   * Apply the editor settings to the selection box.
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
   * Redraw the box.
   *
   * @method _redraw
   * @protected
   */
  p._redraw = function(x1, y1, x2, y2) {
    var color = this._settings.get('selection_color');
    var graphics = this.graphics;

    var x = Math.min(x1, x2);
    var y = Math.min(y1, y2);
    var w = Math.abs(x1 -x2);
    var h = Math.abs(y1 -y2);

    graphics.clear();
    graphics.beginFill(color);
    graphics.drawRect(x, y, w, h);
    graphics.endFill();
  }

  b3e.SelectionBox = createjs.promote(SelectionBox, 'Shape');
})();