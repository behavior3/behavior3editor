import Store from 'editor/store/store.js'
import {assert} from 'chai'

describe('store.Store', function() {
  describe('@reset', function() {
    it('should reset to initial values', function() {
      let store = new Store()
      let state = store.getState()

      store.setState(state.withMutations(state => {
        state.set('project', 'stub')
      }))

      state = store.getState()
      assert.equal(state.get('project'), 'stub')

      store.reset()

      state = store.getState()
      assert.equal(state.get('project'), null)
    })
  })


  describe('@getState', function() {
    it('should return the internal current state', function() {
      let store = new Store();
      let state = store.getState();

      assert.equal(state, store._state)
    })
  })


  describe('@setState', function() {
    it('should set the internal state with the provided state', function() {
      let store = new Store()

      var oldState = store._state
      var newState = store._state.set('project', 30)

      store.setState(newState)

      assert.notEqual(store._state, oldState)
      assert.equal(store._state, newState)
    })

    it('should set the internal state with a provided function', function() {
      let store = new Store()

      let oldState = store._state
      store.setState(state => {
        state.set('project', 30)
      })

      let newState = store._state
      assert.notEqual(store._state, oldState)
      assert.equal(store._state.get('project'), 30)
    })
  })
})
