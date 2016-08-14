import * as validators from './validators.js'
import {assert} from 'chai'

describe('Validators', function() {
  describe('@isId', function() {
    it('should accept id format', function() {
      assert.isTrue(validators.isId('3DEf83jOC7asd8SDmcwe'))
      assert.isTrue(validators.isId('xxxxxxxxxxxxxxxxxxxx'))
      assert.isTrue(validators.isId('00000000000000000000'))
    })

    it('should not accept invalid id', function() {
      assert.isFalse(validators.isId(undefined))
      assert.isFalse(validators.isId(null))
      assert.isFalse(validators.isId(8956))
      assert.isFalse(validators.isId('invalid'))
    })
  })

  describe('@contains', function() {
    it('should accept using list', function() {
      let list = ['a', 2, 'c', null]

      assert.isTrue(validators.contains('a', list))
      assert.isTrue(validators.contains(2, list))
      assert.isTrue(validators.contains('c', list))
      assert.isTrue(validators.contains(null, list))
    })

    it('should not accept using list', function() {
      let list = ['a', 2, 'c', null]

      assert.isFalse(validators.contains('b', list))
      assert.isFalse(validators.contains(1, list))
      assert.isFalse(validators.contains('d', list))
      assert.isFalse(validators.contains(undefined, list))
    })

    it('should accept using dict', function() {
      let dict = {
        'a' : 1,
        2   : 1,
        'c' : 1
      }

      assert.isTrue(validators.contains('a', dict))
      assert.isTrue(validators.contains(2, dict))
      assert.isTrue(validators.contains('c', dict))
    })

    it('should not accept using dict', function() {
      let dict = {
        'a' : 1,
        2   : 1,
        'c' : 1
      }

      assert.isFalse(validators.contains('b', dict))
      assert.isFalse(validators.contains(1, dict))
      assert.isFalse(validators.contains('d', dict))
      assert.isFalse(validators.contains(undefined, dict))
    })
  })

})
