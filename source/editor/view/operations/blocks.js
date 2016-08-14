import EditorError from 'editor/common/errors.js'
import config from 'editor/config.js'
import * as helpers from 'editor/view/helpers.js'
import * as validators from 'editor/common/validators.js'

/**
 * Adds a new block to the tree.
 *
 * @param {action.id} The block id
 * @param {action.treeId} The tree id
 * @param {action.data} The block data object
 * @param {action.data.title} The block title
 * @param {action.data.name} The block name
 * @param {action.data.category} The block name
 * @param {action.data.image} The block image
 * @param {action.data.x} The block x position
 * @param {action.data.y} The block y position
 * @throws {invalid_id} If the provided id is not on the editor ID format
 * @throws {invalid_tree_id} If the provided tree id is not on the editor ID format
 * @throws {tree_not_found} If the provided treeId is not proesent in the HTML
 * @throws {duplicated_id} If the provided block id is already on the HTML
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

  let blocks = editor.view._domBlocks
  if (validators.contains(action.id, blocks)) {
    throw new EditorError('duplicated_id', action)
  }

  let tree = trees[action.treeId]
  let block = helpers.createBlock(action.id, action.treeId, action.data)
  helpers.addElement(block.dom, tree.layers.blocks)
  blocks[action.id] = block
}

/**
 * Select a block.
 *
 * @param {action.id} The id of the block to be selected
 * @throws {invalid_id} If the provided id is not on the editor ID format
 * @throws {block_not_found} If the block has not been found on the HTML
 */
export function select(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let blocks = editor.view._domBlocks
  if (!validators.contains(action.id, blocks)) {
    throw new EditorError('block_not_found', action)
  }

  let block = blocks[action.id]
  block.dom.select()
}

/**
 * Deselect a block.
 *
 * @param {action.id} The id of the block to be deselected
 * @throws {invalid_id} If the provided id is not on the editor ID format
 * @throws {block_not_found} If the block has not been found on the HTML
 */
export function deselect(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let blocks = editor.view._domBlocks
  if (!validators.contains(action.id, blocks)) {
    throw new EditorError('block_not_found', action)
  }

  let block = blocks[action.id]
  block.dom.deselect()
}

/**
 * Move a block.
 *
 * @param {action.id} The id of the block to be moved
 * @param {action.x} The new x position
 * @param {action.y} The new y position
 * @throws {invalid_id} If the provided id is not on the editor ID format
 * @throws {block_not_found} If the block has not been found on the HTML
 */
export function move(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let blocks = editor.view._domBlocks
  if (!validators.contains(action.id, blocks)) {
    throw new EditorError('block_not_found', action)
  }

  // verificar x, y?

  let block = blocks[action.id]
  block.dom.moveTo(action.x, action.y)
}

/**
 * Update the block data.
 *
 * @param {action.id} The id of the block to be updated
 * @param {action.data} The block data object
 * @param {action.data.title} The new block title
 * @param {action.data.name} The new block name
 * @param {action.data.category} The new block name
 * @param {action.data.image} The new block image
 * @param {action.data.x} The new block x position
 * @param {action.data.y} The new block y position
 * @throws {invalid_id} If the provided id is not on the editor ID format
 * @throws {block_not_found} If the block has not been found on the HTML
 */
export function update(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let blocks = editor.view._domBlocks
  if (!validators.contains(action.id, blocks)) {
    throw new EditorError('block_not_found', action)
  }

  let block = blocks[action.id]
  block.dom.update(action.data || {})
}

/**
 * Remove the block from HTML.
 *
 * @param {action.id} The id of the block to be updated
 * @throws {invalid_id} If the provided id is not on the editor ID format
 * @throws {block_not_found} If the block has not been found on the HTML
 */
export function remove(editor, action) {
  if (!validators.isId(action.id)) {
    throw new EditorError('invalid_id', action)
  }

  let blocks = editor.view._domBlocks
  if (!validators.contains(action.id, blocks)) {
    throw new EditorError('block_not_found', action)
  }

  let block = blocks[action.id]
  let tree = editor.view._domTrees[block.tree]
  delete editor.view._domBlocks[action.id]
  helpers.removeElement(block.dom, tree.layers.blocks)
}
