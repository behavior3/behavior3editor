import EditorError from 'editor/common/errors.js'
import config from 'editor/config.js'
import * as helpers from 'editor/view/helpers.js'
import * as validators from 'editor/common/validators.js'

/**
 * @param {action.x1}
 * @param {action.y1}
 * @param {action.x2}
 * @param {action.y2}
 */
export function add(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  if (!validators.isId(action.treeId)) {
    throw new EditorError('invalid_tree_id', action)
  }

  let trees = editor.view._domTrees
  if (!validators.contains(action.treeId, trees)) {
    throw new EditorError('tree_not_found', action)
  }

  let connections = editor.view._domConnections
  if (validators.contains(action.id, connections)) {
    throw new EditorError('duplicated_id', action)
  }

  let tree = trees[action.treeId]
  let connection = helpers.createConnection(action.id, action.treeId, action.data)
  helpers.addElement(connection.dom, tree.layers.connections)
  connections[action.id] = connection
}

/**
 *
 */
export function update(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let connections = editor.view._domConnections
  if (!validators.contains(action.id, connections)) {
    throw new EditorError('connection_not_found', action)
  }

  let connection = connections[action.id]
  connection.dom.update(action.data || {})
}

/**
 *
 */
export function remove(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let connections = editor.view._domConnections
  if (!validators.contains(action.id, connections)) {
    throw new EditorError('connection_not_found', action)
  }

  let connection = connections[action.id]
  let tree = editor.view._domTrees[connection.tree]
  delete editor.view._domConnections[action.id]
  helpers.removeElement(connection.dom, tree.layers.connections)
}
