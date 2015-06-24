b3e.tree.BlockManager = function(editor, project, tree) {
  "use strict";

  this._move = function(block, x, y) {
    block.x = x;
    block.y = y;
    block._redraw();

    // redraw connections linked to the entity
    if (block._inConnection) {
      block._inConnection._redraw();
    }
    for (var j=0; j<block._outConnections.length; j++) {
      block._outConnections[j]._redraw();
    }
  }

  /**
   * Add a block.
   */
  this.add = function(name, x, y) {
    // If name is a block
    if (name instanceof b3e.Block) {
      var block = name;
      block._snap();
      tree._blocks.addChild(block);
      editor.trigger('blockadded', block);

    }

    // Otherwise
    else {
      x = x||0; y = y||0;

      var node = name;
      if (typeof name === 'string') {
        var node = project.nodes.get(name);
      }

      var block = new b3e.Block(node);
      block._applySettings(editor._settings);
      block.x = x;
      block.y = y;
      block._snap();
      tree._blocks.addChild(block);

      tree.selection.deselectAll();
      tree.selection.select(block);

      editor.trigger('blockadded', block);
    }

    var _old = [this, this.remove, [block]];
    var _new = [this, this.add, [block, block.x, block.y]];
    project.history._add(new b3e.Command(_old, _new));

    return block;
  }

  this.get = function(block) {
    if (typeof block === 'string') {
      var blocks = tree._blocks.children;
      for (var i=0; i<blocks.length; i++) {
        if (blocks[i].id === block) {
          return blocks[i];
        }
      }
      return undefined;
    }

    return block;
  }
  this.getUnderPoint = function(x, y) {
    if (!x || !y) {
      var point = tree.view.getLocalPoint();
      x = point.x; y = point.y;
    }

    // Get block under the mouse
    var blocks = this.getAll();
    for (var i=blocks.length-1; i>=0; i--) {
      var block = blocks[i];

      if (block._hitTest(x, y)) return block;
    }
  }
  this.getSelected = function() {
    return tree._selectedBlocks.slice();
  }
  this.getAll = function() {
    return tree._blocks.children;
  }
  this.getRoot = function() {
    return tree._root;
  }
  this.update = function(block, template, merge) {
    var mustSave = !!template;

    var _oldValues = {
      name        : block.name,
      title       : block.title,
      description : block.description,
      properties  : block.properties,
    }

    template = template || {};
    var node = block.node;
    if (typeof template.name !== 'undefined') {
      block.name = template.name;
    } else {
      block.name = node.name || block.name;
    }
    if (typeof template.title !== 'undefined') {
      block.title = template.title;
    } else {
      block.title = node.title || block.title;
    }
    if (typeof template.description !== 'undefined') {
      block.description = template.description;
    } else {
      block.description = node.description || block.description;
    }
    if (typeof template.properties !== 'undefined') {
      block.properties = tine.merge({}, node.properties, template.properties);
    } else {
      block.properties = tine.merge({}, node.properties, block.properties);
    }
    block._redraw();

    var _newValues = {
      name        : block.name,
      title       : block.title,
      description : block.description,
      properties  : block.properties,
    }

    // redraw connections linked to the entity
    if (block._inConnection) {
      block._inConnection._redraw();
    }
    for (var j=0; j<block._outConnections.length; j++) {
      block._outConnections[j]._redraw();
    }
    
    if (!mustSave) project.history._lock();

    project.history._beginBatch()

    if (block.category === 'root') {
      project.nodes.update(tree._id, {title: block.title||'A behavior tree'});
    }

    var _old = [this, this.update, [block, _oldValues]];
    var _new = [this, this.update, [block, _newValues]];
    project.history._add(new b3e.Command(_old, _new));
    project.history._endBatch()
    
    if (!mustSave) project.history._unlock();

    editor.trigger('blockchanged', block);
  }
  this.remove = function(block) {
    project.history._beginBatch();
    tree._blocks.removeChild(block);

    if (block._inConnection) {
      tree.connections.remove(block._inConnection);
    }

    if (block._outConnections.length > 0) {
      for (var i=block._outConnections.length-1; i>=0; i--) {
        tree.connections.remove(block._outConnections[i]);
      }
    }

    if (block._isSelected) {
      tree.selection.deselect(block);
    }

    var _old = [this, this.add, [block, block.x, block.y]];
    var _new = [this, this.remove, [block]];
    project.history._add(new b3e.Command(_old, _new));

    project.history._endBatch();
    editor.trigger('blockremoved', block);
  }
  this.cut = function(block) {
    project.history._beginBatch();
    tree._blocks.removeChild(block);

    if (block._inConnection) {
      if (!block._inConnection._outBlock._isSelected) {
        tree.connections.remove(block._inConnection);
      } else {
        block._inConnection.visible = false;
      }
    }

    if (block._outConnections.length > 0) {
      for (var i=block._outConnections.length-1; i>=0; i--) {
        if (!block._outConnections[i]._inBlock._isSelected) {
          tree.connections.remove(block._outConnections[i]);
        } else {
          block._outConnections[i].visible = false;
        }
      }
    }

    var _old = [this, this.add, [block, block.x, block.y]];
    var _new = [this, this.remove, [block]];
    project.history._add(new b3e.Command(_old, _new));

    editor.trigger('blockremoved', block);
    project.history._endBatch();
  }
  this.each = function(callback, thisarg) {
    tree._blocks.children.forEach(callback, thisarg);
  }

  this._applySettings = function(settings) {
    this.each(function(block) {
      block._applySettings(settings);
    })
  }
}