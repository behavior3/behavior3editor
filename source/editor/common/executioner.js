import logger from 'editor/common/logging.js'

export default class Executioner {
  constructor(name, editor) {
    this.name = name
    this._editor = editor
    this._actions = {}
  }

  add(action, routine) {
    if (typeof this._actions[action] !== 'undefined') {
      throw new Error(`Command "${action}" already registered in this executioner`)
    }

    this._actions[action] = routine
  }

  run(action, parameters) {
    if (typeof action === 'undefined') {
      throw new Error(`Command object must be have a "type"`)
    }

    let routine = this._actions[action];
    if (typeof routine === 'undefined') {
      throw new Error(`Command "${action}" not found`)
    }

    logger.debug(`[${this.name}] running command "${action}"`)
    return routine(this._editor, parameters||{});
  }
}
