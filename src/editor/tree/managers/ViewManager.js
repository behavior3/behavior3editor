b3e.tree.ViewManager = function(editor, project, tree) {
  "use strict";

  this.reset = function() {
    tree.x = 0;
    tree.y = 0;
    tree.scaleX = 1;
    tree.scaleY = 1;
  }
  this.zoom = function(factor) {
    tree.scaleX = factor;
    tree.scaleY = factor;
  }
  this.zoomIn = function() {
    var min = editor._settings.get('zoom_min');
    var max = editor._settings.get('zoom_max');
    var step = editor._settings.get('zoom_step');
    
    var zoom = tree.scaleX;
    this.zoom(tine.clip(zoom+step, min, max));
  }
  this.zoomOut = function() {
    var min = editor._settings.get('zoom_min');
    var max = editor._settings.get('zoom_max');
    var step = editor._settings.get('zoom_step');
    
    var zoom = tree.scaleX;
    this.zoom(tine.clip(zoom-step, min, max));
  }
  this.pan = function(dx, dy) {
    tree.x += dx;
    tree.y += dy;
  }
  this.setCam = function(x, y) {
    tree.x = x;
    tree.y = y;
  }
  this.center = function() {
    var canvas = editor._game.canvas;
    var hw = canvas.width/2;
    var hh = canvas.height/2;
    this.setCam(hw, hh);
  }
  this.getLocalPoint = function(x, y) {
    if (typeof x == 'undefined') x = editor._game.mouse.x;
    if (typeof y == 'undefined') y = editor._game.mouse.y;
    return tree.globalToLocal(x, y);
  }

  this._applySettings = function(settings) {}
}
