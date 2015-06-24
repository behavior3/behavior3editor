b3e.project.TreeManager = function(editor, project) {
  "use strict";

  /**
   * Adds a new tree to the project.
   */
  this.add = function(_id) {
    if (_id instanceof b3e.tree.Tree) {
      var tree = _id;
      project.addChild(tree);
      editor.trigger('treeadded', tree);
      this.select(tree);
      
    } else {
      project.history._beginBatch();
      var tree = new b3e.tree.Tree(editor, project);
      var root = tree.blocks.getRoot();
      project.addChild(tree);
      editor.trigger('treeadded', tree);

      if (_id) tree._id = _id;

      var node = {
        name     : tree._id,
        title    : root.title,
        category : 'tree', 
      }
      project.nodes.add(node, true);

      // select if this is the only tree
      this.select(tree);


      var _old = [this, this.remove, [tree]];
      var _new = [this, this.add, [tree]];
      project.history._add(new b3e.Command(_old, _new));
      project.history._endBatch();
    }

    return tree;
  }

  /**
   * Gets a tree by id.
   */
  this.get = function(tree) {
    if (typeof tree === 'string') {
      for (var i=0; i<project.children.length; i++) {
        if (project.children[i]._id === tree) {
          return project.children[i];
        }
      }

      return undefined;
    }

    return tree;
  }

  this.getSelected = function() {
    return project._selectedTree;
  }

  /**
   * Select a tree.
   */
  this.select = function(tree) {
    tree = this.get(tree);

    if (!tree || project.getChildIndex(tree)<0) return;
    if (project._selectedTree === tree) return;
    if (project._selectedTree) {
      project._selectedTree.visible = false;
      editor.trigger('treedeselected', project._selectedTree);
    }
    
    tree.visible = true;
    project._selectedTree = tree;
    editor.trigger('treeselected', tree);
  }

  /**
   * Removes a tree from the project.
   */
  this.remove = function(tree) {
    project.history._beginBatch();

    tree = this.get(tree);

    var idx = project.children.indexOf(tree);
    project.removeChild(tree);
    project.nodes.remove(tree._id);
    editor.trigger('treeremoved', tree);

    if (project.children.length === 0) {
      this.add();
    } else if (tree === project._selectedTree) {
      this.select(idx==0?project.children[idx]:project.children[idx-1]);
    }

    var _old = [this, this.add, [tree]];
    var _new = [this, this.remove, [tree]];
    project.history._add(new b3e.Command(_old, _new));
    project.history._endBatch();
  }

  /**
   * Iterates over tree list.
   */
  this.each = function(callback, thisarg) {
    project.children.forEach(callback, thisarg);
  }


  this._applySettings = function(settings) {
    this.each(function(tree) {
      tree._applySettings(settings);
    })
  }
}