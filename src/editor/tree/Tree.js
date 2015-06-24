(function () {
  "use strict";

  var Tree = function(editor, project) {
    this.Container_constructor();

    // Variables
    this._id = b3.createUUID();
    this._editor = editor;
    this._project = project;
    this._selectedBlocks = [];
    this._selectionBox = null;
    this._root = null;

    // Layers
    this._blocks = new createjs.Container(),
    this._connections = new createjs.Container(),
    this._overlay = new createjs.Container()

    // Managers
    this.blocks = null;
    this.connections = null;
    this.edit = null;
    this.selection = null;
    this.view = null;
    this.organizer = null;

    this._initialize();
  }
  var p = createjs.extend(Tree, createjs.Container);

  p._initialize = function() {
    this.blocks = new b3e.tree.BlockManager(this._editor, this._project, this);
    this.connections = new b3e.tree.ConnectionManager(this._editor, this._project, this);
    this.edit = new b3e.tree.EditManager(this._editor, this._project, this);
    this.selection = new b3e.tree.SelectionManager(this._editor, this._project, this);
    this.view = new b3e.tree.ViewManager(this._editor, this._project, this);
    this.organize = new b3e.tree.OrganizeManager(this._editor, this._project, this);

    this.addChild(this._connections)
    this.addChild(this._blocks)
    this.addChild(this._overlay)

    this._selectionBox = new b3e.SelectionBox();
    this._overlay.addChild(this._selectionBox);

    this._root = this.blocks.add('Root', 0, 0);
    this._applySettings(this._editor._settings);

    this.view.center();
  }

  p._applySettings = function(settings) {
    this._selectionBox._applySettings(settings);

    this.blocks._applySettings(settings);
    this.connections._applySettings(settings);
    this.edit._applySettings(settings);
    this.selection._applySettings(settings);
    this.view._applySettings(settings);
    this.organize._applySettings(settings);
  }

  b3e.tree.Tree = createjs.promote(Tree, 'Container');
})();