b3e.tree.EditManager = function(editor, project, tree) {
  "use strict";

  this.copy = function() {
    project._clipboard = [];

    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];

      if (block.category != 'root') {
        project._clipboard.push(block)
      }
    }
  }

  this.cut = function() {
    project._clipboard = [];
    project.history._beginBatch();
    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];

      if (block.category != 'root') {
        tree.blocks.remove(block);
        project._clipboard.push(block)
      }
    }
    project.history._endBatch();
    // tree._selectedBlocks = [];
  }

  this.paste = function() {
    project.history._beginBatch();
    var newBlocks = [];
    for (var i=0; i<project._clipboard.length; i++) {
      var block = project._clipboard[i];

      // Copy the block
      var newBlock = block._copy();
      newBlock.x += 50;
      newBlock.y += 50;
+
      // Add block to container
      tree.blocks.add(newBlock)
      newBlocks.push(newBlock);
    }

    // Copy connections
    // TODO: cubic complexity here! How to make it better?
    for (var i=0; i<project._clipboard.length; i++) {
      var oldBlock = project._clipboard[i];
      var newBlock = newBlocks[i];

      for (var j=0; j<oldBlock._outConnections.length; j++) {
        for (var k=0; k<project._clipboard.length; k++) {
          if (oldBlock._outConnections[j]._outBlock === project._clipboard[k]) {
            tree.connections.add(newBlock, newBlocks[k]);
            break;
          }
        }
      }
    }

    // Deselect old blocks and select the new ones
    tree.selection.deselectAll();
    for (var i=0; i<newBlocks.length; i++) {
      tree.selection.select(newBlocks[i]);
    }
    project.history._endBatch();
  }

  this.duplicate = function() {
    project.history._beginBatch();
    var tempClipboard = project._clipboard;
    this.copy();
    this.paste();
    project._clipboard = tempClipboard;
    project.history._endBatch();
  }

  this.remove = function() {
    project.history._beginBatch();
    var root = null;
    for (var i=tree._selectedBlocks.length-1; i>=0; i--) {
      if (tree._selectedBlocks[i].category === 'root') {
        root = tree._selectedBlocks[i];
      } else {
        tree.blocks.remove(tree._selectedBlocks[i]);
      }
    }

    // tree.selection.deselectAll();
    // if (root) {
    //   tree.selection.select(root);
    // }
    project.history._endBatch();
  }

  this.removeConnections = function() {
    project.history._beginBatch();
    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];

      if (block._inConnection) {
        tree.connections.remove(block._inConnection);
      }

      if (block._outConnections.length > 0) {
        for (var j=block._outConnections.length-1; j>=0; j--) {
          tree.connections.remove(block._outConnections[j]);
        }
      }
    }
    project.history._endBatch();
  }

  this.removeInConnections = function() {
    project.history._beginBatch();
    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];

      if (block._inConnection) {
        tree.connections.remove(block._inConnection);
      }
    }
    project.history._endBatch();
  }

  this.removeOutConnections = function() {
    project.history._beginBatch();
    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];

      if (block._outConnections.length > 0) {
        for (var j=block._outConnections.length-1; j>=0; j--) {
          tree.connections.remove(block._outConnections[j]);
        }
      }
    }
    project.history._endBatch();
  }

  this._applySettings = function(settings) {}
}
