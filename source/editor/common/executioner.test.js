import Executioner from './executioner.js'
import {assert} from 'chai'
import {spy, stub} from 'sinon'

describe('common.Executioner', function() {
  describe('@add', function() {
    it('should add command to list', function() {
      let routine = _ => _
      let executioner = new Executioner()
      executioner.add('example.command', routine)

      assert.isObject(executioner._actions)
      assert.equal(executioner._actions['example.command'], routine)
    })

    it('should throw error if command is already registered', function() {
      let routine = _ => _
      let executioner = new Executioner()
      executioner.add('example.command', routine)

      let f = _ => executioner.add('example.command', routine)
      assert.throws(f)
    })
  })
  //
  describe('@run', function() {
    it('should call the command with correct parameters', function() {
      let editor = 'editor value'
      let routine = stub()
      routine.onFirstCall().returns('return value')

      let executioner = new Executioner(null, editor)
      executioner.add('example.command', routine)

      let parameters = {variable:'var'}
      var result = executioner.run('example.command', parameters);

      assert.equal(result, 'return value')
      assert.isTrue(routine.calledOnce)
      assert.isTrue(routine.calledWith('editor value', parameters))
    })

    it('should throw error if command type is not present', function() {
      let routine = _ => _
      let executioner = new Executioner()
      executioner.add('example.command', routine)

      let f = _ => executioner.run({})
      assert.throws(f)
    })

    it('should throw error if command is not registered', function() {
      let routine = _ => _
      let executioner = new Executioner()
      executioner.add('example.command', routine)

      let f = _ => executioner.run('wrong', {})
      assert.throws(f)
    })
  })
})
