b3e.editor.SelectionSystem = function(editor) {
  "use strict";

  var isSelecting = false;
  var ctrl = false;
  var shift = false;
  var alt = false;
  var x0 = 0;
  var y0 = 0;

  this.update = function(delta) {};

  this.onMouseDown = function(e) {
    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    // mouse left
    if (e.nativeEvent.which !== 1) return;
    ctrl = e.nativeEvent.ctrlKey;
    shift = e.nativeEvent.shiftKey;
    alt = e.nativeEvent.altKey;

    // if clicked on block
    var point = tree.view.getLocalPoint();
    var x = point.x;
    var y = point.y;
    var block = tree.blocks.getUnderPoint(x, y);

    if (block && block._isSelected && ctrl) {
      if (alt) {
        tree.selection.deselectSubtree(block);
      } else {
        tree.selection.deselect(block);
      }
    }

    else if (block && !block._isSelected && block._hitBody(x, y)) {
      if (!ctrl) tree.selection.deselectAll();
      if (alt) {
        tree.selection.selectSubtree(block);
      } else {
        tree.selection.select(block);
      }
    }
    else if (block && block._hitBody(x, y)) {
      if (alt) {
        tree.selection.selectSubtree(block);
      }
    }

    else if (!block) {
      isSelecting = true;
      x0 = x;
      y0 = y;

      if (!ctrl) tree.selection.deselectAll();
    }
  };

  this.onMouseMove = function(e) {
    if (!isSelecting) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    var point = tree.view.getLocalPoint();
    var x = point.x;
    var y = point.y;

    tree._selectionBox.visible = true;
    tree._selectionBox._redraw(x0, y0, x, y);
  };

  this.onMouseUp = function(e) {
    if (e.nativeEvent.which !== 1 || !isSelecting) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    var point = tree.view.getLocalPoint();
    var x = point.x;
    var y = point.y;

    var x1 = Math.min(x0, x);
    var y1 = Math.min(y0, y);
    var x2 = Math.max(x0, x);
    var y2 = Math.max(y0, y);

    tree.blocks.each(function(block) {
      if (block._isContainedIn(x1, y1, x2, y2)) {
        tree.selection.select(block);
      }
    });

    tree._selectionBox.visible = false;
    isSelecting = false;
  };

  this.onDblclick = function(e) {
    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    // if clicked on block
    var point = tree.view.getLocalPoint();
    var x = point.x;
    var y = point.y;
    var block = tree.blocks.getUnderPoint(x, y);
    if (block.category === 'tree') {
        project.trees.select(block.name);
    }
  };

  editor._game.stage.on('stagemousedown', this.onMouseDown, this);
  editor._game.stage.on('stagemousemove', this.onMouseMove, this);
  editor._game.stage.on('stagemouseup', this.onMouseUp, this);
  editor._game.stage.on('dblclick', this.onDblclick, this);
};
