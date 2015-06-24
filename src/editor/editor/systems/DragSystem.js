b3e.editor.DragSystem = function(editor) {
  "use strict";

  var isDragging = false;
  var dragX0 = 0;
  var dragY0 = 0;

  this.update = function(delta) {}

  this.onMouseDown = function(e) {
    if (e.nativeEvent.which !== 1 || 
        e.nativeEvent.ctrlKey || 
        isDragging) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    var point = tree.view.getLocalPoint();
    var x = point.x
    var y = point.y
    var block = tree.blocks.getUnderPoint(x, y);

    // if mouse not on block
    if (!block) return;

    // if no block selected
    if (!block._isSelected) return;

    // if mouse in anchor
    if (!block._hitBody(x, y)) return;

    // start dragging
    isDragging = true;
    dragX0 = x;
    dragY0 = y;

    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];
      block._isDragging = true;
      block._dragOffsetX = x - block.x;
      block._dragOffsetY = y - block.y;
    }
  }

  this.onMouseMove = function(e) {
    if (!isDragging) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    var point = tree.view.getLocalPoint();
    var x = point.x
    var y = point.y

    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];

      var dx = x - block._dragOffsetX;
      var dy = y - block._dragOffsetY;

      block.x = dx;
      block.y = dy;
      block._snap();

      // redraw connections linked to the entity
      if (block._inConnection) {
        block._inConnection._redraw();
      }
      for (var j=0; j<block._outConnections.length; j++) {
        block._outConnections[j]._redraw();
      }
    }
  }

  this.onMouseUp = function(e) {
    if (e.nativeEvent.which !== 1 || !isDragging) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    isDragging = false;
    var point = tree.view.getLocalPoint();
    var x = point.x
    var y = point.y


    project.history._beginBatch();
    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];
      block._isDragging = false;

      var _old = [block, dragX0-block._dragOffsetX, dragY0-block._dragOffsetY];
      var _new = [block, block.x, block.y];

      if (_old[1] === _new[1] && _old[2] === _new[2]) break;

      project.history._add(new b3e.Command(
        [tree.blocks, tree.blocks._move, _old],
        [tree.blocks, tree.blocks._move, _new]
      ));
    }
    project.history._endBatch();
  }

  editor._game.stage.on('stagemousedown', this.onMouseDown, this);
  editor._game.stage.on('stagemousemove', this.onMouseMove, this);
  editor._game.stage.on('stagemouseup', this.onMouseUp, this);
}
