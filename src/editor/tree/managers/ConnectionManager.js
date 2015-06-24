b3e.tree.ConnectionManager = function(editor, project, tree) {
  "use strict";

  /** Needed to history manager */
  this._remove = function(block) {
    project.history._lock()
    this.remove(block._inConnection);
    project.history._unlock()
  }

  this.add = function(inBlock, outBlock) {
    var connection = new b3e.Connection();

    if (inBlock) {
      connection._inBlock = inBlock;
      inBlock._outConnections.push(connection);

      editor.trigger('blockconnected', inBlock, {
        connection: connection,
        type: 'outConnection',
        other: outBlock,
      });
    }

    if (outBlock) {
      connection._outBlock = outBlock;
      outBlock._inConnection = connection;

      editor.trigger('blockconnected', outBlock, {
        connection: connection,
        type: 'inConnection',
        other: inBlock,
      });
    }

    if (inBlock && outBlock) {
      var _old = [this, this._remove, [outBlock]];
      var _new = [this, this.add, [inBlock, outBlock]];
      project.history._add(new b3e.Command(_old, _new));
    }

    connection._applySettings(editor._settings);
    tree._connections.addChild(connection);

    // editor.trigger('connectionadded', connection);
    return connection;
  }

  this.remove = function(connection) {
    if (connection._inBlock && connection._outBlock) {
      var _old = [this, this.add, [connection._inBlock, connection._outBlock]];
      var _new = [this, this._remove, [connection._outBlock]];
      project.history._add(new b3e.Command(_old, _new));
    }

    if (connection._inBlock) {
      connection._inBlock._outConnections.remove(connection);
      connection._inBlock = null;
    }

    if (connection._outBlock) {
      connection._outBlock._inConnection = null;
      connection._outBlock = null;
    }

    tree._connections.removeChild(connection);
    editor.trigger('connectionremoved', connection);
  }
  this.each = function(callback, thisarg) {
    tree._connections.children.forEach(callback, thisarg);
  }

  this._applySettings = function(settings) {
    this.each(function(connection) {
      connection._applySettings(settings);
    })
  }
}
