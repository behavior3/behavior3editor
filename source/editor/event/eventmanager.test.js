import Store from 'editor/store/store.js'
import {assert} from 'chai'
import {spy, stub} from 'sinon'

import EventManager from './eventmanager.js'

describe('event.EventManager', function() {
  describe('@subscribe', function() {
    it('should store the callbacks in lists', function() {
      let events = new EventManager()
      let callback1 = _ => _
      let callback2 = _ => _

      events.subscribe('event.test1', callback1)
      events.subscribe('event.test1', callback2)
      events.subscribe('event.test2', callback1)

      assert.isDefined(events._events['event.test1'])
      assert.isDefined(events._events['event.test2'])

      assert.equal(events._events['event.test1'].length, 2)
      assert.equal(events._events['event.test2'].length, 1)
    })

    it('should throw an error if trying to add duplicated callback', function() {
      let events = new EventManager()
      let callback = _ => _

      events.subscribe('event.test1', callback)

      assert.throws(_ => events.subscribe('event.test1', callback))
    })
  })


  describe('@unsubscribe', function() {
    it('should remove the callbacks from the list', function() {
      let events = new EventManager()
      let callback1 = _ => _
      let callback2 = _ => _

      events.subscribe('event.test1', callback1)
      events.subscribe('event.test1', callback2)
      events.subscribe('event.test2', callback1)

      events.unsubscribe('event.test1', callback2)
      events.unsubscribe('event.test2', callback1)

      assert.isDefined(events._events['event.test1'])
      assert.isDefined(events._events['event.test2'])
      assert.equal(events._events['event.test1'].length, 1)
      assert.equal(events._events['event.test2'].length, 0)
    })
  })


  describe('@dispatch', function() {
    it('should call the registered callbacks correctly', function() {
      let events = new EventManager()
      let callback1 = spy()
      let callback2 = spy()
      let data = {'data':'stub'}

      events.subscribe('event.test1', callback1)
      events.subscribe('event.test1', callback2)
      events.subscribe('event.test2', callback1)

      events.dispatch('event.test1', data)
      events.dispatch('event.test2', data)

      assert.isTrue(callback1.calledTwice)
      assert.isTrue(callback2.calledOnce)
      assert.isTrue(callback1.calledWith(data))
      assert.isTrue(callback2.calledWith(data))
    })
  })
})
