

export function new_(editor, action) {
  editor.model.run('project.new')

  let state = editor.store.getState()
  let id = state.get('selectedTree')

  editor.view.run('trees.add', {id})
}
export function open(editor, action) {}
export function get(editor, action) {}
