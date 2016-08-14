import logger from 'editor/common/logging.js'

export default class EventManager {
  constructor(editor) {
    logger.info('Initializing event manager...')
    this._editor = editor
    this._events = {}
  }

  subscribe(event, callback) {
    if (typeof this._events[event] === 'undefined') {
      this._events[event] = []
    }

    if (this._events[event].indexOf(callback) > -1) {
      throw new Error(`Callback already present in "${event}" event`)
    }

    this._events[event].push(callback)
  }

  unsubscribe(event, callback) {
    if (typeof this._events[event] === 'undefined') {
      return
    }

    let events = this._events[event]
    let index = events.indexOf(callback)
    if (index > -1) {
      events.splice(index, 1)
    }
  }

  dispatch(event, data) {
    if (typeof this._events[event] === 'undefined') {
      return
    }

    let events = this._events[event]
    for (let i=0; i<events.length; i++) {
      events[i](data)
    }
  }
}
