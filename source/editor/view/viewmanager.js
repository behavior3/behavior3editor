import Executioner from 'editor/common/executioner.js'
import logger from 'editor/common/logging.js'
import config from 'editor/config.js'

import * as helpers from 'editor/view/helpers.js'
import * as trees from 'editor/view/operations/trees.js'
import * as blocks from 'editor/view/operations/blocks.js'
import * as connections from 'editor/view/operations/connections.js'

export default class ViewManager extends Executioner {
  constructor(editor) {
    logger.info('Initializing view...')
    super('View', editor)

    this._selectedTree = null
    this._domCanvas = null
    this._domTrees = {}
    this._domBlocks = {}
    this._domConnections = {}

    this._initializeOperations()
    this._initializeElements()
  }

  _initializeOperations() {
    this.add('trees.add', trees.add)
    this.add('trees.select', trees.select)
    this.add('trees.remove', trees.remove)

    this.add('blocks.add', blocks.add)
    this.add('blocks.select', blocks.select)
    this.add('blocks.deselect', blocks.deselect)
    this.add('blocks.move', blocks.move)
    this.add('blocks.update', blocks.update)
    this.add('blocks.remove', blocks.remove)

    this.add('connections.add', connections.add)
    this.add('connections.update', connections.update)
    this.add('connections.remove', connections.remove)
  }

  _initializeElements() {
    this._domCanvas = helpers.getElement(config.idCanvas)
    this._domCanvas.classList.add(config.classCanvas)
  }
}
