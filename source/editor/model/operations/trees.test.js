import * as commands from './trees.js'
import {createId} from 'editor/common/utils.js'
import {assert} from 'chai'
import {spy, stub} from 'sinon'

describe('models.operations.trees', function() {
  describe('@add', function() {
    it('should ', function() {
      let state = Immutable.fromJS({
        project        : {},
        nodes          : {},
        trees          : {},
        selectedTree   : null,
        blocks         : {},
        connections    : {},
      })
      let editor = {store: new StoreStub(state)}
      let treeId = createId()
      let treeName = 'sample name'

      commands.add(editor, {id:treeId, name:treeName})

      state = editor.store.getState()
      console.log(state)
    })
  })

  describe('@remove', function() {})

  describe('@select', function() {})
})
