import {createId} from 'editor/common/utils.js'

export function add(editor, action) {
  // let id = createId()
  // let name = 'random tree name'

  // editor.model.run('trees.add', {id, name})
  // editor.view.run('trees.add', {id})
  // editor.events.dispatch('treeAdded', {id, name})
  // editor.history.add('trees.add', {id, name})

  // create tree on the model
  // add tree to the view
  // call event treeAdded
  // add action to history manager
}

export function get(editor, action) {
  // validate id
  // validate tree in the model
  // get tree from model
}

export function getAll(editor, action) {
  // get all trees from model
}

export function getSelected(editor, action) {
  // get selected tree
}

export function select(editor, action) {
  // select tree in model
  // select tree in the view
  // call event treeSelected
}

export function remove(editor, action) {
  // validate id
  // validate tree in the model
  // remove tree in model
  // remove tree in view
  // call event treeRemoved
  // add action to history manager
}

export function reorder(editor, action) {
  // receives a list of ids
  // validate id formats
  // validate must contain all ids
  // reoder on model
}
