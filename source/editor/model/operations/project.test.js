import * as commands from './project.js'
import {assert} from 'chai'
import {spy, stub} from 'sinon'

describe('models.operations.project', function() {
  describe('@new', function() {
    it('shoulld reset current state correctly', function() {
      let state = Immutable.fromJS({
        project        : 'dirty',
        nodes          : 'dirty',
        trees          : 'dirty',
        selectedTree   : 'dirty',
        blocks         : 'dirty',
        selectedBlocks : 'dirty',
        connections    : 'dirty',
      })
      let editor = {store: new StoreStub(state)}

      commands.new_(editor)

      state = editor.store.getState()
      assert.notEqual(state.get('project'), 'dirty')
      assert.notEqual(state.get('nodes'), 'dirty')
      assert.notEqual(state.get('trees'), 'dirty')
      assert.notEqual(state.get('selectedTree'), 'dirty')
      assert.notEqual(state.get('blocks'), 'dirty')
      assert.notEqual(state.get('selectedBlocks'), 'dirty')
      assert.notEqual(state.get('connections'), 'dirty')
    })

    it('should initialize state', function() {
      let state = Immutable.Map()
      let editor = {store: new StoreStub(state)}

      commands.new_(editor)

      state = editor.store.getState()
      assert.isString(state.getIn(['project', 'id']))
      assert.isNotNull(state.getIn(['project', 'createdAt']))
      assert.equal(state.get('trees').size, 1)
      assert.isNotNull(state.get('selectedTree'))
    })
  })
})
