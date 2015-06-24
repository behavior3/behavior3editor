b3e.project.HistoryManager = function(editor, project) {
  "use strict";

  var queue = [];
  var index = 0;
  var lockRequests = 0;
  var batchRequests = 0;
  var commandBuffer = [];

  this.clear = function() {
    queue = [];
    index = 0;
  }
  this.undo = function() {
    this._lock();
    if (this.canUndo()) {
      index--;
      queue[index].undo();
      project.trees.select(queue[index].context);
    }
    this._unlock();

    editor._dirty--;
  }
  this.redo = function() {
    this._lock();
    if (this.canRedo()) {
      queue[index].redo();
      project.trees.select(queue[index].context);
      index++;
    }
    this._unlock();

    editor._dirty++;
  }
  this.canUndo = function() {
    return index>0;
  }
  this.canRedo = function() {
    return index<queue.length;
  }

  /**
   * Add commands to the historic.
   *
   *     history.add(target, command, args)
   */
  this._add = function(command, merge) {
    if (lockRequests > 0) return;

    // Crear all after index
    if (queue.length > index) {
      queue.splice(index, queue.length-index)
    }

    // Add instruction
    if (batchRequests > 0) {
      commandBuffer.push(command);
    } else {
      index++;
      command.context = project.trees.getSelected();
      queue.push(command);
      
      if (editor._dirty < 0) editor._dirty = 0;
      editor._dirty++;
    }

    // Clear excess
    var max = editor._settings.get('max_history');
    if (queue.length > max) {
      queue.splice(0, 1);
    }
  }

  /**
   * Lock the manager, so it can't receive more commands.
   */
  this._lock = function() {
    // if (lockRequests===0) console.log('------- LOCK -------');
    lockRequests++
  }
  this._unlock = function() {
    lockRequests--;
    // if (lockRequests===0) console.log('------- UNLOCK -------');
  }

  /**
   * While in batch, merges all added commands to a single command
   */
  this._beginBatch = function() {
    batchRequests++;
  }
  this._endBatch = function() {
    batchRequests = Math.max(0, batchRequests-1);

    if (batchRequests === 0) {
      if (commandBuffer.length > 0) {
        var command = new b3e.Commands(commandBuffer);
        command.context = project.trees.getSelected();
        this._add(command);
      }
      commandBuffer = [];
    }
  }


  this._applySettings = function(settings) {
    var max = settings.get('max_history');
    if (queue.length > max) {
      queue.splice(0, queue.length-max);
    }

  }
}