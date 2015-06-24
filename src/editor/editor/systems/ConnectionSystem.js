b3e.editor.ConnectionSystem = function(editor) {
  "use strict";

  var connection = null;
  var lastOutBlock = null;

  this.update = function(delta) {}

  this.onMouseDown = function(e) {
    if (e.nativeEvent.which !== 1) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    // if clicked on block
    var point = tree.view.getLocalPoint();
    var x = point.x
    var y = point.y
    var block = tree.blocks.getUnderPoint(x, y);

    if (connection || !block) return;

    if (block._hitOutAnchor(x, y)) {
      // if user clicked at the outAnchor
      connection = tree.connections.add(block, null);

    } else if (block._hitInAnchor(x, y)) {
      // if user clicked at the inAnchor
      var c = block._inConnection;
      if (!c)
          return;

      block._inConnection = null;
      c._outBlock = null;
      lastOutBlock = block;

      connection = c;
    }
  }

  this.onMouseMove = function(e) {
    // if no connection, return
    if (!connection) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;

    var point = tree.view.getLocalPoint();
    var x = point.x
    var y = point.y

    // redraw
    connection._redraw(null, null, x, y);
  }

  this.onMouseUp = function(e) {
    if (e.nativeEvent.which !== 1) return;

    // if no connection, return
    if (!connection) return;

    var project = editor.project.get();
    if (!project) return;

    var tree = project.trees.getSelected();
    if (!tree) return;


    var point = tree.view.getLocalPoint();
    var x = point.x;
    var y = point.y;
    var block = tree.blocks.getUnderPoint(x, y);

    // if not connection or connection but no block
    project.history._beginBatch();
    if (!block || block === connection._inBlock || block.category === 'root') {
      if (lastOutBlock) {
        // Add again to connection in order to create history 
        lastOutBlock._inConnection = connection;
        connection._outBlock = lastOutBlock;
      }
      tree.connections.remove(connection);
    } else {

      // if double parent on node
      if (block._inConnection) {

        var c = block._inConnection;
        tree.connections.remove(c);
      }

      // if double children on root
      if ((connection._inBlock.category === 'root' ||
           connection._inBlock.category === 'decorator') &&
           connection._inBlock._outConnections.length > 1) {

        var c = connection._inBlock._outConnections[0];
        tree.connections.remove(c);
      }

      connection._outBlock = block;
      block._inConnection = connection;

      var _old = [tree.connections, tree.connections._remove, [block]];
      var _new = [tree.connections, tree.connections.add, [connection._inBlock, block]];
      project.history._add(new b3e.Command(_old, _new));

      connection._redraw();
    }
    project.history._endBatch();

    connection = null;
  }

  editor._game.stage.on('stagemousedown', this.onMouseDown, this);
  editor._game.stage.on('stagemousemove', this.onMouseMove, this);
  editor._game.stage.on('stagemouseup', this.onMouseUp, this);
}
