b3e.tree.EditManager = function(editor, project, tree) {
  "use strict";

  this._selectionToClipboard = function() {
    var clipboard = {blocks:{}, connections:[]};
    var blocks = tree._selectedBlocks;
    var i, j, block, other;

    // Copy block
    for (i=0; i<blocks.length; i++) {
      block = blocks[i];
      if (block.category === 'root') continue;
      
      var cp = {};
      cp.id = block.id;
      cp.node = block.node;
      cp.name = block.name;
      cp.title = block.title;
      cp.category = block.category;
      cp.description = block.description;
      cp.properties = block.properties;
      cp._settings = block._settings;
      cp.x = block.x;
      cp.y = block.y;
      clipboard.blocks[block.id] = cp;
    }

    // Copy connections
    for (i=0; i<blocks.length; i++) {
      block = blocks[i];
      
      if (block.category === 'root') continue;
      
      for (j=0; j<block._outConnections.length; j++) {
        other = block._outConnections[j]._outBlock;
        
        if (clipboard.blocks[other.id]) {
          clipboard.connections.push([block.id, other.id]);
        }
      }
    }

    project._clipboard = clipboard;
  };

  this.copy = function() {
    this._selectionToClipboard();
  };

  this.cut = function() {
    this._selectionToClipboard();

    project.history._beginBatch();
    for (var i=tree._selectedBlocks.length-1; i>=0; i--) {
      var block = tree._selectedBlocks[i];

      if (block.category != 'root') {
        tree.blocks.remove(tree._selectedBlocks[i]);
      }
    }
    project.history._endBatch();
    tree._selectedBlocks = [];

    console.log(project._clipboard);
  };

  this.paste = function() {
    if (project._clipboard === null) return;

    var i;
    var table = {};
    var blocks = [];

    project.history._beginBatch();

    // copy blocks
    for (var key in project._clipboard.blocks) {
      var spec = project._clipboard.blocks[key];
      var block = new b3e.Block(spec);

      spec.x += 50;
      spec.y += 50;
      block._applySettings(spec._settings);
      block.x = spec.x;
      block.y = spec.y;

      tree.blocks.add(block);
      table[key] = block;
      blocks.push(block);
    }

    // copy connections
    for (i=0; i<project._clipboard.connections.length; i++) {
      var connection = project._clipboard.connections[i];
      var inBlock = table[connection[0]];
      var outBlock = table[connection[1]];
      tree.connections.add(inBlock, outBlock);
    }

    // select the new nodes    
    tree.selection.deselectAll();
    for (i=0; i<blocks.length; i++) {
      tree.selection.select(blocks[i]);
    }

    project.history._endBatch();
  };

  this.duplicate = function() {
    project.history._beginBatch();
    var tempClipboard = project._clipboard;
    this.copy();
    this.paste();
    project._clipboard = tempClipboard;
    project.history._endBatch();
  };

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
  };

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
  };

  this.removeInConnections = function() {
    project.history._beginBatch();
    for (var i=0; i<tree._selectedBlocks.length; i++) {
      var block = tree._selectedBlocks[i];

      if (block._inConnection) {
        tree.connections.remove(block._inConnection);
      }
    }
    project.history._endBatch();
  };

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
  };

  this._applySettings = function(settings) {
  };
};
