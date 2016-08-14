import EditorError from 'editor/common/errors.js'
import config from 'editor/config.js'
import * as helpers from 'editor/view/helpers.js'
import * as validators from 'editor/common/validators.js'

/**
 * Adds a new tree to the canvas. Notice that this function does not select
 * the tree automatically, you must call the command `trees.select` manually.
 *
 * @param {action.id} The tree id. Required
 * @throws {invalid_id} If the provided is is not in the correct format
 * @throws {duplicated_id} If the provided tree id is already on the HTML
 */
export function add(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let trees = editor.view._domTrees
  if (validators.contains(action.id, trees)) {
    throw new EditorError('duplicated_id', action)
  }

  let canvas = editor.view._domCanvas

  let tree = helpers.createTree(action.id)
  helpers.addElement(tree.dom, canvas)
  trees[action.id] = tree
}

/**
 * Select a tree.
 *
 * @param {action.id} The id of tree to be selected
 * @throws {invalid_id} If the provided id is not in the editor ID format
 * @throws {tree_not_found} if the provided is is not registered in the canvas
 */
export function select(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let trees = editor.view._domTrees
  if (!validators.contains(action.id, trees)) {
    throw new EditorError('tree_not_found', action)
  }

  let selected = editor.view._selectedTree
  if (selected && selected !== action.id) {
    let tree = trees[selected]
    helpers.removeClass(tree.dom, config.classSelectedTree)
  }

  let tree = trees[action.id]
  helpers.addClass(tree.dom, config.classSelectedTree)
  editor.view._selectedTree = action.id
}

/**
 * Removes a tree from the HTML. Notice that this functions does not remove or
 * adjust the selection, you must call the command `trees.select` manually.
 *
 * @param {action.id} The id of the tree to be selected.
 * @throws {invalid_id} If the provided id is not in the correct editor ID format
 * @throws {tree_not_found} Id the provided id is not present in the HTML.
 */
export function remove(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let trees = editor.view._domTrees
  if (!validators.contains(action.id, trees)) {
    throw new EditorError('tree_not_found', action)
  }

  let canvas = editor.view._domCanvas
  let tree = trees[action.id]
  helpers.removeElement(tree.dom, canvas)
  delete trees[action.id]
}
