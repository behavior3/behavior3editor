b3e.tree.SelectionManager = function(editor, project, tree) {
  "use strict";

  this.select = function(block) {
    if (block._isSelected) return;

    block._select();
    tree._selectedBlocks.push(block);

    editor.trigger('blockselected', block);
  }

  this.deselect = function(block) {
    if (!block._isSelected) return;

    block._deselect();
    tree._selectedBlocks.remove(block);

    editor.trigger('blockdeselected', block);
  }

  this.selectAll = function() {
    tree.blocks.each(function(block) {
      this.select(block);
    }, this);
  }

  this.deselectAll = function() {
    for (var i=tree._selectedBlocks.length-1; i>=0; i--) {
      this.deselect(tree._selectedBlocks[i])
    }
  }

  this.invertSelection = function(block) {
    var blocks = (block)?[block]:tree.blocks.getAll();

    blocks.forEach(function(block) {
      if (block._isSelected) {
        this.deselect(block);
      } else {
        this.select(block);
      }
    }, this);
  }

  this.selectSubtree = function(block) {
    var blocks = (block)?[block]:tree._selectedBlocks;

    while (blocks.length > 0) {
      blocks.pop().traversal(function(block) {
        blocks.remove(block);
        this.select(block);
      }, this)
    }
  }

  this.deselectSubtree = function(block) {
    var blocks = (block)?[block]:tree._selectedBlocks;

    while (blocks.length > 0) {
      blocks.pop().traversal(function(block) {
        blocks.remove(block);
        this.deselect(block);
      }, this)
    }
  }

  this._applySettings = function(settings) {}

}
