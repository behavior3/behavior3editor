b3e.project.NodeManager = function(editor, project) {
  "use strict";

  /**
   * Register a node to the node list. You can provide:
   * 
   * - a `b3.BaseNode` instance.
   * - a `b3e.Node` instance.
   * - a generic object containing the node prototype.
   */
  this.add = function(node, isDefault) {
    if (node.prototype) node = node.prototype;

    if (project._nodes[node.name]) {
      return false;
    }

    if (!(node instanceof b3e.Node)) {
      var n         = new b3e.Node(isDefault);
      n.name        = node.name;
      n.category    = node.category;
      n.title       = node.title;
      n.description = node.description;
      n.properties  = tine.merge({}, node.properties||node.parameters);

      node = n;
    }

    project._nodes[node.name] = node;
    if (isDefault !== true) editor.trigger('nodeadded', node);

    var _old = [this, this.remove, [node]];
    var _new = [this, this.add, [node]];
    project.history._add(new b3e.Command(_old, _new));

    return node;
  };

  /**
   * 
   */
  this.get = function(node) {
    if (typeof node !== 'string') return node;
    return project._nodes[node];
  };

  /**
   * 
   */
  this.update = function(node, template) {
    node = this.get(node);
    var oldName = node.name;

    delete project._nodes[node.name];

    if (node.name !== template.name && this.get(template.name)) return false;


    var _oldValues = {
      name        : node.name,
      title       : node.title,
      description : node.description,
      category    : node.category,
      properties  : node.properties,
    };

    if (typeof template.name !== 'undefined') {
      node.name = template.name;
    }
    if (typeof template.title !== 'undefined') {
      node.title = template.title;
    }
    if (typeof template.category !== 'undefined') {
      node.category = template.category;
    }
    if (typeof template.description !== 'undefined') {
      node.description = template.description;
    }
    if (typeof template.properties !== 'undefined') {
      node.properties  = tine.merge({}, template.properties);
    }

    var _newValues = {
      name        : node.name,
      title       : node.title,
      description : node.description,
      category    : node.category,
      properties  : node.properties,
    };

    project.history._beginBatch();

    project.trees.each(function(tree) {
      var blocks = tree.blocks.getAll();
      for (var i=blocks.length-1; i>=0; i--) {
        if (blocks[i].name === oldName) {
          tree.blocks.update(blocks[i]);
        }
      }
    });

    project._nodes[node.name] = node;

    var _old = [this, this.update, [node, _oldValues]];
    var _new = [this, this.update, [node, _newValues]];
    project.history._add(new b3e.Command(_old, _new));
    project.history._endBatch();

    editor.trigger('nodechanged', node);
    if (node.category == 'tree') {
      editor.trigger('treenodechanged', node);
    }
  };

  /**
   * 
   */
  this.remove = function(node) {
    project.history._beginBatch();

    var name = node.name||node;
    delete project._nodes[name];

    project.trees.each(function(tree) {
      var blocks = tree.blocks.getAll();
      for (var i=blocks.length-1; i>=0; i--) {
        if (blocks[i].name === name) {
          tree.blocks.remove(blocks[i]);
        }
      }
    });

    var _old = [this, this.add, [node]];
    var _new = [this, this.remove, [node]];
    project.history._add(new b3e.Command(_old, _new));

    project.history._endBatch();

    editor.trigger('noderemoved', node);
  };

  /**
   * Iterates over node list.
   */
  this.each = function(callback, thisarg) {
    Object.keys(project._nodes).forEach(function(key) {
      callback.call(thisarg, project._nodes[key]);
    });
  };

  this._applySettings = function(settings) {};
};