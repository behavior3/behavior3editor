import logger from 'editor/common/logging.js'

let initialState = {
  project        : null,
  nodes          : null,
  trees          : null,
  selectedTree   : null,
  blocks         : null,
  selectedBlocks : null,
  connections    : null,
  settings       : null,
}

/**
 * Use
 *
 *   store.setState(state => {
 *     state.set(...)
 *   })
 */
export default class Store {
  constructor() {
    logger.info('Initializing data storage...')

    this._state = null

    this.reset()
  }

  reset() {
    this._state = Immutable.fromJS(initialState)
  }

  getState() {
    return this._state
  }

  setState(state) {
    if (typeof state === 'function') {
      this._state = this._state.withMutations(state)
    } else {
      this._state = state
    }
  }
}
