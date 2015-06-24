b3e.editor.ImportManager = function(editor) {
  "use strict";

  this.projectAsData = function(data) {
    var project = editor.project.get();
    if (!project) return;

    if (data.custom_nodes) this.nodesAsData(data.custom_nodes);
    if (data.trees) this.treesAsData(data.trees);
    if (data.selectedTree) {
      project.trees.select(data.selectedTree);
    }
    editor.trigger('projectimported');
  }

  this.treeAsData = function(data) {
    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.add(data.id);
    var root = tree.blocks.getRoot();
    var first = null;

    // Tree data
    var display      = data.display||{};
    tree.x           = display.camera_x || 0;
    tree.y           = display.camera_y || 0;
    tree.scaleX      = display.camera_z || 1;
    tree.scaleY      = display.camera_z || 1;
    var treeNode = project.nodes.get(tree._id);
    treeNode.title = data.title;

    root.title       = data.title;
    root.description = data.description;
    root.properties  = data.properties;
    root.x           = display.x || 0;
    root.y           = display.y || 0;

    // Custom nodes
    if (data.custom_nodes) this.nodesAsData(data.custom_nodes);

    // Add blocks
    for (var id in data.nodes) {
      var spec = data.nodes[id];
      var display = spec.display || {};
      var block = null;

      block = tree.blocks.add(spec.name, spec.display.x, spec.display.y);
      block.id = spec.id;
      block.title = spec.title;
      block.description = spec.description;
      block.properties = tine.merge({}, block.properties, spec.properties);
      block._redraw();
      
      if (spec.id === data.root) {
        first = block;
      }
    }

    // Add connections
    for (var id in data.nodes) {
      var spec = data.nodes[id];
      var inBlock = tree.blocks.get(id);

      var children = null;
      if (inBlock.category === 'composite' && spec.children) {
        children = spec.children;
      }
      else if (spec.child && (inBlock.category == 'decorator' ||
                              inBlock.category == 'root')) {
        children = [spec.child];
      }
      
      if (children) {
        for (var i=0; i<children.length; i++) {
          var outBlock = tree.blocks.get(children[i]);
          tree.connections.add(inBlock, outBlock);
        }
      }
    }

    // Finish
    if (first) {
      tree.connections.add(root, first);
    }

    if (!data.display) {
      tree.organize.organize(true);
    }

    tree.selection.deselectAll();
    tree.selection.select(root);
    project.history.clear();

    editor.trigger('treeimported');
  }

  this.treesAsData = function(data) {
    for (var i=0; i<data.length; i++) {
      this.treeAsData(data[i]);
    }
  }

  this.nodesAsData = function(data) {
    var project = editor.project.get();
    if (!project) return;

    for (var i=0; i<data.length; i++) {
      var template = data[i];
      project.nodes.add(template);
    }
    editor.trigger('nodeimported');
  }
  this._applySettings = function(settings) {}
}