import Executioner from 'editor/common/executioner.js'
import logger from 'editor/common/logging.js'

import * as settings from 'editor/controller/operations/settings.js'
import * as project from 'editor/controller/operations/project.js'
import * as import_ from 'editor/controller/operations/import.js'
import * as export_ from 'editor/controller/operations/export.js'
import * as nodes from 'editor/controller/operations/nodes.js'
import * as history from 'editor/controller/operations/history.js'
import * as camera from 'editor/controller/operations/camera.js'
import * as trees from 'editor/controller/operations/trees.js'
import * as edit from 'editor/controller/operations/edit.js'
import * as blocks from 'editor/controller/operations/blocks.js'
import * as connections from 'editor/controller/operations/connections.js'
import * as selection from 'editor/controller/operations/selection.js'
import * as organization from 'editor/controller/operations/organization.js'


export default class ControllerManager extends Executioner {
  constructor(editor) {
    logger.info('Initializing controller...')
    super('Controller', editor)

    this._initializeOperations()
  }

  _initializeOperations() {
      this.add('project.new', project.new_)
      this.add('project.open', project.open)
      this.add('project.get', project.get)

      this.add('import.projectAsJson', import_.projectAsJson)
      this.add('import.treeAsJson', import_.treeAsJson)
      this.add('import.nodesAsJson', import_.nodesAsJson)
      this.add('import.parametersAsJson', import_.parametersAsJson)

      this.add('export.projectToJson', export_.projectToJson)
      this.add('export.treeToJson', export_.treeToJson)
      this.add('export.nodesToJson', export_.nodesToJson)
      this.add('export.parametersToJson', export_.parametersToJson)

      this.add('history.clear', history.clear)
      this.add('history.undo', history.undo)
      this.add('history.redo', history.redo)
      this.add('history.canUndo', history.canUndo)
      this.add('history.canRedo', history.canRedo)

      this.add('nodes.add', nodes.add)
      this.add('nodes.get', nodes.get)
      this.add('nodes.getAll', nodes.getAll)
      this.add('nodes.update', nodes.update)
      this.add('nodes.remove', nodes.remove)

      this.add('trees.add', trees.add)
      this.add('trees.get', trees.get)
      this.add('trees.getAll', trees.getAll)
      this.add('trees.getSelected', trees.getSelected)
      this.add('trees.select', trees.select)
      this.add('trees.remove', trees.remove)
      this.add('trees.reorder', trees.reorder)

      this.add('camera.reset', camera.reset)
      this.add('camera.zoom', camera.zoom)
      this.add('camera.zoomIn', camera.zoomIn)
      this.add('camera.zoomOut', camera.zoomOut)
      this.add('camera.pan', camera.pan)
      this.add('camera.setPosition', camera.setPosition)
      this.add('camera.center', camera.center)

      this.add('blocks.add', blocks.add)
      this.add('blocks.get', blocks.get)
      this.add('blocks.getSelected', blocks.getSelected)
      this.add('blocks.getAll', blocks.getAll)
      this.add('blocks.getRoot', blocks.getRoot)
      this.add('blocks.remove', blocks.remove)
      this.add('blocks.select', blocks.select)
      this.add('blocks.deselect', blocks.deselect)
      this.add('blocks.move', blocks.move)
      this.add('blocks.update', blocks.update)

      this.add('connections.add', connections.add)
      this.add('connections.remove', connections.remove)
      this.add('connections.get', connections.get)
      this.add('connections.getAll', connections.getAll)

      this.add('edit.copy', edit.copy)
      this.add('edit.cut', edit.cut)
      this.add('edit.paste', edit.paste)
      this.add('edit.duplicate', edit.duplicate)
      this.add('edit.remove', edit.remove)
      this.add('edit.removeConnections', edit.removeConnections)
      this.add('edit.removeInConnections', edit.removeInConnections)
      this.add('edit.removeOutConnections', edit.removeOutConnections)

      this.add('organization.autoOrganize', organization.autoOrganize)
      this.add('organization.alignVertically', organization.alignVertically)
      this.add('organization.alignHorizontally', organization.alignHorizontally)
      this.add('organization.distributeVertically', organization.distributeVertically)
      this.add('organization.distributeHorizontally', organization.distributeHorizontally)

      this.add('selection.select', selection.select)
      this.add('selection.deselect', selection.deselect)
      this.add('selection.selectAll', selection.selectAll)
      this.add('selection.deselectAll', selection.deselectAll)
      this.add('selection.invertSelection', selection.invertSelection)
      this.add('selection.selectSubtree', selection.selectSubtree)
      this.add('selection.deselectSubtree', selection.deselectSubtree)

      this.add('settings.set', settings.set)
      this.add('settings.update', settings.update)
      this.add('settings.reset', settings.reset)
      this.add('settings.resetAll', settings.resetAll)
  }
}


/**
 * OPERATIONS:
 *
 * - project.new
 * - project.open
 * - project.get
 *
 * - import.projectAsJson
 * - import.treeAsJson
 * - import.nodesAsJson
 * - import.parametersAsJson
 *
 * - export.projectToJson
 * - export.treeToJson
 * - export.nodesToJson
 * - export.parametersToJson
 *
 * - history.clear
 * - history.undo
 * - history.redo
 * - history.canUndo
 * - history.canRedo
 *
 * - nodes.add
 * - nodes.get
 * - nodes.getAll
 * - nodes.update
 * - nodes.remove
 *
 * - trees.add
 * - trees.get
 * - trees.getall
 * - trees.getSelected
 * - trees.select
 * - trees.remove
 * - trees.reorder
 *
 * - blocks.add
 * - blocks.get
 * - blocks.getSelected (here or in selection?)
 * - blocks.getAll
 * - blocks.getRoot
 * - blocks.remove
 * - blocks.select
 * - blocks.deselect
 * - blocks.move
 * - blocks.update
 *
 * - connections.add
 * - connections.remove
 * - connections.get
 * - connections.getAll
 *
 * - edit.copy
 * - edit.cut
 * - edit.paste
 * - edit.duplicate
 * - edit.remove
 * - edit.removeConnections
 * - edit.removeInConnections
 * - edit.removeOutConnections
 *
 * - organization.autoOrganize
 * - organization.alignVertically
 * - organization.alignHorizontally
 * - organization.distributeVertically
 * - organization.distributeHorizontally
 *
 * - selection.select
 * - selection.deselect
 * - selection.selectAll
 * - selection.deselectAll
 * - selection.invertSelection
 * - selection.selectSubtree
 * - selection.deselectSubtree
 *
 * - camera.reset
 * - camera.zoom
 * - camera.zoomIn
 * - camera.zoomOut
 * - camera.pan
 * - camera.setPosition
 * - camera.center
 *
 * - settings.set
 * - settings.update
 * - settings.reset
 * - settings.resetAll
 *
 */
