b3e.editor.CameraSystem = function(editor) {
  "use strict";

  var isDragging = false;
  var offsetX = 0;
  var offsetY = 0;

  this.update = function(delta) {
    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    var kb = editor._game.keyboard;
    var k = tine.keys;

    if (kb.isDown(k.CTRL)) {
      if (kb.isPressed(k.UP)) {
        tree.view.zoomIn();
      } else if (kb.isPressed(k.DOWN)) {
        tree.view.zoomOut();
      }
    }

    else {
      if (kb.isDown(k.LEFT)) {
        tree.x += delta;
      } else if (kb.isDown(k.RIGHT)) {
        tree.x -= delta;
      }

      if (kb.isDown(k.UP)) {
        tree.y += delta;
      } else if (kb.isDown(k.DOWN)) {
        tree.y -= delta;
      }
    }
  }

  this.onMouseDown = function(e) {
    if (e.nativeEvent.which !== 2) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    editor._game.canvas.className += " grabbing";

    isDragging = true;
    offsetX = editor._game.mouse.x - tree.x;
    offsetY = editor._game.mouse.y - tree.y;
  }
  this.onMouseMove = function(e) {
    if (!isDragging) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    tree.x = editor._game.mouse.x - offsetX;
    tree.y = editor._game.mouse.y - offsetY;
  }
  this.onMouseUp = function(e) {
    if (e.nativeEvent.which !== 2) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    editor._game.canvas.className = editor._game.canvas.className.replace(/(?:^|\s)grabbing(?!\S)/g, '')

    isDragging = false;
    offsetX = 0;
    offsetY = 0;
  }
  this.onMouseWheel = function(e) {
    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    if (e.ctrlKey) {
      if ((e.wheelDeltaY||e.deltaY) > 0) {
        tree.view.zoomIn();
      } else {
        tree.view.zoomOut();
      }
    }
  }


  var self = this;
  editor._game.stage.on('stagemousedown', this.onMouseDown, this);
  editor._game.stage.on('stagemousemove', this.onMouseMove, this);
  editor._game.stage.on('stagemouseup', this.onMouseUp, this);
  editor._game.canvas.addEventListener('wheel', function(e) {
    self.onMouseWheel(e)
  }, false);
  editor._game.canvas.addEventListener('mousewheel', function(e) {
    self.onMouseWheel(e)
  }, false);
  editor._game.canvas.addEventListener('DOMMouseScroll ', function(e) {
    self.onMouseWheel(e)
  }, false);
}
