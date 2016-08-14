import Executioner from 'editor/common/executioner.js'
import logger from 'editor/common/logging.js'

import * as project from 'editor/model/operations/project.js'
import * as trees from 'editor/model/operations/trees.js'
import * as nodes from 'editor/model/operations/nodes.js'
import * as blocks from 'editor/model/operations/blocks.js'
import * as connections from 'editor/model/operations/connections.js'
import * as settings from 'editor/model/operations/settings.js'


export default class ModelManager extends Executioner {
  constructor(editor) {
    logger.info('Initializing model...')
    super('Model', editor)

    this._initializeOperations()
  }

  _initializeOperations() {
    this.add('project.new', project.new_)
    this.add('project.open', project.open)
    this.add('project.import', project.import_)
    this.add('project.export', project.export_)

    this.add('trees.add', trees.add)
    this.add('trees.remove', trees.remove)
    this.add('trees.select', trees.select)

    this.add('blocks.add', blocks.add)
    this.add('blocks.remove', blocks.remove)
    this.add('blocks.select', blocks.select)
    this.add('blocks.deselect', blocks.deselect)
    this.add('blocks.update', blocks.update)
    this.add('blocks.move', blocks.move)

    this.add('connections.add', connections.add)
    this.add('connections.remove', connections.remove)

    this.add('settings.update', settings.update)
    this.add('settings.set', settings.set)
    this.add('settings.reset', settings.reset)
    this.add('settings.resetAll', settings.resetAll)
  }
}



/**
 * OPERATIONS:
 *
 * - project.new - erase everything from store and start a new empty project
 * - project.open - erase everything from store and load the provided project
 * - project.import - load the provided project
 * - project.export - export the current project
 *
 * - trees.add - adds a new tree in the current project
 * - trees.select - select the provided tree
 * - trees.remove - remove the provided tree (only if there is more than 1 tree)
 * - trees.reorder - reorder the tree list given an id array
 *
 * - nodes.add - adds a new node into the project
 * - nodes.update - update the node data
 * - nodes.remove - remove the node from the project
 *
 * - blocks.add - adds a new block in the selected or provided tree
 * - blocks.remove - removes the provided block
 * - blocks.select - select the given block
 * - blocks.deselect - deselect the given block
 * - blocks.move - moves the given block by the provided position
 * - blocks.update - updates the content of the given block
 *
 * - connections.add - creates a new connection
 * - connections.remove - removes a connection
 *
 * - settings.set - sets a single value on the settings map
 * - settings.update - sets multiple values on the settings map
 * - settings.reset - reset a single setting to its default value
 * - settings.resetAll - reset all settings to their default values
 *
 */
