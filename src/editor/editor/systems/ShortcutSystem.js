b3e.editor.ShortcutSystem = function(editor) {
  "use strict";

  this.update = function(delta) {
    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    var kb = editor._game.keyboard;
    var k = tine.keys;
  }
}
