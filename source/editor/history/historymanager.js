import logger from 'editor/common/logging.js'

export default class HistoryManager {
  constructor(editor) {
    logger.info('Initializing history manager...')

    this._editor = editor
    this._lockStack = 0
    this._batchStack = 0
  }

  add() {}

  lock() {}
  unlock() {}

  beginBatch() {}
  endBatch() {}

  canUndo() {}
  canRedo() {}

  undo() {}
  redo() {}
}
