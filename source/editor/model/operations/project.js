import factory from 'editor/model/factory.js'
import {createId} from 'editor/common/utils.js'

export function new_(editor, action) {
  let project = factory.makeProject()
  project.id = createId()
  project.createdAt = (new Date()).toISOString()

  let tree = factory.makeTree()
  tree.id = createId()

  let trees = {
    [tree.id]: tree
  }

  editor.store.setState(state => {
    state.set('project', Immutable.Map(project))
    state.set('trees', Immutable.Map(trees))
    state.set('selectedTree', tree.id)
    state.set('nodes', {})
    state.set('blocks', {})
    state.set('connections', {})
    state.set('selectedBlocks', [])
  })
}

export function open(editor, action) {}
export function import_(editor, action) {}
export function export_(editor, action) {}
